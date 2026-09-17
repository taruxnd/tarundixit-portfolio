"use client";

import { useEffect, useRef } from "react";

const LOGO_URL = "/models/google-g.glb";

type Props = {
  /** Building / prop GLB path under /public */
  modelUrl: string;
  /** World-space height of the building */
  targetHeight?: number;
  /** Yaw for side elevation (default π/2) */
  yaw?: number;
  /** Rooftop Google G facing the camera */
  withLogo?: boolean;
  /** Logo height relative to scene */
  logoHeight?: number;
  /**
   * Some Sketchfab exports ship near-black metallic materials that vanish
   * without an HDRI — lift albedo so they read on a transparent diorama.
   */
  liftDarkMaterials?: boolean;
};

/**
 * Side-elevation diorama prop: building on the road deck, optional Google G on roof.
 */
export default function DioramaProp({
  modelUrl,
  targetHeight = 2,
  yaw = Math.PI / 2,
  withLogo = true,
  logoHeight = 0.55,
  liftDarkMaterials = false,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let renderer: import("three").WebGLRenderer | null = null;
    let prop: import("three").Group | null = null;
    let logo: import("three").Group | null = null;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    let fitW = 2.2;
    let fitH = 2.8;
    let viewCenterY = 1.3;
    const state = { ready: false };

    const boot = async () => {
      const three = await import("three");
      const { GLTFLoader } = await import(
        "three/examples/jsm/loaders/GLTFLoader.js"
      );
      if (disposed) return;

      const {
        ACESFilmicToneMapping,
        AmbientLight,
        Box3,
        Color,
        DirectionalLight,
        Group,
        HemisphereLight,
        OrthographicCamera,
        SRGBColorSpace,
        Scene,
        Vector3,
        WebGLRenderer,
      } = three;

      const scene = new Scene();
      const cam = new OrthographicCamera(-1.2, 1.2, 2.6, -0.1, 0.1, 50);
      cam.position.set(0, 1.3, 12);
      cam.lookAt(0, 1.3, 0);

      scene.add(new AmbientLight(0xffffff, liftDarkMaterials ? 0.85 : 0.55));
      scene.add(new HemisphereLight(0xfff6ea, 0x4a4c52, liftDarkMaterials ? 0.9 : 0.65));
      const key = new DirectionalLight(0xfff8f0, liftDarkMaterials ? 1.55 : 1.15);
      key.position.set(2.5, 4, 3.5);
      scene.add(key);
      const fill = new DirectionalLight(0xd4e0ff, liftDarkMaterials ? 0.7 : 0.4);
      fill.position.set(-2.5, 2, 2);
      scene.add(fill);
      if (liftDarkMaterials) {
        const rim = new DirectionalLight(0xffffff, 0.55);
        rim.position.set(0, 2, 5);
        scene.add(rim);
      }

      const root = new Group();
      scene.add(root);

      try {
        renderer = new WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }

      renderer.outputColorSpace = SRGBColorSpace;
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = liftDarkMaterials ? 1.35 : 1.05;
      renderer.setClearColor(new Color(0x000000), 0);
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      host.appendChild(renderer.domElement);

      const paint = () => {
        if (!disposed && renderer && state.ready) renderer.render(scene, cam);
      };

      const setSize = () => {
        if (!renderer || disposed) return;
        const w = Math.max(host.clientWidth, 1);
        const h = Math.max(host.clientHeight, 1);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h, false);
        const aspect = w / h;
        const halfH = Math.max(fitH / 2, fitW / 2 / aspect);
        const halfW = halfH * aspect;
        cam.left = -halfW;
        cam.right = halfW;
        cam.top = viewCenterY + halfH;
        cam.bottom = viewCenterY - halfH;
        cam.position.set(0, viewCenterY, 12);
        cam.lookAt(0, viewCenterY, 0);
        cam.updateProjectionMatrix();
        paint();
      };
      setSize();

      ro = new ResizeObserver(setSize);
      ro.observe(host);

      io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) paint();
        },
        { rootMargin: "80px", threshold: 0 },
      );
      io.observe(host);

      const prepareMesh = (obj: import("three").Object3D) => {
        const drop: import("three").Object3D[] = [];
        obj.traverse((child) => {
          if (
            (child as import("three").Camera).isCamera ||
            (child as import("three").Light).isLight
          ) {
            drop.push(child);
            return;
          }
          const mesh = child as import("three").Mesh;
          if (!mesh.isMesh) return;
          mesh.frustumCulled = false;
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          mats.forEach((mat) => {
            if (!mat) return;
            const std = mat as import("three").MeshStandardMaterial;
            std.side = three.DoubleSide;
            if (liftDarkMaterials && std.color) {
              const { r, g, b } = std.color;
              const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
              if (lum < 0.18) {
                // Pull charcoal Sketchfab albedos up into a readable mid-tone
                const gain = Math.min(6, 0.42 / Math.max(lum, 0.015));
                std.color.multiplyScalar(gain);
              }
              std.metalness = 0.08;
              std.roughness = 0.72;
            } else {
              if ("roughness" in std) {
                std.roughness = Math.min(std.roughness ?? 0.8, 0.85);
              }
              if ("metalness" in std) {
                std.metalness = Math.min(std.metalness ?? 0.1, 0.25);
              }
            }
            std.needsUpdate = true;
          });
        });
        drop.forEach((child) => child.parent?.remove(child));
      };

      const loader = new GLTFLoader();
      const loadGltf = (url: string) =>
        new Promise<import("three").Group>((resolve, reject) => {
          loader.load(url, (gltf) => resolve(gltf.scene), undefined, reject);
        });

      const jobs: Promise<import("three").Group>[] = [loadGltf(modelUrl)];
      if (withLogo) jobs.push(loadGltf(LOGO_URL));

      void Promise.all(jobs)
        .then(([buildingScene, logoScene]) => {
          if (disposed || !buildingScene) return;

          prepareMesh(buildingScene);
          prop = new Group();

          const bBox0 = new Box3().setFromObject(buildingScene);
          const bSize = bBox0.getSize(new Vector3());
          const bCenter = bBox0.getCenter(new Vector3());
          buildingScene.position.sub(bCenter);
          buildingScene.scale.setScalar(
            targetHeight / Math.max(bSize.y, 0.001),
          );
          prop.add(buildingScene);

          root.rotation.set(0, yaw, 0);
          root.add(prop);
          root.updateMatrixWorld(true);

          const grounded = new Box3().setFromObject(root);
          root.position.set(
            -(grounded.min.x + grounded.max.x) / 2,
            -grounded.min.y,
            0,
          );
          root.updateMatrixWorld(true);

          const framed = new Box3().setFromObject(root);

          if (withLogo && logoScene) {
            prepareMesh(logoScene);
            logoScene.traverse((child) => {
              const mesh = child as import("three").Mesh;
              if (!mesh.isMesh) return;
              const mats = Array.isArray(mesh.material)
                ? mesh.material
                : [mesh.material];
              mats.forEach((mat) => {
                if (!mat) return;
                mat.side = three.DoubleSide;
                mat.needsUpdate = true;
              });
            });

            logo = logoScene;
            const lBox0 = new Box3().setFromObject(logoScene);
            const lSize = lBox0.getSize(new Vector3());
            const lCenter = lBox0.getCenter(new Vector3());
            logoScene.position.sub(lCenter);
            logoScene.scale.setScalar(logoHeight / Math.max(lSize.y, 0.001));
            logoScene.rotation.set(0, 0, 0);
            scene.add(logoScene);
            logoScene.updateMatrixWorld(true);

            const roof = new Box3().setFromObject(root);
            const logoBox = new Box3().setFromObject(logoScene);
            const logoHalfH = (logoBox.max.y - logoBox.min.y) / 2;
            logoScene.position.set(
              (roof.min.x + roof.max.x) / 2,
              roof.max.y + logoHalfH + 0.06,
              roof.max.z + 0.12,
            );
            framed.union(new Box3().setFromObject(logoScene));
          }

          const pad = 0.24;
          fitW = framed.max.x - framed.min.x + pad * 2;
          fitH = framed.max.y - framed.min.y + pad * 2;
          viewCenterY = (framed.min.y + framed.max.y) / 2;

          state.ready = true;
          host.dataset.ready = "true";
          setSize();
        })
        .catch((err) => console.error("[DioramaProp] load failed", modelUrl, err));
    };

    void boot();

    return () => {
      disposed = true;
      state.ready = false;
      io?.disconnect();
      ro?.disconnect();
      delete host.dataset.ready;
      renderer?.dispose();
      renderer?.domElement.remove();
      const disposeObj = (obj: import("three").Object3D | null) => {
        obj?.traverse((child) => {
          const mesh = child as import("three").Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          mats.forEach((m) => m?.dispose?.());
        });
      };
      disposeObj(prop);
      disposeObj(logo);
    };
  }, [modelUrl, targetHeight, yaw, withLogo, logoHeight, liftDarkMaterials]);

  return <div ref={hostRef} className="diorama-road__building-canvas" />;
}
