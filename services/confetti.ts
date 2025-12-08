
export const fireConfetti = (): void => {
    // Check if canvas exists or create it
    let canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
    }
    
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    
    // Set dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#F36D36', '#8DC63F', '#D0368C', '#0070BA', '#FFD700'];
    const particles: any[] = [];
    
    // Create particles (Burst)
    for(let i=0; i<150; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 25, // Velocity X
            vy: (Math.random() - 0.5) * 25 - 5, // Velocity Y (Upward bias)
            gravity: 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            life: 1.0,
            decay: Math.random() * 0.01 + 0.01
        });
    }

    function animate() {
        if(!ctx) return;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        let active = false;

        particles.forEach(p => {
            if(p.life > 0) {
                active = true;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.rotation += p.rotationSpeed;
                p.life -= p.decay;
                
                ctx.save();
                ctx.globalAlpha = p.life;
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });

        if(active) {
            requestAnimationFrame(animate);
        } else {
            // Cleanup
            if(canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
    }
    
    animate();

    // Safety timeout cleanup
    setTimeout(() => {
        if(document.body.contains(canvas)) document.body.removeChild(canvas);
    }, 5000);
};
