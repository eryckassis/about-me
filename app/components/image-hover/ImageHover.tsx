"use client";

import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Geometry, Mesh, Program, Renderer, Texture, Vec2 } from "ogl";
import {useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,} from "react";

type ImageHoverProps = {
  children: ReactNode;
};

type LoadedTexture = {
  height: number;
  texture: Texture;
  width: number;
};

type ShaderUniforms = {
  uPixelRatio: { value: number };
  uPointer: { value: Vec2 };
  uRect: { value: Float32Array };
  uStrength: { value: number };
  uTexture: { value: Texture };
  uTextureSize: { value: Vec2 };
  uTime: { value: number };
  uVelocity: { value: Vec2 };
};

type HoverRuntime = {
  canvas: HTMLCanvasElement;
  drawTarget: HTMLElement | null;
  dpr: number;
  gl: Renderer["gl"];
  hasPointer: boolean;
  hoverTarget: HTMLElement | null;
  lastPointerX: number;
  lastPointerY: number;
  loadingTarget: HTMLElement | null;
  mesh: Mesh;
  pointerX: number;
  pointerY: number;
  rafId: number | null;
  renderer: Renderer;
  requestId: number;
  strength: number;
  targetStrength: number;
  textures: Map<string, Promise<LoadedTexture>>;
  uniforms: ShaderUniforms;
};

const vertexShader = /* glsl */ `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uTextureSize;
  uniform vec4 uRect;
  uniform vec2 uPointer;
  uniform float uStrength;
  uniform float uPixelRatio;

  vec2 mod289(vec2 value) {
    return value - floor(value * (1.0 / 289.0)) * 289.0;
  }

  vec3 mod289(vec3 value) {
    return value - floor(value * (1.0 / 289.0)) * 289.0;
  }

  vec3 permute(vec3 value) {
    return mod289(((value * 34.0) + 1.0) * value);
  }

  // 2D simplex noise, based on the MIT-licensed Ashima Arts implementation.
  float snoise(vec2 value) {
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
      -0.577350269189626,
      0.024390243902439
    );

    vec2 i = floor(value + dot(value, C.yy));
    vec2 x0 = value - i + dot(i, C.xx);
    vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;

    x12.xy -= i1;
    i = mod289(i);

    vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0)) +
      i.x +
      vec3(0.0, i1.x, 1.0)
    );

    vec3 m = max(
      0.5 -
      vec3(
        dot(x0, x0),
        dot(x12.xy, x12.xy),
        dot(x12.zw, x12.zw)
      ),
      0.0
    );

    m *= m;
    m *= m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 -
      0.85373472095314 * (a0 * a0 + h * h);

    vec3 gradient;

    gradient.x = a0.x * x0.x + h.x * x0.y;
    gradient.yz = a0.yz * x12.xz + h.yz * x12.yw;

    return 130.0 * dot(m, gradient);
  }

  vec2 coverUv(vec2 uv, vec2 frameSize, vec2 textureSize) {
    float frameRatio = frameSize.x / frameSize.y;
    float textureRatio = textureSize.x / textureSize.y;
    vec2 scale = vec2(1.0);

    if (frameRatio > textureRatio) {
      scale.y = textureRatio / frameRatio;
    } else {
      scale.x = frameRatio / textureRatio;
    }

    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 framePixel = gl_FragCoord.xy - uRect.xy;

    if (
      framePixel.x < 0.0 ||
      framePixel.y < 0.0 ||
      framePixel.x > uRect.z ||
      framePixel.y > uRect.w
    ) {
      discard;
    }

    vec2 frameUv = framePixel / uRect.zw;
    float aspect = uRect.z / uRect.w;
    float circle =
      1.0 -
      length(
        (frameUv - uPointer) *
        vec2(1.0, 1.0 / aspect)
      ) *
      15.0;

    float pointerDistancePx =
      length((frameUv - uPointer) * uRect.zw) /
      max(uPixelRatio, 1.0);

    float focusMask = smoothstep(14.0, 48.0, pointerDistancePx);
    float displacement =
      circle *
      snoise(gl_FragCoord.xy) *
      0.0028 *
      uStrength *
      focusMask;

    frameUv += vec2(displacement, -displacement);

    vec2 textureUv = coverUv(
      frameUv,
      uRect.zw,
      uTextureSize
    );

    textureUv = clamp(textureUv, 0.001, 0.999);

    gl_FragColor = texture2D(uTexture, textureUv);
  }
`;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function showDomImage(target: HTMLElement | null) {
  if (target) {
    delete target.dataset.hoverActive;
  }
}

