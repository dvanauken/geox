// https://observablehq.com/@d3/interrupted-sinusoidal@170
import define1 from "./cd89ef62a7430a3c@66.js";

function _1(md){return(
md`# Interrupted Sinusoidal

This interrupted [sinusoidal projection](/@d3/sinusoidal) uses asymmetrical lobe boundaries to emphasize land masses over oceans, after the Swedish *Nordisk Världs Atlas* as reproduced by C.A. Furuti.`
)}

function _projection(d3){return(
d3.geoInterruptedSinusoidal()
)}

function _3(map){return(
map
)}

function _5(md){return(
md`Here’s an alternative form with the lobes explicitly specified as by [Goode](/@d3/interrupted-goode-homolosine).`
)}

function _projection2(d3){return(
d3.geoInterrupt(
  d3.geoSinusoidalRaw,
  [[ // northern hemisphere
    [[-180,   0], [-100,  90], [ -40,   0]],
    [[ -40,   0], [  30,  90], [ 180,   0]]
  ], [ // southern hemisphere
    [[-180,   0], [-160, -90], [-100,   0]],
    [[-100,   0], [ -60, -90], [ -20,   0]],
    [[ -20,   0], [  20, -90], [  80,   0]],
    [[  80,   0], [ 140, -90], [ 180,   0]]
  ]]
)
)}

function _7(map2){return(
map2
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("projection")).define("projection", ["d3"], _projection);
  main.variable(observer()).define(["map"], _3);
  const child1 = runtime.module(define1).derive(["projection"], main);
  main.import("d3", child1);
  main.import("map", child1);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("projection2")).define("projection2", ["d3"], _projection2);
  main.variable(observer()).define(["map2"], _7);
  const child2 = runtime.module(define1).derive([{name: "projection2", alias: "projection"}], main);
  main.import("map", "map2", child2);
  return main;
}
