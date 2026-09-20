"use client";

import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  Color,
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
  type Material,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const DRACO_DECODER = "/draco/";
const MODEL_URL = "/models/suzuki-ertiga.glb";
/** White Dreza shell — clo_NONE is authored mauve in the textureless bake. */
const BODY_WHITE = new Color("#f2f3f5");
const TIRE_MATERIAL = "m_2022_honda_hr_v_ehev_tires";
/** Match the WagonR and the shared 24s road loop. */
const WHEEL_SPIN_RADIANS_PER_SECOND = Math.PI * 2.15;

function asPhysical(source: MeshStandardMaterial): MeshPhysicalMaterial {
  // Avoid Material.copy() — textureless FBX slots leave Vector3/Color fields
  // undefined and Three throws on v.x during the Physical upgrade path.
  const next = new MeshPhysicalMaterial({
    name: source.name,
    color: source.color?.clone() ?? new Color(0xffffff),
    map: source.map,
    lightMap: source.lightMap,
    lightMapIntensity: source.lightMapIntensity,
    aoMap: source.aoMap,
    aoMapIntensity: source.aoMapIntensity,
    emissive: source.emissive?.clone() ?? new Color(0x000000),
    emissiveMap: source.emissiveMap,
    emissiveIntensity: source.emissiveIntensity,
    bumpMap: source.bumpMap,
    bumpScale: source.bumpScale,
    normalMap: source.normalMap,
    normalMapType: source.normalMapType,
    normalScale: source.normalScale?.clone(),
    displacementMap: source.displacementMap,
    displacementScale: source.displacementScale,
    displacementBias: source.displacementBias,
    roughness: source.roughness,
    roughnessMap: source.roughnessMap,
    metalness: source.metalness,
    metalnessMap: source.metalnessMap,
    alphaMap: source.alphaMap,
    envMap: source.envMap,
    envMapIntensity: source.envMapIntensity,
    wireframe: source.wireframe,
    flatShading: source.flatShading,
    fog: source.fog,
    transparent: source.transparent,
    opacity: source.opacity,
    depthWrite: source.depthWrite,
    depthTest: source.depthTest,
    side: source.side,
  });
  return next;
}

/**
 * Textureless FBX bake: every slot is metalness 0 / roughness 0.6. Rebuild the
 * exterior as real car-paint / glass / chrome so RoomEnvironment can catch.
 */
