import define1 from "./30d921010e91f02f@1166.js";

function _1(md){return(
md`# U.S. Geographic Data
## Commonly used contextual data for geographic visualizations.
An attempt to catalogue and prepare a number of useful datasets that are commonly used for mapping data visualizations of the United States. The goal is to be able to easily import or download relevant datasets as well as trace their provenance back to the source.

In many cases it will be useful to processes data and cache it as a file attachment for performance reasons. We will always link back to the source of the data as well as capture as much of the processing code in this notebook as possible.`
)}

async function _2(md,visualtoc,FileAttachment){return(
md`**Visual Table of Contents**


${visualtoc([
  {
    label: 'Counties',
    link: '#counties',
    src: await FileAttachment("countyExample.png").url(),
  },
  {
    label: 'States',
    link: '#states',
    src: await FileAttachment("stateExample.png").url(),
  },
  {
    label: 'Nation',
    link: '#nation',
    src: await FileAttachment("nationExample.png").url(),
  },
  {
    label: 'County Population',
    link: '#census-api-population',
    src: await FileAttachment("countyPopulationExample@1.png").url(),
  },
  {
    label: 'Census Demographics',
    link: '#census-api-acs-demographics',
    src: await FileAttachment("countyACSExample@1.png").url(),
  },
  {
    label: 'Cumulative COVID-19 Cases',
    link: '#cumulative-covid-19-cases',
    src: await FileAttachment("cumulativeCovidExample@1.png").url(),
  },
  {
    label: 'Cities',
    link: '#u-s-cities',
    src: await FileAttachment("cityExample.png").url(),
  },
 
])}
`
)}

function _3(md){return(
md`## Geographic Boundaries`
)}

function _4(md){return(
md`### U.S. Atlas
The [us-atlas npm package](https://www.npmjs.com/package/us-atlas) provides a convenient redistribution of the [Census Bureau’s cartographic boundary shapefiles, 2017 edition](http://www.census.gov/) as TopoJSON. 

\`\`\`js
import {us} from "@observablehq/us-county-datasets"
\`\`\`
`
)}

function _5(Plot,exampleWidth,exampleHeight,nation){return(
Plot.plot({
  projection: "albers-usa",
  width: exampleWidth,
  height: exampleHeight,
  marks: [
    Plot.frame({stroke: "white", fill: "#111"}),
    Plot.geo(nation, {stroke: "#fff", strokeWidth: 0.35})
  ]
})
)}

function _us(d3){return(
d3.json("https://unpkg.com/us-atlas@3/counties-10m.json")
)}

function _nation(topojson,us){return(
topojson.feature(us, us.objects.nation)
)}

function _8(md){return(
md`---
### Counties

\`\`\`js
import {countyShapes} from "@observablehq/us-county-datasets"
\`\`\`
`
)}

function _9(Plot,exampleWidth,exampleHeight,countyShapes){return(
Plot.plot({
  projection: "albers-usa",
  width: exampleWidth,
  height: exampleHeight,
  marks: [
    Plot.frame({ stroke: "white", fill: "#111" }),
    Plot.geo(countyShapes, { stroke: "#fff", strokeWidth: 0.35 })
  ]
})
)}

function _countyShapes(topojson,us){return(
topojson.feature(us, us.objects.counties)
)}

function _11(md){return(
md`The id of each County feature is it's [FIPS code](https://en.wikipedia.org/wiki/FIPS_county_code). The first two numbers identify which state it is in, and the last three numbers uniquely identify that county within the state.
`
)}

function _fipsByName(countyShapes,statesByFips,usStateCodes){return(
new Map(
  countyShapes.features.map((d) => {
    const state = statesByFips.get(d.id.slice(0, 2)).name;
    const county = d.properties.name;
    const name = county + ", " + usStateCodes.getStateCodeByStateName(state);
    return [name, d.id];
  })
)
)}