function clearCanvas(runtime: HoverRuntime) {
  runtime.gl.clear(runtime.gl.COLOR_BUFFER_BIT);
}

function resizeRenderer(runtime: HoverRuntime) {
  runtime.renderer.setSize(window.innerWidth, window.innerHeight);
}

function loadTexture(runtime: HoverRuntime, src: string) {
  const cachedTexture = runtime.textures.get(src);

  if (cachedTexture) {
    return cachedTexture;
  }

  const texturePromise = new Promise<LoadedTexture>((resolve, reject) => {
    const image = new window.Image();

    image.decoding = "async";

    image.onload = () => {
      const texture = new Texture(runtime.gl, {
        flipY: true,
        generateMipmaps: false,
        image,
        magFilter: runtime.gl.LINEAR,
        minFilter: runtime.gl.LINEAR,
      });

      texture.needsUpdate = true;

      resolve({
        height: image.naturalHeight,
        texture,
        width: image.naturalWidth,
      });
    };

    image.onerror = () => {
      reject(new Error(`Unable to load hover texture: ${src}`));
    };

    image.src = src;
  });

  runtime.textures.set(src, texturePromise);

  void texturePromise.catch(() => {
    runtime.textures.delete(src);
  });

  return texturePromise;
}

function scheduleFrame(runtime: HoverRuntime) {
  if (runtime.rafId !== null) {
    return;
  }

  runtime.rafId = window.requestAnimationFrame((time) => {
    renderFrame(runtime, time);
  });
}

function renderFrame(runtime: HoverRuntime, time: number) {
  runtime.rafId = null;

  const target = runtime.drawTarget;

  if (!target) {
    runtime.canvas.style.opacity = "0";
    clearCanvas(runtime);
    return;
  }

  const rect = target.getBoundingClientRect();
  const isVisible =
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.top < window.innerHeight;

  if (!isVisible) {
    runtime.targetStrength = 0;
    showDomImage(target);
  }

  runtime.strength += (runtime.targetStrength - runtime.strength) * 0.14;

  runtime.uniforms.uStrength.value = runtime.strength;
  runtime.uniforms.uTime.value = time * 0.001;

  const rectUniform = runtime.uniforms.uRect.value;

  rectUniform[0] = rect.left * runtime.dpr;
  rectUniform[1] = (window.innerHeight - rect.bottom) * runtime.dpr;
  rectUniform[2] = rect.width * runtime.dpr;
  rectUniform[3] = rect.height * runtime.dpr;

  const pointerX = clamp(
    (runtime.pointerX - rect.left) / Math.max(rect.width, 1),
    0,
    1,
  );

  const pointerY = clamp(
    1 - (runtime.pointerY - rect.top) / Math.max(rect.height, 1),
    0,
    1,
  );

  runtime.uniforms.uPointer.value.set(pointerX, pointerY);

  runtime.uniforms.uVelocity.value.set(
    runtime.uniforms.uVelocity.value.x * 0.88,
    runtime.uniforms.uVelocity.value.y * 0.88,
  );

  runtime.renderer.render({ scene: runtime.mesh });

  if (
    runtime.targetStrength === 1 &&
    runtime.strength > 0.985 &&
    runtime.hoverTarget === target
  ) {
    target.dataset.hoverActive = "true";
  }

  if (runtime.targetStrength === 0) {
    showDomImage(target);
  }

  const shouldContinue = runtime.targetStrength > 0 || runtime.strength > 0.002;

  if (shouldContinue) {
    scheduleFrame(runtime);
    return;
  }

  showDomImage(target);

  runtime.drawTarget = null;
  runtime.strength = 0;
  runtime.canvas.style.opacity = "0";

  clearCanvas(runtime);
}