function fixErtigaMaterials(root: Object3D) {
  const remapped = new Map<Material, Material>();

  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    const nextMats = mats.map((raw) => {
      if (!raw) return raw;
      const cached = remapped.get(raw);
      if (cached) return cached;
      if (!(raw instanceof MeshStandardMaterial)) return raw;

      const name = (raw.name || "").toLowerCase();
      let next: Material = raw;

      if (name === "clo_none" || name === "color_a04_00_000" || name === "color_a04_00") {
        const paint = asPhysical(raw);
        paint.color.copy(BODY_WHITE);
        paint.metalness = 0.05;
        paint.roughness = 0.22;
        paint.clearcoat = 1;
        paint.clearcoatRoughness = 0.08;
        paint.envMapIntensity = 1.35;
        paint.needsUpdate = true;
        next = paint;
      } else if (name === "color_001_00") {
        // Tinted glass — no transmission (alpha canvas would show through).
        const glass = asPhysical(raw);
        glass.color.set("#1a242c");
        glass.metalness = 0.15;
        glass.roughness = 0.06;
        glass.transparent = true;
        glass.opacity = 0.42;
        glass.depthWrite = false;
        glass.envMapIntensity = 1.8;
        glass.needsUpdate = true;
        next = glass;
      } else if (name === "m_0130_gainsboro" || name === "matte__ffffffff") {
        const chrome = asPhysical(raw);
        chrome.color.set("#d8dbe0");
        chrome.metalness = 0.92;
        chrome.roughness = 0.18;
        chrome.envMapIntensity = 1.4;
        chrome.needsUpdate = true;
        next = chrome;
      } else if (name === "color_007_00" || name === "m_0135_darkgray" || name === "m_2022_honda_002") {
        raw.color.set(name === "color_007_00" ? "#2a2d31" : "#3a3d42");
        raw.metalness = 0.15;
        raw.roughness = 0.55;
        raw.envMapIntensity = 0.7;
        raw.needsUpdate = true;
        next = raw;
      } else if (name === TIRE_MATERIAL || name.includes("tire") || name === "black3") {
        raw.color.set("#1a1a1c");
        raw.metalness = 0;
        raw.roughness = 0.88;
        raw.envMapIntensity = 0.25;
        raw.needsUpdate = true;
        next = raw;
      } else if (name === "brakedisk") {
        raw.color.set("#6a6e74");
        raw.metalness = 0.7;
        raw.roughness = 0.35;
        raw.needsUpdate = true;
        next = raw;
      } else if (name === "vehiclelights1") {
        const lamp = asPhysical(raw);
        lamp.color.set("#f7f8f4");
        lamp.emissive.set("#fff1c8");
        lamp.emissiveIntensity = 0.35;
        lamp.metalness = 0.05;
        lamp.roughness = 0.12;
        lamp.transparent = true;
        lamp.opacity = 0.92;
        lamp.envMapIntensity = 1.2;
        lamp.needsUpdate = true;
        next = lamp;
      } else if (name === "color_b17_00") {
        const tail = asPhysical(raw);
        tail.color.set("#b01018");
        tail.emissive.set("#6a0508");
        tail.emissiveIntensity = 0.22;
        tail.metalness = 0.05;
        tail.roughness = 0.2;
        tail.transparent = true;
        tail.opacity = 0.88;
        tail.depthWrite = false;
        tail.needsUpdate = true;
        next = tail;
      } else if (name === "material_002" || name === "matte__69a6a6a6") {
        raw.color.set("#e6e8eb");
        raw.metalness = 0.08;
        raw.roughness = 0.4;
        raw.needsUpdate = true;
        next = raw;
      }

      remapped.set(raw, next);
      return next;
    });

    obj.material = nextMats.length === 1 ? nextMats[0]! : nextMats;
  });

  // Drop upgraded Standard slots we no longer reference.
  for (const [from, to] of remapped) {
    if (from !== to) from.dispose();
  }
}

function materialNames(mesh: Mesh): string[] {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return mats.map((m) => (m?.name || "").toLowerCase());
}

/**
 * Object_165 packs three tires; Object_167 is the fourth. Partition by local
 * X/Y quadrants into axle pivots, then attach nearby rim meshes so the whole
 * wheel (tire + rim) spins — rims alone looked static before.
 */
