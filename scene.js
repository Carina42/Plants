import * as THREE from 'three';

let scene, camera, renderer, deskGroup;
let onResizeCb;

export async function initScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b1110, 0.0003);
    
    const isMobile = window.innerWidth < 768;
    camera = new THREE.PerspectiveCamera(isMobile ? 50 : 45, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(0, 1.2, 4.8);
    camera.lookAt(0, 0.4, 0);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // 光照
    scene.add(new THREE.AmbientLight(0x3a2a1a, 1.8));
    const hemi = new THREE.HemisphereLight(0xffeedd, 0x3a2818, 0.9);
    scene.add(hemi);
    
    const light1 = new THREE.PointLight(0xffc080, 25, 6);
    light1.position.set(-2.5, 2.2, -1.5);
    light1.castShadow = true;
    scene.add(light1);
    const light2 = new THREE.PointLight(0xffc080, 25, 6);
    light2.position.set(2.5, 2.2, -1.5);
    light2.castShadow = true;
    scene.add(light2);
    
    // 书房环境
    buildStudy(scene);
    
    // 桌面
    deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0.05, 0);
    scene.add(deskGroup);
    buildDesk(deskGroup);
    
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
    
    onResizeCb = () => {
        const w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w / h;
        camera.fov = w < 768 ? 50 : 45;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResizeCb);
    
    return { scene, camera, renderer, deskGroup, onResize: onResizeCb };
}

function buildStudy(scene) {
    // 地板、墙、书架等简化实现（可复用之前完整场景代码，此处为简洁省略细节）
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x2d1f12, roughness: 0.6 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8,8), floorMat);
    floor.rotation.x = -Math.PI/2; floor.position.y = -1.5; floor.receiveShadow = true;
    scene.add(floor);
    
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x3d2e22, roughness: 0.7 });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(8,5), wallMat);
    wall.position.set(0, 1, -3.5); wall.receiveShadow = true; scene.add(wall);
    
    // 书架
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.5 });
    [-2.8, 2.8].forEach(x => {
        const g = new THREE.Group();
        g.position.set(x, 0.9, -2.8);
        for (let i=0; i<4; i++) {
            const plank = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.5), shelfMat);
            plank.position.y = i*0.7;
            plank.castShadow = true; plank.receiveShadow = true;
            g.add(plank);
        }
        scene.add(g);
    });
}

function buildDesk(group) {
    const oakMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.4 });
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 1.6), oakMat);
    top.position.y = 0.85; top.castShadow = true; top.receiveShadow = true;
    group.add(top);
    // 桌腿
    const legPos = [[-1.2,0.4,-0.6],[1.2,0.4,-0.6],[-1.2,0.4,0.6],[1.2,0.4,0.6]];
    legPos.forEach(([x,y,z]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.1,0.82,8), oakMat);
        leg.position.set(x,y,z); leg.castShadow = true; group.add(leg);
    });
}

export function getSceneObjects() {
    return { scene, camera, renderer, deskGroup, onResize: onResizeCb };
}