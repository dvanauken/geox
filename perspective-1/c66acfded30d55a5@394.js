// https://observablehq.com/@jjhembd/tilting-the-satellite@394

function _params(html)
{
  const form = html`<form style="font: 16px var(--sans-serif);">
  <div style="display: inline-block; border: 1px solid black; padding: 8px; margin: 5px 5px 0 5px; width: 345px;">
    <h3>Satellite Position</h3>
    <label style="display: block;">
      <input name=a type=range min=-180 max=180 value=-85 step=any style="width:180px;">
      Longitude = <output name=oa></output>
    </label>
    <label style="display: block;">
      <input name=b type=range min=-90 max=90 value=18 step=any style="width:180px;">
      Latitude = <output name=ob></output>
    </label>
    <label style="display: block;">
      <input name=c type=range min=3 max=15 value=10 step=0.1 style="width:180px;">
      Altitude = <output name=oc></output>
    </label>
  </div>
  <div style="display: inline-block; border: 1px solid black; padding: 8px; margin: 5px 5px 0 5px; width: 345px;">
    <h3>Camera Properties</h3>
    <label style="display: block;">
      <input name=d type=range min=-180 max=180 value=15 step=2 style="width:180px;">
      Rotation = <output name=od></output>
    </label>
    <label style="display: block;">
      <input name=e type=range min=0 max=89 value=45 step=1 style="width:180px;">
      Tilt = <output name=oe></output>
    </label>
    <label style="display: block;">
      <input name=f type=range min=1 max=175 value=30 step=1 style="width:180px;">
      Field of View = <output name=of></output>
    </label>
  </div>
</form>`;
  form.value = {
    longitude: 0,
    latitude: 0,
    altitude: 11000,
    rotation: 0,
    tilt: 0,
    fieldOfView: 25
  };
  form.oninput = () => {
    form.oa.value = `${(form.value.longitude = form.a.valueAsNumber).toFixed(
      2
    )}°`;
    form.ob.value = `${(form.value.latitude = form.b.valueAsNumber).toFixed(
      2
    )}°`;
    form.oc.value = `${(form.value.altitude = Math.pow(
      2,
      form.c.valueAsNumber
    )).toFixed(0)} km`;
    form.od.value = `${(form.value.rotation = form.d.valueAsNumber).toFixed(
      0
    )}°`;
    form.oe.value = `${(form.value.tilt = form.e.valueAsNumber).toFixed(0)}°`;
    form.of.value = `${(form.value.fieldOfView = form.f.valueAsNumber).toFixed(
      0
    )}°`;
  };
  form.oninput();
  return form;
}


function _map(DOM,width,numPixelsY,d3,projection,land,grid)
{
  const context = DOM.context2d(width, numPixelsY);
  const path = d3.geoPath(projection, context);
  context.fillStyle = "#88d";
  context.beginPath(), path(land), context.fill();
  //context.beginPath(), path(grid.minor), context.strokeStyle = "#aaa", context.globalAlpha = 0.4, context.stroke();
  context.beginPath(),
    path(grid.major),
    (context.strokeStyle = "#ddf"),
    (context.globalAlpha = 0.8),
    context.stroke();
  context.beginPath(),
    path(grid.horizon),
    (context.strokeStyle = "#000"),
    context.stroke();
  return context.canvas;
}


function _snyderP(params,earthRadius){return(
1.0 + params.altitude / earthRadius
)}


function _11(html,width){return(
html``
)}


function _dY(params,degrees){return(
params.altitude * Math.sin(params.tilt / degrees)
)}

function _dZ(params,degrees){return(
params.altitude * Math.cos(params.tilt / degrees)
)}

function _16(md){return(
md``
)}

function _visibleYextent(dZ,params,degrees){return(
2 * dZ * Math.tan(0.5 * params.fieldOfView / degrees)
)}

function _scale(earthRadius,numPixelsY,visibleYextent){return(
earthRadius * numPixelsY / visibleYextent
)}

function _yShift(dY,numPixelsY,visibleYextent){return(
dY * numPixelsY / visibleYextent
)}

function _projection(d3,scale,width,yShift,numPixelsY,params,snyderP,preclip){return(
d3.geoSatellite()
    .scale(scale)
    .translate([width / 2, yShift + numPixelsY / 2])
    .rotate([-params.longitude, -params.latitude, params.rotation])
    .tilt(params.tilt)
    .distance(snyderP)
    .preclip(preclip)
    .precision(0.1)
)}

function _preclip(params,degrees,snyderP,geoClipCircle,geoPipeline,geoRotatePhi)
{
  const tilt = params.tilt / degrees;
  const alpha = Math.acos(snyderP * Math.cos(tilt) * 0.999);
  const clipDistance = geoClipCircle(Math.acos(1 / snyderP) - 1e-6);
  return alpha ? geoPipeline(
    clipDistance,
    geoRotatePhi(Math.PI + tilt),
    geoClipCircle(Math.PI - alpha - 1e-4), // Extra safety factor needed for large tilt values
    geoRotatePhi(-Math.PI - tilt)
  ) : clipDistance;
}


