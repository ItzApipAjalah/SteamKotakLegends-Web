'use client';

import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            baseSize: number;
            size: number;
            baseOpacity: number;
            opacity: number;
            speedX: number;
            speedY: number;
            color: string;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.vx = 0;
                this.vy = 0;
                this.baseSize = Math.random() * 1.5 + 0.5;
                this.size = this.baseSize;
                this.baseOpacity = Math.random() * 0.35 + 0.15;
                this.opacity = this.baseOpacity;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.color = this.getRandomColor();
            }

            getRandomColor() {
                const colors = [
                    'rgba(139, 92, 246,',
                    'rgba(167, 139, 250,',
                    'rgba(196, 181, 253,',
                    'rgba(124, 58, 237,',
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                const dx = mouseRef.current.x - this.x;
                const dy = mouseRef.current.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 180;

                if (distance < maxDistance && distance > 0) {
                    const intensity = 1 - distance / maxDistance;
                    const angle = Math.atan2(dy, dx);
                    const pushForce = intensity * 3;

                    this.vx += -Math.cos(angle) * pushForce * 0.1;
                    this.vy += -Math.sin(angle) * pushForce * 0.1;

                    this.size = this.baseSize + intensity * 1.5;
                    this.opacity = Math.min(0.8, this.baseOpacity + intensity * 0.3);
                } else {
                    this.size += (this.baseSize - this.size) * 0.05;
                    this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                }

                this.vx *= 0.95;
                this.vy *= 0.95;

                this.x += this.speedX + this.vx;
                this.y += this.speedY + this.vy;

                if (this.x < -10) this.x = canvas!.width + 10;
                if (this.x > canvas!.width + 10) this.x = -10;
                if (this.y < -10) this.y = canvas!.height + 10;
                if (this.y > canvas!.height + 10) this.y = -10;
            }

            draw() {
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
                ctx!.fillStyle = `${this.color} ${this.opacity * 0.15})`;
                ctx!.fill();

                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fillStyle = `${this.color} ${this.opacity})`;
                ctx!.fill();
            }
        }

        function resizeCanvas() {
            canvas!.width = window.innerWidth;
            canvas!.height = window.innerHeight;
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const midX = (particles[i].x + particles[j].x) / 2;
                        const midY = (particles[i].y + particles[j].y) / 2;
                        const mouseDistance = Math.sqrt(
                            (mouseRef.current.x - midX) ** 2 + (mouseRef.current.y - midY) ** 2
                        );

                        let opacity = (1 - distance / 120) * 0.2;
                        if (mouseDistance < 150) {
                            opacity = (1 - distance / 120) * 0.5;
                        }

                        ctx!.beginPath();
                        ctx!.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                        ctx!.lineWidth = mouseDistance < 150 ? 1 : 0.5;
                        ctx!.moveTo(particles[i].x, particles[j].y);
                        ctx!.lineTo(particles[j].x, particles[j].y);
                        ctx!.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });
            connectParticles();
            animationId = requestAnimationFrame(animate);
        }

        resizeCanvas();
        const particleCount = Math.min(200, Math.floor((canvas.width * canvas.height) / 8000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        animate();

        const handleResize = () => resizeCanvas();
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return <canvas ref={canvasRef} id="particles" />;
}
