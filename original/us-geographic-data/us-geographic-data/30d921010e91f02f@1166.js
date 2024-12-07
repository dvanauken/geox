// https://observablehq.com/@jashkenas/united-states-coronavirus-daily-cases-map-covid-19@1166
import define1 from "./450051d7f1174df8@255.js";

function _1(md){return(
md`# United States Coronavirus Daily Cases Map (COVID-19)

In late January, a team of journalists at The New York Times began [tracking each confirmed case](https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html) of the new coronavirus in the United States. Working with freelance reporters and teams of journalism students, they continue to work around the clock to gather the most detailed county-level data available. In a better timeline, this data would be centrally gathered and reported by the CDC — but alas, we live in the country we have. As of publication (March 27), the United States has more confirmed cases than any other nation.

*Source: [The New York Times](https://www.nytimes.com/article/coronavirus-county-data-us.html) *`
)}

function _day(Scrubber,dates,data,delay){return(
Scrubber(dates.slice(0, data.length), {
  delay,
  loop: false,
  format: d => d.toLocaleDateString()
})
)}

function _map(d3,w,h,radius,legendRadii,colorScale,numFormat,topojson,us,path,data,getLocation,places,albersProjection,html,delay,placeName)
{
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, w, h])
    .attr("class", "map");

  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("fill", "#777")
    .attr("transform", `translate(${[w - 270, 90]})`);

  legend
    .append("text")
    .attr("class", "legend-title")
    .text("No. confirmed cases")
    .attr("dx", 5)
    .attr("dy", -(radius(legendRadii[legendRadii.length - 1]) * 2 + 10));

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
    .attr("r", radius);

  legendBubbles
    .append("text")
    .attr("dy", "1.3em")
    .text(numFormat);

  svg
    .append("path")
    .datum(topojson.feature(us, us.objects.nation))
    .attr("fill", "#f4f4f4")
    .attr("stroke", "#999")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  svg
    .append("path")
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke", "#999")
    .attr("stroke-width", 0.5)
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  const bubble = svg
    .selectAll(".bubble")
    .data(
      data[data.length - 1].sort((a, b) => +b.cases - +a.cases),
      d => d.fips || d.county
    )
    .enter()
    .append("circle")
    .attr("transform", d => "translate(" + path.centroid(getLocation(d)) + ")")
    .attr("class", "bubble")
    .attr("fill-opacity", 0.5)
    .attr("fill", d => colorScale(0))
    .attr("r", d => radius(0));

  bubble.append("title");

  svg
    .selectAll("place")
    .data(places)
    .enter()
    .append("circle")
    .attr("class", "place")
    .attr("r", 2.5)
    .attr("transform", function(d) {
      return "translate(" + albersProjection([+d.LONGITUDE, +d.LATITUDE]) + ")";
    });

  svg
    .selectAll(".place-label")
    .data(places)
    .enter()
    .append("text")
    .attr("class", "place-label")
    .attr("transform", function(d) {
      return "translate(" + albersProjection([+d.LONGITUDE, +d.LATITUDE]) + ")";
    })
    .attr("dy", ".35em")
    .text(function(d) {
      return d.NAME;
    })
    .attr("x", 6)
    .style("text-anchor", "start");

  const wrapper = html`<div class="wrapper"></div>`;
  wrapper.append(svg.node());

  return Object.assign(wrapper, {
    update(i) {
      const t = svg
        .transition()
        .duration(i === 0 ? 0 : delay)
        .ease(d3.easeLinear);

      bubble
        .data(data[i], d => d.fips || d.county)
        .call(b => {
          b.transition(t)
            .attr("fill", d => colorScale(+d.cases))
            .attr("r", d => radius(+d.cases))
            .select("title")
            .text(d => `${placeName(d)}: ${numFormat(+d.cases)} cases`);
        })
        .exit()
        .call(b => {
          b.transition()
            .attr("fill", d => colorScale(0))
            .attr("r", d => radius(0));
        });
    }
  });
}


function _4(md){return(
md`<br><br><br>

## Appendix

*The implementation of this notebook lies below. It is not yet organized or commented.*

---

<br><br><br><br><br><br><br>`
)}