function _nameByFips(fipsByName){return(
new Map(Array.from(fipsByName, ([name, fips]) => [fips, name]))
)}

function _14(md){return(
md`We can reshape our county and state data to make it easy to filter by FIPS, state or county name.`
)}

function _countyStates(countyShapes,statesByFips,usStateCodes){return(
countyShapes.features.map((d) => {
  const state = statesByFips.get(d.id.slice(0, 2)).name;
  const stateCode = usStateCodes.getStateCodeByStateName(state);
  const county = d.properties.name;
  const name = `${county}, ${stateCode}`;
  return {fips: d.id, state, stateCode, county, name};
})
)}

function _16(countyStates){return(
countyStates.filter(d => d.stateCode === "MD").sort((a, b) => a.county.localeCompare(b.county))
)}

function _17(md){return(
md`---
### States

\`\`\`js
import {stateShapes} from "@observablehq/us-county-datasets"
\`\`\`
`
)}

function _18(Plot,exampleWidth,exampleHeight,stateShapes){return(
Plot.plot({
  projection: "albers-usa",
  width: exampleWidth,
  height: exampleHeight,
  marks: [
    Plot.frame({stroke: "white", fill: "#111"}),
    Plot.geo(stateShapes, {stroke: "#fff", strokeWidth: 0.35})
  ]
})
)}

function _usStateCodes(){return(
import('https://cdn.skypack.dev/us-state-codes@1.1.2?min').then(d => d.default)
)}

function _stateShapes(topojson,us){return(
topojson.feature(us, us.objects.states)
)}

function _statesByFips(us){return(
new Map(Array.from(us.objects.states.geometries, d => [d.id, d.properties]))
)}

function _statesMesh(topojson,us){return(
topojson.mesh(us, us.objects.states, (a, b) => a !== b)
)}

function _23(md){return(
md`### U.S. Cities
This dataset of U.S. cities comes from [Natural Earth Populated Places](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-populated-places/). We download the zip file and upload it into [Mapshaper](https://mapshaper.org/) then export it as CSV where we upload as a file attachment to this notebook and do a little more post-processing.

\`\`\`js
import {usCities} from "@observablehq/us-county-datasets"
\`\`\`
`
)}

function _24(Plot,exampleWidth,exampleHeight,usCities){return(
Plot.plot({
  projection: "albers-usa",
  width: exampleWidth,
  height: exampleHeight,
  marks: [
    Plot.frame({stroke: "white", fill: "#111"}),
    Plot.dot(usCities, {x: "longitude", y: "latitude", fill: "#fff", r: 1})
  ]
})
)}

async function _usCities(FileAttachment){return(
(await FileAttachment("ne_10m_populated_places.csv").csv())
  .filter((d) => d["ADM0NAME"] === "United States of America")
  .map((d) => ({
    name: d.NAME,
    state: d.ADM1NAME,
    population: +d.POP_MAX,
    latitude: +d.LATITUDE,
    longitude: +d.LONGITUDE
  }))
)}

function _26(md){return(
md`Exporting the same data as a GeoJSON collection for tools that expect this format, such as D3’s geoPath or Plot’s geo mark.`
)}

function _usCitiesGeo(usCities){return(
{
  type: "FeatureCollection",
  features: usCities.map(
    ({ longitude, latitude, ...properties }) => ({
      type: "Feature",
      id: properties.name,
      properties,
      geometry: { type: "Point", coordinates: [longitude, latitude] }
    })
  )
}
)}

function _28(md){return(
md`---
## Population and Demographics
`
)}

function _29(md){return(
md`### Census API: Population

\`\`\`js
import {populationByCounty} from "@observablehq/us-county-datasets"
\`\`\`

The \`populationByCounty\` cell is a Map which returns the population for a given FIPS code.
`
)}

