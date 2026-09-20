"use client";

import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  OrthographicCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const DRACO_DECODER = "/draco/";
const MODEL_URL = "/models/suzuki-carry.glb";
/** Match WagonR / Ertiga / 24s road loop. */
const WHEEL_SPIN_RADIANS_PER_SECOND = Math.PI * 2.15;

const RIM_MATERIAL_RE = /rim|watanabe|brakedisc|10831/i;

function materialName(mesh: Mesh): string {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return (mats[0]?.name || "").toLowerCase();
}

/** Light tune only — this bake already ships Physical mats + textures. */
function tuneCarryMaterials(root: Object3D) {
  const seen = new Set<MeshStandardMaterial | MeshPhysicalMaterial>();

  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const raw of mats) {
      if (
        !(raw instanceof MeshStandardMaterial || raw instanceof MeshPhysicalMaterial)
      ) {
        continue;
      }
      if (seen.has(raw)) continue;
      seen.add(raw);

      const name = (raw.name || "").toLowerCase();

      if (name.startsWith("mainbody.007") || name === "mainbody.007") {
        raw.metalness = Math.min(raw.metalness, 0.2);
        raw.roughness = Math.min(Math.max(raw.roughness, 0.18), 0.35);
        if (raw instanceof MeshPhysicalMaterial) {
          raw.clearcoat = Math.max(raw.clearcoat, 0.75);
          raw.clearcoatRoughness = Math.min(raw.clearcoatRoughness || 0.2, 0.12);
        }
        raw.envMapIntensity = 1.2;
        raw.needsUpdate = true;
      } else if (name.includes("tyre") || name.includes("tire")) {
        if (!raw.map) raw.color.set("#1a1a1c");
        raw.metalness = 0;
        raw.roughness = Math.max(raw.roughness, 0.82);
        raw.envMapIntensity = 0.3;
        raw.needsUpdate = true;
      } else if (name.includes("window")) {
        raw.color.set("#1a242c");
        raw.metalness = 0.1;
        raw.roughness = 0.08;
        raw.transparent = true;
        raw.opacity = 0.45;
        raw.depthWrite = false;
        raw.envMapIntensity = 1.6;
        raw.needsUpdate = true;
      } else if (
        name.includes("chrome") ||
        name.includes("rim") ||
        name.includes("watanabe")
      ) {
        raw.metalness = Math.max(raw.metalness, 0.85);
        raw.roughness = Math.min(raw.roughness, 0.28);
        raw.envMapIntensity = 1.35;
        raw.needsUpdate = true;
      } else if (name.includes("black")) {
        if (!raw.map) raw.color.set("#2a2d31");
        raw.metalness = Math.min(raw.metalness, 0.2);
        raw.roughness = Math.max(raw.roughness, 0.55);
        raw.needsUpdate = true;
      }
    }
  });
}

/**
 * Split one indexed mesh into local-space pieces. Each returned holder has
 * the source mesh's exact world pose at rest, but can be reparented to an
 * axle without baking away the Sketchfab parent rotations.
 */
