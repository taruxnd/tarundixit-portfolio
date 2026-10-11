"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  OrthographicCamera,
  PMREMGenerator,
  Quaternion,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { polishCarTextures } from "./polishCarTextures";

const DRACO_DECODER = "/draco/";
/** Match the WagonR / 24s road loop. */
const WHEEL_SPIN_RADIANS_PER_SECOND = Math.PI * 2.15;
const SCREEN_AXLE = new Vector3(0, 0, 1);

export interface GlbCarSpec {
  modelUrl: string;
  /**
   * Wheel assemblies, tested against three.js-sanitized node names (spaces
   * become `_`, dots and colons are dropped). The topmost match in each
   * branch is taken, so name the assembly, not the car.
   */
  wheels: RegExp;
  /** Matches `wheels` but must stay still (calipers, steering wheel). */
  notWheels?: RegExp;
  /** Parts at the front of the car; decides which way it faces. */
  front: RegExp;
  /** Optional material tune-up after load. */
  tune?: (root: Object3D) => void;
  exposure?: number;
}

function forEachMaterial(root: Object3D, fn: (m: MeshStandardMaterial) => void) {
  const seen = new Set<MeshStandardMaterial>();
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const m of mats) {
      if (m instanceof MeshStandardMaterial && !seen.has(m)) {
        seen.add(m);
        fn(m);
      }
    }
  });
}

/** Cars added through the generic loader. Keys double as CSS modifiers. */
export const GLB_CARS: Record<string, GlbCarSpec> = {
  "maruti-800": {
    modelUrl: "/models/maruti-800.glb",
    wheels: /^rim_rf\d*$/i,
    front: /frnt_|bonet|hood_part|indicators_frnt|lights_main/i,
    tune(root) {
      forEachMaterial(root, (m) => {
        const name = m.name.toLowerCase();
        if (name.startsWith("primary")) {
          // Near-matte: the bright room reflection on red paint reads as a
          // white band at 70px, so keep the env contribution low.
          m.roughness = 0.55;
          m.metalness = 0;
          m.envMapIntensity = 0.3;
        } else if (name.includes("glass")) {
          // The interior was stripped, so tint the glass instead of seeing
          // straight through to the page background.
          m.color.set("#182028");
          m.transparent = true;
          m.opacity = 0.82;
          m.roughness = 0.12;
          m.envMapIntensity = 1.1;
          m.depthWrite = false;
        }
      });
    },
  },
  "kia-carens": {
    modelUrl: "/models/kia-carens.glb",
    wheels: /^00\d+_(wheel|whl|tire)/i,
    notWheels: /brake|str_whl/i,
    front: /headlamp|fb_|fbumper|frontglass|hl_/i,
    exposure: 1.1,
    tune(root) {
      forEachMaterial(root, (m) => {
        const name = m.name.toLowerCase();
        if (name.includes("carpaint")) {
          m.roughness = Math.min(m.roughness, 0.25);
          m.envMapIntensity = 1.1;
        }
      });
    },
  },
};

/** Topmost nodes matching the wheel pattern (never descends into a match). */
function collectWheels(root: Object3D, spec: GlbCarSpec): Object3D[] {
  const wheels: Object3D[] = [];
  const visit = (obj: Object3D) => {
    if (spec.wheels.test(obj.name) && !spec.notWheels?.test(obj.name)) {
      wheels.push(obj);
      return;
    }
    for (const child of obj.children) visit(child);
  };
  visit(root);
  return wheels;
}

/**
 * Work out the yaw that points the car's nose along +x (screen right).
 * Compares the centre of the front-named parts with the car's centre
 * along its longer horizontal axis.
 */
function facingYaw(car: Object3D, spec: GlbCarSpec, label: string): number {
  car.updateMatrixWorld(true);
  const whole = new Box3().setFromObject(car);
  const size = whole.getSize(new Vector3());
  const center = whole.getCenter(new Vector3());
  const axis: "x" | "z" = size.z > size.x ? "z" : "x";

  // Match node names, not just meshes: Sketchfab exports often name the
  // wrapper node ("00_mi12 headlamp") and leave the mesh as "Object_8".
  const frontBox = new Box3();
  let found = 0;
  car.traverse((obj) => {
    if (!spec.front.test(obj.name)) return;
    const box = new Box3().setFromObject(obj);
    if (box.isEmpty()) return;
    frontBox.union(box);
    found++;
  });
  if (found === 0 || frontBox.isEmpty()) {
    console.warn(`[AboutPageGlbCar:${label}] no front parts matched; guessing`);
    return axis === "z" ? -Math.PI / 2 : 0;
  }
  const front = frontBox.getCenter(new Vector3());
  const sign = Math.sign(front[axis] - center[axis]) || 1;
  if (axis === "z") return sign > 0 ? Math.PI / 2 : -Math.PI / 2;
  return sign > 0 ? 0 : Math.PI;
}

/**
 * Generic side-view GLB car for the about-road. Orientation and wheel
 * pivots are derived from the model, so a new car only needs a spec.
 */
