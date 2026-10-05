"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeController";
import {
  ACESFilmicToneMapping, AmbientLight, AnimationAction, AnimationMixer, Box3,
  DirectionalLight, Group, HemisphereLight, Mesh, OrthographicCamera,
  LoopOnce, Scene, SRGBColorSpace, Texture, Vector3, WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./hero-bee.css";

/** Armabee by Quaternius, using the model's authored flying animation. */
export default function HeroBee({ placement = "hero" }: {
  placement?: "hero" | "footer" | "timeline";
} = {}) {
  const hostRef = useRef<HTMLButtonElement>(null);
  const tapRef = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const { reducedMotion } = useTheme();

  useEffect(() => {
    const host = hostRef.current;
    const hero = host?.parentElement;
    if (!host || !hero) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1.9, 1.9, 1.9, -1.9, 0.1, 30);
    camera.position.set(0, 0.35, 8);
    camera.lookAt(0, 0, 0);
    scene.add(new AmbientLight(0xffffff, 1.4), new HemisphereLight(0xfff4d4, 0x52627b, 1.8));
    const key = new DirectionalLight(0xffffff, 3);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const bee = new Group();
    scene.add(bee);

    setReady(false);
    let mixer: AnimationMixer | undefined;
    let flightAction: AnimationAction | undefined;
    let headbuttAction: AnimationAction | undefined;
    let headbutting = false;

    const finishHeadbutt = (event: { action: AnimationAction }) => {
      if (event.action !== headbuttAction) return;
      headbuttAction.stop();
      headbutting = false;
      flightAction?.reset().play();
    };
    let disposed = false;
    let visible = false;
    let loaded = false;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let heroWidth = 0;
    let heroHeight = 0;
    let beeSize = 100;

    const place = () => {
      const phase = elapsed * 0.36;
      if(placement === "timeline") {
        const rect=hero.getBoundingClientRect();
        const progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,heroHeight-window.innerHeight)));
        const x=heroWidth*(.78+Math.sin(progress*Math.PI*6)*.09)-beeSize/2;
        const y=Math.max(100,Math.min(heroHeight-beeSize-40,window.innerHeight*.48-rect.top));
        host.style.transform=`translate3d(${Math.max(8,Math.min(heroWidth-beeSize-8,x))}px,${y}px,0)`;
        bee.rotation.y=headbutting?0:-Math.PI/2+.12*Math.sin(phase);
        bee.rotation.z=headbutting?0:Math.sin(phase)*.08;
        return;
      }
      const mobile = heroWidth < 768;
      const footer = placement === "footer";
      const centerX = heroWidth * (footer ? 0.6 : mobile ? 0.66 : 0.77);
      const swingX = Math.min(heroWidth * (footer ? 0.23 : mobile ? 0.18 : 0.15), 210);
      const centerY = heroHeight * (footer ? 0.32 : mobile ? 0.73 : 0.59);
      const swingY = Math.min(heroHeight * (footer ? 0.1 : 0.07), 55);
      const x = Math.min(heroWidth - beeSize - 8, Math.max(8, centerX + Math.sin(phase) * swingX - beeSize / 2));
      const y = centerY + Math.sin(phase * 2) * swingY - beeSize / 2;
      host.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      bee.rotation.y = headbutting ? 0 : -0.4 + Math.cos(phase) * 0.7;
      bee.rotation.z = headbutting ? 0 : -Math.cos(phase) * 0.12;
    };

    const render = (timestamp: number) => {
      if (disposed || !visible || !loaded || document.hidden) return;
      const delta = previous ? Math.min((timestamp - previous) / 1000, 0.05) : 0;
      previous = timestamp;
      if (!reducedMotion && !headbutting) elapsed += delta;
      if (!reducedMotion || headbutting) mixer?.update(delta);
      place();
      renderer.render(scene, camera);
      if (!reducedMotion || headbutting) frame = requestAnimationFrame(render);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (visible && loaded && !document.hidden) frame = requestAnimationFrame(render);
    };

    tapRef.current = () => {
      if (!loaded || !headbuttAction || headbutting) return;
      headbutting = true;
      flightAction?.stop();
      headbuttAction.reset().setLoop(LoopOnce, 1);
      headbuttAction.clampWhenFinished = true;
      headbuttAction.play();
      start();
    };

    const resize = () => {
      heroWidth = hero.clientWidth;
      heroHeight = hero.clientHeight;
      beeSize = host.clientWidth;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(beeSize, host.clientHeight, false);
      start();
    };
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(hero);
    sizeObserver.observe(host);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    visibilityObserver.observe(hero);
    document.addEventListener("visibilitychange", start);
    resize();

    const disposeModel = (root: Group) => {
      const textures = new Set<Texture>();
      root.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value instanceof Texture) textures.add(value);
          });
          material.dispose();
        });
      });
      textures.forEach((texture) => texture.dispose());
    };

    new GLTFLoader().load("/models/armabee.glb", (gltf) => {
      if (disposed) {
        disposeModel(gltf.scene);
        return;
      }
      const bounds = new Box3().setFromObject(gltf.scene);
      const size = bounds.getSize(new Vector3());
      const center = bounds.getCenter(new Vector3());
      const scale = 2.7 / Math.max(size.x, size.y, size.z, 0.001);
      gltf.scene.scale.setScalar(scale);
      gltf.scene.position.copy(center).multiplyScalar(-scale);
      bee.add(gltf.scene);
      mixer = new AnimationMixer(gltf.scene);
      const flight = gltf.animations.find((clip) => clip.name.endsWith("|Fast_Flying"))
        ?? gltf.animations.find((clip) => clip.name.endsWith("|Flying_Idle"));
      if (flight) {
        flightAction = mixer.clipAction(flight);
        flightAction.play();
        mixer.update(reducedMotion ? 0.15 : 0);
      }
      const headbutt = gltf.animations.find((clip) => clip.name.endsWith("|Headbutt"));
      if (headbutt) headbuttAction = mixer.clipAction(headbutt);
      mixer.addEventListener("finished", finishHeadbutt);
      loaded = true;
      setReady(Boolean(headbuttAction));
      host.dataset.loaded = "true";
      start();
    }, undefined, () => {
      host.style.display = "none";
    });

    if(placement === "timeline" && reducedMotion)window.addEventListener("scroll",start,{passive:true});
    return () => {
      window.removeEventListener("scroll",start);
      disposed = true;
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", start);
      tapRef.current = () => {};
      mixer?.removeEventListener("finished", finishHeadbutt);
      mixer?.stopAllAction();
      mixer?.uncacheRoot(mixer.getRoot());
      disposeModel(bee);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion, placement]);

  return (
    <button
      ref={hostRef}
      type="button"
      className="hero-bee"
      aria-label="Tap the bee to make it headbutt"
      data-cursor="interactive"
      disabled={!ready}
      onClick={() => tapRef.current()}
    />
  );
}
