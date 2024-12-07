const width = 300;
const height = 300;

// Create dispatch for synchronization
const dispatch = d3.dispatch("zoom");

// Initialize projections
const projections = [
    { fn: d3.geoOrthographic(), name: "orthographic" },
    { fn: d3.geoGnomonic(), name: "gnomonic" },
    { fn: d3.geoTransverseMercator(), name: "transverse mercator" },
    { fn: d3.geoEquirectangular().clipAngle(90), name: "equirectangular (½)" },
    { fn: d3.geoStereographic(), name: "stereographic" },
    { fn: d3.geoAzimuthalEquidistant(), name: "azimuthal equidistant" }
];

function zoom(projection, {
    scale = projection._scale === undefined
        ? (projection._scale = projection.scale())
        : projection._scale,
    scaleExtent = [0.8, 8]
} = {}) {
    let v0, q0, r0, a0, tl;

    const zoom = d3.zoom()
        .scaleExtent(scaleExtent.map(x => x * scale))
        .on("start", zoomstarted)
        .on("zoom", zoomed);

    function point(event, that) {
        const t = d3.pointers(event, that);

        if (t.length !== tl) {
            tl = t.length;
            if (tl > 1) a0 = Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0]);
            zoomstarted.call(that, event);
        }

        return tl > 1
            ? [
                d3.mean(t, p => p[0]),
                d3.mean(t, p => p[1]),
                Math.atan2(t[1][1] - t[0][1], t[1][0] - t[0][0])
            ]
            : t[0];
    }

    function zoomstarted(event) {
        v0 = versor.cartesian(projection.invert(point(event, this)));
        q0 = versor((r0 = projection.rotate()));
    }

    function zoomed(event) {
        projection.scale(event.transform.k);
        const pt = point(event, this);
        const v1 = versor.cartesian(projection.rotate(r0).invert(pt));
        const delta = versor.delta(v0, v1);
        let q1 = versor.multiply(q0, delta);

        if (pt[2]) {
            const d = (pt[2] - a0) / 2;
            const s = -Math.sin(d);
            const c = Math.sign(Math.cos(d));
            q1 = versor.multiply([Math.sqrt(1 - s * s), 0, 0, c * s], q1);
        }

        projection.rotate(versor.rotation(q1));

        if (delta[0] < 0.7) zoomstarted.call(this, event);
    }

    return Object.assign(selection => selection
        .property("__zoom", d3.zoomIdentity.scale(projection.scale()))
        .call(zoom), {
        on(type, ...options) {
            return options.length
                ? (zoom.on(type, ...options), this)
                : zoom.on(type);
        }
    });
}

function createGlobe(projection, title) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.classList.add('globe');
    
    const context = canvas.getContext('2d');
    const path = d3.geoPath()
        .projection(projection
            .precision(0.1)
            .fitSize([width - 4, height - 4], { type: "Sphere" }))
        .context(context);

    projection.translate(projection.translate().map(d => d + 2));

    function drawText(text) {
        context.save();
        context.translate(4, 14);
        context.font = "bold 9pt sans-serif";
        context.shadowBlur = 3;
        context.strokeStyle = context.shadowColor = "white";
        context.shadowOffset = 0;
        context.strokeText(text, 0, 0);
        context.fillText(text, 0, 0);
        context.restore();
    }

    function draw() {
        context.clearRect(0, 0, width, height);
        context.beginPath();
        path(d3.geoGraticule10());
        context.lineWidth = 0.25;
        context.stroke();
        context.beginPath();
        path(land);
        context.fill();
        context.beginPath();
        path({ type: "Sphere" });
        context.lineWidth = 1.5;
        context.stroke();
        drawText(title);
    }

    const id = Math.random();
    const s0 = projection.scale();
    let willdraw = 0;

    dispatch.on("zoom." + id, async function(r, z) {
        projection.rotate(r).scale((d3.zoomTransform(canvas).k = z * s0));

        if (this == canvas) draw();
        else if (!willdraw++) {
            await new Promise(r => setTimeout(r, 5));
            willdraw = 0;
            draw();
        }
    });

    const zoomBehavior = zoom(projection);
    zoomBehavior.on("zoom.render", function() {
        dispatch.call("zoom", this, projection.rotate(), projection.scale() / s0);
    });

    d3.select(canvas)
        .call(zoomBehavior)
        .on("pointerenter pointerdown pointerup", function(event) {
            this.style.cursor = event.type === "pointerdown" ? "grabbing" : "grab";
        });

    Promise.resolve().then(() => 
        dispatch.call("zoom", canvas, projection.rotate(), 1)
    );

    return canvas;
}

let land;

// Load data and initialize globes
fetch("https://unpkg.com/visionscarto-world-atlas@0.0.6/world/110m.json")
    .then(response => response.json())
    .then(world => {
        const simpler = topojson.simplify(topojson.presimplify(world), 0.5);
        land = topojson.feature(simpler, simpler.objects.land);
        
        const container = document.getElementById('globes-container');
        projections.forEach(({fn, name}) => {
            container.appendChild(createGlobe(fn, name));
        });
    });

// Reset button handler
document.getElementById('reset').addEventListener('click', () => {
    dispatch.call("zoom", null, [0, 0, 0], 1);
});

// Update parameters display
dispatch.on("zoom.parameters", (r, z) => {
    document.getElementById('parameters').textContent = 
        `Scale: ${z.toFixed(2)} | Rotation: ${r.map(d => d.toFixed(2)).join("° / ")}°`;
});