export default function AboutPageGlbCar({
  id,
  animate = true,
  speedRef,
  innerRef,
}: {
  /** Key into GLB_CARS; also the CSS modifier. */
  id: keyof typeof GLB_CARS;
  animate?: boolean;
  speedRef?: { current: number };
  innerRef?: (el: HTMLDivElement | null) => void;
}) {
  const spec = GLB_CARS[id];
  const hostRef = useRef<HTMLDivElement | null>(null);
  const animateRef = useRef(animate);
  animateRef.current = animate;
  const speedFactorRef = useRef(speedRef);
  speedFactorRef.current = speedRef;
  const setHost = useCallback(
    (el: HTMLDivElement | null) => {
      hostRef.current = el;
      innerRef?.(el);
    },
    [innerRef],
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !spec) return;

    let disposed = false;
    let raf = 0;
    let renderer: WebGLRenderer | null = null;
    let car: Object3D | null = null;
    let carWidth = 3.2;
    let carHeight = 1.6;
    const wheels: { pivot: Object3D; axis: Vector3 }[] = [];
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
      new AmbientLight(0xffffff, 0.35),
      new HemisphereLight(0xfff6ea, 0x34343c, 0.75),
    );
    const key = new DirectionalLight(0xffffff, 1.65);
    key.position.set(2.5, 3, 4);
    const fill = new DirectionalLight(0xffe2b0, 0.45);
    fill.position.set(-2, 1.5, 3);
    scene.add(key, fill);

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
    renderer.toneMappingExposure = spec.exposure ?? 1.05;
    const pmrem = new PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
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
      spec.modelUrl,
      (gltf) => {
        if (disposed || !renderer) return;
        car = gltf.scene;
        polishCarTextures(car, renderer);
        spec.tune?.(car);
        host.dataset.tune = spec.tune ? "applied" : "none";

        const box = new Box3().setFromObject(car);
        const size = box.getSize(new Vector3());
        const center = box.getCenter(new Vector3());
        car.position.sub(center);
        const longest = Math.max(size.x, size.y, size.z, 0.001);
        car.scale.setScalar(3.2 / longest);

        const yaw = facingYaw(car, spec, id);
        root.rotation.set(0, yaw, 0);
        host.dataset.yaw = (yaw / Math.PI).toFixed(2) + "π";
        root.add(car);
        root.updateMatrixWorld(true);

        const grounded = new Box3().setFromObject(root);
        root.position.set(0, -grounded.min.y, 0);
        root.updateMatrixWorld(true);

        const framed = new Box3().setFromObject(root);
        const framedSize = framed.getSize(new Vector3());
        carWidth = framedSize.x;
        carHeight = framedSize.y;

        // Wheels spin about their own centre, whatever the authored pivot.
        for (const wheel of collectWheels(car, spec)) {
          const parent = wheel.parent;
          if (!parent) continue;
          const wheelBox = new Box3().setFromObject(wheel);
          if (wheelBox.isEmpty()) continue;
          const pivot = new Group();
          pivot.position.copy(parent.worldToLocal(wheelBox.getCenter(new Vector3())));
          parent.add(pivot);
          pivot.updateMatrixWorld(true);
          pivot.attach(wheel);
          const parentQuat = parent.getWorldQuaternion(new Quaternion()).invert();
          const axis = SCREEN_AXLE.clone().applyQuaternion(parentQuat).normalize();
          wheels.push({ pivot, axis });
        }
        host.dataset.wheels = String(wheels.length);
        if (wheels.length === 0) {
          console.warn(`[AboutPageGlbCar:${id}] no wheels matched`);
        }

        host.dataset.ready = "true";
        host.classList.add("is-ready");
        setSize();
      },
      undefined,
      (err) => {
        console.error(`[AboutPageGlbCar:${id}] failed to load`, err);
      },
    );

    const tick = (now: number) => {
      if (disposed || !renderer) return;
      raf = requestAnimationFrame(tick);

      if (!animateRef.current) {
        lastFrameTime = null;
        return;
      }

      if (!reducedMotion) {
        if (lastFrameTime !== null) {
          const deltaSeconds = Math.min((now - lastFrameTime) / 1000, 0.1);
          // Negative about screen +z: tops of the wheels move right.
          const angle =
            -deltaSeconds *
            WHEEL_SPIN_RADIANS_PER_SECOND *
            (speedFactorRef.current?.current ?? 1);
          for (const wheel of wheels) wheel.pivot.rotateOnAxis(wheel.axis, angle);
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
      host.classList.remove("is-ready", "is-reduced-motion", "is-paused");
      renderer?.dispose();
      dracoLoader.dispose();
      scene.environment = null;
      envTex.dispose();
      canvas.remove();
      car?.traverse((obj) => {
        if (!(obj instanceof Mesh)) return;
        obj.geometry?.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => m?.dispose?.());
      });
    };
  }, [spec, id]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.classList.toggle("is-paused", !animate);
  }, [animate]);

  return (
    <div
      ref={setHost}
      className={`about-road__glb-car about-road__glb-car--${id}`}
      aria-hidden
    />
  );
}
