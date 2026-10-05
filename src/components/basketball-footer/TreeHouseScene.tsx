"use client";
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {getTreeLayout} from './courtGeometry';

// Bare, tapered branches leave room for future bird models above the hoop.
function buildTree() {
  const tree=new THREE.Group();
  const bark=new THREE.MeshStandardMaterial({color:0x72523e,roughness:1,flatShading:true});
  function branch(points:number[][],radius:number) {
    const curve=new THREE.CatmullRomCurve3(points.map(([x,y,z])=>new THREE.Vector3(x,y,z)));
    const segments=18,sides=7;
    const geometry=new THREE.TubeGeometry(curve,segments,radius,sides,false);
    const positions=geometry.getAttribute('position');
    for(let ring=0;ring<=segments;ring++) {
      const t=ring/segments,center=curve.getPointAt(t),taper=1-t*.9;
      for(let side=0;side<=sides;side++) {
        const index=ring*(sides+1)+side;
        positions.setXYZ(index,center.x+(positions.getX(index)-center.x)*taper,center.y+(positions.getY(index)-center.y)*taper,center.z+(positions.getZ(index)-center.z)*taper);
      }
    }
    geometry.computeVertexNormals();tree.add(new THREE.Mesh(geometry,bark));
  }
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(3.2,6.5,91,9,3),bark);
  trunk.position.set(0,40,0);tree.add(trunk);
  branch([[0,70,-3],[-18,75,-4],[-40,76,-4],[-60,82,-4]],2.5);
  branch([[0,70,-3],[16,74,-4],[34,76,-4],[52,81,-4]],2.3);
  // Short, nearly horizontal stretches give birds natural places to perch.
  branch([[0,82,0],[-9,96,-1],[-22,103,-2],[-36,105,-2]],3.2);
  branch([[-19,102,-2],[-23,111,-3],[-25,118,-3]],1.25);
  branch([[-30,105,-2],[-35,110,-2],[-41,111,-2]],.75);
  branch([[0,84,-1],[10,98,-2],[22,104,-3],[34,104,-3]],2.9);
  branch([[17,102,-3],[22,113,-4],[30,120,-4]],1.4);
  branch([[29,104,-3],[35,110,-3],[40,112,-3]],.8);
  branch([[0,84,-2],[-2,104,-4],[3,117,-4],[2,126,-5]],2.5);
  branch([[0,110,-4],[-8,118,-5],[-12,122,-5]],1.05);
  branch([[0,0,0],[-8,-2,4],[-12,-5,5]],2.1);
  branch([[0,0,0],[9,-2,2],[13,-5,3]],2.1);
  return tree;
}
export default function TreeHouseScene() {
  const host=useRef<HTMLDivElement>(null);
  const ravenButton=useRef<HTMLButtonElement>(null);
  const [comment,setComment]=useState("");
  useEffect(()=>{
    const element=host.current;if(!element)return;
    let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return;}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,3));renderer.outputColorSpace=THREE.SRGBColorSpace;
    element.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),model=buildTree();scene.add(model);
    let disposed=false;
    let raven:THREE.Group|undefined;
    let reactionFrame=0,commentTimer=0,lastComment=-Infinity;
    scene.add(new THREE.HemisphereLight(0xfff4df,0x303728,2));
    const light=new THREE.DirectionalLight(0xffe4bd,2.5);light.position.set(-120,180,250);scene.add(light);
    const camera=new THREE.OrthographicCamera(0,1,1,0,.1,1000);
    const render=()=>{
      const width=element.clientWidth,height=element.clientHeight;if(!width||!height)return;
      renderer.setSize(width,height);camera.left=0;camera.right=width;camera.top=height;camera.bottom=0;
      camera.position.set(0,0,500);camera.lookAt(0,0,0);camera.updateProjectionMatrix();
      const layout=getTreeLayout(width,height);model.scale.setScalar(layout.scale);model.position.set(layout.x,layout.y,0);
      if(ravenButton.current){
        ravenButton.current.style.left=`${layout.x-40*layout.scale}px`;
        ravenButton.current.style.top=`${height-76.8*layout.scale}px`;
        ravenButton.current.style.width=`${Math.max(44,21*layout.scale)}px`;
        ravenButton.current.style.height=`${Math.max(44,19*layout.scale)}px`;
      }
      renderer.render(scene,camera);
    };
    const disposeObject=(root:THREE.Object3D)=>{
      const materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();
      root.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>materials.add(material));}});
      materials.forEach(material=>{Object.values(material).forEach(value=>{if(value instanceof THREE.Texture)textures.add(value);});material.dispose();});textures.forEach(texture=>texture.dispose());
    };
    new GLTFLoader().load('/models/raven.glb',gltf=>{
      if(disposed){disposeObject(gltf.scene);return;}
      const bird=gltf.scene;
      // A profile view keeps the beak and tail readable against the trunk.
      bird.rotation.y=Math.PI/2;bird.updateMatrixWorld(true);
      const bounds=new THREE.Box3().setFromObject(bird);
      const footCenter=new THREE.Vector3();let count=0;
      bird.traverse(object=>{
        if(!(object instanceof THREE.Mesh))return;
        const positions=object.geometry.getAttribute('position');
        for(let index=0;index<positions.count;index++){
          const point=new THREE.Vector3().fromBufferAttribute(positions,index).applyMatrix4(object.matrixWorld);
          if(point.y<=bounds.min.y+(bounds.max.y-bounds.min.y)*.025){footCenter.add(point);count++;}
        }
        (Array.isArray(object.material)?object.material:[object.material]).forEach(material=>{
          if(material instanceof THREE.MeshStandardMaterial && material.map){material.map.minFilter=THREE.LinearMipmapLinearFilter;material.map.anisotropy=renderer.capabilities.getMaxAnisotropy();material.map.needsUpdate=true;}
        });
      });
      if(count)footCenter.divideScalar(count);else bounds.getCenter(footCenter);
      bird.position.set(-footCenter.x,-bounds.min.y,-footCenter.z);
      const perch=new THREE.Group();perch.add(bird);perch.scale.setScalar(15.048/(bounds.max.y-bounds.min.y));
      perch.position.set(-40,76.8,1);raven=perch;model.add(perch);if(ravenButton.current)ravenButton.current.hidden=false;render();
    },undefined,()=>{});
    const speak=(text:string,force=false)=>{
      const now=performance.now();if(!raven||(!force && now-lastComment<7000))return;
      lastComment=now;setComment(text);window.clearTimeout(commentTimer);
      commentTimer=window.setTimeout(()=>setComment(''),3500);
      cancelAnimationFrame(reactionFrame);
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      const animate=(time:number)=>{
        if(disposed||!raven)return;
        const progress=Math.min(1,(time-now)/1100);
        raven.rotation.z=Math.sin(progress*Math.PI*2)*.1*(1-progress);
        render();if(progress<1)reactionFrame=requestAnimationFrame(animate);
      };
      reactionFrame=requestAnimationFrame(animate);
    };
    const onBasket=(event:Event)=>{const score=(event as CustomEvent<{score:number}>).detail.score;
      speak(score===1?"Beginner’s luck.":score===3?"Suspiciously good for a Muggle.":score%3===0?"Ten points to your house.":"That one counts. I checked.");
    };
    const onMiss=()=>speak("Even a wand wouldn’t save that.");
    const onClick=()=>speak("I’m supervising.",true);
    window.addEventListener('portfolio:raven-basket',onBasket);
    window.addEventListener('portfolio:raven-miss',onMiss);
    window.addEventListener('portfolio:raven-click',onClick);
    const observer=new ResizeObserver(render);observer.observe(element);render();
    return()=>{disposed=true;window.clearTimeout(commentTimer);cancelAnimationFrame(reactionFrame);
      window.removeEventListener('portfolio:raven-basket',onBasket);window.removeEventListener('portfolio:raven-miss',onMiss);window.removeEventListener('portfolio:raven-click',onClick);observer.disconnect();disposeObject(model);renderer.dispose();renderer.domElement.remove();};
  },[]);
  return <><div className="basketball-tree" ref={host} aria-hidden="true"/>
    <button ref={ravenButton} hidden className="basketball-raven" aria-label="Talk to the raven" onClick={()=>window.dispatchEvent(new Event('portfolio:raven-click'))}>
      <span className="basketball-raven-comment" role="status">{comment}</span>
    </button></>;
}
