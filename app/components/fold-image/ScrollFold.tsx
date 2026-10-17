"use client";

import { useReducedMotion } from "framer-motion";
import { Geometry, Mesh, Program, Renderer, Texture, Vec2 } from "ogl";
import { useEffect, useRef, type ReactNode } from "react";

type ScrollFoldProps = {
  children: ReactNode;
};

type LoadedTexture = {
  height: number;
  texture: Texture;
  width: number;
};

type FoldUniforms = {
  uRect: { value: Float32Array };
  uStrength: { value: number };
  uTexture: { value: Texture };
  uTextureSize: { value: Vec2 };
};

type FoldRuntime = {
  canvas: HTMLCanvasElement;
  dpr: number;
  gl: Renderer["gl"];
  lastScrollY: number;
  mesh: Mesh;
  rafId: number | null;
  renderer: Renderer;
  root: HTMLDivElement;
  strength: number;
  targetStrength: number;
  textures: Map<string, Promise<LoadedTexture>>;
  uniforms: FoldUniforms;
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
  uniform float uStrength;

  const float PI = 3.141592653589793;

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
    float strength = min(abs(uStrength), 1.0);
    float direction = sign(uStrength);
    float curve = sin(frameUv.y * PI) * strength;

    frameUv.x = 0.5 + (frameUv.x - 0.5) * (1.0 - curve * 0.09);
    frameUv.y += (0.5 - frameUv.y) * curve * 0.3;
    frameUv.y += direction * curve * 0.075;

    vec2 textureUv = coverUv(frameUv, uRect.zw, uTextureSize);
    textureUv = clamp(textureUv, 0.001, 0.999);

    vec4 color = texture2D(uTexture, textureUv);
    float foldLight = 1.0 - curve * 0.2;
    float directionalLight = cos(frameUv.y * PI) * uStrength * 0.07;

    color.rgb *= foldLight + directionalLight;
    gl_FragColor = color;
  }
