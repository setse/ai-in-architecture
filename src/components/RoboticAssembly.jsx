import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './RoboticAssembly.css';

const RoboticAssembly = ({ onClose }) => {
    const mountRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [btnText, setBtnText] = useState('Animate Disassembly');

    const [depth, setDepth] = useState(1.8);
    const [tabScale, setTabScale] = useState(1.0);
    const [isTesting, setIsTesting] = useState(false);
    const [panelOpen, setPanelOpen] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const stateRef = useRef({
        currentProgress: 0,
        targetProgress: 0,
        isAnimating: false,
        updatePositions: null,
        isTestingCollision: false,
        testProgress: 0,
        updateDimensions: null
    });

    // Show hint bubble after 3s, auto-hide after 6s more
    useEffect(() => {
        const showTimer = setTimeout(() => setShowHint(true), 3000);
        const hideTimer = setTimeout(() => setShowHint(false), 9000);
        return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
    }, []);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2a2e35);
        scene.fog = new THREE.Fog(0x2a2e35, 30, 150);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
        camera.position.set(0, -10, 40);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        currentMount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xfffae6, 1.2);
        dirLight.position.set(10, 20, 25);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 100;
        dirLight.shadow.camera.left = -20;
        dirLight.shadow.camera.right = 20;
        dirLight.shadow.camera.top = 20;
        dirLight.shadow.camera.bottom = -20;
        scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0x90b0d0, 0.5);
        fillLight.position.set(-15, -10, 10);
        scene.add(fillLight);

        function rot120(x, y) {
            const cos120 = -0.5;
            const sin120 = 0.86602540378;
            return {
                x: x * cos120 - y * sin120,
                y: x * sin120 + y * cos120
            };
        }

        function createJointGeometries(tScale, dep) {
            const p0 = { x: 0, y: 0 };
            const p1 = { x: 0.866, y: 0.5 };
            const p2 = { x: p1.x - 0.25 * tScale, y: p1.y + 0.433 * tScale };
            const p3 = { x: p2.x + 0.866, y: p2.y + 0.5 };
            const p4 = { x: p3.x + 0.25 * tScale, y: p3.y - 0.433 * tScale };
            const p5 = { x: p4.x + 0.866, y: p4.y + 0.5 };

            const q1 = rot120(p1.x, p1.y);
            const q2 = rot120(p2.x, p2.y);
            const q3 = rot120(p3.x, p3.y);
            const q4 = rot120(p4.x, p4.y);
            const q5 = rot120(p5.x, p5.y);

            const shape = new THREE.Shape();
            shape.moveTo(p0.x, p0.y);
            shape.lineTo(p1.x, p1.y);
            shape.lineTo(p2.x, p2.y);
            shape.lineTo(p3.x, p3.y);
            shape.lineTo(p4.x, p4.y);
            shape.lineTo(p5.x, p5.y);

            shape.lineTo(2.598, 14);
            shape.lineTo(-2.598, 14);

            shape.lineTo(q5.x, q5.y);
            shape.lineTo(q4.x, q4.y);
            shape.lineTo(q3.x, q3.y);
            shape.lineTo(q2.x, q2.y);
            shape.lineTo(q1.x, q1.y);
            shape.lineTo(p0.x, p0.y);

            const extrudeSettings = {
                depth: dep,
                bevelEnabled: true,
                bevelSegments: 3,
                steps: 1,
                bevelSize: 0.05,
                bevelThickness: 0.05
            };
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            geometry.translate(0, 0, -dep / 2);

            const edgesGeometry = new THREE.EdgesGeometry(geometry, 15);
            return { geometry, edgesGeometry };
        }

        const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x3d2817, linewidth: 2, opacity: 0.3, transparent: true });

        const woodProps = { roughness: 0.9, metalness: 0.05 };
        const mat1 = new THREE.MeshStandardMaterial({ color: 0xdeb887, ...woodProps });
        const mat2 = new THREE.MeshStandardMaterial({ color: 0xc49b66, ...woodProps });
        const mat3 = new THREE.MeshStandardMaterial({ color: 0xe6cc98, ...woodProps });
        const errorMat = new THREE.MeshStandardMaterial({ color: 0xff4a4a, ...woodProps, emissive: 0x330000 });

        function createArucoTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 128; canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 128, 128);
            ctx.fillStyle = '#000000'; ctx.fillRect(16, 16, 96, 96);
            ctx.fillStyle = '#ffffff';
            const blocks = [[1, 0, 1, 1], [0, 1, 0, 1], [1, 1, 0, 0], [0, 0, 1, 0]];
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    if (blocks[y][x]) ctx.fillRect(32 + x * 16, 32 + y * 16, 16, 16);
                }
            }
            const texture = new THREE.CanvasTexture(canvas);
            texture.magFilter = THREE.NearestFilter;
            return texture;
        }

        const arucoMat = new THREE.MeshBasicMaterial({ map: createArucoTexture() });
        const arucoGeo = new THREE.PlaneGeometry(1.5, 1.5);

        let initialGeoms = createJointGeometries(1.0, 1.8);

        function createBeam(material, rotationZ, geometries) {
            const group = new THREE.Group();
            const mesh = new THREE.Mesh(geometries.geometry, material);
            mesh.castShadow = true; mesh.receiveShadow = true;
            group.add(mesh);
            const lines = new THREE.LineSegments(geometries.edgesGeometry, edgesMaterial);
            group.add(lines);
            const marker = new THREE.Mesh(arucoGeo, arucoMat);
            marker.position.set(0, 10, 0.91);
            group.add(marker);
            group.rotation.z = rotationZ;
            return group;
        }

        const beam1 = createBeam(mat1, 0, initialGeoms);
        const beam2 = createBeam(mat2, 2 * Math.PI / 3, initialGeoms);
        const beam3 = createBeam(mat3, 4 * Math.PI / 3, initialGeoms);

        scene.add(beam1);
        scene.add(beam2);
        scene.add(beam3);

        let currentGeometries = initialGeoms;

        stateRef.current.updateDimensions = (tScale, dep) => {
            const newGeoms = createJointGeometries(tScale, dep);
            [beam1, beam2, beam3].forEach(beam => {
                beam.children[0].geometry.dispose();
                beam.children[0].geometry = newGeoms.geometry;

                beam.children[1].geometry.dispose();
                beam.children[1].geometry = newGeoms.edgesGeometry;

                beam.children[2].position.z = (dep / 2) + 0.01;
            });

            if (currentGeometries !== initialGeoms) {
                currentGeometries.geometry.dispose();
                currentGeometries.edgesGeometry.dispose();
            }
            currentGeometries = newGeoms;
        };

        const floorGeo = new THREE.PlaneGeometry(200, 200);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a1c20, roughness: 1.0, depthWrite: false });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.z = -5; floor.receiveShadow = true;
        scene.add(floor);

        const grid = new THREE.GridHelper(100, 50, 0x444444, 0x333333);
        grid.rotation.x = Math.PI / 2; grid.position.z = -4.99;
        scene.add(grid);

        const v1 = new THREE.Vector3(0, 1, 0);
        const v2 = new THREE.Vector3(Math.cos(7 * Math.PI / 6), Math.sin(7 * Math.PI / 6), 0);
        const v3 = new THREE.Vector3(Math.cos(11 * Math.PI / 6), Math.sin(11 * Math.PI / 6), 0);

        stateRef.current.updatePositions = (prog) => {
            const maxDistance = 3;
            const dist = prog * maxDistance;
            beam1.position.copy(v1).multiplyScalar(dist);
            beam2.position.copy(v2).multiplyScalar(dist);
            beam3.position.copy(v3).multiplyScalar(dist);
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        const timer = new THREE.Timer();
        timer.connect(document);
        let animationFrameId;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            timer.update();
            const delta = timer.getDelta();
            controls.update();

            const st = stateRef.current;
            const warningUI = document.getElementById('collision-warning');

            if (st.isTestingCollision) {
                st.testProgress += delta;

                if (st.testProgress < 0.5) {
                    beam1.position.copy(v1).multiplyScalar(st.testProgress * 2);
                } else if (st.testProgress < 2.0) {
                    if (warningUI) warningUI.style.opacity = '1';
                    beam1.children[0].material = errorMat;
                    beam2.children[0].material = errorMat;
                    beam3.children[0].material = errorMat;
                } else if (st.testProgress < 2.5) {
                    if (warningUI) warningUI.style.opacity = '0';
                    const retract = (2.5 - st.testProgress) * 2;
                    beam1.position.copy(v1).multiplyScalar(retract);

                    beam1.children[0].material = mat1;
                    beam2.children[0].material = mat2;
                    beam3.children[0].material = mat3;
                } else {
                    st.isTestingCollision = false;
                    setIsTesting(false);
                    beam1.position.set(0, 0, 0);
                }
            } else if (st.isAnimating) {
                st.currentProgress += (st.targetProgress - st.currentProgress) * 5 * delta;
                setProgress(st.currentProgress);
                st.updatePositions(st.currentProgress);

                if (Math.abs(st.targetProgress - st.currentProgress) < 0.001) {
                    st.currentProgress = st.targetProgress;
                    st.isAnimating = false;
                    setProgress(st.currentProgress);
                }
            }

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            timer.dispose();
            if (controls) controls.dispose();
            renderer.forceContextLoss();
            renderer.dispose();
            if (currentMount && currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, []);

    const handleAssemblySlider = (e) => {
        if (stateRef.current.isTestingCollision) return;
        const val = parseFloat(e.target.value);
        setProgress(val);
        stateRef.current.currentProgress = val;
        stateRef.current.targetProgress = val;
        stateRef.current.isAnimating = false;
        if (stateRef.current.updatePositions) {
            stateRef.current.updatePositions(val);
        }
        setBtnText(val > 0.05 ? "Animate Assembly" : "Animate Disassembly");
    };

    const handleToggleBtn = () => {
        if (stateRef.current.isTestingCollision) return;
        const st = stateRef.current;
        if (st.targetProgress > 0.5) {
            st.targetProgress = 0;
            setBtnText("Animate Disassembly");
        } else {
            st.targetProgress = 1;
            setBtnText("Animate Assembly");
        }
        st.isAnimating = true;
    };

    const handleTestBtn = () => {
        const st = stateRef.current;
        if (st.isAnimating || st.isTestingCollision) return;

        st.isTestingCollision = true;
        setIsTesting(true);
        st.testProgress = 0;

        st.currentProgress = 0;
        st.targetProgress = 0;
        setProgress(0);
        if (st.updatePositions) {
            st.updatePositions(0);
        }
    };

    const handleDepthSlider = (e) => {
        const val = parseFloat(e.target.value);
        setDepth(val);
        if (stateRef.current.updateDimensions) {
            stateRef.current.updateDimensions(tabScale, val);
        }
    };

    const handleTabSlider = (e) => {
        const val = parseFloat(e.target.value);
        setTabScale(val);
        if (stateRef.current.updateDimensions) {
            stateRef.current.updateDimensions(val, depth);
        }
    };

    return (
        <div className="robotic-assembly-page">
            <div id="loading" style={{ display: 'none' }}>Initializing 3D Environment...</div>
            <div id="collision-warning">⚠️ KINEMATIC LOCK: Cannot remove sequentially. The tabs collide!</div>
            <div ref={mountRef} id="canvas-container"></div>

            <div id="ui-panel">
                {/* Header row: title + mobile collapse toggle */}
                <div className="panel-header">
                    <h1>Synchronous Multi-Robot Assembly</h1>
                    <button
                        className="panel-toggle"
                        onClick={() => {
                            setPanelOpen(o => !o);
                            setShowHint(false);
                        }}
                        aria-label={panelOpen ? 'Collapse panel' : 'Expand panel'}
                    >
                        {panelOpen ? '▲' : '▼'}
                    </button>
                </div>

                {/* Collapsible body */}
                <div className={`panel-body${panelOpen ? '' : ' collapsed'}`}>
                    <p>This interactive 3D model visualizes a <span className="highlight">3-part non-sequential interlocking joint</span>.</p>
                    <p>Because of the cyclic mortise-and-tenon geometry, it is <strong>locked by its kinematics</strong>. No single beam can be pulled out independently without colliding with its neighbor. It requires synchronized, simultaneous motion along 3 specific vectors to assemble.</p>

                    <div className="controls">
                        <label htmlFor="assemblySlider">Joint Assembly State</label>
                        <input
                            type="range"
                            id="assemblySlider"
                            min="0" max="1"
                            step="0.001"
                            value={progress}
                            onChange={handleAssemblySlider}
                            disabled={isTesting}
                        />
                        <button id="toggleBtn" onClick={handleToggleBtn} disabled={isTesting}>{btnText}</button>

                        <hr style={{ border: '0', borderTop: '1px solid #ddd', margin: '15px 0' }} />

                        <label htmlFor="depthSlider">Beam Thickness (cm)</label>
                        <input
                            type="range" id="depthSlider" min="0.5" max="5.0" step="0.1"
                            value={depth} onChange={handleDepthSlider} disabled={isTesting}
                        />

                        <label htmlFor="tabSlider">Interlock Size (Tab Scale)</label>
                        <input
                            type="range" id="tabSlider" min="0.0" max="5.0" step="0.1"
                            value={tabScale} onChange={handleTabSlider} disabled={isTesting}
                        />

                        <button id="testBtn" style={{ background: '#d24a3a', marginTop: '10px' }} onClick={handleTestBtn} disabled={isTesting}>
                            Test Single-Part Removal
                        </button>
                    </div>

                    <p className="paper-ref">
                        <strong>Based on:</strong> Rossi et al. (2023). <br /><em>Robotic Non-Sequential Interlocking Assemblies.</em> Note the simulated ArUco markers on the beams, referencing the automated component location detection used by the robotic arms.
                    </p>
                    {onClose && (
                        <button className="close-btn" onClick={onClose} disabled={isTesting}>Return to Main Site</button>
                    )}
                </div>
            </div>

            {/* Hint bubble – outside ui-panel so it's never clipped */}
            {showHint && !panelOpen && (
                <div className="hint-bubble" onClick={() => setShowHint(false)}>
                    ⚙️ Tap <strong>▼</strong> to adjust beam thickness, interlock size &amp; more!
                </div>
            )}

            {/* Floating animate button – mobile only, visible when panel is collapsed */}
            {!panelOpen && (
                <button
                    className="fab-animate"
                    onClick={handleToggleBtn}
                    disabled={isTesting}
                    aria-label="Toggle animation"
                >
                    {stateRef.current.targetProgress > 0.5 ? '◼ Assemble' : '▶ Animate'}
                </button>
            )}
        </div>
    );
};

export default RoboticAssembly;