function buildErtigaWheelAssemblies(root: Object3D) {
  const wheelAssemblies: Group[] = [];
  const tireMeshes: Mesh[] = [];
  const rimCandidates: Mesh[] = [];

  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    const names = materialNames(obj);
    if (names.some((n) => n === TIRE_MATERIAL)) {
      tireMeshes.push(obj);
      return;
    }
    // Per-wheel Gainsboro disks / faces (skip long body chrome rails)
    if (names.some((n) => n === "m_0130_gainsboro")) {
      rimCandidates.push(obj);
    }
  });

  for (const tireMesh of tireMeshes) {
    const geometry = tireMesh.geometry;
    const position = geometry.getAttribute("position");
    const index = geometry.index;
    const parent = tireMesh.parent;
    if (!position || !index || !parent) continue;

    const trianglesByWheel = new Map<string, number[]>();
    for (let i = 0; i < index.count; i += 3) {
      const a = index.getX(i);
      const b = index.getX(i + 1);
      const c = index.getX(i + 2);
      const x = (position.getX(a) + position.getX(b) + position.getX(c)) / 3;
      const y = (position.getY(a) + position.getY(b) + position.getY(c)) / 3;
      const key = `${x < 0 ? "left" : "right"}-${y < 0 ? "rear" : "front"}`;
      const wheelIndices = trianglesByWheel.get(key) ?? [];
      wheelIndices.push(a, b, c);
      trianglesByWheel.set(key, wheelIndices);
    }

    const tireRoot = new Group();
    tireRoot.name = `${tireMesh.name}_wheel_root`;
    tireRoot.position.copy(tireMesh.position);
    tireRoot.quaternion.copy(tireMesh.quaternion);
    tireRoot.scale.copy(tireMesh.scale);
    parent.add(tireRoot);

    for (const [key, wheelIndices] of trianglesByWheel) {
      const wheelGeometry = geometry.clone();
      wheelGeometry.setIndex(wheelIndices);
      const bounds = new Box3();
      const point = new Vector3();
      for (const vertexIndex of wheelIndices) {
        point.fromBufferAttribute(position, vertexIndex);
        bounds.expandByPoint(point);
      }
      const center = bounds.getCenter(new Vector3());

      const axle = new Group();
      axle.name = `${tireMesh.name}_${key}_axle`;
      axle.position.copy(center);

      const tire = new Mesh(wheelGeometry, tireMesh.material);
      tire.name = `${tireMesh.name}_${key}`;
      tire.position.copy(center).multiplyScalar(-1);
      tire.castShadow = tireMesh.castShadow;
      tire.receiveShadow = tireMesh.receiveShadow;
      axle.add(tire);
      tireRoot.add(axle);
      wheelAssemblies.push(axle);
    }

    parent.remove(tireMesh);
    geometry.dispose();
  }

  root.updateMatrixWorld(true);

  const axleWorld = wheelAssemblies.map((axle) => {
    const center = new Vector3();
    axle.getWorldPosition(center);
    return { axle, center };
  });

  const size = new Vector3();
  const rimCenter = new Vector3();
  const rimBox = new Box3();

  for (const rim of rimCandidates) {
    rimBox.setFromObject(rim);
    rimBox.getSize(size);
    // Body chrome rails span ~300 units on Z — skip those
    if (Math.max(size.x, size.y, size.z) > 120) continue;

    rimBox.getCenter(rimCenter);
    let best = axleWorld[0];
    let bestDist = Infinity;
    for (const entry of axleWorld) {
      const d = rimCenter.distanceToSquared(entry.center);
      if (d < bestDist) {
        bestDist = d;
        best = entry;
      }
    }
    // Only parent if clearly near a tire axle (~half wheelbase)
    if (!best || bestDist > 55 * 55) continue;
    best.axle.attach(rim);
  }

  return wheelAssemblies;
}

/** Side-view Ertiga — same curb footing + loop as WagonR. */
export default function AboutPageErtiga() {
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

    // Soft fill + directional key so clearcoat / chrome catch the env map.
    // High ambient washed the textureless shell into flat plastic.
    scene.add(
      new AmbientLight(0xffffff, 0.28),
      new HemisphereLight(0xf2f6ff, 0x3a3a40, 0.7),
    );
    const key = new DirectionalLight(0xfff8f0, 1.55);
    key.position.set(3.2, 4.2, 5);
    const fill = new DirectionalLight(0xd8e6ff, 0.55);
    fill.position.set(-3.5, 1.8, 2.5);
    const rim = new DirectionalLight(0xfff0dd, 0.4);
    rim.position.set(-1.5, 2.5, -4);
    scene.add(key, fill, rim);

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
    renderer.toneMappingExposure = 1.18;

    // Studio IBL — textureless paint needs real reflections.
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
      // Supersample: CSS box is tiny (~100px); draw at ≥3× so it stays sharp.
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

        fixErtigaMaterials(car);
        wheelAssemblies.push(...buildErtigaWheelAssemblies(car));
        if (wheelAssemblies.length !== 4) {
          console.warn(
            `[AboutPageErtiga] expected 4 wheel assemblies, found ${wheelAssemblies.length}`,
          );
        }

        const box = new Box3().setFromObject(car);
        const size = box.getSize(new Vector3());
        const center = box.getCenter(new Vector3());
        car.position.sub(center);

        const longest = Math.max(size.x, size.y, size.z, 0.001);
        car.scale.setScalar(3.2 / longest);

        // Face traffic right without mirroring (mirroring flipped wheel spin).
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
        console.error("[AboutPageErtiga] failed to load", err);
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
      className="about-road__glb-car about-road__glb-car--ertiga"
      aria-hidden
    />
  );
}
