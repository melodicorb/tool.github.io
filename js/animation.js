// Colorful 3D Animation for MultiTool Hub
// This script creates an interactive particle system with vibrant colors

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the canvas element
    const canvas = document.getElementById('bg-canvas');
    
    // Check if canvas exists
    if (!canvas) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup - perspective camera for 3D effect
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true // Transparent background
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Particles container
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    // Create arrays for particle positions and colors
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    // Generate random positions and yellow-themed colors for particles
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Positions - scattered in 3D space
        posArray[i] = (Math.random() - 0.5) * 100;
        posArray[i + 1] = (Math.random() - 0.5) * 100;
        posArray[i + 2] = (Math.random() - 0.5) * 100;
        
        // Colors - yellow-dominant palette
        colorsArray[i] = 0.9 + Math.random() * 0.1; // High red value
        colorsArray[i + 1] = 0.8 + Math.random() * 0.2; // High green value
        colorsArray[i + 2] = Math.random() * 0.3; // Low blue for yellow effect
    }
    
    // Set positions and colors attributes
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    // Material for particles
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    // Create the particle system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Rotate particle system based on mouse position
        particleSystem.rotation.x += 0.0005;
        particleSystem.rotation.y += 0.0005;
        
        // Add mouse influence
        particleSystem.rotation.x += mouseY * 0.0005;
        particleSystem.rotation.y += mouseX * 0.0005;
        
        // Color shifting over time for dynamic effect
        const time = Date.now() * 0.0005;
        const positions = particlesGeometry.attributes.position.array;
        const colors = particlesGeometry.attributes.color.array;
        
        for (let i = 0; i < particlesCount * 3; i += 3) {
            // Subtle position animation
            positions[i] += Math.sin(time + i) * 0.01;
            positions[i + 1] += Math.cos(time + i) * 0.01;
            
            // Color cycling
            colors[i] = Math.sin(time + i * 0.1) * 0.5 + 0.5;
            colors[i + 1] = Math.sin(time + i * 0.1 + 2) * 0.5 + 0.5;
            colors[i + 2] = Math.sin(time + i * 0.1 + 4) * 0.5 + 0.5;
        }
        
        particlesGeometry.attributes.position.needsUpdate = true;
        particlesGeometry.attributes.color.needsUpdate = true;
        
        // Render the scene
        renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
});