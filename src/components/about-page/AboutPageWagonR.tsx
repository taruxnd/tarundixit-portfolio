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
const MODEL_URL = "/models/suzuki-wagonr.glb";
/**
 * three.js strips "." from glTF names (PropertyBinding.sanitizeNodeName),
 * so authored `wheel.001` becomes `wheel001` at runtime.
 */
const WHEEL_NAME_RE = /^wheel\d*$/i;
/** Match forward CSS traffic (~24s lap). Negated: +rotateX reads backward on this bake. */
const WHEEL_SPIN_RADIANS_PER_SECOND = -Math.PI * 2.15;

function collectWagonRWheels(root: Object3D): Object3D[] {
  const wheels: Object3D[] = [];
  root.traverse((obj) => {
    if (!WHEEL_NAME_RE.test(obj.name)) return;
    // Prefer the assembly group (has tire/rim/hub children), not leaf meshes
    if (obj.children.length === 0) return;
    wheels.push(obj);
  });
  return wheels;
}

/** Side-view WagonR looping with the about-road traffic. */
export default function AboutPageWagonR({
  lane = "a",
}: {
  /** Stagger multiple WagonRs on the shared 24s loop. */
  lane?: "a" | "b";
} = {}) {
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
      new AmbientLight(0xffffff, 0.9),
      new HemisphereLight(0xfff6ea, 0x444448, 0.55),
    );
    const key = new DirectionalLight(0xffffff, 1.2);
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
    renderer.toneMappingExposure = 1.05;
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

        wheelAssemblies.push(...collectWagonRWheels(car));
        if (wheelAssemblies.length !== 4) {
          console.warn(
            `[AboutPageWagonR] expected 4 wheels, found ${wheelAssemblies.length}`,
            wheelAssemblies.map((w) => w.name),
          );
        }

        const box = new Box3().setFromObject(car);
        const size = box.getSize(new Vector3());
        const center = box.getCenter(new Vector3());
        car.position.sub(center);

        const longest = Math.max(size.x, size.y, size.z, 0.001);
        car.scale.setScalar(3.2 / longest);

        // Side profile facing right
        root.rotation.set(0, -Math.PI / 2, 0);
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
        console.error("[AboutPageWagonR] failed to load", err);
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
  }, []);

  return (
    <div
      ref={hostRef}
      className={`about-road__glb-car about-road__glb-car--wagonr about-road__glb-car--wagonr-${lane}`}
      aria-hidden
    />
  );
}