function deactivateRuntime(runtime: HoverRuntime) {
  const isAlreadyInactive =
    runtime.hoverTarget === null &&
    runtime.loadingTarget === null &&
    runtime.targetStrength === 0;

  if (isAlreadyInactive) {
    return;
  }

  runtime.requestId += 1;
  runtime.hoverTarget = null;
  runtime.loadingTarget = null;
  runtime.targetStrength = 0;
  runtime.hasPointer = false;

  showDomImage(runtime.drawTarget);

  if (runtime.drawTarget) {
    scheduleFrame(runtime);
  } else {
    runtime.canvas.style.opacity = "0";
    clearCanvas(runtime);
  }
}

function updatePointer(
  runtime: HoverRuntime,
  event: ReactPointerEvent<HTMLDivElement>,
  target: HTMLElement,
) {
  const rect = target.getBoundingClientRect();

  runtime.pointerX = event.clientX;
  runtime.pointerY = event.clientY;

  if (runtime.hasPointer) {
    const velocityX =
      (event.clientX - runtime.lastPointerX) / Math.max(rect.width, 1);

    const velocityY =
      (runtime.lastPointerY - event.clientY) / Math.max(rect.height, 1);

    runtime.uniforms.uVelocity.value.set(
      clamp(velocityX, -0.08, 0.08),
      clamp(velocityY, -0.08, 0.08),
    );
  } else {
    runtime.uniforms.uVelocity.value.set(0, 0);
    runtime.hasPointer = true;
  }

  runtime.lastPointerX = event.clientX;
  runtime.lastPointerY = event.clientY;
}

