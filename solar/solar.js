document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('mapCanvas');
    const context = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const projection = d3.geoNaturalEarth1().scale(175).translate([width / 2, height / 2]);
    const path = d3.geoPath(projection, context);

    // Load and parse geographic data
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json")
        .then(response => response.json())
        .then(world => {
            const land = topojson.feature(world, world.objects.land);

            // Draw the base map
            context.beginPath();
            path(land);
            context.fillStyle = "#000";
            context.fill();

            // Calculate sun position and draw night area
            const sun = getSolarPosition(new Date(), 29.7604, -95.3698); // Use Houston's coordinates
            const night = d3.geoCircle().radius(90).center([sun.longitude + 180, -sun.latitude])();

            context.beginPath();
            path(night);
            context.fillStyle = "rgba(0,0,255,0.3)";
            context.fill();

            // Outline the sphere
            context.beginPath();
            path({type: "Sphere"});
            context.strokeStyle = "#000";
            context.stroke();
        });

    function getSolarPosition(date, latitude, longitude) {
        const deg2rad = Math.PI / 180;
        const rad2deg = 180 / Math.PI;

        // Day of the year
        const n = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

        // Mean anomaly of the sun
        const g = (357.528 + 0.9856003 * n) % 360;

        // Mean longitude of the sun
        const L = (280.46 + 0.9856474 * n) % 360;

        // Ecliptic longitude of the sun
        const lambda = L + 1.915 * Math.sin(g * deg2rad) + 0.020 * Math.sin(2 * g * deg2rad);

        // Obliquity of the ecliptic
        const epsilon = 23.439 - 0.0000004 * n;

        // Declination of the sun
        const delta = Math.asin(Math.sin(epsilon * deg2rad) * Math.sin(lambda * deg2rad)) * rad2deg;

        // Equation of time (in minutes)
        const EOT = 229.18 * (0.000075 + 0.001868 * Math.cos(g * deg2rad) - 0.032077 * Math.sin(g * deg2rad) -
            0.014615 * Math.cos(2 * g * deg2rad) - 0.040849 * Math.sin(2 * g * deg2rad));

        // True solar time
        const meanTime = (date.getUTCHours() * 60 + date.getUTCMinutes() + (date.getUTCSeconds() / 60));
        const trueSolarTime = (meanTime + (EOT + 4 * (longitude - lambda))) % 1440;

        // Hour angle
        const H = trueSolarTime < 720 ? (trueSolarTime / 4 - 180) : (trueSolarTime / 4 - 180);

        return {
            longitude: -H,
            latitude: delta
        };
    }
});
