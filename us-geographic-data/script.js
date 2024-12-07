const w = 975;
const h = 610;
const delay = 250;
const maxRadius = 50;
const legendRadii = [10, 1000, 10000, 50000];

// Initialize projection
const albersProjection = d3.geoAlbersUsa().scale(130000000);

const svg = d3.create("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "#f8f9fa")  // Light background to see the boundaries
    .style("display", "block");  // Ensure proper display

// Modify the projection setup
const projection = d3.geoAlbersUsa()
    .scale(1200)
    .translate([w/2, h/2]);  // Center the map

// Update path generator to use projection
const path = d3.geoPath()
    .projection(projection);

// Format numbers
const numFormat = d3.format("~s");

// Create legend group (but don't populate it yet)
const legend = svg.append("g")
    .attr("class", "legend")
    .attr("fill", "#777")
    .attr("transform", `translate(${[w - 270, 90]})`);

legend.append("text")
    .attr("class", "legend-title")
    .text("No. confirmed cases")
    .attr("dx", 5)
    .attr("dy", -(maxRadius/2 * 2 + 10));

// // Load map data
// Promise.all([
//     d3.json("https://unpkg.com/us-atlas@3/counties-10m.json"),
//     d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv")

Promise.all([
    d3.json("https://unpkg.com/us-atlas@3/counties-10m.json"),
    d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv"),
    //d3.csv("https://gist.githubusercontent.com/mbostock/7608400/raw/e5974d9bba45bc9ab272d98dd7427567373ef0e3/largest-cities.csv")
    d3.csv("us-places.csv")  // NYTimes places
]).then(([us, covidData, places]) => {
    console.log("Initial data:", { us: !!us, covidData: covidData?.length });

    if (!us || !covidData) {
        throw new Error("Failed to load required data files");
    }

    // Process topology
    const nation = topojson.feature(us, us.objects.nation);
    const states = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
    const counties = topojson.feature(us, us.objects.counties);

    console.log("Processed topology:", {
        nationFeatures: nation.features?.length,
        counties: counties.features?.length
    });

    // Create maps for lookups
    const countyMap = new Map(counties.features.map(d => [d.id, d]));
    const stateMap = new Map(us.objects.states.geometries.map(d => [d.properties.name, d]));

    console.log("Maps created:", {
        countyMapSize: countyMap.size,
        stateMapSize: stateMap.size
    });

    // Process COVID data
    covidData = covidData
        .map(d => ({
            date: d.date,
            county: d.county,
            state: d.state,
            fips: d.fips ? d.fips.padStart(5, '0') : null,
            cases: +d.cases || 0,
            deaths: +d.deaths || 0
        }))
        .filter(d => d.fips && d.cases > 0);

    // Get unique dates and sort them
    const dates = [...new Set(covidData.map(d => d.date))].sort();
    const dataByDay = d3.nest()
        .key(d => d.date)
        .map(covidData);

    console.log("Processed COVID data:", {
        totalRecords: covidData.length,
        sampleRecord: covidData[0]
    });

    // Setup scales
    const maxCases = d3.max(covidData, d => d.cases);
    console.log("Max cases:", maxCases);

    const radius = d3.scaleSqrt()
        .domain([0, maxCases])
        .range([0, maxRadius]);

    const colorScale = d3.scaleSequential()
        .domain([0, maxCases])
        .interpolator(d3.interpolateReds);

    // Draw base map
    svg.append("path")
        .datum(nation)
        .attr("fill", "#f4f4f4")
        .attr("stroke", "#999")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d", path);

    svg.append("path")
        .datum(states)
        .attr("fill", "none")
        .attr("stroke", "#999")
        .attr("stroke-width", 0.5)
        .attr("stroke-linejoin", "round")
        .attr("d", path);

    // Add legend bubbles
    const legendBubbles = legend
        .selectAll("g")
        .data(legendRadii)
        .join("g");

    let margin = 0;
    legendBubbles
        .attr("transform", (d, i) => {
            margin += i === 0 ? 0 : radius(legendBubbles.data()[i - 1]) * 2 + 18;
            return `translate(${margin + radius(d)}, 0)`;
        })
        .append("circle")
        .attr("class", "legend-bubble")
        .attr("fill", d => colorScale(d))
        .attr("cy", d => -radius(d))
        .attr("r", d => radius(d));

    legendBubbles
        .append("text")
        .attr("dy", "1.3em")
        .text(numFormat);

    // Add bubbles for cases
    const bubbles = svg.selectAll(".bubble")
        .data(covidData.filter(d => d.date === dates[0] && d.fips), d => d.fips)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("transform", d => {
            const location = getLocation(d, countyMap, stateMap);
            if (!location) return null;
            const centroid = path.centroid(location);
            return centroid ? `translate(${centroid})` : null;
        })
        .attr("fill-opacity", 0.7)
        .attr("fill", d => colorScale(0))
        .attr("r", d => radius(0));

    bubbles.append("title");

    // Add to map container
    document.getElementById('map-container').appendChild(svg.node());

    // Setup slider
    const slider = document.getElementById('day-slider');
    const dateDisplay = document.getElementById('date-display');
    slider.max = dates.length - 1;

    function updateMap(dateIndex) {
        const currentDate = dates[dateIndex];
        const currentData = dataByDay.get(currentDate) || [];

        dateDisplay.textContent = new Date(currentDate).toLocaleDateString();

        const t = d3.transition()
            .duration(delay)
            .ease(d3.easeLinear);

        bubbles
            .data(currentData.filter(d => d.fips), d => d.fips)
            .transition(t)
            .attr("fill", d => colorScale(+d.cases))
            .attr("r", d => radius(+d.cases))
            .select("title")
            .text(d => {
                const name = getPlaceName(d, countyMap, stateMap);
                return name ? `${name}: ${numFormat(+d.cases)} cases` : '';
            });
    }

    // Setup animation controls
    let animationFrame;
    const playButton = document.getElementById('play-button');

    function startAnimation() {
        playButton.textContent = 'Pause';
        animationFrame = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        playButton.textContent = 'Play';
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    }

    function animate() {
        if (slider.value < slider.max) {
            slider.value++;
            updateMap(+slider.value);
            animationFrame = requestAnimationFrame(animate);
        } else {
            stopAnimation();
        }
    }

    playButton.addEventListener('click', () => {
        if (playButton.textContent === 'Play') {
            startAnimation();
        } else {
            stopAnimation();
        }
    });

    slider.addEventListener('input', () => {
        stopAnimation();
        updateMap(+slider.value);
    });

    // Initial render
    updateMap(0);

}).catch(error => {
    console.error('Error loading data:', error);
    document.getElementById('map-container').innerHTML = 
        '<p class="error">Error loading data. Please ensure you are running through a web server and data files are accessible.</p>';
});

function getLocation(d, countyMap, stateMap) {
    let location = countyMap.get(d.fips);
    if (!location && d.county === "New York City") {
        location = countyMap.get("36061");
    }
    if (!location) {
        location = stateMap.get(d.state);
    }
    return location;
}

function getPlaceName(d, countyMap, stateMap) {
    if (d.county === "New York City") return "New York City";
    const loc = getLocation(d, countyMap, stateMap);
    return loc ? `${loc.properties.name} ${d.state === "Louisiana" ? "Parish" : "County"}` : '';
}