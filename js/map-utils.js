// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiamlueGdpcmkiLCJhIjoiY202MzM2ZHJ3MHVkMjJ3c2V1ZTE4em13MiJ9.M6tDB0ZXH9TMwOaGr5NFjg';

// Sample eco store locations
const ecoStores = [
    {
        name: "Green Earth Store",
        coordinates: [77.3266, 28.5830],
        address: "123 Green Street, Delhi"
    },
    {
        name: "Eco Essentials",
        coordinates: [77.3166, 28.5730],
        address: "45 Nature Road, Delhi"
    },
    {
        name: "Sustainable Living",
        coordinates: [77.3366, 28.5930],
        address: "78 Earth Avenue, Delhi"
    },
    {
        name: "Zero Waste Shop",
        coordinates: [77.3466, 28.5630],
        address: "90 Eco Lane, Delhi"
    }
];

// Initialize map with current location
function initializeMap(mapContainer) {
    // Create the map instance
    const map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 12
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());

    // Get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { longitude, latitude } = position.coords;
                
                // Set map center to current location
                map.setCenter([longitude, latitude]);

                // Add marker for current location
                new mapboxgl.Marker({ color: '#0000FF' })
                    .setLngLat([longitude, latitude])
                    .setPopup(new mapboxgl.Popup().setHTML('<h6>You are here</h6>'))
                    .addTo(map);

                // Add markers for eco stores
                ecoStores.forEach(store => {
                    // Create marker element
                    const el = document.createElement('div');
                    el.className = 'marker';
                    el.style.backgroundColor = '#4CAF50';
                    el.style.width = '20px';
                    el.style.height = '20px';
                    el.style.borderRadius = '50%';
                    el.style.cursor = 'pointer';

                    // Create popup content
                    const popupContent = `
                        <h6>${store.name}</h6>
                        <p>${store.address}</p>
                    `;

                    // Add marker to map
                    new mapboxgl.Marker(el)
                        .setLngLat(store.coordinates)
                        .setPopup(new mapboxgl.Popup().setHTML(popupContent))
                        .addTo(map);
                });
            },
            (error) => {
                console.error('Error getting location:', error);
                // Default to Delhi coordinates if location access is denied
                map.setCenter([77.3266, 28.5830]);
                
                // Add markers for eco stores even if location access is denied
                ecoStores.forEach(store => {
                    const el = document.createElement('div');
                    el.className = 'marker';
                    el.style.backgroundColor = '#4CAF50';
                    el.style.width = '20px';
                    el.style.height = '20px';
                    el.style.borderRadius = '50%';
                    el.style.cursor = 'pointer';

                    const popupContent = `
                        <h6>${store.name}</h6>
                        <p>${store.address}</p>
                    `;

                    new mapboxgl.Marker(el)
                        .setLngLat(store.coordinates)
                        .setPopup(new mapboxgl.Popup().setHTML(popupContent))
                        .addTo(map);
                });
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser');
        // Default to Delhi coordinates if geolocation is not supported
        map.setCenter([77.3266, 28.5830]);
        
        // Add markers for eco stores even if geolocation is not supported
        ecoStores.forEach(store => {
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundColor = '#4CAF50';
            el.style.width = '20px';
            el.style.height = '20px';
            el.style.borderRadius = '50%';
            el.style.cursor = 'pointer';

            const popupContent = `
                <h6>${store.name}</h6>
                <p>${store.address}</p>
            `;

            new mapboxgl.Marker(el)
                .setLngLat(store.coordinates)
                .setPopup(new mapboxgl.Popup().setHTML(popupContent))
                .addTo(map);
        });
    }

    return map;
}
