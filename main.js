import * as twgl from "https://cdn.skypack.dev/twgl.js";
import gsap from "https://cdn.skypack.dev/gsap";
import ScrollTrigger from "https://cdn.skypack.dev/gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const gl = document.getElementById("c").getContext("webgl");
const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
const arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

const noiseTexture = twgl.createTexture(gl, { src: "img/noise.png" }, () =>
  requestAnimationFrame(render)
);
const startTime = Date.now();

function render(time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  const progress = tl.progress();

  const uniforms = {
    u_resolution: [gl.canvas.width, gl.canvas.height],
    u_progress: anims.delta,
    u_time: (Date.now() - startTime) / 1000.0,
    u_world_color: [
      anims.world_color_r,
      anims.world_color_g,
      anims.world_color_b,
    ],
    u_noise: noiseTexture,
    u_light_dir: [anims.light_dir_x, anims.light_dir_y, anims.light_dir_z],
  };
  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo, gl.TRIANGLES);

  requestAnimationFrame(render);
}

const anims = {
  delta: 0,
  light_dir_x: 0,
  light_dir_y: 1.0,
  light_dir_z: 0.1,
  world_color_r: 1.0,
  world_color_g: 0.1,
  world_color_b: 0.1,
};

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "main",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
});

tl.to(anims, {
  delta: 0.0,
  light_dir_x: 0.0,
  light_dir_y: 1.0,
  light_dir_z: 0.1,
  world_color_r: 0.8,
  world_color_g: 0.1,
  world_color_b: 0.1,
  duration: 0.25,
});

tl.to(anims, {
  delta: 0.3,
  light_dir_x: 0.0,
  light_dir_y: 1.0,
  light_dir_z: 0.1,
  world_color_r: 0.8,
  world_color_g: 0.1,
  world_color_b: 0.1,
  duration: 1.0,
});
tl.to(anims, {
  delta: 0.6,
  light_dir_x: 0.0,
  light_dir_y: 1.0,
  light_dir_z: -0.1,
  world_color_r: 0.8,
  world_color_g: 0.5,
  world_color_b: 0.5,
  duration: 1.0,
});
tl.to(anims, {
  delta: 1.0,
  light_dir_x: 0.0,
  light_dir_y: -1.0,
  light_dir_z: 0.0,
  world_color_r: 0.7,
  world_color_g: 0.6,
  world_color_b: 0.6,
  duration: 1.0,
});
