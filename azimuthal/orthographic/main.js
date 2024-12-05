const width = 960;
let height;
let projection;

const sphere = {type: "Sphere"};

// Initialize canvas and start rendering
function init() {
    // Set up canvas
    const canvas = document.getElementById('globe');
    canvas.width = width;
    const context = canvas.getContext('2d');
    
    // Set initial projection
    projection = d3.geoOrthographic().precision(0.1);
    
    // Calculate height and adjust projection
    const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, sphere)).bounds(sphere);
    height = Math.ceil(y1 - y0);
    const l = Math.min(Math.ceil(x1 - x0), height);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    canvas.height = height;

    const path = d3.geoPath(projection, context);

    function render(land) {
        context.clearRect(0, 0, width, height);
        context.beginPath(), path(sphere), context.fillStyle = "#fff", context.fill();
        context.beginPath(), path(land), context.fillStyle = "#000", context.fill();
        context.beginPath(), path(sphere), context.stroke();
    }

    // Load map data
    Promise.all([
        fetch('land-50m.json').then(resp => resp.json()),
        fetch('land-110m.json').then(resp => resp.json())
    ]).then(([world50, world110]) => {
        const land50 = topojson.feature(world50, world50.objects.land);
        const land110 = topojson.feature(world110, world110.objects.land);

        function drag(projection) {
            let v0, q0, r0, a0, l;

            function pointer(event, that) {
                const t = d3.pointers(event, that);

                if (t.length !== l) {
                    l = t.length;
                    if (l > 1) a0 = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
                    dragstarted.apply(that, [event, that]);
                }

                // For multitouch, average positions and compute rotation.
                if (l > 1) {
                    const x = d3.mean(t, p => p[0]);
                    const y = d3.mean(t, p => p[1]);
                    const a = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
                    return [x, y, a];
                }

                return t[0];
            }

            function dragstarted({x, y}) {
                v0 = versor.cartesian(projection.invert([x, y]));
                q0 = versor(r0 = projection.rotate());
            }

            function dragged(event) {
                const v1 = versor.cartesian(projection.rotate(r0).invert([event.x, event.y]));
                const delta = versor.delta(v0, v1);
                let q1 = versor.multiply(q0, delta);

                // For multitouch, compose with a rotation around the axis.
                const p = pointer(event, this);
                if (p[2]) {
                    const d = (p[2] - a0) / 2;
                    const s = -Math.sin(d);
                    const c = Math.sign(Math.cos(d));
                    q1 = versor.multiply([Math.sqrt(1 - s * s), 0, 0, c * s], q1);
                }

                projection.rotate(versor.rotation(q1));

                // In vicinity of the antipode (unstable) of q0, restart.
                if (delta[0] < 0.7) dragstarted.apply(this, [event, this]);
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged);
        }

        // Set up drag behavior
        d3.select(canvas)
            .call(drag(projection)
                .on("drag.render", () => render(land110))
                .on("end.render", () => render(land50)))
            .call(() => render(land50));

        // Set up projection selector
        document.getElementById('projection-select').addEventListener('change', (e) => {
            switch(e.target.value) {
                case 'orthographic':
                    projection = d3.geoOrthographic().precision(0.1);
                    break;
                case 'mercator':
                    projection = d3.geoMercator().precision(0.1);
                    break;
                case 'equalEarth':
                    projection = d3.geoEqualEarth().precision(0.1);
                    break;
            }
            const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, sphere)).bounds(sphere);
            height = Math.ceil(y1 - y0);
            const l = Math.min(Math.ceil(x1 - x0), height);
            projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
            canvas.height = height;
            path = d3.geoPath(projection, context);
            render(land50);
        });
    });
}

init();