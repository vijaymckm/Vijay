"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Fullscreen mesh-gradient shader plane with smooth simplex noise
 * + faint floating orbs for atmospheric depth.
 */

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  // 2D simplex noise (Ashima)
  vec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec2 mod289(vec2 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // smoothstep based circular gradient
  float orb(vec2 uv, vec2 c, float r){
    return smoothstep(r, 0.0, length(uv - c));
  }

  void main(){
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = uv;
    p.x *= aspect;

    float t = uTime * 0.06;

    // Two noise fields combined for an organic mesh gradient
    float n1 = snoise(p * 1.4 + vec2(t, t * 0.7));
    float n2 = snoise(p * 2.6 - vec2(t * 1.1, t * 0.4));
    float field = 0.5 + 0.5 * (0.6 * n1 + 0.4 * n2);

    // Mouse parallax warps the field gently
    vec2 m = (uMouse - 0.5);
    float warp = snoise(p * 1.1 + m * 0.6 + t * 0.5) * 0.35;
    field = clamp(field + warp, 0.0, 1.0);

    // Color palette: deep ink -> blue -> cyan -> violet
    vec3 c0 = vec3(0.012, 0.024, 0.052);   // deep ink
    vec3 c1 = vec3(0.024, 0.090, 0.200);   // navy
    vec3 c2 = vec3(0.231, 0.510, 0.965);   // electric blue
    vec3 c3 = vec3(0.490, 0.976, 1.000);   // cyan glow
    vec3 c4 = vec3(0.545, 0.361, 0.965);   // violet

    vec3 col = mix(c0, c1, smoothstep(0.0, 0.45, field));
    col = mix(col, c2, smoothstep(0.45, 0.78, field));
    col = mix(col, c3, smoothstep(0.78, 0.92, field) * 0.55);
    col = mix(col, c4, smoothstep(0.6, 1.0, n1 * 0.5 + 0.5) * 0.18);

    // Soft floating orbs of light
    vec2 puv = uv * vec2(aspect, 1.0);
    vec2 oc1 = vec2(aspect * 0.25 + 0.06 * sin(t * 2.0),
                    0.7  + 0.05 * cos(t * 1.4));
    vec2 oc2 = vec2(aspect * 0.78 + 0.05 * cos(t * 1.6),
                    0.32 + 0.06 * sin(t * 2.4));
    vec2 oc3 = vec2(aspect * 0.5  + 0.08 * sin(t * 1.0),
                    0.5  + 0.07 * cos(t * 0.8));

    float o = orb(puv, oc1, 0.55) * 0.18;
    o += orb(puv, oc2, 0.5)  * 0.14;
    o += orb(puv, oc3, 0.7)  * 0.10;
    col += o * vec3(0.6, 0.85, 1.0);

    // Vignette to keep focus toward center
    float vig = smoothstep(1.2, 0.35, length(uv - 0.5));
    col *= vig * 0.95 + 0.4;

    // Subtle fine grain to break up banding
    float grain = (fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.018;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function GradientPlane() {
  const matRef = useRef(null);
  const { size, viewport } = useThree();
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const currentMouse = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(size.width, size.height),
      },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [size.width, size.height]
  );

  useFrame((state, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += delta;
    matRef.current.uniforms.uResolution.value.set(size.width, size.height);

    // Track pointer (state.pointer is in NDC -1..1)
    const px = (state.pointer.x + 1) * 0.5;
    const py = (state.pointer.y + 1) * 0.5;
    targetMouse.current.set(px, py);
    currentMouse.current.lerp(targetMouse.current, 0.05);
    matRef.current.uniforms.uMouse.value.copy(currentMouse.current);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Background3D() {
  return (
    <Canvas
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1], fov: 50 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#03060d"]} />
      <GradientPlane />
    </Canvas>
  );
}