function splitMesh(
  source: Mesh,
  keyForTriangle: (worldCenter: Vector3) => string,
): Map<string, Group> {
  const pieces = new Map<string, Group>();
  const position = source.geometry.getAttribute("position");
  const index = source.geometry.index;
  const parent = source.parent;
  if (!position || !index || !parent) return pieces;

  source.updateMatrixWorld(true);
  const triangles = new Map<string, number[]>();
  const a = new Vector3();
  const b = new Vector3();
  const c = new Vector3();
  const worldCenter = new Vector3();

  for (let i = 0; i < index.count; i += 3) {
    const ia = index.getX(i);
    const ib = index.getX(i + 1);
    const ic = index.getX(i + 2);
    a.fromBufferAttribute(position, ia).applyMatrix4(source.matrixWorld);
    b.fromBufferAttribute(position, ib).applyMatrix4(source.matrixWorld);
    c.fromBufferAttribute(position, ic).applyMatrix4(source.matrixWorld);
    worldCenter.copy(a).add(b).add(c).multiplyScalar(1 / 3);
    const key = keyForTriangle(worldCenter);
    const list = triangles.get(key) ?? [];
    list.push(ia, ib, ic);
    triangles.set(key, list);
  }

  const sourceRoot = new Group();
  sourceRoot.name = `${source.name}_split_root`;
  sourceRoot.position.copy(source.position);
  sourceRoot.quaternion.copy(source.quaternion);
  sourceRoot.scale.copy(source.scale);
  parent.add(sourceRoot);

  const point = new Vector3();
  for (const [key, indices] of triangles) {
    if (indices.length < 24) continue;
    const bounds = new Box3();
    for (const vertexIndex of indices) {
      point.fromBufferAttribute(position, vertexIndex);
      bounds.expandByPoint(point);
    }
    const center = bounds.getCenter(new Vector3());
    const geometry = source.geometry.clone();
    geometry.setIndex(indices);

    const mesh = new Mesh(geometry, source.material);
    mesh.name = `${source.name}_${key}`;
    mesh.position.copy(center).multiplyScalar(-1);
    mesh.castShadow = source.castShadow;
    mesh.receiveShadow = source.receiveShadow;

    const holder = new Group();
    holder.name = `${source.name}_${key}_holder`;
    holder.position.copy(center);
    holder.add(mesh);
    sourceRoot.add(holder);
    pieces.set(key, holder);
  }

  source.visible = false;
  return pieces;
}

/**
 * Carry packs all four tires into one mesh and each axle's rims across both
 * sides. Keep only camera-facing wheels, preserve their authored rest pose,
 * then parent the rim faces/discs to the matching tire axle.
 */
function buildCarryWheelAssemblies(root: Object3D): Group[] {
  const tireMeshes: Mesh[] = [];
  const rimMeshes: Mesh[] = [];

  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    const name = materialName(obj);
    if (/tyre|tire/i.test(name)) tireMeshes.push(obj);
    else if (RIM_MATERIAL_RE.test(name)) rimMeshes.push(obj);
  });

  root.updateMatrixWorld(true);
  const axles: Group[] = [];

  for (const tire of tireMeshes) {
    const pieces = splitMesh(tire, (center) =>
      `${center.x < 0 ? "left" : "right"}-${center.z < 0 ? "rear" : "front"}`,
    );
    for (const [key, holder] of pieces) {
      if (!key.startsWith("left-")) {
        holder.visible = false;
        continue;
      }
      holder.name = `carry_${key}_axle`;
      axles.push(holder);
    }
  }

  root.updateMatrixWorld(true);
  const axleCenters = axles.map((axle) => ({
    axle,
    center: axle.getWorldPosition(new Vector3()),
  }));

  for (const rim of rimMeshes) {
    const pieces = splitMesh(rim, (center) =>
      center.x < 0 ? "left" : "right",
    );
    const nearPiece = pieces.get("left");
    if (!nearPiece || axleCenters.length === 0) continue;

    nearPiece.updateMatrixWorld(true);
    const center = nearPiece.getWorldPosition(new Vector3());
    let nearest = axleCenters[0]!;
    for (const entry of axleCenters) {
      if (
        center.distanceToSquared(entry.center) <
        center.distanceToSquared(nearest.center)
      ) {
        nearest = entry;
      }
    }
    nearest.axle.attach(nearPiece);

    const farPiece = pieces.get("right");
    if (farPiece) farPiece.visible = false;
  }

  return axles;
}

