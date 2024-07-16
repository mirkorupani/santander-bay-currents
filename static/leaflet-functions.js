

export function createCustomMarkerIcon(clusterNumber) {
    const iconsFolder = '/markers/';

    let markerIndex = 1;
    if (clusterNumber !== undefined) {
        markerIndex = clusterNumber + 1;
    }

    const iconUrl = iconsFolder + "marker-" + markerIndex.toString().padStart(2, '0') + ".png";
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [20, 28],
        iconAnchor: [10, 0]
    });
}