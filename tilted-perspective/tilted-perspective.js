// Tilted Satellite Perspective Calculator
class TiltedPerspective {
  constructor(params = {}) {
    this.params = {
      longitude: params.longitude || 0,
      latitude: params.latitude || 0,
      altitude: params.altitude || 11000,
      rotation: params.rotation || 0,
      tilt: params.tilt || 0,
      fieldOfView: params.fieldOfView || 25
    };
    this.earthRadius = 6371; // km
    this.degrees = 180 / Math.PI;
  }

  getSnyderP() {
    return 1.0 + this.params.altitude / this.earthRadius;
  }

  getVerticalShift() {
    return this.params.altitude * Math.sin(this.params.tilt / this.degrees);
  }

  getProjectionDistance() {
    return this.params.altitude * Math.cos(this.params.tilt / this.degrees);
  }

  getVisibleYextent() {
    const dZ = this.getProjectionDistance();
    return 2 * dZ * Math.tan(0.5 * this.params.fieldOfView / this.degrees);
  }

  getScale(numPixelsY) {
    return this.earthRadius * numPixelsY / this.getVisibleYextent();
  }

  getYShift(numPixelsY) {
    return this.getVerticalShift() * numPixelsY / this.getVisibleYextent();
  }

  getClipAngle() {
    const tilt = this.params.tilt / this.degrees;
    const snyderP = this.getSnyderP();
    return Math.acos(snyderP * Math.cos(tilt) * 0.999);
  }

  getHorizonAngle() {
    return Math.acos(1 / this.getSnyderP()) - 1e-6;
  }

  getProjectionParameters(width, height) {
    const scale = this.getScale(height);
    const yShift = this.getYShift(height);
    
    return {
      scale,
      translate: [width / 2, yShift + height / 2],
      rotate: [-this.params.longitude, -this.params.latitude, this.params.rotation],
      tilt: this.params.tilt,
      distance: this.getSnyderP(),
      clipAngle: this.getClipAngle() * this.degrees,
      horizonAngle: this.getHorizonAngle() * this.degrees
    };
  }

  // Update parameters
  setParams(newParams) {
    Object.assign(this.params, newParams);
  }
}

// Example usage:
/*
const perspective = new TiltedPerspective({
  longitude: -85,
  latitude: 18,
  altitude: 10000,
  rotation: 15,
  tilt: 45,
  fieldOfView: 30
});

const projectionParams = perspective.getProjectionParameters(800, 600);
*/