const diameter = 550;

// Initialize projection
const projection = d3.geoOrthographic()
    .fitSize([diameter, diameter], { type: "Sphere" })
    .rotate([-12.268690932434698, -42.670720869983306]);

// Create graticule
const graticule = d3.geoGraticule().step([30, 30]);

// Create drag behavior
function dragBehavior(projection) {
    let v0, q0, r0;
    
    function dragstarted() {
        v0 = versor.cartesian(projection.invert([d3.event.x, d3.event.y]));
        q0 = versor(r0 = projection.rotate());
    }
    
    function dragged() {
        const v1 = versor.cartesian(projection.rotate(r0).invert([d3.event.x, d3.event.y]));
        const q1 = versor.multiply(q0, versor.delta(v0, v1));
        projection.rotate(versor.rotation(q1));
        render();
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged);
}

// Initialize SVG
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter);

// Create radial gradient
const radialGradient = svg.append("defs")
    .append("radialGradient")
    .attr("cx", diameter * 0.48)
    .attr("cy", diameter * 0.35)
    .attr("r", diameter * 0.64)
    .attr("id", "grSea")
    .attr("gradientUnits", "userSpaceOnUse");

const gradientStops = [
    { offset: "0", opacity: 0 },
    { offset: "0.5", opacity: 0.006 },
    { offset: "0.56", opacity: 0.009 },
    { offset: "0.64", opacity: 0.017 },
    { offset: "0.7", opacity: 0.039 },
    { offset: "0.74", opacity: 0.055 },
    { offset: "1", opacity: 0.142 }
];

gradientStops.forEach(stop => {
    radialGradient.append("stop")
        .attr("offset", stop.offset)
        .style("stop-color", "#000000")
        .style("stop-opacity", stop.opacity);
});

// Create background circle
svg.append("circle")
    .attr("cx", diameter/2)
    .attr("cy", diameter/2)
    .attr("r", diameter/2)
    .attr("fill", "#C7E7FB")
    .attr("stroke", "none");

let path = d3.geoPath(projection);
let countriesPath, disputedPath, graticulePath;

// Load data and initialize visualization
Promise.all([
    fetch("https://unpkg.com/visionscarto-world-atlas@0.0.6/world/50m_countries.geojson").then(d => d.json()),
    fetch("./disputed-territories.geojson").then(d => d.json())
]).then(([countries, disputed]) => {
    countries.features.forEach(d => { d.selected = false });

    // Draw countries
    countriesPath = svg.append("g")
        .attr("id", "countries")
        .selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("id", d => d.properties.formal_en)
        .attr("d", path)
        .attr("stroke", "#656565")
        .attr("fill", d => d.selected ? "#C12838" : "#FDFBEA")
        .attr("stroke-width", 0.5)
        .on("click", function(d) {
            d.selected = !d.selected;
            
            countriesPath.attr("fill", d => d.selected ? "#C12838" : "#FDFBEA")
                .attr("stroke", d => d.selected ? "#C12838" : "#656565")
                .each(function(d) {
                    if(d.selected) {
                        d3.select(this).raise();
                    }
                });

            if (document.getElementById("showDisputed").checked) {
                const selected = d.properties.adm0_a3;
                disputedPath.attr("display", "none");
                disputedPath.filter(e => e.properties['disputed-territories_Claimants_ISO'].includes(selected))
                    .attr("display", null);
            }

            let newCentroid = d3.geoCentroid(d).map(v => -v);
            projection.rotate(newCentroid);
            render();
        })
        .on("mouseover", function() {
            d3.select(this).attr("stroke", d => d.selected ? "#C12838" : "#656565").raise();
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke", d => d.selected ? "#C12838" : "#656565");
        });

    // Draw disputed areas
    disputedPath = svg.append("g")
        .attr("id", "disputed-areas")
        .attr("stroke", "white")
        .selectAll("path")
        .data(disputed.features)
        .join("path")
        .attr("id", d => d.properties.geometry)
        .attr("d", path)
        .attr("fill", "#C12838AA")
        .attr("stroke-width", 0.5)
        .attr("display", "none");

    // Draw graticule
    graticulePath = svg.append("path")
        .datum(graticule)
        .attr("id", "graticule")
        .attr("stroke", "#656565")
        .attr("opacity", 0.8)
        .attr("stroke-width", 0.3)
        .attr("fill", "none")
        .attr("d", path)
        .attr("pointer-events", "none");

    // Add shaded circle and outer line
    svg.append("circle")
        .attr("cx", diameter/2)
        .attr("cy", diameter/2)
        .attr("r", diameter/2)
        .attr("fill", "url(#grSea)")
        .attr("stroke", "none")
        .attr("pointer-events", "none");

    // Initialize drag behavior
    svg.call(dragBehavior(projection));
});

function render() {
    path = d3.geoPath(projection);
    graticulePath.attr("d", path);
    countriesPath.attr("d", path);
    disputedPath.attr("d", path);
}

// Handle disputed territories checkbox
document.getElementById("showDisputed").addEventListener("change", function() {
    if (!this.checked) {
        disputedPath.attr("display", "none");
    }
});