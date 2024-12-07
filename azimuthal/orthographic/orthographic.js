// Setting up the canvas
const canvas = document.createElement('canvas');
const width = 800; // Set desired width
const height = 600; // Set desired height
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);
const context = canvas.getContext('2d');

// Define sphere
const sphere = { type: "Sphere" };

// Define the projection
const projection = d3.geoOrthographic().precision(0.1).scale(300).translate([width / 2, height / 2]);
const path = d3.geoPath(projection, context);

// Load land data (using the provided land JSON files)
let land50, land110;
fetch('../../assets/land-50m.json')
  .then(response => response.json())
  .then(world => {
    land50 = topojson.feature(world, world.objects.land);
    render(land50);
  });
fetch('../../assets/land-110m.json')
  .then(response => response.json())
  .then(world => {
    land110 = topojson.feature(world, world.objects.land);
  });

// Render function
function render(land) {
  context.clearRect(0, 0, width, height);
  context.beginPath();
  path(sphere);
  context.fillStyle = "#fff";
  context.fill();
  context.beginPath();
  path(land);
  context.fillStyle = "#000";
  context.fill();
  context.beginPath();
  path(sphere);
  context.stroke();
}

// Versor setup (similar to using versor.js in D3)
let v0, q0, r0, a0, l;
function cartesian(coords) {
  const [λ, φ] = coords.map(d => d * Math.PI / 180);
  return [Math.cos(φ) * Math.cos(λ), Math.cos(φ) * Math.sin(λ), Math.sin(φ)];
}
function multiply(a, b) {
  return [
    a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
    a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
    a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
    a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]
  ];
}

// Drag logic
canvas.addEventListener('mousedown', event => {
  const [x, y] = [event.offsetX, event.offsetY];
  v0 = cartesian(projection.invert([x, y]));
  q0 = versor(r0 = projection.rotate());

  function pointermove(event) {
    const [x, y] = [event.offsetX, event.offsetY];
    const v1 = cartesian(projection.rotate(r0).invert([x, y]));
    const delta = versor.delta(v0, v1);
    let q1 = multiply(q0, delta);
    projection.rotate(versor.rotation(q1));
    render(land110 || land50);
  }

  function pointerup() {
    canvas.removeEventListener('mousemove', pointermove);
    canvas.removeEventListener('mouseup', pointerup);
  }

  canvas.addEventListener('mousemove', pointermove);
  canvas.addEventListener('mouseup', pointerup);
});
