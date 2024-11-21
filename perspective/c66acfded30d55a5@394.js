// https://observablehq.com/@jjhembd/tilting-the-satellite@394
function _1(md){return(
md`# Tilting the Satellite`
)}

function _2(md){return(
md`Mike Bostock's [Satellite Explorer](https://observablehq.com/@d3/satellite-explorer) provides a fun way to play with the raw parameters of the [General Perspective Projection](https://en.wikipedia.org/wiki/General_Perspective_projection), which can be used to construct a projection of the Earth similar to what would be captured by a photo from a satellite. However, varying the tilt angle in that notebook can result in some surprising effects. This is because the projection's parameters do not directly relate to the physical parameters of a satellite camera.`
)}

function _3(md){return(
md`In this notebook, we start from the physical position of a satellite and the properties of its camera, and derive the relevant projection parameters. As in [The View from Space](https://observablehq.com/@jjhembd/the-view-from-space), we define the satellite's position by its longitude, latitude, and altitude. But this time, to account for the orientation of the camera, we add rotation and tilt parameters, along with the angular [field of view](https://en.wikipedia.org/wiki/Field_of_view) in the Y direction.`
)}

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


function _6(md){return(
md`Unlike the raw projection, this example behaves as expected for small altitudes and large tilt angles. When the satellite is close to the surface, and its camera is oriented near 90° from vertical, we see a flattish horizon near the center of the display--just like we would see out the window of an airplane.`
)}

function _7(md){return(
md`## Computing projection parameters`
)}

function _8(md){return(
md`The rotations of the projection can be directly obtained from the satellite's longitude and latitude and the camera's rotation. To obtain the projection's "distance", we must convert altitude to a proportional distance from the Earth's center:`
)}

function _snyderP(params,earthRadius){return(
1.0 + params.altitude / earthRadius
)}

function _10(md){return(
md`The projection's scale and translation require a little more thought. Consider the following picture, which is modified from Figure 35 in Snyder's [Map Projections, A Working Manual](https://pubs.usgs.gov/pp/1395/report.pdf):`
)}

function _11(html,width){return(
html`<img src="https://github.com/jjhembd/spinning-ball/raw/main/snyder_fig35_edit.png" style="width: ${width}px; max-width: 700px;">`
)}

function _12(md){return(
md`As the tilt angle increases, two things happen:
1. The projection plane moves closer to the camera
2. The center of the camera's view moves up the plane

Note that the origin of the projection's y-axis remains at the intersection with the sphere, even though the camera is no longer pointing at that location. The map y-coordinate of the camera's center of view will be given by`
)}

function _dY(params,degrees){return(
params.altitude * Math.sin(params.tilt / degrees)
)}

function _14(md){return(
md`The distance from the camera to the projection plane is`
)}

function _dZ(params,degrees){return(
params.altitude * Math.cos(params.tilt / degrees)
)}

function _16(md){return(
md`We now derive the projection's scale by computing the y-range visible within the camera's field of view. Since we are working with real altitudes in kilometers, we must also scale by the radius of the Earth, as discussed in [The View from Space](https://observablehq.com/@jjhembd/the-view-from-space).`
)}

function _visibleYextent(dZ,params,degrees){return(
2 * dZ * Math.tan(0.5 * params.fieldOfView / degrees)
)}

function _scale(earthRadius,numPixelsY,visibleYextent){return(
earthRadius * numPixelsY / visibleYextent
)}

function _19(md){return(
md`Finally, we compute the y-translation and construct our projection.`
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

function _22(md){return(
md`## Clipping out-of-range points`
)}

function _23(md){return(
md`Note that the projection is defined for all points on the globe, including:
- Points on the other side of the Earth (or beyond the horizon), and
- Points *behind* the camera! (for large tilt angles)

The math/geometry to remove these points could be pretty complicated... Thankfully Mike Bostock has already done it for us. We copy from [Satellite Explorer](https://observablehq.com/@d3/satellite-explorer), with the addition of one extra safety factor.`
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

function _28(md){return(
md`## Appendix`
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
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("viewof params")).define("viewof params", ["html"], _params);
  main.variable(observer("params")).define("params", ["Generators", "viewof params"], (G, _) => G.input(_));
  main.variable(observer("map")).define("map", ["DOM","width","numPixelsY","d3","projection","land","grid"], _map);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("snyderP")).define("snyderP", ["params","earthRadius"], _snyderP);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["html","width"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("dY")).define("dY", ["params","degrees"], _dY);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("dZ")).define("dZ", ["params","degrees"], _dZ);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("visibleYextent")).define("visibleYextent", ["dZ","params","degrees"], _visibleYextent);
  main.variable(observer("scale")).define("scale", ["earthRadius","numPixelsY","visibleYextent"], _scale);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer("yShift")).define("yShift", ["dY","numPixelsY","visibleYextent"], _yShift);
  main.variable(observer("projection")).define("projection", ["d3","scale","width","yShift","numPixelsY","params","snyderP","preclip"], _projection);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer("preclip")).define("preclip", ["params","degrees","snyderP","geoClipCircle","geoPipeline","geoRotatePhi"], _preclip);
  main.variable(observer("geoPipeline")).define("geoPipeline", _geoPipeline);
  main.variable(observer("geoClipCircle")).define("geoClipCircle", ["d3"], _geoClipCircle);
  main.variable(observer("geoRotatePhi")).define("geoRotatePhi", _geoRotatePhi);
  main.variable(observer()).define(["md"], _28);
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
