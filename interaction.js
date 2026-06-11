import * as THREE from 'three';

export function setupInteraction(sceneObjects, onPlantClick) {
    const { camera } = sceneObjects;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    function getIntersections(clientX, clientY) {
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const plants = sceneObjects.plants;
        const objects = [];
        if (plants.rose) objects.push({ type: 'rose', obj: plants.rose });
        if (plants.elm) objects.push({ type: 'elm', obj: plants.elm });
        if (plants.carnation) objects.push({ type: 'carnation', obj: plants.carnation });
        const targets = objects.map(o => o.obj);
        const intersects = raycaster.intersectObjects(targets, true);
        if (intersects.length > 0) {
            let obj = intersects[0].object;
            while (obj && !objects.find(o => o.obj === obj)) obj = obj.parent;
            const found = objects.find(o => o.obj === obj);
            return found ? found.type : null;
        }
        return null;
    }
    
    function onClick(event) {
        if (document.getElementById('case-overlay').classList.contains('case-overlay--active')) return;
        const x = event.clientX || (event.touches && event.touches[0].clientX);
        const y = event.clientY || (event.touches && event.touches[0].clientY);
        if (x === undefined) return;
        const plantType = getIntersections(x, y);
        if (plantType && onPlantClick) onPlantClick(plantType);
    }
    
    window.addEventListener('click', onClick);
    window.addEventListener('touchend', (e) => { e.preventDefault(); onClick(e); }, { passive: false });
}