`;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function resizeRenderer(runtime: FoldRuntime) {
  runtime.renderer.setSize(window.innerWidth, window.innerHeight);
}

function showDomImages(runtime: FoldRuntime) {
  runtime.root.querySelectorAll<HTMLElement>("[data-fold-active]").forEach((target) => {
    delete target.dataset.foldActive;
  });
}

function loadTexture(runtime: FoldRuntime, src: string) {
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
    image.onerror = reject;
    image.src = src;
  });

  runtime.textures.set(src, texturePromise);
  void texturePromise.catch(() => {
    runtime.textures.delete(src);
  });

  return texturePromise;
}

function scheduleFrame(runtime: FoldRuntime) {
  if (runtime.rafId !== null) {
    return;
  }

  runtime.rafId = window.requestAnimationFrame(() => renderFrame(runtime));
}

function renderFrame(runtime: FoldRuntime) {
  runtime.rafId = null;
  runtime.strength += (runtime.targetStrength - runtime.strength) * 0.16;
  runtime.targetStrength *= 0.78;

  const isActive =
    Math.abs(runtime.strength) > 0.002 || Math.abs(runtime.targetStrength) > 0.002;

  if (!isActive) {
    runtime.strength = 0;
    runtime.targetStrength = 0;
    runtime.canvas.style.opacity = "0";
    showDomImages(runtime);
    runtime.gl.clear(runtime.gl.COLOR_BUFFER_BIT);
    return;
  }

  const targets = Array.from(
    runtime.root.querySelectorAll<HTMLElement>("[data-fold-image]"),
  );

  runtime.gl.clear(runtime.gl.COLOR_BUFFER_BIT);

  let renderedTarget = false;

  targets.forEach((target) => {
    const rect = target.getBoundingClientRect();
    const src = target.dataset.foldSrc;

    if (
      !src ||
      rect.width <= 0 ||
      rect.height <= 0 ||
      rect.bottom <= 0 ||
      rect.top >= window.innerHeight
    ) {
      return;
    }

    void loadTexture(runtime, src)
      .then((loadedTexture) => {
        runtime.uniforms.uTexture.value = loadedTexture.texture;
        runtime.uniforms.uTextureSize.value.set(
          loadedTexture.width,
          loadedTexture.height,
        );

        const rectUniform = runtime.uniforms.uRect.value;

        rectUniform[0] = rect.left * runtime.dpr;
        rectUniform[1] = (window.innerHeight - rect.bottom) * runtime.dpr;
        rectUniform[2] = rect.width * runtime.dpr;
        rectUniform[3] = rect.height * runtime.dpr;
        runtime.uniforms.uStrength.value = runtime.strength;

        runtime.renderer.render({
          clear: false,
          frustumCull: false,
          scene: runtime.mesh,
          sort: false,
          update: false,
        });

        target.dataset.foldActive = "true";
        runtime.canvas.style.opacity = "1";
      })
      .catch(() => {
        delete target.dataset.foldActive;
      });

    renderedTarget = true;
  });

  if (!renderedTarget) {
    runtime.canvas.style.opacity = "0";
    showDomImages(runtime);
  }

  scheduleFrame(runtime);
}

export function ScrollFold({ children }: ScrollFoldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const runtimeRef = useRef<FoldRuntime | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;

    if (!canvas || !root || shouldReduceMotion) {
      return;
    }

    let runtime: FoldRuntime;

    try {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const renderer = new Renderer({
        alpha: true,
        antialias: false,
        autoClear: false,
        canvas,
        depth: false,
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
      const uniforms: FoldUniforms = {
        uRect: { value: new Float32Array([0, 0, 1, 1]) },
        uStrength: { value: 0 },
        uTexture: { value: emptyTexture },
        uTextureSize: { value: new Vec2(1, 1) },
      };
      const program = new Program(gl, {
        depthTest: false,
        depthWrite: false,
        fragment: fragmentShader,
        transparent: true,
        uniforms,
        vertex: vertexShader,
      });

      runtime = {
        canvas,
        dpr,
        gl,
        lastScrollY: window.scrollY,
        mesh: new Mesh(gl, { geometry, program }),
        rafId: null,
        renderer,
        root,
        strength: 0,
        targetStrength: 0,
        textures: new Map(),
        uniforms,
      };
    } catch {
      return;
    }

    runtimeRef.current = runtime;
    resizeRenderer(runtime);

    root.querySelectorAll<HTMLElement>("[data-fold-src]").forEach((target) => {
      const src = target.dataset.foldSrc;

      if (src) {
        void loadTexture(runtime, src).catch(() => undefined);
      }
    });

    function handleResize() {
      resizeRenderer(runtime);
    }

    function handleScroll() {
      const nextScrollY = window.scrollY;
      const scrollDelta = nextScrollY - runtime.lastScrollY;

      runtime.lastScrollY = nextScrollY;

      if (Math.abs(scrollDelta) > window.innerHeight * 0.5) {
        return;
      }

      runtime.targetStrength = clamp(scrollDelta / 90, -1, 1);
      scheduleFrame(runtime);
    }

    function handleContextLost() {
      if (runtime.rafId !== null) {
        window.cancelAnimationFrame(runtime.rafId);
      }

      showDomImages(runtime);
      runtime.canvas.style.opacity = "0";
      runtimeRef.current = null;
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    canvas.addEventListener("webglcontextlost", handleContextLost);

    return () => {
      if (runtime.rafId !== null) {
        window.cancelAnimationFrame(runtime.rafId);
      }

      showDomImages(runtime);
      runtime.canvas.style.opacity = "0";
      runtime.gl.clear(runtime.gl.COLOR_BUFFER_BIT);
      runtimeRef.current = null;

      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
    };
  }, [shouldReduceMotion]);

  return (
    <div ref={rootRef} className="contents">
      {children}

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[6] h-full w-full opacity-0"
      />
    </div>
  );
}