function _5(html)
{
  const c = `rgb(255, 255, 255, 0.5)`;
  return html`<style>
form output {
  font-weight: bold;
  font-size: 14px;
}
.wrapper {
  text-align: center;
}
.map {
  text-anchor: middle;
  font-family: sans-serif;
  font-size: 10px;
  margin: 0 auto;
}
.subunit {
  fill: #f4f4f4;
  stroke: #999;
  stroke-width: 0.5;
}
.place {
  fill: rgba(0,0,0,0.8);
  stroke: none;
  pointer-events: none;
}
.place-label {
  pointer-events: none;
  text-shadow: ${c} 1px 0px 0px, ${c} 0.540302px 0.841471px 0px, ${c} -0.416147px 0.909297px 0px, ${c} -0.989992px 0.14112px 0px, ${c} -0.653644px -0.756802px 0px, ${c} 0.283662px -0.958924px 0px, ${c} 0.96017px -0.279415px 0px;
}
.place-label, .legend-title {
  font-weight: bold;
  font-size: 12px;
  fill: rgba(0,0,0,0.8);
}
.bubble, .legend-bubble {
  stroke-width: 0.8;
  stroke: rgba(0,0,0,0.3)
}
.bubble:hover {
  stroke: rgba(0,0,0,0.6);
  stroke-width: 1.2;
  cursor: crosshair;
}
.legend text {
  fill: #000;
}
.legend-bubble {
  stroke: rgba(0,0,0,0.4);
}
.legend-title {
  text-anchor: start;
}
</style>`;
}


function _legendRadii(){return(
[10, 1000, 10000, 50000]
)}

function _placeName(getLocation){return(
function placeName(d) {
  if (d.county === "New York City") return "New York City";
  const loc = getLocation(d);
  return `${loc.properties.name} ${
    d.state === "Louisiana" ? "Parish" : "County"
  }`;
}
)}

function _getLocation(countyMap,stateMap){return(
function getLocation(d) {
  let location = countyMap.get(d.fips);
  if (!location && d.county === "New York City")
    location = countyMap.get("36061");
  if (!location) location = stateMap.get(d.state);
  if (!location) console.warn("No location found for: " + JSON.stringify(d));
  return location;
}
)}

function _9(map,index){return(
map.update(index)
)}

function _w(){return(
975
)}

function _h(){return(
610
)}

function _albersProjection(d3)
{
  // XXX super hacky
  const proj = d3.geoAlbersUsa().scale(1300);
  return function(coords) {
    const [x, y] = proj(coords);
    return [x + 6, y + 54];
  };
}


function _magnitude(toMagnitude,maxCases){return(
toMagnitude(maxCases)
)}

function _countyMap(topojson,us){return(
new Map(
  topojson.feature(us, us.objects.counties).features.map(d => [d.id, d])
)
)}

function _stateMap(topojson,us){return(
new Map(
  topojson
    .feature(us, us.objects.states)
    .features.map(d => [d.properties.name, d])
)
)}

function _toMagnitude(){return(
function toMagnitude(n) {
  var order = Math.floor(Math.log(n) / Math.LN10 + 0.000000001);
  return Math.pow(10, order);
}
)}

function _index(){return(
0
)}

function _18($0,dates,day)
{
  $0.value = dates.indexOf(day);
}


function _radius(d3,maxCases,maxRadius){return(
d3
  .scaleSqrt()
  .domain([0, maxCases])
  .range([0, maxRadius])
)}

function _colorScale(d3,maxCases){return(
d3
  .scaleSqrt()
  .domain([0, maxCases])
  .range([`hsla(57, 100%, 50%, 0.36)`, `hsla(7, 100%, 50%, 0.57)`])
)}

function _delay(){return(
250
)}

function _maxCases(d3,recentData){return(
d3.max(recentData.map(d => +d.cases))
)}

function _excludeTerritories(){return(
new Set(["Guam", "Puerto Rico", "Virgin Islands"])
)}

function _data(d3,rawData,excludeTerritories,startDate){return(
d3
  .nest()
  .key(d => d.date)
  .entries(rawData.filter(d => !excludeTerritories.has(d.state)))
  .map(d => d.values)
  .filter(d => d[0].date >= startDate)
)}

function _rawData(d3){return(
d3.csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv")
)}