function _30(d3,Plot,exampleWidth,exampleHeight,countyShapes,density)
{
  const f3 = d3.format(",.3r");
  const f1 = d3.format(".1s");
  return Plot.plot({
    projection: "albers-usa",
    width: exampleWidth,
    height: exampleHeight,
    marks: [
      Plot.frame({ fill: "#111" }),
      Plot.geo(countyShapes, {
        stroke: "none",
        strokeWidth: 0.35,
        fill: (d) => density(d),
        title: (d) => `${d.id}: ${f3(density(d))} hab/km²`
      })
    ],
    color: {
      scheme: "ylgnbu",
      domain: [0.2, 20000],
      type: "log",
      legend: true,
      label: "population density (hab/km²)",
      ticks: 4,
      tickFormat: (d) => (d < 1 ? "≤1" : f1(d))
    }
  });
}


function _populationByCounty(populationData){return(
new Map(Array.from(populationData, ({ POP, state, county }) => [`${state}${county}`, +POP]))
)}

function _32(md){return(
md`We want to make sure to color by population density, not just population, otherwise we are misrepresenting the data.`
)}

function _density(populationByCounty,d3){return(
function density(d) {
  const population = populationByCounty.get(d.id);
  const area = d3.geoArea(d) * (510e6 / (4 * Math.PI)); // km²
  return population / area;
}
)}

function _useCache(Inputs){return(
Inputs.toggle({label: "Use cache", value: true})
)}

function _populationData(useCache,FileAttachment,d3){return(
useCache
  ? FileAttachment("populationData.csv").csv() // cache of the API call from October 2020

  // or load the data from the census API, and tweak its format
  : d3.json("https://api.census.gov/data/2018/pep/population?get=POP&for=county:*").then(rows => {
    const keys = rows.shift();
    return Array.from(rows, row => Object.fromEntries(keys.map((key, i) => [key, row[i]])));
  })
)}

function _36(md){return(
md`---
### Census API: ACS Demographics
The [American Community Survey](https://www.census.gov/data/developers/data-sets/acs-5year.html) can give us estimates about the make-up of populations across the country. We download a selected set of fields from the API, you can find a detailed list of [all the available fields here](https://api.census.gov/data/2018/acs/acs5/variables.html).

\`\`\`js
import { demographicsData, selectedFields, niceLabel } from "@observablehq/us-county-datasets"
\`\`\`

`
)}

function _37(Plot,exampleWidth,exampleHeight,countyShapes,demographicsData,field,populationByCounty){return(
Plot.plot({
  projection: "albers-usa",
  width: exampleWidth,
  height: exampleHeight,
  marks: [
    Plot.frame({fill: "#111"}),
    Plot.geo(countyShapes, {
      stroke: "#fff",
      strokeWidth: 0.35,
      title: "id",
      // note: some of the values are marked as negative
      fill: d => Math.max(0, (demographicsData[2018].get(d.id)?.[field] / populationByCounty.get(d.id)))
    })
  ],
  color: { scheme: "purples", type: "log" }
})
)}

function _field(Inputs,selectedFields,niceLabel){return(
Inputs.select(
  new Map(Array.from(selectedFields, (f) => [`${f} ${niceLabel(f)}`, f])),
  { value: selectedFields[4] }
)
)}

function _demographicsData(demographicsData2018,processDemographics,demographicsData2016,demographicsData2014){return(
{
  2018: new Map(demographicsData2018.map(processDemographics).map(d => [`${d.state}${d.county}`, d])),
  2016: new Map(demographicsData2016.map(processDemographics).map(d => [`${d.state}${d.county}`, d])),
  2014: new Map(demographicsData2014.map(processDemographics).map(d => [`${d.state}${d.county}`, d])),
}
)}

function _40(md){return(
md`Expand the following cell's code to see a commented list of fields selected from the Census API`
)}

