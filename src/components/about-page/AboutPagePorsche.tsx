"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  Object3D,
  OrthographicCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  type MeshStandardMaterial,
} from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const DRACO_DECODER = "/draco/";

const MODEL_URL = "/models/porsche-911.glb";
const LOOP_MS = 14000;
const SPINS_PER_LOOP = 14;
const BODY_RED = new Color("#c8102e");

function makeAxlePivot(wheel: Object3D): Group {
  const parent = wheel.parent;
  if (!parent) {
    const fallback = new Group();
    fallback.add(wheel);
    return fallback;
  }

  parent.updateWorldMatrix(true, true);
  const center = new Box3()
    .setFromObject(wheel)
    .getCenter(new Vector3());
  const localCenter = parent.worldToLocal(center.clone());
  const pivot = new Group();
  parent.add(pivot);
  pivot.position.copy(localCenter);
  pivot.attach(wheel);
  return pivot;
}

function paintBodyRed(root: Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    const objName = (obj.name || "").toLowerCase();
    if (/cylinder|wheel|tire|glass|light|lamp/i.test(objName)) return;

    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    const next = mats.map((mat) => {
      const name = (mat.name || "").toLowerCase();
      const isBody =
        name === "paint" ||
        name === "coat" ||
        name === "carpaint" ||
        (/paint|coat|body|chassis/i.test(name) && !/glass/i.test(name));
      if (!isBody) return mat;

      const cloned = (mat as MeshStandardMaterial).clone();
      cloned.color.copy(BODY_RED);
      cloned.metalness = 0.45;
      cloned.roughness = 0.28;
      cloned.map = null;
      cloned.emissive = BODY_RED.clone().multiplyScalar(0.08);
      cloned.needsUpdate = true;
      return cloned;
    });
    obj.material = next.length === 1 ? next[0] : next;
  });
}

/** Side-view Porsche GLB that drives along the about-road traffic lane. */
export default function AboutPagePorsche() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let raf = 0;
    let renderer: WebGLRenderer | null = null;
    let car: Object3D | null = null;
    const axles: Group[] = [];
    let baseY = 0;
    let startAt = 0;
    let ready = false;

    const scene = new Scene();
    const cam = new OrthographicCamera(-2, 2, 1.2, -0.15, 0.1, 50);
    cam.position.set(0, 0.55, 8);
    cam.lookAt(0, 0.55, 0);

    scene.add(
      new AmbientLight(0xffffff, 0.85),
      new HemisphereLight(0xfff6ea, 0x444448, 0.55),
    );
    const key = new DirectionalLight(0xffffff, 1.15);
    key.position.set(2.5, 3, 4);
    const warm = new DirectionalLight(0xffc857, 0.55);
    warm.position.set(4, 2, 1);
    scene.add(key, warm);

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
    renderer.toneMappingExposure = 1.15;
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);

    const setSize = () => {
      if (!renderer || disposed) return;
      const w = Math.max(host.clientWidth, 1);
      const h = Math.max(host.clientHeight, 1);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      const aspect = w / h;
      const halfH = 1.05;
      cam.left = -halfH * aspect;
      cam.right = halfH * aspect;
      cam.top = halfH * 1.15;
      cam.bottom = -halfH * 0.12;
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
        paintBodyRed(car);

        const wheelNames = new Set<string>();
        car.traverse((obj) => {
          if (/^Cylinder\d+$/i.test(obj.name)) wheelNames.add(obj.name);
        });
        if (wheelNames.size === 0) {
          wheelNames.add("Cylinder000");
          wheelNames.add("Cylinder001");
        }
        for (const name of wheelNames) {
          const wheel = car.getObjectByName(name);
          if (wheel) axles.push(makeAxlePivot(wheel));
        }

        const box = new Box3().setFromObject(car);
        const size = box.getSize(new Vector3());
        const center = box.getCenter(new Vector3());
        car.position.sub(center);

        const longest = Math.max(size.x, size.y, size.z, 0.001);
        car.scale.setScalar(3.35 / longest);
        root.rotation.set(0, Math.PI / 2, 0);
        root.add(car);
        root.updateMatrixWorld(true);

        const grounded = new Box3().setFromObject(root);
        baseY = -grounded.min.y;
        root.position.set(0, baseY, 0);

        ready = true;
        startAt = performance.now();
        host.style.setProperty("--drive-x", "18%");
        host.dataset.ready = "true";
        host.classList.add("is-ready");
        setSize();
      },
      undefined,
      (err) => {
        console.error("[AboutPagePorsche] failed to load", err);
      },
    );

    const tick = (now: number) => {
      if (disposed || !renderer) return;
      raf = requestAnimationFrame(tick);

      if (ready) {
        if (!reduced) {
          const u = ((now - startAt) % LOOP_MS) / LOOP_MS;
          const drive = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
          host.style.setProperty("--drive-x", `${-12 + drive * 118}%`);
          const spin = -drive * SPINS_PER_LOOP * Math.PI * 2;
          for (const axle of axles) axle.rotation.x = spin;
        } else {
          host.style.setProperty("--drive-x", "28%");
        }
        root.position.y = baseY;
      }

      renderer.render(scene, cam);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      ready = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      delete host.dataset.ready;
      host.classList.remove("is-ready");
      host.style.removeProperty("--drive-x");
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

  return <div ref={hostRef} className="about-road__porsche" />;
}