function _path(d3){return(
d3.geoPath()
)}

function _maxRadius(){return(
50
)}

function _recentData(data){return(
data[data.length - 1]
)}

function _startDate(){return(
"2020-03-01"
)}

function _dates(data){return(
data.map(d => d[0].date).map(d => new Date(`${d}T20:00Z`))
)}

async function _places(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("us-places.csv").text())
)}

function _sFormat(d3){return(
d3.format(".1s")
)}

function _numFormat(d3){return(
d3.format("~s")
)}

function _us(FileAttachment){return(
FileAttachment("counties-albers-10m.json").json()
)}

function _topojson(require){return(
require("topojson-client@3")
)}

function _d3(require){return(
require("d3@5")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["counties-albers-10m.json", {url: new URL("./files/50848f0dd4d2d9c84821adba90ca625cb2815694117bbb7b6ae393e788aae9d85f19a6c73d60d642bb04e2f95b87993e8c7312d4d4da6a1431c58460f5ad6c63.json", import.meta.url), mimeType: "application/json", toString}],
    ["us-places.csv", {url: new URL("./files/6e98da4e948218eeb9c43a5175a25c5ebf732d0d957d4676ef634a78cb7c81b6dbeb935ca46d1a6fd1ce472cbd73dff8082a9279a6f53076df64a976a0764550.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof day")).define("viewof day", ["Scrubber","dates","data","delay"], _day);
  main.variable(observer("day")).define("day", ["Generators", "viewof day"], (G, _) => G.input(_));
  main.variable(observer("map")).define("map", ["d3","w","h","radius","legendRadii","colorScale","numFormat","topojson","us","path","data","getLocation","places","albersProjection","html","delay","placeName"], _map);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["html"], _5);
  main.variable(observer("legendRadii")).define("legendRadii", _legendRadii);
  main.variable(observer("placeName")).define("placeName", ["getLocation"], _placeName);
  main.variable(observer("getLocation")).define("getLocation", ["countyMap","stateMap"], _getLocation);
  main.variable(observer()).define(["map","index"], _9);
  main.variable(observer("w")).define("w", _w);
  main.variable(observer("h")).define("h", _h);
  main.variable(observer("albersProjection")).define("albersProjection", ["d3"], _albersProjection);
  main.variable(observer("magnitude")).define("magnitude", ["toMagnitude","maxCases"], _magnitude);
  main.variable(observer("countyMap")).define("countyMap", ["topojson","us"], _countyMap);
  main.variable(observer("stateMap")).define("stateMap", ["topojson","us"], _stateMap);
  main.variable(observer("toMagnitude")).define("toMagnitude", _toMagnitude);
  main.define("initial index", _index);
  main.variable(observer("mutable index")).define("mutable index", ["Mutable", "initial index"], (M, _) => new M(_));
  main.variable(observer("index")).define("index", ["mutable index"], _ => _.generator);
  main.variable(observer()).define(["mutable index","dates","day"], _18);
  main.variable(observer("radius")).define("radius", ["d3","maxCases","maxRadius"], _radius);
  main.variable(observer("colorScale")).define("colorScale", ["d3","maxCases"], _colorScale);
  main.variable(observer("delay")).define("delay", _delay);
  main.variable(observer("maxCases")).define("maxCases", ["d3","recentData"], _maxCases);
  main.variable(observer("excludeTerritories")).define("excludeTerritories", _excludeTerritories);
  main.variable(observer("data")).define("data", ["d3","rawData","excludeTerritories","startDate"], _data);
  main.variable(observer("rawData")).define("rawData", ["d3"], _rawData);
  main.variable(observer("path")).define("path", ["d3"], _path);
  main.variable(observer("maxRadius")).define("maxRadius", _maxRadius);
  main.variable(observer("recentData")).define("recentData", ["data"], _recentData);
  main.variable(observer("startDate")).define("startDate", _startDate);
  main.variable(observer("dates")).define("dates", ["data"], _dates);
  main.variable(observer("places")).define("places", ["d3","FileAttachment"], _places);
  main.variable(observer("sFormat")).define("sFormat", ["d3"], _sFormat);
  main.variable(observer("numFormat")).define("numFormat", ["d3"], _numFormat);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
