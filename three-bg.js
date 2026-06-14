// three-bg.js

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return; // Only run on pages with the canvas

    // ── 1. Setup Scene, Camera, Renderer ──
    const scene = new THREE.Scene();
    
    // Use a narrow FOV to simulate isometric perspective
    const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Position camera up and to the right, looking down
    camera.position.set(12, 10, 15);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── 2. Create the Stature Scene ──
    const statureGroup = new THREE.Group();

    // Add Lighting to give the scene solid, understandable form
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Wireframe Material (Charcoal)
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x1A1A1A,
        transparent: true,
        opacity: 0.6,
        linewidth: 1
    });

    // Solid shaded material for the environment (Desk/Furniture)
    const deskMaterial = new THREE.MeshStandardMaterial({
        color: 0xFDFDFD, // Off-white
        roughness: 0.8,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9,
        depthWrite: true
    });

    // Solid shaded material for the Avatar (slightly darker to stand out)
    const avatarMaterial = new THREE.MeshStandardMaterial({
        color: 0xEAEAEA, // Light grey to separate from desk
        roughness: 0.9,
        metalness: 0.0,
        transparent: true,
        opacity: 0.95,
        depthWrite: true
    });

    // Helper to create wireframe geometric boxes
    function createBox(w, h, d, x, y, z, material, rx=0, ry=0, rz=0) {
        const group = new THREE.Group();
        const geometry = new THREE.BoxGeometry(w, h, d);
        
        // Add solid faces
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
        
        // Add wireframe edges
        const edges = new THREE.EdgesGeometry(geometry);
        const lines = new THREE.LineSegments(edges, lineMaterial);
        group.add(lines);

        group.position.set(x, y, z);
        group.rotation.set(rx, ry, rz);
        return group;
    }

    // ── DESK ──
    // Desk Top
    const deskTop = createBox(5, 0.2, 2.5, 0, 2, 0, deskMaterial);
    statureGroup.add(deskTop);
    
    // Legs
    const leg1 = createBox(0.2, 2, 0.2, -2.3, 1, -1.05, deskMaterial);
    const leg2 = createBox(0.2, 2, 0.2, 2.3, 1, -1.05, deskMaterial);
    const leg3 = createBox(0.2, 2, 0.2, -2.3, 1, 1.05, deskMaterial);
    const leg4 = createBox(0.2, 2, 0.2, 2.3, 1, 1.05, deskMaterial);
    statureGroup.add(leg1, leg2, leg3, leg4);

    // ── LAPTOP ──
    const laptopBase = createBox(1.2, 0.05, 0.8, 0, 2.125, -0.2, deskMaterial);
    statureGroup.add(laptopBase);

    // Laptop Screen
    const screenGroup = new THREE.Group();
    const screenGeom = new THREE.BoxGeometry(1.2, 0.8, 0.05);
    
    // Electric Klein Blue glowing screen
    const screenMaterials = [
        deskMaterial, // right
        deskMaterial, // left
        deskMaterial, // top
        deskMaterial, // bottom
        new THREE.MeshBasicMaterial({ color: 0x0A44E3, transparent: true, opacity: 0.95 }), // front (screen)
        deskMaterial  // back
    ];
    const screenMesh = new THREE.Mesh(screenGeom, screenMaterials);
    const screenEdges = new THREE.EdgesGeometry(screenGeom);
    const screenLines = new THREE.LineSegments(screenEdges, lineMaterial);
    
    screenGroup.add(screenMesh);
    screenGroup.add(screenLines);
    screenGroup.position.set(0, 2.5, -0.6);
    screenGroup.rotation.x = -0.2; // tilted back
    statureGroup.add(screenGroup);

    // ── AVATAR (Builder) ──
    // Body leaning forward slightly
    const body = createBox(1.0, 1.4, 0.8, 0, 1.8, 1.2, avatarMaterial, 0.1, 0, 0);
    statureGroup.add(body);

    // Head tilted down at screen
    const head = createBox(0.8, 0.8, 0.8, 0, 2.8, 1.0, avatarMaterial, 0.2, 0, 0);
    statureGroup.add(head);

    // Arm (Typing) Left
    const armL = createBox(0.2, 0.8, 0.2, -0.6, 2.1, 0.8, avatarMaterial, -0.6, 0, 0.2);
    const forearmL = createBox(0.2, 0.7, 0.2, -0.7, 2.2, 0.3, avatarMaterial, -1.4, 0, 0);
    statureGroup.add(armL, forearmL);

    // Arm (Typing) Right
    const armR = createBox(0.2, 0.8, 0.2, 0.6, 2.1, 0.8, avatarMaterial, -0.6, 0, -0.2);
    const forearmR = createBox(0.2, 0.7, 0.2, 0.7, 2.2, 0.3, avatarMaterial, -1.4, 0, 0);
    statureGroup.add(armR, forearmR);

    // Chair Seat
    const chair = createBox(1.2, 0.2, 1.2, 0, 1.2, 1.4, deskMaterial);
    const chairLeg = createBox(0.2, 1.2, 0.2, 0, 0.6, 1.4, deskMaterial);
    const chairBase = createBox(1.0, 0.1, 1.0, 0, 0.05, 1.4, deskMaterial);
    statureGroup.add(chair, chairLeg, chairBase);

    // Position entire scene
    statureGroup.position.x = 2; // Shift right to balance typography
    statureGroup.position.y = -1; // Center vertically
    // Tilt the entire scene slightly so it feels like a classic isometric angle
    statureGroup.rotation.y = -0.5; 
    
    scene.add(statureGroup);

    // ── 3. Interaction & Animation Variables ──
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = -0.5; // Base rotation

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    // ── 4. Animation Loop ──
    let animationFrameId;
    let isVisible = true;

    function animate() {
        if (!isVisible) {
            animationFrameId = requestAnimationFrame(animate);
            return;
        }

        const time = clock.getElapsedTime();

        // Gentle floating
        statureGroup.position.y = -1 + Math.sin(time * 1.5) * 0.1;

        // Parallax tracking (Gazi Jarin style tilt)
        // Adjust the base rotation with mouse influence
        targetRotY = -0.5 + (mouseX * 0.0003);
        targetRotX = (mouseY * 0.0003);

        // Smoothly interpolate rotation
        statureGroup.rotation.y += (targetRotY - statureGroup.rotation.y) * 0.05;
        statureGroup.rotation.x += (targetRotX - statureGroup.rotation.x) * 0.05;

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // ── 5. Responsive Resize & Intersection Observer ──
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Adjust position based on screen size (keep it from covering text on mobile)
        if(window.innerWidth < 900) {
            statureGroup.position.x = 0;
            statureGroup.scale.set(0.7, 0.7, 0.7);
        } else {
            statureGroup.position.x = 2;
            statureGroup.scale.set(1, 1, 1);
        }
    });

    // Initial resize trigger
    if(window.innerWidth < 900) {
        statureGroup.position.x = 0;
        statureGroup.scale.set(0.7, 0.7, 0.7);
    }

    // Performance optimization: Pause animation when canvas is not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    });
    observer.observe(canvas);
});
