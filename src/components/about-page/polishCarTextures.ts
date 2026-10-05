import {LinearFilter,LinearMipmapLinearFilter,Mesh,MeshStandardMaterial,Object3D,Texture,WebGLRenderer} from 'three';
/** Preserve original maps while improving detail on the small moving canvases. */
export function polishCarTextures(root:Object3D,renderer:WebGLRenderer){
  const textures=new Set<Texture>();
  root.traverse(object=>{
    if(!(object instanceof Mesh))return;
    for(const material of Array.isArray(object.material)?object.material:[object.material]){
      if(!(material instanceof MeshStandardMaterial))continue;
      for(const value of Object.values(material)){
        if(!(value instanceof Texture)||textures.has(value))continue;
        textures.add(value);value.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
        value.magFilter=LinearFilter;value.minFilter=LinearMipmapLinearFilter;value.needsUpdate=true;
      }
    }
  });
}
export function polishWagonPaint(root:Object3D){
  root.traverse(object=>{
    if(!(object instanceof Mesh))return;
    for(const material of Array.isArray(object.material)?object.material:[object.material]){
      if(!(material instanceof MeshStandardMaterial))continue;
      if(material.name.toLowerCase()==='primary'){
        material.roughness=.2;material.metalness=.12;material.envMapIntensity=.9;
      }else if(material.name.toLowerCase().includes('glass')){
        material.roughness=.09;material.envMapIntensity=1.2;material.depthWrite=false;
      }
    }
  });
}
