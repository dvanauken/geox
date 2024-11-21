class Perspective {
    constructor() {
        this.params = {
            longitude: -85,
            latitude: 18,
            altitude: 1024,
            rotation: 15,
            tilt: 45,
            fieldOfView: 25
        };

        this.earthRadius = 6371;
        this.degrees = 180 / Math.PI;

        this.snyderP = null;
        this.dY = null;
        this.dZ = null;
        this.visibleYextent = null;
        this.scale = null;
        this.yShift = null;
        this.numPixelsY = null;
        this.width = null;

        this.projection = null;
        this.preclip = null;
        this.grid = null;
        this.land = null;
        this.land50 = null;
        this.land110 = null;

       // Bind methods that are used as callbacks
       this.geoPipeline = this.geoPipeline.bind(this);
       this.geoRotatePhi = this.geoRotatePhi.bind(this);
       this.geoClipCircle = d3.geoClipCircle;
    }

    init(width) {
        this.width = width;
        this.numPixelsY = width * 0.6;
        this.setupGrid();
        this.calculateAll();
        return this.loadMapData();
    }

    updateParams(newParams) {
        Object.assign(this.params, newParams);
        this.calculateAll();
    }

    async loadMapData() {
        try {
            const [land50Response, land110Response] = await Promise.all([
                fetch('https://cdn.jsdelivr.net/npm/world-atlas@1/world/50m.json'),
                fetch('https://cdn.jsdelivr.net/npm/world-atlas@1/world/110m.json')
            ]);
            
            const world50 = await land50Response.json();
            const world110 = await land110Response.json();
            
            this.land50 = topojson.feature(world50, world50.objects.land);
            this.land110 = topojson.feature(world110, world110.objects.land);
            this.land = this.land50;
            
            return this;
        } catch (error) {
            console.error('Failed to load map data:', error);
            throw error;
        }
    }

    setupGrid() {
        this.grid = {
            major: d3.geoGraticule().step([15, 15])(),
            minor: d3.geoGraticule().step([5, 5])(),
            horizon: { type: "Sphere" }
        };
    }

    calculateAll() {
        this.snyderP = this.calculateSnyderP();
        [this.dY, this.dZ] = this.calculateOffsets();
        this.visibleYextent = this.calculateVisibleExtent();
        this.scale = this.calculateScale();
        this.yShift = this.calculateYShift();
        this.updateProjection();
    }

    calculateSnyderP() {
        return 1.0 + this.params.altitude / this.earthRadius;
    }

    calculateOffsets() {
        const tiltRad = this.params.tilt / this.degrees;
        const dY = this.params.altitude * Math.sin(tiltRad);
        const dZ = this.params.altitude * Math.cos(tiltRad);
        return [dY, dZ];
    }

    calculateVisibleExtent() {
        const fovRad = 0.5 * this.params.fieldOfView / this.degrees;
        return 2 * this.dZ * Math.tan(fovRad);
    }
    // calculateVisibleExtent() {
    //     const fovRad = 0.5 * this.params.fieldOfView / this.degrees;
    //     const extent = 2 * this.dZ * Math.tan(fovRad);
    //     const feetValue = (extent * 3280.84).toLocaleString();
    //     return `${feetValue} feet`;
    // }
    

    calculateScale() {
        return this.earthRadius * this.numPixelsY / this.visibleYextent;
    }

    calculateYShift() {
        return this.dY * this.numPixelsY / this.visibleYextent;
    }

    updateProjection() {
        this.preclip = this.createPreclip();
        this.projection = d3.geoSatellite()
            .scale(this.scale)
            .translate([this.width / 2, this.yShift + this.numPixelsY / 2])
            .rotate([-this.params.longitude, -this.params.latitude, this.params.rotation])
            .tilt(this.params.tilt)
            .distance(this.snyderP)
            .preclip(this.preclip)
            .precision(0.1);
    }

    createPreclip() {
        const tilt = this.params.tilt / this.degrees;
        const alpha = Math.acos(this.snyderP * Math.cos(tilt) * 0.999);
        const clipDistance = this.geoClipCircle(Math.acos(1 / this.snyderP) - 1e-6);
        
        if (!alpha) return clipDistance;
        
        return this.geoPipeline(
            clipDistance,
            this.geoRotatePhi(Math.PI + tilt),
            this.geoClipCircle(Math.PI - alpha - 1e-4),
            this.geoRotatePhi(-Math.PI - tilt)
        );
    }

    geoPipeline(...transforms) {
        return sink => {
            for (let i = transforms.length - 1; i >= 0; --i) {
                sink = transforms[i](sink);
            }
            return sink;
        };
    }

    geoRotatePhi(deltaPhi) {
        const cosDeltaPhi = Math.cos(deltaPhi);
        const sinDeltaPhi = Math.sin(deltaPhi);
        return sink => ({
            point(lambda, phi) {
                const cosPhi = Math.cos(phi);
                const x = Math.cos(lambda) * cosPhi;
                const y = Math.sin(lambda) * cosPhi;
                const z = Math.sin(phi);
                const k = z * cosDeltaPhi + x * sinDeltaPhi;
                sink.point(Math.atan2(y, x * cosDeltaPhi - z * sinDeltaPhi), Math.asin(k));
            },
            lineStart() { sink.lineStart(); },
            lineEnd() { sink.lineEnd(); },
            polygonStart() { sink.polygonStart(); },
            polygonEnd() { sink.polygonEnd(); },
            sphere() { sink.sphere(); }
        });
    }

    draw(context) {
        if (!this.projection || !this.land) return;
        
        const path = d3.geoPath(this.projection, context);
        
        context.clearRect(0, 0, this.width, this.numPixelsY);
        
        context.fillStyle = "#88d";
        context.beginPath();
        path(this.land);
        context.fill();
        
        context.beginPath();
        path(this.grid.major);
        context.strokeStyle = "#ddf";
        context.globalAlpha = 0.8;
        context.stroke();
        
        context.beginPath();
        path(this.grid.horizon);
        context.strokeStyle = "#000";
        context.globalAlpha = 1;
        context.stroke();

        
         const el = document.querySelector('input[name="altitude"]');
         const kmValue = this.params.altitude;
         const milesValue = kmValue * 0.621371;
         el.nextElementSibling.textContent = `${milesValue.toLocaleString()} miles`;
    }

    setResolution(useHighRes) {
        this.land = useHighRes ? this.land50 : this.land110;
    }
}

export default Perspective;