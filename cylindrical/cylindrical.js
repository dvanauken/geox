document.addEventListener("DOMContentLoaded", function() {
    const width = 960, height = 500;
    const sphere = {type: "Sphere"};
    const graticule = d3.geoGraticule().step([30, 30]);

    const canvas = d3.select("body").append("canvas")
        .attr("width", width)
        .attr("height", height)
        .node();
    const context = canvas.getContext("2d");

    const ProjectionTypes = {
        CYLINDRICAL_EQUAL_AREA: 'Cylindrical Equal Area',
        CYLINDRICAL_STEREOGRAPHIC: 'Cylindrical Stereographic',
        ECKERT_I: 'Eckert I',
        ECKERT_II: 'Eckert II',
        ECKERT_III: 'Eckert III',
        ECKERT_IV: 'Eckert IV',
        ECKERT_V: 'Eckert V',
        ECKERT_VI: 'Eckert VI',
        FAHEY: 'Fahey',
        GALL_PETERS: 'Gall-Peters',
        HOBO_DYER: 'Hobo-Dyer',
        KAVRAYSKIY_VII: 'Kavrayskiy VII',
        LAMBERT_CYLINDRICAL_EQUAL_AREA: 'Lambert Cylindrical Equal-Area',
        MERCATOR: 'Mercator',
        MILLER: 'Miller',
        NATURAL_EARTH: 'Natural Earth',
        PATTERSON: 'Patterson',
        TOBLER_MERCATOR: 'Tobler Mercator',
        TRANSVERSE_MERCATOR: 'Transverse Mercator',
        WAGNER_VI: 'Wagner VI'
    };

    const projections = {
        'Mercator': () => d3.geoMercator(),
        'Transverse Mercator': () => d3.geoTransverseMercator(),
        'Miller': () => d3.geoMiller(),
        'Cylindrical Equal Area': () => d3.geoCylindricalEqualArea(),
        'Cylindrical Stereographic': () => d3.geoCylindricalStereographic(),
        'Eckert I': () => d3.geoEckert1(),
        'Eckert II': () => d3.geoEckert2(),
        'Eckert III': () => d3.geoEckert3(),
        'Eckert IV': () => d3.geoEckert4(),
        'Eckert V': () => d3.geoEckert5(),
        'Eckert VI': () => d3.geoEckert6(),
        'Fahey': () => d3.geoFahey(),
        'Gall-Peters': () => d3.geoCylindricalEqualArea(),
        'Hobo-Dyer': () => d3.geoCylindricalEqualArea(),
        'Kavrayskiy VII': () => d3.geoKavrayskiy7(),
        'Lambert Cylindrical Equal-Area': () => d3.geoCylindricalEqualArea(),
        'Patterson': () => d3.geoPatterson(),
        'Tobler Mercator': () => d3.geoToblerMercator(),
        'Natural Earth': () => d3.geoNaturalEarth1(),
        'Wagner VI': () => d3.geoWagner6()
    };

    let currentProjection = 'Mercator';
    let projection = projections[currentProjection]().scale(150).translate([width / 2, height / 2]);
    let path = d3.geoPath(projection, context);

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
        context.beginPath();
        path(graticule());
        context.lineWidth = 0.5;
        context.strokeStyle = "#ccc";
        context.stroke();
    }

    const dragBehavior = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", function() { render(land50); });

    d3.select(canvas).call(dragBehavior);

    function dragstarted(event) {
        const p = d3.pointer(event, this);
        const coords = projection.invert(p);
        this.v0 = versor.cartesian(coords);
        this.q0 = versor(this.r0 = projection.rotate());
    }

    function dragged(event) {
        const p = d3.pointer(event, this);
        const coords = projection.invert(p);
        const v1 = versor.cartesian(projection.rotate(this.r0).invert(p));
        const q1 = versor.multiply(this.q0, versor.delta(this.v0, v1));
        projection.rotate(versor.rotation(q1));
        render(land110);
    }

    d3.select('#projection-select').on('change', function() {
        currentProjection = this.value;
        projection = projections[currentProjection] ? projections[currentProjection]().scale(150).translate([width / 2, height / 2]) : projection;
        path = d3.geoPath(projection, context);
        render(land50);
    });
});
