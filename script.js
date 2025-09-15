const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("three-container").appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// Image carousel group
const carousel = new THREE.Group();

// Your images + links
const items = [
    { img: "https://picsum.photos/id/1011/300/200", url: "#about" },
    { img: "https://picsum.photos/id/1025/300/200", url: "#projects" },
    { img: "https://picsum.photos/id/1035/300/200", url: "#contact" },
    { img: "https://picsum.photos/id/1041/300/200", url: "#gallery" }
];

const radius = 5;
const loader = new THREE.TextureLoader();

items.forEach((item, i) => {
    loader.load(item.img, (texture) => {
        const geometry = new THREE.PlaneGeometry(3, 2);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);

        const angle = (i / items.length) * Math.PI * 2;
        plane.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        plane.lookAt(new THREE.Vector3(0, 0, 0));

        plane.userData = { url: item.url };
        carousel.add(plane);
    });
});

scene.add(carousel);
camera.position.z = 10;

// Animation
function animate() {
    requestAnimationFrame(animate);
    carousel.rotation.y += 0.005;
    renderer.render(scene, camera);
}
animate();

window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero-title");
  const scrollY = window.scrollY;
  const shrinkPoint = 300;

  if (scrollY < shrinkPoint) {
    const scale = 1 - (scrollY / shrinkPoint) * 0.7;
    const topOffset = (scrollY / shrinkPoint) * 40;

    hero.style.transform = `translateX(-50%) scale(${scale})`;
    hero.style.top = `${topOffset}px`;
  } else {
    hero.style.transform = `translateX(-50%) scale(0.3)`;
    hero.style.top = "40px";
  }
});

window.addEventListener("click", (event) => {
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(carousel.children);
    if (intersects.length > 0) {
        window.location.href = intersects[0].object.userData.url;
    }
});

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