/** Side-view Suzuki Carry blind van on the about-road. */
export default function AboutPageCarry() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let raf = 0;
    let renderer: WebGLRenderer | null = null;
    let car: Object3D | null = null;
    let carWidth = 3.2;
    let carHeight = 1.6;
    const wheelAssemblies: Object3D[] = [];
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let lastFrameTime: number | null = null;

    const syncMotionClass = () => {
      host.classList.toggle("is-reduced-motion", reducedMotion);
    };

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      lastFrameTime = null;
      syncMotionClass();
    };

    const scene = new Scene();
    const cam = new OrthographicCamera(-2, 2, 1.6, 0, 0.1, 50);
    cam.position.set(0, 0, 8);
    cam.lookAt(0, 0, 0);

    scene.add(
      new AmbientLight(0xffffff, 0.32),
      new HemisphereLight(0xf2f6ff, 0x3a3a40, 0.65),
    );
    const key = new DirectionalLight(0xfff8f0, 1.45);
    key.position.set(3.2, 4.2, 5);
    const fill = new DirectionalLight(0xd8e6ff, 0.5);
    fill.position.set(-3.5, 1.8, 2.5);
    const rimLight = new DirectionalLight(0xfff0dd, 0.35);
    rimLight.position.set(-1.5, 2.5, -4);
    scene.add(key, fill, rimLight);

    const root = new Group();
    scene.add(root);

    try {
      renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    const pmrem = new PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;
    scene.environment = envTex;
    pmrem.dispose();

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);
    syncMotionClass();
    motionQuery.addEventListener("change", handleMotionPreference);

    const setSize = () => {
      if (!renderer || disposed) return;
      const w = Math.max(host.clientWidth, 1);
      const h = Math.max(host.clientHeight, 1);
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const superSample = Math.max(3, Math.ceil(420 / w));
      renderer.setPixelRatio(Math.min(dpr * superSample, 8));
      renderer.setSize(w, h, false);
      const aspect = w / h;

      const viewHeight = Math.max(carHeight * 1.02, (carWidth / aspect) * 1.02);
      const halfWidth = (viewHeight * aspect) / 2;
      cam.left = -halfWidth;
      cam.right = halfWidth;
      cam.top = viewHeight;
      cam.bottom = 0;
      cam.updateProjectionMatrix();
    };

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(host);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER);
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        car = gltf.scene;

        tuneCarryMaterials(car);
        wheelAssemblies.push(...buildCarryWheelAssemblies(car));
        if (wheelAssemblies.length !== 2) {
          console.warn(
            `[AboutPageCarry] expected 2 near-side wheels, found ${wheelAssemblies.length}`,
          );
        }

        const box = new Box3().setFromObject(car);
        const size = box.getSize(new Vector3());
        const center = box.getCenter(new Vector3());
        car.position.sub(center);

        const longest = Math.max(size.x, size.y, size.z, 0.001);
        car.scale.setScalar(3.2 / longest);

        // Nose +X (right) without Z-flip
        root.rotation.set(0, Math.PI / 2, 0);
        root.add(car);
        root.updateMatrixWorld(true);

        const grounded = new Box3().setFromObject(root);
        root.position.set(0, -grounded.min.y, 0);
        root.updateMatrixWorld(true);

        const framed = new Box3().setFromObject(root);
        const framedSize = framed.getSize(new Vector3());
        carWidth = framedSize.x;
        carHeight = framedSize.y;

        host.dataset.ready = "true";
        host.classList.add("is-ready");
        setSize();
      },
      undefined,
      (err) => {
        console.error("[AboutPageCarry] failed to load", err);
      },
    );

    const tick = (now: number) => {
      if (disposed || !renderer) return;
      raf = requestAnimationFrame(tick);

      if (!reducedMotion) {
        if (lastFrameTime !== null) {
          const deltaSeconds = Math.min((now - lastFrameTime) / 1000, 0.1);
          const wheelDelta = deltaSeconds * WHEEL_SPIN_RADIANS_PER_SECOND;
          for (const wheel of wheelAssemblies) wheel.rotateX(wheelDelta);
        }
        lastFrameTime = now;
      } else {
        lastFrameTime = null;
      }

      renderer.render(scene, cam);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      motionQuery.removeEventListener("change", handleMotionPreference);
      delete host.dataset.ready;
      host.classList.remove("is-ready", "is-reduced-motion");
      scene.environment = null;
      envTex.dispose();
      renderer?.dispose();
      dracoLoader.dispose();
      canvas.remove();
      car?.traverse((obj) => {
        if (!(obj instanceof Mesh)) return;
        obj.geometry?.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => m?.dispose?.());
      });
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="about-road__glb-car about-road__glb-car--carry"
      aria-hidden
    />
  );
}