function _selectedFields(){return(
[
  "B01003_001E", // estimated total population
  
  // Sex demographics
  // https://api.census.gov/data/2018/acs/acs5/groups/B01001.html
  "B01001_002E", // Total Male
  // TODO: age breakdowns for male
  "B01001_026E", // Total Female
  // TODO: age breakdowns for female
  
  // Racial demographics
  // https://api.census.gov/data/2018/acs/acs5/groups/B02001.html
  "B02001_002E", // White (includes Hispanic or Latino?)
  "B02001_003E", // Black or African American
  "B02001_004E", // American Indian or Alaskan Native
  "B02001_005E", // Asian
  "B02001_006E", // Native Hawaiian or Pacific Islander
  "B02001_007E", // Some other race
  "B02001_008E", // Two or more races
  "B02001_009E", // Two or more races (one is some other)
  "B02001_010E", // Three or more races
  
  // Hispanic or Latino Origin
  // https://api.census.gov/data/2018/acs/acs5/groups/B03003.html
  // "B03003_001E", // Total 
  "B03003_002E", // not Hispanic or Latino
  "B03003_003E", // Hispanic or Latino
    
  // GINI index of inequality
  // https://api.census.gov/data/2018/acs/acs5/groups/B19083.html
  "B19083_001E", // gini index
  
  // Per-capita income in last 12 months (inflation adjusted for that year)
  "B19301_001E",  // All races
  "B19301A_001E", // White
  "B19301H_001E", // White (not hispanic)
  "B19301I_001E", // Hispanic or Latino
  "B19301B_001E", // Black or African American
  "B19301C_001E", // American Indian or Alaskan Native
  "B19301D_001E", // Asian
  "B19301E_001E", // Native Hawaiian or Pacific Islander
  "B19301F_001E", // Some other race
  "B19301G_001E", // Two or more races
  
]
)}

function _niceKeys(selectedFields,niceLabel){return(
selectedFields.map(niceLabel)
)}

function _selectedKeys(selectedFields,demographicsKeysFile){return(
selectedFields.map(key => {
  return demographicsKeysFile.variables[key]
})
)}

function _demographicsData2018(FileAttachment){return(
FileAttachment("demographicsData2018.csv").csv({typed: true})
)}

function _demographicsData2016(FileAttachment){return(
FileAttachment("demographicsDataApi2016.csv").csv({typed: true})
)}

function _demographicsData2014(FileAttachment){return(
FileAttachment("demographicsDataApi2014.csv").csv({typed: true})
)}

function _demographicsKeysFile(FileAttachment){return(
FileAttachment("demographicsKeys.json").json()
)}

function _50(md){return(
md`We deal with null data and the Census -666666 by just setting the value to -1. Since none of these values should be negative, it simplifies both immediately looking at the data as well as eventual post-processing to call out missing data.`
)}

function _processDemographics(selectedFields){return(
({ ...d }) => {
  d.state = String(d.state).padStart(2, "0");
  d.county = String(d.county).padStart(3, "0");
  for (const key of selectedFields) if (!d[key] || d[key] < 0) d[key] = -1;
  return d;
}
)}

function _52(md){return(
md`This helper function writes the labels in a more human-interpretable version.`
)}

function _niceLabel(demographicsKeysFile){return(
(key) => {
  const moe = key.slice(key.length - 1) == "M";
  // if its a margin of error field, we don't have it in the lookup so we us the E(stimate) field instead
  const d = demographicsKeysFile.variables[moe ? key.replace(/M$/, "E") : key];
  const niceLabel = d.label
    .split("!!")
    .filter((d) => d !== "Estimate" && d !== "Total" && d.indexOf("Per capita") !== 0)
    .join(" ");
  const niceConcept = `${moe ? "Margin of error: " : ""}${d.concept.toLowerCase()}`;
  return niceLabel ? `${niceConcept}: ${niceLabel.toLowerCase()}` : niceConcept;
}
)}

function _54(md){return(
md`
---
### Cumulative COVID-19 cases
*Source: [The New York Times](https://www.nytimes.com/article/coronavirus-county-data-us.html) *

\`\`\`js
let date = "2021-12-31"
import { nytOnDateByCounty, nytByDay } with { date as nytDate } from "@observablehq/us-county-datasets"
\`\`\`

`
)}

