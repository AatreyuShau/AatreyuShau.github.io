const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("three-container").appendChild(renderer.domElement);

const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Space Station
const group = new THREE.Group();

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.4 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
group.add(sphere);

//
for (let i = 0; i < 3; i++) {
    const ringGeometry = new THREE.TorusGeometry(2 + i*0.5, 0.05, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.5 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = i * 0.5;
    group.add(ring);
}

//sats
const pages = [
    { name: "About", url: "#about" },
    { name: "Projects", url: "#projects" },
    { name: "Contact", url: "#contact" }
];

pages.forEach((page, i) => {
    const geo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const cube = new THREE.Mesh(geo, mat);
    cube.position.set(Math.sin(i*2) * 3, i - 1, Math.cos(i*2) * 3);
    cube.userData = { url: page.url };
    group.add(cube);
});

scene.add(group);
camera.position.z = 6;

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.002;
    renderer.render(scene, camera);
}
animate();

// Handle clicks
window.addEventListener("click", (event) => {
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);
    if (intersects.length > 0) {
        const { url } = intersects[0].object.userData;
        if (url) window.location.href = url;
    }
});

//resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
