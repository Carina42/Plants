import * as THREE from 'three';

const updateFns = [];

function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32,32,0,32,32,32);
    grad.addColorStop(0,'rgba(255,255,255,1)');
    grad.addColorStop(0.1,'rgba(200,230,200,0.9)');
    grad.addColorStop(0.4,'rgba(150,200,150,0.4)');
    grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,64,64);
    return new THREE.CanvasTexture(canvas);
}
const glowTex = createGlowTexture();

function createRoseGroup() {
    const group = new THREE.Group();
    const count = 15000;
    const pos = new Float32Array(count*3);
    const col = new Float32Array(count*3);
    const goldenAngle = Math.PI*(3-Math.sqrt(5));
    const centerY = 0.95;
    for (let i=0; i<count; i++) {
        const i3 = i*3;
        const petalIdx = Math.floor(i/(count/21));
        const layer = Math.floor(petalIdx/7);
        const angle = petalIdx*goldenAngle + layer*0.4;
        const radius = 0.07 + layer*0.11;
        const t = (i%350)/350;
        const s = (Math.random()-0.5)*2;
        const width = (0.12+layer*0.06)*Math.sin(t*Math.PI);
        const localX = s*width;
        const localY = t*(0.28+layer*0.1);
        const localZ = 0.02*Math.sin(t*Math.PI)*Math.cos(s*2);
        const dirX = Math.cos(angle), dirZ = Math.sin(angle);
        const upY = 0.3+layer*0.2;
        pos[i3] = radius*dirX + dirX*localY - dirZ*localX;
        pos[i3+1] = centerY + upY*localY + 0.1*localZ;
        pos[i3+2] = radius*dirZ + dirZ*localY + dirX*localX;
        col[i3]=0.8+Math.random()*0.2; col[i3+1]=0.75+Math.random()*0.2; col[i3+2]=0.7+Math.random()*0.25;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.BufferAttribute(col,3));
    const mat = new THREE.PointsMaterial({ size:0.018, map:glowTex, blending:THREE.AdditiveBlending, depthWrite:false, vertexColors:true, sizeAttenuation:true });
    const points = new THREE.Points(geo, mat);
    points.position.set(-0.6, 0.9, 0.05);
    group.add(points);
    updateFns.push((dt)=>{ points.rotation.y += dt*0.08; });
    return group;
}

function createElmGroup() {
    const group = new THREE.Group();
    const trunkCount=3000, canopyCount=12000;
    const total = trunkCount+canopyCount;
    const pos = new Float32Array(total*3);
    const col = new Float32Array(total*3);
    // trunk
    for (let i=0; i<trunkCount; i++) {
        const i3=i*3, y=Math.random()*0.9, ang=Math.random()*Math.PI*2, r=0.05*(0.7+Math.random()*0.4);
        pos[i3]=Math.cos(ang)*r; pos[i3+1]=y; pos[i3+2]=Math.sin(ang)*r;
        col[i3]=0.5+Math.random()*0.2; col[i3+1]=0.55+Math.random()*0.2; col[i3+2]=0.4+Math.random()*0.2;
    }
    // canopy (umbrella)
    for (let i=0; i<canopyCount; i++) {
        const i3=(trunkCount+i)*3;
        const rawR = Math.pow(Math.random(),0.55)*0.55;
        const ang = Math.random()*Math.PI*2;
        const r = rawR;
        const edge = r/0.55;
        const yBase = 0.9 + 0.15;
        const sag = 0.9 - edge*0.4;
        const y = yBase - (yBase-sag)*Math.pow(edge,1.4) + (Math.random()-0.5)*0.2;
        pos[i3]=Math.cos(ang)*r; pos[i3+1]=y; pos[i3+2]=Math.sin(ang)*r;
        col[i3]=0.6+Math.random()*0.3; col[i3+1]=0.7+Math.random()*0.2; col[i3+2]=0.5+Math.random()*0.25;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.BufferAttribute(col,3));
    const mat = new THREE.PointsMaterial({ size:0.02, map:glowTex, blending:THREE.AdditiveBlending, depthWrite:false, vertexColors:true });
    const points = new THREE.Points(geo, mat);
    points.position.set(0, 0.8, -0.3);
    group.add(points);
    updateFns.push((dt)=>{ points.rotation.y += dt*0.04; });
    return group;
}

function createCarnationGroup() {
    const group = new THREE.Group();
    const count = 15000;
    const pos = new Float32Array(count*3);
    const col = new Float32Array(count*3);
    const centerY = 0.95;
    for (let i=0; i<count; i++) {
        const i3=i*3;
        const layer = Math.floor(Math.random()*10)/10;
        const petal = Math.floor(Math.random()*7);
        const baseAngle = petal/7*Math.PI*2 + layer*0.5;
        const radius = 0.05 + layer*0.2;
        const length = 0.18 + layer*0.14;
        const t = Math.random();
        const s = (Math.random()-0.5)*2;
        const jagged = 1+0.15*Math.sin(t*Math.PI*14+petal*2.5)*(t>0.3?1:t/0.3);
        const width = (0.09+layer*0.08)*Math.sin(t*Math.PI)*jagged;
        const localX = s*width;
        const localY = t*length;
        const localZ = 0.02*Math.sin(t*Math.PI)*jagged;
        const dirX = Math.cos(baseAngle), dirZ = Math.sin(baseAngle);
        pos[i3]=radius*dirX + dirX*localY - dirZ*localX;
        pos[i3+1]=centerY + localY*0.4 + 0.15*localZ;
        pos[i3+2]=radius*dirZ + dirZ*localY + dirX*localX;
        col[i3]=0.8+Math.random()*0.2; col[i3+1]=0.6+Math.random()*0.3; col[i3+2]=0.65+Math.random()*0.25;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    geo.setAttribute('color', new THREE.BufferAttribute(col,3));
    const mat = new THREE.PointsMaterial({ size:0.016, map:glowTex, blending:THREE.AdditiveBlending, depthWrite:false, vertexColors:true });
    const points = new THREE.Points(geo, mat);
    points.position.set(0.6, 0.9, 0.05);
    group.add(points);
    updateFns.push((dt)=>{ points.rotation.y += dt*0.06; });
    return group;
}

export function createAllPlants(scene) {
    const rose = createRoseGroup();
    const elm = createElmGroup();
    const carnation = createCarnationGroup();
    scene.add(rose); scene.add(elm); scene.add(carnation);
    
    window._particleUpdate = (dt) => updateFns.forEach(fn => fn(dt));
    return { rose, elm, carnation };
}