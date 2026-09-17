import * as Cesium from 'cesium';

// Safari's WebGL-to-Metal shader translator (ANGLE) fails to link Cesium's
// atmosphere-scattering shader (a `thread float3&` lvalue-binding bug in its
// MSL compiler), crashing the whole viewer. Chromium and Firefox are
// unaffected. Until WebKit fixes this, skip sky atmosphere there.
function isSafariBrowser() {
  const ua = navigator.userAgent;
  return (
    /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(ua) &&
    /Apple Computer/.test(navigator.vendor || '')
  );
}

/** Create the standard globe viewer in caller-owned, visible containers. */
export function createApplicationViewer({ container, creditContainer }) {
  if (!container || !creditContainer)
    throw new TypeError('Viewer and credit containers are required');
  const viewer = new Cesium.Viewer(container, {
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    vrButton: false,
    selectionIndicator: false,
    infoBox: false,
    baseLayer: false,
    creditContainer,
    msaaSamples: 4,
    contextOptions: { webgl: { preserveDrawingBuffer: true } },
  });
  try {
    viewer.targetFrameRate = 60;
    viewer.scene.globe.show = false;
    viewer.scene.skyAtmosphere.show = !isSafariBrowser();
    viewer.scene.skyAtmosphere.atmosphereLightIntensity = 18;
    viewer.scene.skyAtmosphere.saturationShift = -0.12;
    viewer.scene.skyAtmosphere.brightnessShift = -0.08;
    return viewer;
  } catch (error) {
    viewer.destroy();
    throw error;
  }
}
