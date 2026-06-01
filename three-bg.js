// three-bg.js

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return; // Only run on pages with the canvas

    // ── 1. Setup Scene, Camera, Renderer ──
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true, // Transparent background to show CSS gradient
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── 2. Create the Object ──
    // Minimalist, abstract geometric sphere
    const geometry = new THREE.IcosahedronGeometry(1.8, 2); // Radius, Detail
    
    // Wireframe material with the accent color
    // Accent color from CSS: --accent: #3B82F6 (blue)
    const material = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    // Stretch slightly on X-axis to cover both "8" and "9"
    mesh.scale.set(1.5, 1, 1);
    // Move the mesh off-center to fully surround the "89" on the right side
    mesh.position.x = 3.6;
    scene.add(mesh);

    // ── 3. Interaction & Animation Variables ──
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    // Store original vertices for morphing animation
    const originalPositions = [];
    const positionAttribute = geometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
        originalPositions.push(
            positionAttribute.getX(i),
            positionAttribute.getY(i),
            positionAttribute.getZ(i)
        );
    }

    // ── 4. Animation Loop ──
    let animationFrameId;
    let isVisible = true;

    function animate() {
        if (!isVisible) {
            // Pause animation to save battery
            animationFrameId = requestAnimationFrame(animate);
            return;
        }

        const elapsedTime = clock.getElapsedTime();

        // Ease the target rotation towards the mouse position
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        mesh.rotation.y += 0.005 + (targetX - mesh.rotation.y) * 0.02;
        mesh.rotation.x += 0.005 + (targetY - mesh.rotation.x) * 0.02;

        // Gentle morphing logic (breathing effect)
        const positions = mesh.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            const ox = originalPositions[ix];
            const oy = originalPositions[iy];
            const oz = originalPositions[iz];

            // Calculate a wave offset based on time and original position
            const offset = Math.sin(elapsedTime * 0.5 + ox * 2.0) * 0.1;
            
            // Apply scale/offset
            const scalar = 1 + offset;
            positions.setXYZ(i, ox * scalar, oy * scalar, oz * scalar);
        }
        positions.needsUpdate = true;

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // ── 5. Resize Handling ──
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ── 6. Performance Optimization (Intersection Observer) ──
    const heroSection = document.getElementById("hero");
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
            });
        }, { threshold: 0.01 }); // Pause if less than 1% visible
        observer.observe(heroSection);
    }
});
