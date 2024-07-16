import { plotUx, plotUy, plotWaterLevel } from './plots.js';
import { createCustomMarkerIcon } from './leaflet-functions.js';

const map = L.map('map').setView([43.45, -3.79], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

document.addEventListener('DOMContentLoaded', function() {
    axios.get('/points')
        .then(response => {
            loadPoints(response.data);
        })
        .catch(error => {
            console.error('Error fetching points:', error);
        });
});

let clusterData = null;

function loadPoints(points) {
    points.forEach(point => {
        let clusterNumber = point.cluster;
        let markerIcon = createCustomMarkerIcon(clusterNumber);
        const marker = L.marker([point.latitude, point.longitude], { icon: markerIcon });
        marker.addTo(map);

        // Bind popup to marker, but don't open it immediately
        marker.bindPopup(`<b>${point.name}</b><br>ID: ${point.id}<br>Cluster: ${point.cluster}`, {
            closeButton: false, // Hide the close button
            offset: L.point(0, 0) // Offset popup to be above the marker
        });

        // Open popup on marker mouseover
        marker.on('mouseover', function (e) {
            this.openPopup();
        });

        marker.on('click', () => {
            document.getElementById('output').innerHTML = '';
            document.getElementById('plot-ux').innerHTML = '';
            document.getElementById('scatter-ux').innerHTML = '';
            document.getElementById('plot-uy').innerHTML = '';
            document.getElementById('scatter-uy').innerHTML = '';
            document.getElementById('plot-waterlevel').innerHTML = '';
            document.getElementById('scatter-waterlevel').innerHTML = '';
            document.getElementById('loading').style.display = 'block';

            axios.post('/train', { point: point, cluster_data: clusterData })
                .then(response => {
                    const result = response.data;
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('output').innerHTML = `
                        <h3 class="result-heading">Training Result for ${point.name}</h3>
                    `;

                    plotUx(result);
                    plotUy(result);
                    plotWaterLevel(result);
                })
                .catch(error => {
                    console.error('Error training model:', error);
                });
        });
    });
}

document.getElementById('clusterize-button').addEventListener('click', () => {
    const numClusters = document.getElementById('num-clusters').value;
    document.getElementById('cluster-loading').style.display = 'block';

    // Clear plots before clustering
    document.getElementById('plot-ux').innerHTML = '';
    document.getElementById('scatter-ux').innerHTML = '';
    document.getElementById('plot-uy').innerHTML = '';
    document.getElementById('scatter-uy').innerHTML = '';
    document.getElementById('plot-waterlevel').innerHTML = '';
    document.getElementById('scatter-waterlevel').innerHTML = '';

    axios.post('/cluster', { num_clusters: parseInt(numClusters) })
        .then(response => {
            document.getElementById('cluster-loading').style.display = 'none';
            const clusterId = response.data.cluster_id;
            // Store the cluster ID for later use
            localStorage.setItem('clusterId', clusterId);
            axios.get(`/clusters/${clusterId}`)
                .then(response => {
                    clusterData = response.data; // Store the cluster data for later use
                    // Clear previous points
                    map.eachLayer(layer => {
                        if (layer instanceof L.Marker) {
                            map.removeLayer(layer);
                        }
                    });
                    loadPoints(response.data);
                })
                .catch(error => {
                    console.error('Error fetching cluster points:', error);
                });
        })
        .catch(error => {
            document.getElementById('cluster-loading').style.display = 'none';
            console.error('Error clustering points:', error);
        });
});