function geoZoom() {
    const radians = Math.PI / 180;
    const degrees = 180 / Math.PI;
    
    // State variables
    let projection,
        zoomPoint,
        zoomStarted = false,
        zooming = false,
        state = { r: [0, 0, 0], k: 1 };

    function pointDistance(a, b) {
        const [λ1, φ1] = a;
        const [λ2, φ2] = b;
        const dλ = (λ2 - λ1) * radians;
        const dφ = (φ2 - φ1) * radians;
        const sinφ1 = Math.sin(φ1 * radians);
        const sinφ2 = Math.sin(φ2 * radians);
        const cosφ1 = Math.cos(φ1 * radians);
        const cosφ2 = Math.cos(φ2 * radians);
        const cosdλ = Math.cos(dλ);
        const sindλ = Math.sin(dλ);
        const a2 = Math.sin((dφ) / 2) * Math.sin((dφ) / 2) +
                   cosφ1 * cosφ2 * Math.sin(dλ / 2) * Math.sin(dλ / 2);
        return 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2));
    }

    function quaternionFromEuler(λ, φ, γ) {
        λ *= radians / 2;
        φ *= radians / 2;
        γ *= radians / 2;
        const cλ = Math.cos(λ), sλ = Math.sin(λ);
        const cφ = Math.cos(φ), sφ = Math.sin(φ);
        const cγ = Math.cos(γ), sγ = Math.sin(γ);
        return [
            cλ * cφ * cγ + sλ * sφ * sγ,
            sλ * cφ * cγ - cλ * sφ * sγ,
            cλ * sφ * cγ + sλ * cφ * sγ,
            cλ * cφ * sγ - sλ * sφ * cγ
        ];
    }

    function eulerFromQuaternion(q) {
        return [
            Math.atan2(2 * (q[0] * q[1] + q[2] * q[3]), 1 - 2 * (q[1] * q[1] + q[2] * q[2])) * degrees,
            Math.asin(Math.max(-1, Math.min(1, 2 * (q[0] * q[2] - q[3] * q[1])))) * degrees,
            Math.atan2(2 * (q[0] * q[3] + q[1] * q[2]), 1 - 2 * (q[2] * q[2] + q[3] * q[3])) * degrees
        ];
    }

    function quaternionMultiply(a, b) {
        return [
            a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
            a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
            a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
            a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]
        ];
    }

    function zoom(selection) {
        selection.property("__zoom", d3.zoomIdentity)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .call(d3.zoom()
                .scaleExtent([0.7 * state.k, 10 * state.k])
                .on("start", () => zoomStarted = true)
                .on("zoom", zoomed)
                .on("end", () => zoomStarted = false));
    }

    function dragstarted(event) {
        const mouse = [event.x, event.y];
        const point = projection.invert(mouse);
        if (point) zoomPoint = point;
        
        state.q = quaternionFromEuler(...projection.rotate());
        state.mouse0 = mouse;
        zooming = true;
    }

    function dragged(event) {
        if (!zooming) return;
        
        const mouse = [event.x, event.y];
        const point = projection.invert(mouse);
        if (!point) return;

        const distance = pointDistance(zoomPoint, point);
        const angle = Math.atan2(point[1] - zoomPoint[1], point[0] - zoomPoint[0]);
        
        const dq = quaternionFromEuler(distance * Math.cos(angle),
                                     distance * Math.sin(angle), 0);
        state.q = quaternionMultiply(state.q, dq);
        
        projection.rotate(eulerFromQuaternion(state.q));
        event.target.ownerSVGElement.dispatchEvent(new CustomEvent("redraw"));
    }

    function dragended() {
        zooming = false;
    }

    function zoomed(event) {
        if (!zoomStarted) return;
        projection.scale(event.transform.k);
        event.target.ownerSVGElement.dispatchEvent(new CustomEvent("redraw"));
    }

    zoom.projection = function(_) {
        if (!arguments.length) return projection;
        projection = _;
        state.k = projection.scale();
        return zoom;
    };

    return zoom;
}

// Extend d3 with the geoZoom function
d3.geoZoom = geoZoom;