function _55(Plot,exampleWidth,exampleHeight,countyShapes,nytOnDateByCounty,populationByCounty){return(
Plot.plot({
  projection: "albers-usa",
  width: exampleWidth,
  height: exampleHeight,
  marks: [
    Plot.frame({ stroke: "white", fill: "#111" }),
    Plot.geo(countyShapes, {
      stroke: "#fff",
      strokeWidth: 0.35,
      fill: (d) => (nytOnDateByCounty.get(d.id)?.cases ?? 0) / populationByCounty.get(d.id)
    })
  ],
  color: {scheme: "oranges"}
})
)}

function _nytStartDate(){return(
new Date("2020-01-22")
)}

function _nytDate(){return(
"2021-12-31"
)}

function _nytOnDateByCounty(nytOnDate){return(
new Map(Array.from(nytOnDate, d => [d.fips, d]))
)}

function _nytByDay(d3,nytData){return(
d3.group(nytData, d => d.date)
)}

function _nytOnDate(nytByDay,nytDate){return(
nytByDay.get(nytDate)
)}

function _62(md){return(
md`---
## Appendix`
)}

function _exampleWidth(){return(
300
)}

function _exampleHeight(){return(
200
)}

function _visualtoc(DOM,html){return(
function visualtoc(links) {
  const id = DOM.uid().id;
  const style = html`<style>
#${id} {display:flex;flex-wrap:wrap}
#${id} div {flex:0 1 300px; overflow:hidden;margin:0 15px 15px 0}
#${id} a {color:#1c1c1c;font:600 14px var(--sans-serif)}
#${id} a:hover {text-decoration:none; color:#3b5fc0}
#${id} img {max-width:100%;width:250px;border:1px solid #e8e8e8;box-sizing:border-box;border-radius:.25rem}
#${id} span {display:block;padding:3px 10px 10px}
  `;
  const cards = links.map(({link = null, label = link, src = ''}) => {
    // entries.push(Object.assign(
    //   html`<li><a href=#${h.id}>${DOM.text(h.textContent)}`,
    //   {onclick: e => (e.preventDefault(), h.scrollIntoView())}
    // ));
    let h = document.querySelector(link)
    console.log("h", h, link)
    let l = html`<div><a${!link?'':` href="${link}"`}><img src="${src}"><span>${DOM.text(label)}`
    let entry = Object.assign(l, {onclick: e => (e.preventDefault(), h.scrollIntoView())})
    return entry
  });
  return html`<div id=${id}>${cards}${style}`;
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["ne_10m_populated_places.csv", {url: new URL("./files/5f3b8a483b847ed4bcf0a0d25b2266b16c1224f12fda0553d1329fedcc3f2ebcb1bf53301a635e9810acd82e93e2949b4463a6327399c34164c4f591466c371e.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["populationData.csv", {url: new URL("./files/d33612f580ee62cea70c5cf31e5b0ac5459b426a65182573cda6b24f1d7299632fbe08e2a7c23f8a4a9527abf7b0eede606f63c170c54f29a434f3f3a3f63f2b.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["cityExample.png", {url: new URL("./files/0c5a5763e691d6a32625377c3ec045ba2ebdd27a726f6549516f6d8ef356eb9d917885cb3b5461e572365b940f247795bbeefcb272ec89e209e98a0b7c9637e7.png", import.meta.url), mimeType: "image/png", toString}],
    ["stateExample.png", {url: new URL("./files/f535b7208c264d7028d4168de2f69845108715a62fb3e29e739d45067ca9ea9bec62c3032d6fc2113755b4ea657736cf607f21e31fa74ca6721d0382e3f05188.png", import.meta.url), mimeType: "image/png", toString}],
    ["countyExample.png", {url: new URL("./files/5498a3b6985c4402d37abd046cc8e793134a6353847f1dc7c8d2cfa17cfa2466bab100e71eaabd34065c212c4b36f4a5dbef703daf9058eab74a94a291876c19.png", import.meta.url), mimeType: "image/png", toString}],
    ["demographicsKeys.json", {url: new URL("./files/ad33564d41a212152f11c0a3646c6ce9312db1f8fef90c7332e22d746817dbbe2a7c2502e3373afa2026de512c860dd0567b1cecf1217beb48efada36c36c87a.json", import.meta.url), mimeType: "application/json", toString}],
    ["demographicsData2018.csv", {url: new URL("./files/b93f69498f1ec92e06a309d5aed1a196ad22c8b1604dd36e669409338e38583b6637d042362bc98f306873c819197567b427deef9899e231d4b2e4f76aa527b8.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["demographicsDataApi2016.csv", {url: new URL("./files/a35dd7b1b1e80d39a89b99012a2a663c452f47df84527a3f45c35f6bff69963d0e32b9ed51e3c3422dd9d7d4dfe2604a87eace12ef7bed4251e71c2c9d87365b.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["demographicsDataApi2014.csv", {url: new URL("./files/54e853b511f916cbe50fd48aeebe3368838558a463fc90079a7d482aa24e90e45bef7137cabbef2bf2de5b4a37144d08b7fbbc85f0970d9f9f8ee9189a63e395.csv", import.meta.url), mimeType: "text/csv", toString}],
    ["nationExample.png", {url: new URL("./files/b9c471e1b49b9ae6d79bb4d3cf14a3b5387acd7c57b500abb17fc1e89fd51b87f684799df0b56846029a18b6e40cf85876b01be38825d66612472afab2b5209f.png", import.meta.url), mimeType: "image/png", toString}],
    ["countyACSExample@1.png", {url: new URL("./files/2e9c86364cf498f1f29489def756ad36f26b1a21d81e649016d4a006a6ad153c64396af53d015d8eb17af21bac07b8c79a9609fa6a7c016999710deaa9789fac.png", import.meta.url), mimeType: "image/png", toString}],
    ["cumulativeCovidExample@1.png", {url: new URL("./files/031b89b239105d8336c014bb83f603f04ffb8f4b76da32a2d84c0f5888b4659c5099a0fda575773d829b1bee7ced7ddfb4264fab0a316251ce49a3878e90b1fc.png", import.meta.url), mimeType: "image/png", toString}],
    ["countyPopulationExample@1.png", {url: new URL("./files/21a09c09cb9b31c7dd62dbcf8206e9efd5e3af8615a9c8412da7b191f90686065be7b24d805d645640fc64366c7c63296a667ebca6daf72cb97e531e3451c6bd.png", import.meta.url), mimeType: "image/png", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","visualtoc","FileAttachment"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["Plot","exampleWidth","exampleHeight","nation"], _5);
  main.variable(observer("us")).define("us", ["d3"], _us);
  main.variable(observer("nation")).define("nation", ["topojson","us"], _nation);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["Plot","exampleWidth","exampleHeight","countyShapes"], _9);
  main.variable(observer("countyShapes")).define("countyShapes", ["topojson","us"], _countyShapes);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("fipsByName")).define("fipsByName", ["countyShapes","statesByFips","usStateCodes"], _fipsByName);
  main.variable(observer("nameByFips")).define("nameByFips", ["fipsByName"], _nameByFips);
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("countyStates")).define("countyStates", ["countyShapes","statesByFips","usStateCodes"], _countyStates);
  main.variable(observer()).define(["countyStates"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["Plot","exampleWidth","exampleHeight","stateShapes"], _18);
  main.variable(observer("usStateCodes")).define("usStateCodes", _usStateCodes);
  main.variable(observer("stateShapes")).define("stateShapes", ["topojson","us"], _stateShapes);
  main.variable(observer("statesByFips")).define("statesByFips", ["us"], _statesByFips);
  main.variable(observer("statesMesh")).define("statesMesh", ["topojson","us"], _statesMesh);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer()).define(["Plot","exampleWidth","exampleHeight","usCities"], _24);
  main.variable(observer("usCities")).define("usCities", ["FileAttachment"], _usCities);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("usCitiesGeo")).define("usCitiesGeo", ["usCities"], _usCitiesGeo);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer()).define(["md"], _29);
  main.variable(observer()).define(["d3","Plot","exampleWidth","exampleHeight","countyShapes","density"], _30);
  main.variable(observer("populationByCounty")).define("populationByCounty", ["populationData"], _populationByCounty);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("density")).define("density", ["populationByCounty","d3"], _density);
  main.variable(observer("viewof useCache")).define("viewof useCache", ["Inputs"], _useCache);
  main.variable(observer("useCache")).define("useCache", ["Generators", "viewof useCache"], (G, _) => G.input(_));
  main.variable(observer("populationData")).define("populationData", ["useCache","FileAttachment","d3"], _populationData);
  main.variable(observer()).define(["md"], _36);
  main.variable(observer()).define(["Plot","exampleWidth","exampleHeight","countyShapes","demographicsData","field","populationByCounty"], _37);
  main.variable(observer("viewof field")).define("viewof field", ["Inputs","selectedFields","niceLabel"], _field);
  main.variable(observer("field")).define("field", ["Generators", "viewof field"], (G, _) => G.input(_));
  main.variable(observer("demographicsData")).define("demographicsData", ["demographicsData2018","processDemographics","demographicsData2016","demographicsData2014"], _demographicsData);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer("selectedFields")).define("selectedFields", _selectedFields);
  main.variable(observer("niceKeys")).define("niceKeys", ["selectedFields","niceLabel"], _niceKeys);
  main.variable(observer("selectedKeys")).define("selectedKeys", ["selectedFields","demographicsKeysFile"], _selectedKeys);
  main.variable(observer("demographicsData2018")).define("demographicsData2018", ["FileAttachment"], _demographicsData2018);
  main.variable(observer("demographicsData2016")).define("demographicsData2016", ["FileAttachment"], _demographicsData2016);
  main.variable(observer("demographicsData2014")).define("demographicsData2014", ["FileAttachment"], _demographicsData2014);
  main.variable(observer("demographicsKeysFile")).define("demographicsKeysFile", ["FileAttachment"], _demographicsKeysFile);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer("processDemographics")).define("processDemographics", ["selectedFields"], _processDemographics);
  main.variable(observer()).define(["md"], _52);
  main.variable(observer("niceLabel")).define("niceLabel", ["demographicsKeysFile"], _niceLabel);
  main.variable(observer()).define(["md"], _54);
  main.variable(observer()).define(["Plot","exampleWidth","exampleHeight","countyShapes","nytOnDateByCounty","populationByCounty"], _55);
  main.variable(observer("nytStartDate")).define("nytStartDate", _nytStartDate);
  main.variable(observer("nytDate")).define("nytDate", _nytDate);
  main.variable(observer("nytOnDateByCounty")).define("nytOnDateByCounty", ["nytOnDate"], _nytOnDateByCounty);
  const child1 = runtime.module(define1).derive([{name: "nytStartDate", alias: "startDate"}], main);
  main.import("rawData", "nytData", child1);
  main.variable(observer("nytByDay")).define("nytByDay", ["d3","nytData"], _nytByDay);
  main.variable(observer("nytOnDate")).define("nytOnDate", ["nytByDay","nytDate"], _nytOnDate);
  main.variable(observer()).define(["md"], _62);
  main.variable(observer("exampleWidth")).define("exampleWidth", _exampleWidth);
  main.variable(observer("exampleHeight")).define("exampleHeight", _exampleHeight);
  main.variable(observer("visualtoc")).define("visualtoc", ["DOM","html"], _visualtoc);
  return main;
}
