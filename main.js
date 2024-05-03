import * as twgl from "https://esm.sh/twgl.js@5.5.4";
import gsap from "https://esm.sh/gsap@3.12.5";
import ScrollTrigger from "https://esm.sh/gsap@3.12.5/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const gl = document.getElementById("c").getContext("webgl");
const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
const arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

const noiseTexture = twgl.createTexture(gl, { src: "/img/noise.png", min: gl.LINEAR, max: gl.LINEAR }, () => {
  requestAnimationFrame(render);
  gsap.to(anims, {
    delta: 0.5,
    world_color_r: 0.2,
    world_color_g: 0.1,
    world_color_b: 0.1,
    duration: 2.0,
    ease: "power4.out",
    onComplete: buildTimeline,
  });
});

const startTime = Date.now();
const ctaAnims = {
  superSpeed: 0.0,
};
let zOffset = 0.0;

function render(time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // const progress = tl.progress();

  const uniforms = {
    u_resolution: [gl.canvas.width, gl.canvas.height],
    u_progress: anims.delta,
    u_z_offset: zOffset,
    u_time: (Date.now() - startTime) / 1000.0,
    u_world_color: [anims.world_color_r, anims.world_color_g, anims.world_color_b],
    u_noise: noiseTexture,
    u_light_dir: [anims.light_dir_x, anims.light_dir_y, anims.light_dir_z],
  };
  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);

  zOffset -= ctaAnims.superSpeed;

  requestAnimationFrame(render);
}

const anims = {
  delta: -0.0,
  light_dir_x: 0.1,
  light_dir_y: 0.1,
  light_dir_z: 0.1,
  world_color_r: 0.0,
  world_color_g: 0.0,
  world_color_b: 0.0,
};

function buildTimeline() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "main",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });

  tl.from(anims, {
    delta: 0.5,
    world_color_r: 0.2,
    world_color_g: 0.1,
    world_color_b: 0.1,
    duration: 0.2,
  });

  tl.to(anims, {
    delta: 0.3,
    light_dir_x: 0.0,
    light_dir_y: 0.1,
    light_dir_z: 0.1,
    world_color_r: 0.5,
    world_color_g: 0.0,
    world_color_b: 0.2,
    duration: 0.25,
  });

  tl.to(anims, {
    delta: 0.1,
    light_dir_x: 0.0,
    light_dir_y: 1.0,
    light_dir_z: 0.1,
    world_color_r: 0.2,
    world_color_g: 0.2,
    world_color_b: 0.2,
    duration: 1.0,
  });
  tl.to(anims, {
    delta: -0.8,
    light_dir_x: 0.0,
    light_dir_y: 1.0,
    light_dir_z: -0.1,
    world_color_r: 0.2,
    world_color_g: 0.0,
    world_color_b: 0.1,
    duration: 1.0,
  });
  tl.to(anims, {
    delta: 1.0,
    light_dir_x: 0.0,
    light_dir_y: -1.0,
    light_dir_z: 0.0,
    world_color_r: 0.2,
    world_color_g: 0.1,
    world_color_b: 0.1,
    duration: 1.0,
  });
}

document.querySelectorAll(".cta").forEach((cta) => {
  cta.addEventListener("mouseenter", () => {
    gsap.to(ctaAnims, {
      superSpeed: 0.1,
      duration: 2.0,
      overwrite: "auto",
    });
  });

  cta.addEventListener("mouseleave", () => {
    gsap.to(ctaAnims, {
      superSpeed: 0.0,
      duration: 1.0,
      overwrite: "auto",
    });
  });
});
