/**
 * Shrink a Sketchfab/Blender GLB for the about-road.
 *
 *   node scripts/optimize-car.mjs <in.glb> <out.glb> [prune-regex]
 *
 * Needs (install once, locally or in a scratch folder next to this file):
 *   npm i -D @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions draco3dgltf sharp
 *
 * What it does: drops nodes whose (cleaned) name matches the regex (use it
 * for interiors: seats, dash, pedals…), prunes unused data, welds and
 * Draco-compresses geometry, and rewrites textures as 1024px WebP. The road
 * loader already handles Draco + WebP. Typical result: 36 MB → ~2.3 MB.
 *
 * Node names are cleaned before matching: Sketchfab "00:123 " / "00_mi12 "
 * prefixes, trailing "_123" ids and ".001" suffixes are stripped, lowercase.
 * Keep wheel nodes! Check the "remaining wheel-ish" list in the output and
 * point GLB_CARS[...].wheels in AboutPageGlbCar.tsx at them.
 *
 * Prune conservatively. Artists misname body parts ("bornet" = bonnet,
 * "upper cover", "matt1", "top_img" were painted skins on the Carens) and
 * most cars have a black under-shell beneath the paint, so an over-eager
 * regex shows up as black panels. Only prune names that are unambiguously
 * interior (seat, dash, console, pedal, steering wheel, sunvisor…), then
 * check the car on a light AND dark background before shipping.
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, draco, prune, textureCompress, weld } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import sharp from "sharp";
import { statSync } from "node:fs";

const [,, input, output, prunePattern = "$^"] = process.argv;
const strip = (n) => n.replace(/^00[:_](mi)?\d+\s*/, "").replace(/_\d+$/, "").replace(/\.\d+/g, "").toLowerCase();
const pruneRe = new RegExp(prunePattern, "i");

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "draco3d.encoder": await draco3d.createEncoderModule(),
  "draco3d.decoder": await draco3d.createDecoderModule(),
});
const doc = await io.read(input);
const root = doc.getRoot();
const before = { nodes: root.listNodes().length, meshes: root.listMeshes().length, mats: root.listMaterials().length, tex: root.listTextures().length };

const removed = [];
const disposeTree = (n) => { for (const c of n.listChildren()) disposeTree(c); n.dispose(); };
for (const scene of root.listScenes()) {
  const visit = (n) => {
    if (pruneRe.test(strip(n.getName()))) { removed.push(strip(n.getName())); disposeTree(n); return; }
    for (const c of n.listChildren()) visit(c);
  };
  for (const n of scene.listChildren()) visit(n);
}

await doc.transform(
  prune(),
  dedup(),
  weld(),
  textureCompress({ encoder: sharp, targetFormat: "webp", resize: [1024, 1024], quality: 82 }),
  draco({ method: "edgebreaker", quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }),
);
await io.write(output, doc);
const after = { nodes: root.listNodes().length, meshes: root.listMeshes().length, mats: root.listMaterials().length, tex: root.listTextures().length };
console.log(JSON.stringify({ input: (statSync(input).size / 1e6).toFixed(1) + " MB", output: (statSync(output).size / 1e6).toFixed(2) + " MB", before, after, removedCount: removed.length, removed: [...new Set(removed)].sort() }, null, 1));
console.log("remaining wheel-ish:", [...new Set(root.listNodes().map(n => n.getName()).filter(n => /wheel|whl|tire|tyre|rim/i.test(n)))].slice(0, 60));
