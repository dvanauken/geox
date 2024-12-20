document.addEventListener("DOMContentLoaded", function() {
    const width = 960, height = 500;
    const sphere = {type: "Sphere"};

    const canvas = d3.select("body").append("canvas")
        .attr("width", width)
        .attr("height", height)
        .node();
    const context = canvas.getContext("2d");
    
    const projection = d3.geoMercator().scale(150).translate([width / 2, height / 2]);
    const path = d3.geoPath(projection, context);

    let land50, land110;
    fetch("./land-50m.json")
        .then(response => response.json())
        .then(json => {
            land50 = topojson.feature(json, json.objects.land);
            render(land50); // Initial render with high detail for static display.
        });

    fetch("./land-110m.json")
        .then(response => response.json())
        .then(json => {
            land110 = topojson.feature(json, json.objects.land);
        });

    function render(land) {
        context.clearRect(0, 0, width, height);
        context.beginPath();
        path(sphere);
        context.fillStyle = "#fff";
        context.fill();
        context.beginPath();
        path(land);
        context.fillStyle = "#bbb";
        context.fill();
        context.strokeStyle = "#fff";
        context.stroke();
    }

    const overlay = setupDebugOverlay();

    let v0, q0, r0;
    const drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", () => render(land50)); // After dragging, render with high detail.

    d3.select(canvas).call(drag);

    function dragstarted(event) {
        const p = d3.pointer(event, this);
        const coords = projection.invert(p);
        v0 = versor.cartesian(coords);
        q0 = versor(r0 = projection.rotate());
        updateDebugOverlay(p, r0);
    }

    function dragged(event) {
        const p = d3.pointer(event, this);
        const coords = projection.invert(p);
        const v1 = versor.cartesian(projection.rotate(r0).invert(p));
        const q1 = versor.multiply(q0, versor.delta(v0, v1));
        projection.rotate(versor.rotation(q1));
        render(land110); // Continue using lower detail during dragging.
        updateDebugOverlay(p, projection.rotate());
    }

    function setupDebugOverlay() {
        const overlay = d3.select("body").append("div")
            .attr("id", "debug-overlay")
            .style("position", "fixed")
            .style("top", "10px")
            .style("left", "10px")
            .style("background", "rgba(255, 255, 255, 0.8)")
            .style("padding", "5px")
            .style("border", "1px solid #ccc")
            .style("border-radius", "5px")
            .style("pointer-events", "none");
        return overlay;
    }

    function updateDebugOverlay(point, rotation) {
        const coords = projection.invert(point);
        if (coords) {
            const overlay = d3.select("#debug-overlay");
            overlay.html(`Longitude: ${coords[0].toFixed(2)}, Latitude: ${coords[1].toFixed(2)}<br>Rotation: ${rotation}`);
        }
    }
});
