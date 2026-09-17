"use client";

import { useEffect, useRef } from "react";

const LOGO_URL = "/models/google-g.glb";

/**
 * Handmade low-poly “Google office” for the diorama —
 * readable colors, side elevation, G on the roof.
 */
export default function DioramaOffice() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Bump when logo orientation changes so HMR always rebuilds the scene
    const LOGO_ORIENT = "yaw-pi-v4";
    void LOGO_ORIENT;

    let disposed = false;
    let renderer: import("three").WebGLRenderer | null = null;
    let root: import("three").Group | null = null;
    let logo: import("three").Group | null = null;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    let fitW = 2.6;
    let fitH = 3.0;
    let viewCenterY = 1.35;
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
        BoxGeometry,
        Color,
        DirectionalLight,
        Group,
        HemisphereLight,
        Mesh,
        MeshStandardMaterial,
        OrthographicCamera,
        SRGBColorSpace,
        Scene,
        Vector3,
        WebGLRenderer,
      } = three;

      const scene = new Scene();
      const cam = new OrthographicCamera(-1.4, 1.4, 2.8, -0.1, 0.1, 50);
      cam.position.set(0, 1.35, 12);
      cam.lookAt(0, 1.35, 0);

      scene.add(new AmbientLight(0xffffff, 0.7));
      scene.add(new HemisphereLight(0xfff6ea, 0x5a5c62, 0.75));
      const key = new DirectionalLight(0xfff8f0, 1.35);
      key.position.set(2.8, 4.5, 3.5);
      scene.add(key);
      const fill = new DirectionalLight(0xd4e0ff, 0.55);
      fill.position.set(-2.5, 2, 2.5);
      scene.add(fill);

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
      renderer.toneMappingExposure = 1.12;
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

      const mat = (
        hex: string,
        opts: { roughness?: number; metalness?: number } = {},
      ) =>
        new MeshStandardMaterial({
          color: new Color(hex),
          roughness: opts.roughness ?? 0.72,
          metalness: opts.metalness ?? 0.05,
        });

      const box = (
        w: number,
        h: number,
        d: number,
        material: import("three").Material,
        x: number,
        y: number,
        z: number,
      ) => {
        const mesh = new Mesh(new BoxGeometry(w, h, d), material);
        mesh.position.set(x, y, z);
        mesh.frustumCulled = false;
        return mesh;
      };

      // —— Procedural Google campus office (side elevation) ——
      root = new Group();
      const office = new Group();

      // Google brand accents
      const gBlue = mat("#4285F4", { roughness: 0.45 });
      const gRed = mat("#EA4335", { roughness: 0.45 });
      const gYellow = mat("#FBBC05", { roughness: 0.45 });
      const gGreen = mat("#34A853", { roughness: 0.45 });
      const chalk = mat("#f4f2ec", { roughness: 0.78 });
      const concrete = mat("#d8d4cc", { roughness: 0.88 });
      const glass = mat("#9ec4e8", { roughness: 0.25, metalness: 0.15 });
      const darkGlass = mat("#5b7a96", { roughness: 0.35, metalness: 0.2 });
      const trim = mat("#2c2c2e", { roughness: 0.55 });
      const door = mat("#1a73e8", { roughness: 0.4 });

      // Main tower
      const bodyW = 2.15;
      const bodyH = 1.85;
      const bodyD = 1.05;
      office.add(box(bodyW, bodyH, bodyD, chalk, 0, bodyH / 2, 0));

      // Slightly recessed glass face
      office.add(
        box(bodyW * 0.92, bodyH * 0.88, 0.04, glass, 0, bodyH / 2 + 0.02, bodyD / 2 + 0.01),
      );

      // Window grid
      const cols = 5;
      const rows = 4;
      const winW = 0.22;
      const winH = 0.26;
      const startX = -0.78;
      const startY = 0.38;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const shade = (r + c) % 2 === 0 ? glass : darkGlass;
          office.add(
            box(
              winW,
              winH,
              0.05,
              shade,
              startX + c * 0.39,
              startY + r * 0.38,
              bodyD / 2 + 0.03,
            ),
          );
          // sill
          office.add(
            box(
              winW + 0.04,
              0.03,
              0.06,
              concrete,
              startX + c * 0.39,
              startY + r * 0.38 - winH / 2 - 0.02,
              bodyD / 2 + 0.035,
            ),
          );
        }
      }

      // Color stripe band (Google colors)
      const stripeY = bodyH - 0.12;
      const stripeH = 0.1;
      const stripeD = 0.06;
      const stripeZ = bodyD / 2 + 0.04;
      const stripeW = bodyW / 4;
      office.add(box(stripeW, stripeH, stripeD, gBlue, -stripeW * 1.5, stripeY, stripeZ));
      office.add(box(stripeW, stripeH, stripeD, gRed, -stripeW * 0.5, stripeY, stripeZ));
      office.add(box(stripeW, stripeH, stripeD, gYellow, stripeW * 0.5, stripeY, stripeZ));
      office.add(box(stripeW, stripeH, stripeD, gGreen, stripeW * 1.5, stripeY, stripeZ));

      // Roof slab + parapet
      office.add(box(bodyW + 0.12, 0.08, bodyD + 0.12, concrete, 0, bodyH + 0.04, 0));
      office.add(box(bodyW + 0.16, 0.06, 0.06, trim, 0, bodyH + 0.1, bodyD / 2 + 0.06));

      // Ground floor lobby notch
      office.add(box(0.7, 0.55, 0.2, door, 0, 0.28, bodyD / 2 + 0.08));
      office.add(box(0.55, 0.42, 0.05, darkGlass, 0, 0.3, bodyD / 2 + 0.19));

      // Canopy over entrance
      office.add(box(0.95, 0.05, 0.35, gBlue, 0, 0.58, bodyD / 2 + 0.22));
      office.add(box(0.06, 0.28, 0.06, trim, -0.4, 0.42, bodyD / 2 + 0.28));
      office.add(box(0.06, 0.28, 0.06, trim, 0.4, 0.42, bodyD / 2 + 0.28));

      // Side wing (lower annex)
      office.add(box(0.85, 0.95, 0.85, chalk, bodyW / 2 + 0.35, 0.475, -0.05));
      office.add(
        box(0.7, 0.7, 0.04, glass, bodyW / 2 + 0.35, 0.55, 0.85 / 2 + 0.01),
      );
      // wing windows
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          office.add(
            box(
              0.2,
              0.22,
              0.05,
              darkGlass,
              bodyW / 2 + 0.2 + j * 0.3,
              0.35 + i * 0.32,
              0.85 / 2 + 0.03,
            ),
          );
        }
      }

      // Plinth / sidewalk
      office.add(box(3.3, 0.08, 1.5, concrete, 0.15, 0.04, 0.05));

      // Tiny colorful bike-rack posts (Google campus vibe)
      office.add(box(0.05, 0.22, 0.05, gYellow, -0.95, 0.15, bodyD / 2 + 0.35));
      office.add(box(0.05, 0.22, 0.05, gGreen, -0.82, 0.15, bodyD / 2 + 0.35));
      office.add(box(0.05, 0.22, 0.05, gRed, -0.69, 0.15, bodyD / 2 + 0.35));

      root.add(office);
      // Face the camera (facade on +Z)
      root.rotation.set(0, 0, 0);
      scene.add(root);
      root.updateMatrixWorld(true);

      const grounded = new Box3().setFromObject(root);
      root.position.set(
        -(grounded.min.x + grounded.max.x) / 2,
        -grounded.min.y,
        0,
      );
      root.updateMatrixWorld(true);

      const roof = new Box3().setFromObject(root);
      const framed = roof.clone();

      // —— Google G on the roof, facing user ——
      new GLTFLoader().load(
        LOGO_URL,
        (gltf) => {
          if (disposed) return;
          try {
            logo = gltf.scene;
            logo.traverse((child) => {
              const mesh = child as import("three").Mesh;
              if (!mesh.isMesh) return;
              mesh.frustumCulled = false;
              const mats = Array.isArray(mesh.material)
                ? mesh.material
                : [mesh.material];
              mats.forEach((m) => {
                if (!m) return;
                m.side = three.DoubleSide;
                m.needsUpdate = true;
              });
            });

            const lBox0 = new Box3().setFromObject(logo);
            const lSize = lBox0.getSize(new Vector3());
            const lCenter = lBox0.getCenter(new Vector3());
            logo.position.sub(lCenter);

            const logoH = 0.55;
            const s = logoH / Math.max(lSize.y, 0.001);

            // Face the camera only (model is authored toward -Z).
            // Do NOT add Z-roll — that was mirroring the G.
            logo.scale.setScalar(s);
            logo.rotation.set(0, Math.PI, 0);

            const logoPivot = new Group();
            logoPivot.add(logo);
            scene.add(logoPivot);
            logoPivot.updateMatrixWorld(true);

            const logoBox = new Box3().setFromObject(logoPivot);
            const logoHalfH = (logoBox.max.y - logoBox.min.y) / 2;
            logoPivot.position.set(
              (roof.min.x + roof.max.x) / 2,
              roof.max.y + logoHalfH + 0.05,
              roof.max.z + 0.12,
            );

            // Keep dispose handle on the pivot root
            logo = logoPivot as typeof logo;

            framed.union(new Box3().setFromObject(logoPivot));
            const padX = 0.2;
            const padTop = 0.08;
            const padBot = 0.12;
            fitW = framed.max.x - framed.min.x + padX * 2;
            fitH = framed.max.y - framed.min.y + padTop + padBot;
            viewCenterY =
              (framed.min.y + framed.max.y) / 2 + (padBot - padTop) / 2;

            state.ready = true;
            host.dataset.ready = "true";
            setSize();
            // Nudge paint after orientation so HMR always shows the new transform
            requestAnimationFrame(() => {
              if (!disposed && renderer && state.ready) {
                renderer.render(scene, cam);
              }
            });
          } catch (err) {
            console.error("[DioramaOffice] logo failed", err);
            state.ready = true;
            host.dataset.ready = "true";
            setSize();
          }
        },
        undefined,
        () => {
          // Still show the office if logo fails
          const pad = 0.22;
          fitW = framed.max.x - framed.min.x + pad * 2;
          fitH = framed.max.y - framed.min.y + pad * 2;
          viewCenterY = (framed.min.y + framed.max.y) / 2;
          state.ready = true;
          host.dataset.ready = "true";
          setSize();
        },
      );
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
      disposeObj(root);
      disposeObj(logo);
    };
  }, []);

  return <div ref={hostRef} className="diorama-road__building-canvas" />;
}
