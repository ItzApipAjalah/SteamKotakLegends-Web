'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/useIsMobile';

interface DownloadIndicatorProps {
    isVisible: boolean;
}

export default function DownloadIndicator3D({ isVisible }: DownloadIndicatorProps) {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<{
        renderer: THREE.WebGLRenderer;
        animationId: number;
    } | null>(null);

    // Skip rendering on mobile for performance
    useEffect(() => {
        if (!containerRef.current || !isVisible || isMobile) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        renderer.setSize(160, 160);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        containerRef.current.appendChild(renderer.domElement);

        // ============ 3D ROTATING CONTAINER ============
        const containerGroup = new THREE.Group();

        // Create glass box edges (wireframe cube style)
        const boxSize = 1.8;

        // Edge material - glowing purple
        const edgeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8b5cf6,
            metalness: 1.0,
            roughness: 0.0,
            emissive: 0x6d28d9,
            emissiveIntensity: 0.8,
        });

        // Create 12 edges of the cube
        const edgeRadius = 0.03;
        const edges: THREE.Mesh[] = [];

        // Horizontal edges (bottom)
        const createEdge = (length: number, isVertical: boolean = false) => {
            const geometry = new THREE.CylinderGeometry(edgeRadius, edgeRadius, length, 16);
            return new THREE.Mesh(geometry, edgeMaterial);
        };

        // Bottom face edges
        const bottomEdges = [
            { pos: [0, -boxSize / 2, boxSize / 2], rot: [0, 0, Math.PI / 2] },
            { pos: [0, -boxSize / 2, -boxSize / 2], rot: [0, 0, Math.PI / 2] },
            { pos: [boxSize / 2, -boxSize / 2, 0], rot: [Math.PI / 2, 0, 0] },
            { pos: [-boxSize / 2, -boxSize / 2, 0], rot: [Math.PI / 2, 0, 0] },
        ];

        // Top face edges
        const topEdges = [
            { pos: [0, boxSize / 2, boxSize / 2], rot: [0, 0, Math.PI / 2] },
            { pos: [0, boxSize / 2, -boxSize / 2], rot: [0, 0, Math.PI / 2] },
            { pos: [boxSize / 2, boxSize / 2, 0], rot: [Math.PI / 2, 0, 0] },
            { pos: [-boxSize / 2, boxSize / 2, 0], rot: [Math.PI / 2, 0, 0] },
        ];

        // Vertical edges
        const verticalEdges = [
            { pos: [boxSize / 2, 0, boxSize / 2], rot: [0, 0, 0] },
            { pos: [-boxSize / 2, 0, boxSize / 2], rot: [0, 0, 0] },
            { pos: [boxSize / 2, 0, -boxSize / 2], rot: [0, 0, 0] },
            { pos: [-boxSize / 2, 0, -boxSize / 2], rot: [0, 0, 0] },
        ];

        [...bottomEdges, ...topEdges].forEach(e => {
            const edge = createEdge(boxSize);
            edge.position.set(e.pos[0], e.pos[1], e.pos[2]);
            edge.rotation.set(e.rot[0], e.rot[1], e.rot[2]);
            edges.push(edge);
            containerGroup.add(edge);
        });

        verticalEdges.forEach(e => {
            const edge = createEdge(boxSize);
            edge.position.set(e.pos[0], e.pos[1], e.pos[2]);
            edges.push(edge);
            containerGroup.add(edge);
        });

        // Corner spheres (glowing nodes)
        const corners = [
            [boxSize / 2, boxSize / 2, boxSize / 2],
            [-boxSize / 2, boxSize / 2, boxSize / 2],
            [boxSize / 2, -boxSize / 2, boxSize / 2],
            [-boxSize / 2, -boxSize / 2, boxSize / 2],
            [boxSize / 2, boxSize / 2, -boxSize / 2],
            [-boxSize / 2, boxSize / 2, -boxSize / 2],
            [boxSize / 2, -boxSize / 2, -boxSize / 2],
            [-boxSize / 2, -boxSize / 2, -boxSize / 2],
        ];

        const cornerMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x22c55e,
            metalness: 1.0,
            roughness: 0.0,
            emissive: 0x16a34a,
            emissiveIntensity: 1.0,
        });

        corners.forEach(pos => {
            const cornerGeometry = new THREE.SphereGeometry(0.08, 16, 16);
            const corner = new THREE.Mesh(cornerGeometry, cornerMaterial);
            corner.position.set(pos[0], pos[1], pos[2]);
            containerGroup.add(corner);
        });

        // Glass faces (very transparent)
        const faceMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x8b5cf6,
            metalness: 0.0,
            roughness: 0.0,
            transmission: 0.95,
            thickness: 0.1,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
        });

        const faceGeometry = new THREE.PlaneGeometry(boxSize, boxSize);

        // 6 faces
        const faces = [
            { pos: [0, 0, boxSize / 2], rot: [0, 0, 0] },      // front
            { pos: [0, 0, -boxSize / 2], rot: [0, Math.PI, 0] }, // back
            { pos: [boxSize / 2, 0, 0], rot: [0, Math.PI / 2, 0] }, // right
            { pos: [-boxSize / 2, 0, 0], rot: [0, -Math.PI / 2, 0] }, // left
            { pos: [0, boxSize / 2, 0], rot: [-Math.PI / 2, 0, 0] }, // top
            { pos: [0, -boxSize / 2, 0], rot: [Math.PI / 2, 0, 0] }, // bottom
        ];

        faces.forEach(f => {
            const face = new THREE.Mesh(faceGeometry, faceMaterial);
            face.position.set(f.pos[0], f.pos[1], f.pos[2]);
            face.rotation.set(f.rot[0], f.rot[1], f.rot[2]);
            containerGroup.add(face);
        });

        scene.add(containerGroup);

        // ============ ARROW INSIDE CONTAINER ============
        const arrow = new THREE.Group();

        // Crystal arrow material
        const arrowMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.0,
            transmission: 0.8,
            thickness: 0.5,
            ior: 2.0,
            clearcoat: 1.0,
            iridescence: 1.0,
            iridescenceIOR: 2.0,
            iridescenceThicknessRange: [100, 600],
            emissive: 0x8b5cf6,
            emissiveIntensity: 0.2,
        });

        // Arrow shaft
        const shaftGeometry = new THREE.CapsuleGeometry(0.12, 0.8, 16, 32);
        const shaft = new THREE.Mesh(shaftGeometry, arrowMaterial);
        shaft.position.y = -0.2;
        arrow.add(shaft);

        // Arrow head
        const headMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xa78bfa,
            metalness: 0.2,
            roughness: 0.0,
            transmission: 0.7,
            thickness: 0.8,
            ior: 2.2,
            clearcoat: 1.0,
            iridescence: 1.0,
            emissive: 0xa78bfa,
            emissiveIntensity: 0.4,
        });
        const headGeometry = new THREE.ConeGeometry(0.35, 0.7, 32);
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 0.55;
        arrow.add(head);

        // Inner glow
        const glowGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x22c55e,
            transparent: true,
            opacity: 0.9,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 0.1;
        arrow.add(glow);

        // Rotate arrow to point up-right
        arrow.rotation.z = Math.PI / 4;

        scene.add(arrow);

        // ============ SPARKLES ============
        const sparklesGroup = new THREE.Group();
        for (let i = 0; i < 12; i++) {
            const sparkGeometry = new THREE.OctahedronGeometry(0.04, 0);
            const colors = [0xa78bfa, 0x22c55e, 0xfbbf24];
            const sparkMaterial = new THREE.MeshBasicMaterial({
                color: colors[i % 3],
                transparent: true,
                opacity: 0.9,
            });
            const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
            spark.userData = {
                angle: (i / 12) * Math.PI * 2,
                radius: 0.6 + Math.random() * 0.3,
                speed: 0.5 + Math.random() * 0.5,
                yOffset: (Math.random() - 0.5) * 0.8,
            };
            sparklesGroup.add(spark);
        }
        scene.add(sparklesGroup);

        // ============ LIGHTING ============
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 2);
        keyLight.position.set(3, 3, 5);
        scene.add(keyLight);

        const purpleLight = new THREE.PointLight(0x8b5cf6, 2, 10);
        purpleLight.position.set(-2, 2, 3);
        scene.add(purpleLight);

        const greenLight = new THREE.PointLight(0x22c55e, 1.5, 10);
        greenLight.position.set(2, -2, 3);
        scene.add(greenLight);

        // ============ ANIMATION ============
        let time = 0;
        const animate = () => {
            const animationId = requestAnimationFrame(animate);
            sceneRef.current!.animationId = animationId;

            time += 0.02;

            // Container rotation - slow and smooth
            containerGroup.rotation.y = time * 0.5;
            containerGroup.rotation.x = Math.sin(time * 0.3) * 0.1;

            // Arrow stays relatively stable but with subtle movement
            arrow.position.y = Math.sin(time * 2) * 0.1;
            arrow.rotation.x = Math.sin(time) * 0.05;
            arrow.rotation.y = Math.cos(time * 0.8) * 0.05;

            // Arrow scale pulse
            const scale = 1 + Math.sin(time * 2.5) * 0.05;
            arrow.scale.setScalar(scale);

            // Glow pulse
            glow.scale.setScalar(1 + Math.sin(time * 4) * 0.3);
            (glowMaterial as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(time * 5) * 0.3;

            // Sparkles orbit
            sparklesGroup.children.forEach((spark) => {
                const userData = spark.userData;
                const angle = userData.angle + time * userData.speed;
                spark.position.x = Math.cos(angle) * userData.radius;
                spark.position.y = Math.sin(angle) * userData.radius * 0.5 + userData.yOffset;
                spark.position.z = Math.sin(angle * 2) * 0.3;
                spark.rotation.x = time * 3;
                spark.rotation.y = time * 2;
            });

            // Edge glow pulse
            edges.forEach((edge, i) => {
                (edge.material as THREE.MeshPhysicalMaterial).emissiveIntensity =
                    0.5 + Math.sin(time * 3 + i * 0.5) * 0.3;
            });

            // Light intensity pulse
            purpleLight.intensity = 1.5 + Math.sin(time * 2) * 0.5;
            greenLight.intensity = 1 + Math.cos(time * 3) * 0.5;

            renderer.render(scene, camera);
        };

        sceneRef.current = { renderer, animationId: 0 };
        animate();

        return () => {
            if (sceneRef.current) {
                cancelAnimationFrame(sceneRef.current.animationId);
                sceneRef.current.renderer.dispose();
            }
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [isVisible, isMobile]);

    // Completely hide on mobile
    if (!isVisible || isMobile) return null;

    return (
        <>
            <style jsx>{`
                .download-indicator-overlay {
                    position: fixed;
                    top: 50px;
                    right: 10px;
                    z-index: 9999;
                    pointer-events: none;
                    animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .indicator-wrapper {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .pointer-line {
                    position: absolute;
                    top: -35px;
                    right: 85px;
                    width: 3px;
                    height: 30px;
                    background: linear-gradient(to bottom, #8b5cf6, transparent);
                    border-radius: 3px;
                }

                .pointer-line::before {
                    content: '';
                    position: absolute;
                    top: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-bottom: 8px solid #8b5cf6;
                    filter: drop-shadow(0 0 5px #8b5cf6);
                }

                .indicator-canvas {
                    width: 160px;
                    height: 160px;
                    display: block;
                }

                .indicator-label {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    margin-top: 4px;
                    padding: 8px 18px;
                    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 700;
                    color: white;
                    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.5);
                    animation: labelGlow 2s ease-in-out infinite alternate;
                }

                @keyframes labelGlow {
                    from { box-shadow: 0 4px 20px rgba(139, 92, 246, 0.5); }
                    to { box-shadow: 0 4px 30px rgba(139, 92, 246, 0.8); }
                }

                .indicator-label::after {
                    content: '↑';
                    font-size: 14px;
                    animation: bounce 0.5s ease-in-out infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }

                @media (max-width: 768px) {
                    .download-indicator-overlay {
                        display: none;
                    }
                }
            `}</style>

            <div className="download-indicator-overlay">
                <div className="indicator-wrapper">
                    <div className="pointer-line" />
                    <div ref={containerRef} className="indicator-canvas" />
                    <div className="indicator-label">
                        Downloading
                    </div>
                </div>
            </div>
        </>
    );
}
