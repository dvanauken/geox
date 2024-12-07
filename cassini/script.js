const width = 928;
const projection = d3.geoEquirectangular()
    .rotate([0, 0, 90])
    .angle(-90);

const outline = { type: "Sphere" };
const graticule = d3.geoGraticule10();

// Setup canvas
const canvas = document.getElementById('map');
const context = canvas.getContext('2d');

// Calculate height and set canvas dimensions
function calculateHeight() {
    const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
    const dy = Math.ceil(y1 - y0);
    const l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    return dy;
}

const height = calculateHeight();
canvas.width = width;
canvas.height = height;

// Load map data and render
fetch('../assets/land-50m.json')
    .then(response => response.json())
    .then(world => {
        const land = topojson.feature(world, world.objects.land);
        const path = d3.geoPath(projection, context);

        // Draw map
        context.save();
        context.beginPath();
        path(outline);
        context.clip();
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, height);
        
        context.beginPath();
        path(graticule);
        context.strokeStyle = "#ccc";
        context.stroke();
        
        context.beginPath();
        path(land);
        context.fillStyle = "#000";
        context.fill();
        
        context.restore();
        context.beginPath();
        path(outline);
        context.strokeStyle = "#000";
        context.stroke();
    })
    .catch(error => console.error('Error loading the map data:', error));