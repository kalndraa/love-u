const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
let heartStarted = false;
let glowIntensity = 0;
let centerTextOpacity = 0;
let neyOpacity = 0;

const menuOverlay = document.getElementById('menuOverlay');
const openButton = document.getElementById('openButton');

class Particle {
    constructor(x, y, index) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.targetX = x;
        this.targetY = y;
        this.vx = 0;
        this.vy = 0;
        this.text = 'i love you';
        this.size = 14;
        this.opacity = 0;
        this.hue = 340;
        this.index = index;
        this.delay = Math.random() * 2500;
    }

    update(time) {
        if (time < this.delay) {
            this.opacity = 0;
            return;
        }
        
        this.opacity = Math.min(1, (time - this.delay) / 1000);

        this.x = this.targetX;
        this.y = this.targetY;
    }

    draw(glowAmount) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsl(${this.hue}, 100%, ${50 + glowAmount * 10}%)`;
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
        ctx.shadowBlur = 8 + glowAmount * 15;

        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

function getHeartPoints() {
    const points = [];
    const scale = Math.min(canvas.width, canvas.height) * 0.18;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let t = 0; t < Math.PI * 2; t += 0.05) {
        const x = 16 * Math.sin(t) ** 3;
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        for (let r = 0; r <= 1; r += 0.15) {
            points.push({
                x: centerX + x * scale * r,
                y: centerY + y * scale * r
            });
        }
    }

    return points;
}

function initializeParticles() {
    particles.length = 0;
    const heartPoints = getHeartPoints();
    
    for (let i = 0; i < heartPoints.length; i++) {
        const point = heartPoints[i];
        particles.push(new Particle(point.x, point.y, i));
    }
}

let startTime = Date.now();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const elapsed = Date.now() - startTime;

    if (heartStarted) {
        particles.forEach((particle) => {
            particle.update(elapsed);
            particle.draw(glowIntensity);
        });

        const heartReady = particles.length > 0 && particles.every(p => p.opacity >= 1);

        if (heartReady && elapsed > 4000) {
            centerTextOpacity = Math.min(1, (elapsed - 4000) / 600);
            drawCenterText(centerTextOpacity);

            glowIntensity = Math.sin(elapsed * 0.004) * 0.6 + 0.4;

            if (elapsed > 7000) {
                neyOpacity = Math.min(1, (elapsed - 7000) / 800);
                drawName(neyOpacity);
            }
        }
    }

    requestAnimationFrame(animate);
}

function drawCenterText(opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = `hsl(340, 100%, 60%)`;
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.shadowColor = `hsl(340, 100%, 50%)`;
    ctx.shadowBlur = 25 + glowIntensity * 30;

    ctx.fillText('Ney', canvas.width / 2, canvas.height / 2);
    ctx.restore();
}

function drawName(opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = `hsl(340, 100%, 60%)`;
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.shadowColor = `hsl(340, 100%, 50%)`;
    ctx.shadowBlur = 25 + glowIntensity * 30;

    ctx.fillText('Ney', canvas.width / 2, canvas.height / 2);
    ctx.restore();
}

function startHeart() {
    heartStarted = true;
    initializeParticles();
    startTime = Date.now();
}

openButton.addEventListener('click', () => {
    menuOverlay.classList.add('menu-hidden');
    setTimeout(() => {
        menuOverlay.style.display = 'none';
        startHeart();
    }, 900);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (heartStarted) {
        initializeParticles();
        startTime = Date.now();
    }
});

animate();