export function ImageHover({ children }: ImageHoverProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const runtimeRef = useRef<HoverRuntime | null>(null);

  const [cursorLabel, setCursorLabel] = useState("");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorOpacity = useMotionValue(0);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;

    const supportsHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    if (!root || !canvas || !supportsHover || shouldReduceMotion) {
      return;
    }

    let runtime: HoverRuntime;

    try {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const renderer = new Renderer({
        alpha: true,
        antialias: false,
        canvas,
        dpr,
      });

      const gl = renderer.gl;

      gl.clearColor(0, 0, 0, 0);

      const geometry = new Geometry(gl, {
        position: {
          data: new Float32Array([-1, -1, 3, -1, -1, 3]),
          size: 2,
        },
      });

      const emptyTexture = new Texture(gl, {
        generateMipmaps: false,
        height: 1,
        image: new Uint8Array([0, 0, 0, 0]),
        width: 1,
      });

      const uniforms: ShaderUniforms = {
        uPixelRatio: {
          value: dpr,
        },
        uPointer: {
          value: new Vec2(0.5, 0.5),
        },
        uRect: {
          value: new Float32Array([0, 0, 1, 1]),
        },
        uStrength: {
          value: 0,
        },
        uTexture: {
          value: emptyTexture,
        },
        uTextureSize: {
          value: new Vec2(1, 1),
        },
        uTime: {
          value: 0,
        },
        uVelocity: {
          value: new Vec2(0, 0),
        },
      };

      const program = new Program(gl, {
        depthTest: false,
        depthWrite: false,
        fragment: fragmentShader,
        transparent: true,
        uniforms,
        vertex: vertexShader,
      });

      const mesh = new Mesh(gl, {
        geometry,
        program,
      });

      runtime = {
        canvas,
        drawTarget: null,
        dpr,
        gl,
        hasPointer: false,
        hoverTarget: null,
        lastPointerX: 0,
        lastPointerY: 0,
        loadingTarget: null,
        mesh,
        pointerX: 0,
        pointerY: 0,
        rafId: null,
        renderer,
        requestId: 0,
        strength: 0,
        targetStrength: 0,
        textures: new Map(),
        uniforms,
      };
    } catch {
      delete root.dataset.imageHoverEnabled;
      runtimeRef.current = null;
      return;
    }

    runtimeRef.current = runtime;
    root.dataset.imageHoverEnabled = "true";

    resizeRenderer(runtime);

    const handleResize = () => {
      resizeRenderer(runtime);
    };

    const handleContextLost = () => {
      runtime.requestId += 1;

      if (runtime.rafId !== null) {
        window.cancelAnimationFrame(runtime.rafId);
        runtime.rafId = null;
      }

      showDomImage(runtime.drawTarget);

      runtimeRef.current = null;
      cursorOpacity.set(0);
      canvas.style.opacity = "0";

      delete root.dataset.imageHoverEnabled;
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("webglcontextlost", handleContextLost);

    return () => {
      runtime.requestId += 1;

      if (runtime.rafId !== null) {
        window.cancelAnimationFrame(runtime.rafId);
      }

      showDomImage(runtime.drawTarget);
      clearCanvas(runtime);

      runtimeRef.current = null;
      cursorOpacity.set(0);
      canvas.style.opacity = "0";

      delete root.dataset.imageHoverEnabled;

      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
    };
  }, [cursorOpacity, shouldReduceMotion]);

  function activateTarget(runtime: HoverRuntime, target: HTMLElement) {
    const isCurrentTarget =
      runtime.hoverTarget === target &&
      (runtime.drawTarget === target || runtime.loadingTarget === target);

    if (isCurrentTarget) {
      return;
    }

    showDomImage(runtime.drawTarget);

    runtime.requestId += 1;
    runtime.hoverTarget = target;
    runtime.loadingTarget = target;
    runtime.drawTarget = null;
    runtime.targetStrength = 0;
    runtime.strength = 0;
    runtime.hasPointer = false;

    runtime.canvas.style.opacity = "0";

    clearCanvas(runtime);

    const requestId = runtime.requestId;
    const src = target.dataset.hoverSrc;

    if (!src) {
      target.dataset.hoverFailed = "true";
      runtime.loadingTarget = null;
      return;
    }

    void loadTexture(runtime, src)
      .then((loadedTexture) => {
        const isStillCurrent =
          runtimeRef.current === runtime &&
          runtime.requestId === requestId &&
          runtime.hoverTarget === target;

        if (!isStillCurrent) {
          return;
        }

        runtime.loadingTarget = null;
        runtime.drawTarget = target;
        runtime.targetStrength = 1;

        runtime.uniforms.uTexture.value = loadedTexture.texture;

        runtime.uniforms.uTextureSize.value.set(
          loadedTexture.width,
          loadedTexture.height,
        );

        runtime.canvas.style.opacity = "1";

        scheduleFrame(runtime);
      })
      .catch(() => {
        target.dataset.hoverFailed = "true";

        const isStillCurrent =
          runtimeRef.current === runtime && runtime.requestId === requestId;

        if (!isStillCurrent) {
          return;
        }

        runtime.hoverTarget = null;
        runtime.loadingTarget = null;

        cursorOpacity.set(0);
        setCursorLabel("");
      });
  }

  function handlePointer(event: ReactPointerEvent<HTMLDivElement>) {
    const runtime = runtimeRef.current;

    if (!runtime || !(event.target instanceof Element)) {
      return;
    }

    const target = event.target.closest<HTMLElement>("[data-hover-image]");

    if (!target || target.dataset.hoverFailed === "true") {
      cursorOpacity.set(0);
      setCursorLabel("");
      deactivateRuntime(runtime);
      return;
    }

    cursorX.set(event.clientX - 8);
    cursorY.set(event.clientY - 8);
    cursorOpacity.set(1);

    if (runtime.hoverTarget !== target) {
      setCursorLabel(target.dataset.cursorLabel ?? "");
    }

    if (target.hasAttribute("data-hover-shader")) {
      activateTarget(runtime, target);
      updatePointer(runtime, event, target);
    } else {
      deactivateRuntime(runtime);
    }
  }

  function handlePointerLeave() {
    const runtime = runtimeRef.current;

    cursorOpacity.set(0);
    setCursorLabel("");

    if (runtime) {
      deactivateRuntime(runtime);
    }
  }

  return (
    <div
      ref={rootRef}
      className="contents"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointer}
      onPointerOver={handlePointer}
    >
      {children}

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9] h-full w-full opacity-0"
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[1300] size-4 bg-background mix-blend-difference will-change-transform [transition:opacity_180ms_ease]"
        style={{
          opacity: cursorOpacity,
          x: cursorX,
          y: cursorY,
        }}
      >
        <span
          className={`absolute bottom-[calc(100%+8px)] left-1/2 w-44 -translate-x-1/2 p-1 text-center text-sm leading-[15.6px] font-medium tracking-[-0.04em] text-balance text-background ${
            cursorLabel ? "opacity-100" : "opacity-0"
          }`}
        >
          {cursorLabel}
        </span>
      </motion.div>
    </div>
  );
}