function _geoPipeline(){return(
function geoPipeline(...transforms) {  // Move to Appendix?
  return sink => {
    for (let i = transforms.length - 1; i >= 0; --i) {
      sink = transforms[i](sink);
    }
    return sink;
  };
}
)}

function _geoClipCircle(d3){return(
d3.geoClipCircle
)}

function _geoRotatePhi(){return(
function geoRotatePhi(deltaPhi) {
  const cosDeltaPhi = Math.cos(deltaPhi);
  const sinDeltaPhi = Math.sin(deltaPhi);
  return sink => ({
    point(lambda, phi) {
      const cosPhi = Math.cos(phi);
      const x = Math.cos(lambda) * cosPhi;
      const y = Math.sin(lambda) * cosPhi;
      const z = Math.sin(phi);
      const k = z * cosDeltaPhi + x * sinDeltaPhi;
      sink.point(Math.atan2(y, x * cosDeltaPhi - z * sinDeltaPhi), Math.asin(k));
    },
    lineStart() { sink.lineStart(); },
    lineEnd() { sink.lineEnd(); },
    polygonStart() { sink.polygonStart(); },
    polygonEnd() { sink.polygonEnd(); },
    sphere() { sink.sphere(); }
  });
}
)}

function _earthRadius(){return(
6371
)}

function _numPixelsY(width){return(
width * 0.6
)}

function _degrees(){return(
180 / Math.PI
)}

function _grid(d3){return(
{
  major: d3.geoGraticule().step([15,15])(),
  minor: d3.geoGraticule().step([5,5])(),
  horizon: ({type: "Sphere"})
}
)}

function _land(Generators,land110,land50){return(
Generators.observe(notify => {
  const mousedown = event => { event.target.form && notify(land110); };
  const mouseup = event => { event.target.form && notify(land50); };
  notify(land50);
  window.addEventListener("mousedown", mousedown);
  window.addEventListener("mouseup", mouseup);
  return () => {
    window.removeEventListener("mousedown", mousedown);
    window.removeEventListener("mouseup", mouseup);
  };
})
)}

function _land50(topojson){return(
fetch("https://cdn.jsdelivr.net/npm/world-atlas@1/world/50m.json")
  .then(response => response.json())
  .then(world => topojson.feature(world, world.objects.land))
)}

function _land110(topojson){return(
fetch("https://cdn.jsdelivr.net/npm/world-atlas@1/world/110m.json")
  .then(response => response.json())
  .then(world => topojson.feature(world, world.objects.land))
)}

function _topojson(require){return(
require("topojson-client@3")
)}

function _d3(require){return(
require("d3-geo@1", "d3-geo-projection@2")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("viewof params")).define("viewof params", ["html"], _params);
  main.variable(observer("params")).define("params", ["Generators", "viewof params"], (G, _) => G.input(_));
  main.variable(observer("map")).define("map", ["DOM","width","numPixelsY","d3","projection","land","grid"], _map);
  main.variable(observer("snyderP")).define("snyderP", ["params","earthRadius"], _snyderP);
  main.variable(observer()).define(["html","width"], _11);
  main.variable(observer("dY")).define("dY", ["params","degrees"], _dY);
  main.variable(observer("dZ")).define("dZ", ["params","degrees"], _dZ);
  main.variable(observer("visibleYextent")).define("visibleYextent", ["dZ","params","degrees"], _visibleYextent);
  main.variable(observer("scale")).define("scale", ["earthRadius","numPixelsY","visibleYextent"], _scale);
  main.variable(observer("yShift")).define("yShift", ["dY","numPixelsY","visibleYextent"], _yShift);
  main.variable(observer("projection")).define("projection", ["d3","scale","width","yShift","numPixelsY","params","snyderP","preclip"], _projection);
  main.variable(observer("preclip")).define("preclip", ["params","degrees","snyderP","geoClipCircle","geoPipeline","geoRotatePhi"], _preclip);
  main.variable(observer("geoPipeline")).define("geoPipeline", _geoPipeline);
  main.variable(observer("geoClipCircle")).define("geoClipCircle", ["d3"], _geoClipCircle);
  main.variable(observer("geoRotatePhi")).define("geoRotatePhi", _geoRotatePhi);
  main.variable(observer("earthRadius")).define("earthRadius", _earthRadius);
  main.variable(observer("numPixelsY")).define("numPixelsY", ["width"], _numPixelsY);
  main.variable(observer("degrees")).define("degrees", _degrees);
  main.variable(observer("grid")).define("grid", ["d3"], _grid);
  main.variable(observer("land")).define("land", ["Generators","land110","land50"], _land);
  main.variable(observer("land50")).define("land50", ["topojson"], _land50);
  main.variable(observer("land110")).define("land110", ["topojson"], _land110);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
