// Map bounds and global variables
const UK_BOUNDS = {
    northEast: { lat: 60.86, lng: 1.76 },  // Covers northern Scotland
    southWest: { lat: 49.84, lng: -8.65 }  // Covers southern England and western Ireland
};

let map;
let markers = [];
let isTransitioning = false;
let d3Container;
let d3Svg;
let townsData = []; // Store the current towns data

// Initialize D3
function initD3() {
    d3Container = d3.select('#d3-overlay');
    d3Svg = d3Container.append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('position', 'absolute')
        .style('pointer-events', 'none');
}

// Map initialization and style functions
function initMap() {
    map = L.map('map', {
        maxBounds: L.latLngBounds(
            L.latLng(UK_BOUNDS.southWest.lat, UK_BOUNDS.southWest.lng),
            L.latLng(UK_BOUNDS.northEast.lat, UK_BOUNDS.northEast.lng)
        ),
        maxBoundsViscosity: 1.0,
        minZoom: 6,
        maxZoom: 18,
        zoomSnap: 0.25,
        zoomDelta: 0.25,
        wheelDebounceTime: 150
    }).fitBounds([
        [UK_BOUNDS.southWest.lat, UK_BOUNDS.southWest.lng],
        [UK_BOUNDS.northEast.lat, UK_BOUNDS.northEast.lng]
    ]);

    map.setView([54.5, -4.0], 6);
    initD3();
    setMapStyle('default');
    loadTowns();

    // Add resize handler for D3 overlay
    map.on('resize move zoom', updateD3Overlay);
}

function setMapStyle(style) {
    if (map.currentLayer) {
        map.removeLayer(map.currentLayer);
    }

    const layerOptions = {
        attribution: style === 'topo' ? 
            '&copy; OpenTopoMap contributors' : 
            style === 'satellite' ?
            '&copy; ESRI World Imagery' :
            '&copy; OpenStreetMap contributors',
        bounds: L.latLngBounds(
            L.latLng(UK_BOUNDS.southWest.lat, UK_BOUNDS.southWest.lng),
            L.latLng(UK_BOUNDS.northEast.lat, UK_BOUNDS.northEast.lng)
        ),
        noWrap: true,
        minZoom: 6,
        maxZoom: 18
    };

    let tileUrl;
    if (style === 'topo') {
        tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    } else if (style === 'satellite') {
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else {
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    const layer = L.tileLayer(tileUrl, layerOptions);
    layer.addTo(map);
    map.currentLayer = layer;
}

function updateD3Overlay() {
    const bounds = map.getBounds();
    const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
    const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

    d3Svg
        .attr('width', bottomRight.x - topLeft.x)
        .attr('height', bottomRight.y - topLeft.y)
        .style('left', topLeft.x + 'px')
        .style('top', topLeft.y + 'px');
}

function addD3Animation(town) {
    const point = map.latLngToLayerPoint([town.lat, town.lng]);
    
    // Create multiple effects group
    const effects = d3Svg.append('g')
        .attr('transform', `translate(${point.x}, ${point.y})`);

    // Starburst effect
    const burstCount = 8;
    for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2;
        effects.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0)
            .style('stroke', '#e11d48')
            .style('stroke-width', 2)
            .style('opacity', 0.6)
            .transition()
            .duration(400)
            .ease(d3.easeExpOut)
            .attr('x2', Math.cos(angle) * 30)
            .attr('y2', Math.sin(angle) * 30)
            .style('opacity', 0)
            .remove();
    }

    // Concentric ripples
    [0, 1, 2].forEach(index => {
        effects.append('circle')
            .attr('r', 0)
            .style('fill', 'none')
            .style('stroke', '#e11d48')
            .style('stroke-width', 3 - index)
            .style('opacity', 0.6)
            .transition()
            .duration(600)
            .ease(d3.easeExpOut)
            .attr('r', 25)
            .style('opacity', 0)
            .remove();
    });

    // Center blast
    effects.append('circle')
        .attr('r', 0)
        .style('fill', '#e11d48')
        .style('opacity', 1)
        .transition()
        .duration(300)
        .ease(d3.easeExpOut)
        .attr('r', 15)
        .style('opacity', 0)
        .remove();

    // Rotating hexagon
    const hexagonPoints = Array.from({length: 6}, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return [Math.cos(angle) * 10, Math.sin(angle) * 10];
    });

    effects.append('polygon')
        .attr('points', hexagonPoints.map(p => p.join(',')).join(' '))
        .style('fill', 'none')
        .style('stroke', '#e11d48')
        .style('stroke-width', 2)
        .style('opacity', 0.8)
        .attr('transform', 'rotate(0)')
        .transition()
        .duration(500)
        .ease(d3.easeExpOut)
        .attr('transform', 'rotate(180)')
        .style('opacity', 0)
        .remove();
}


async function loadTowns() {
    if (isTransitioning) return;
    isTransitioning = true;

    const slider = document.getElementById('townSlider');
    const count = slider.value;
    
    try {
        await fadeOutMarkers();
        const response = await fetch(`http://34.147.162.172/Circles/Towns/${count}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // Add generated data to each town
        data.forEach(town => {
            town.weather = TownInfoGenerator.getWeather();
            town.attractions = TownInfoGenerator.getNearbyAttractions();
            town.transport = TownInfoGenerator.getTransport();
            town.amenities = TownInfoGenerator.getAmenities();
            town.housing = TownInfoGenerator.getHousing();
            town.events = TownInfoGenerator.getEvents();
            town.economics = TownInfoGenerator.getEconomics();
            town.demographics = TownInfoGenerator.getDemographics();
        });

        window.townsData = data;
        
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];

        // Update React components - simplified version
        ReactDOM.render(
            React.createElement(TownDetailsPanel, { 
                data: data,
                selectedTown: null 
            }),
            document.getElementById('leftPanel')
        );
        
        ReactDOM.render(
            React.createElement(ChatBot, { data: data }),
            document.getElementById('rightPanel')
        );

        await updateMap(data);
    } catch (error) {
        console.error('Error fetching towns:', error);
        alert('Error loading data: ' + error.message);
    } finally {
        isTransitioning = false;
    }
}

function fadeOutMarkers() {
    return new Promise((resolve) => {
        if (markers.length === 0) {
            resolve();
            return;
        }

        // Sort markers for spiral effect
        const center = map.getCenter();
        markers.sort((a, b) => {
            const distA = center.distanceTo(a.getLatLng());
            const distB = center.distanceTo(b.getLatLng());
            return distA - distB;
        });

        const totalDuration = 400;
        
        markers.forEach((marker, index) => {
            const delay = (index / markers.length) * (totalDuration / 2);
            const point = map.latLngToLayerPoint(marker.getLatLng());

            // Add explosion effect before removal
            setTimeout(() => {
                const explosion = d3Svg.append('g')
                    .attr('transform', `translate(${point.x}, ${point.y})`);

                // Particle explosion
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    explosion.append('circle')
                        .attr('r', 2)
                        .style('fill', '#e11d48')
                        .attr('cx', 0)
                        .attr('cy', 0)
                        .style('opacity', 1)
                        .transition()
                        .duration(300)
                        .ease(d3.easeExpOut)
                        .attr('cx', Math.cos(angle) * 20)
                        .attr('cy', Math.sin(angle) * 20)
                        .style('opacity', 0)
                        .remove();
                }

                marker.setStyle({
                    fillOpacity: 0,
                    opacity: 0,
                    radius: 0
                });
                
                setTimeout(() => {
                    map.removeLayer(marker);
                }, 150);
            }, delay);
        });

        setTimeout(resolve, totalDuration);
        markers = [];
    });
}
async function updateMap(towns) {
    const totalDuration = 800;
    const staggerDelay = totalDuration / (towns.length * 2);
    
    // Sort towns for wave effect
    const centerLat = (UK_BOUNDS.northEast.lat + UK_BOUNDS.southWest.lat) / 2;
    const centerLng = (UK_BOUNDS.northEast.lng + UK_BOUNDS.southWest.lng) / 2;
    
    towns.sort((a, b) => {
        const distA = Math.hypot(a.lat - centerLat, a.lng - centerLng);
        const distB = Math.hypot(b.lat - centerLat, b.lng - centerLng);
        return distA - distB;
    });

    towns.forEach((town, index) => {
        const radius = Math.sqrt(town.Population) / 50;
        
        const marker = L.circleMarker([town.lat, town.lng], {
            radius: 0, // Start at 0 for animation
            fillColor: '#e11d48',
            fillOpacity: 0,
            color: '#be123c',
            weight: 2,
            opacity: 0
        });

        const tooltipContent = `
            <div class="town-tooltip">
                <h3>${town.Town}</h3>
                <div class="tooltip-section">
                    <strong>📍 Location</strong>
                    <p>County: ${town.County}</p>
                    <p>Population: ${town.Population.toLocaleString()}</p>
                </div>

                <div class="tooltip-section">
                    <strong>🌤 Current Weather</strong>
                    <p>${town.weather.condition}, ${town.weather.temperature}°C</p>
                    <p>Humidity: ${town.weather.humidity}%</p>
                    <hr class="my-2 border-gray-300"/>
                    </br>
                    <p class="text-sm text-blue-600">📍 Click the circle for detailed insights!</p>
                    <p class="text-sm text-purple-600"> Need help? Ask Andy 🧙‍♂️, your UK towns guide</p>
                </div>
                
            </div>
        `;

        marker.bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'auto',
            offset: [0, -radius - 5],
            className: 'custom-tooltip',
            sticky: true,
            opacity: 1,
            interactive: true
        });

        marker.on('click', function() {
            ReactDOM.render(
                React.createElement(TownDetailsPanel, { 
                    data: window.townsData,
                    selectedTown: town 
                }),
                document.getElementById('leftPanel')
            );

            // Add click effect
            const clickPoint = map.latLngToLayerPoint([town.lat, town.lng]);
            const clickEffect = d3Svg.append('circle')
                .attr('cx', clickPoint.x)
                .attr('cy', clickPoint.y)
                .attr('r', radius)
                .style('fill', 'none')
                .style('stroke', '#ffffff')
                .style('stroke-width', 3)
                .style('opacity', 1)
                .transition()
                .duration(500)
                .ease(d3.easeExpOut)
                .attr('r', radius * 3)
                .style('opacity', 0)
                .remove();
        });

        // Enhanced hover effects
        marker.on('mouseover', function() {
            this.setStyle({
                fillOpacity: 0.9,
                weight: 3,
                radius: radius * 1.2
            });

            // Add hover pulse effect
            addD3Animation(town);
        });

        marker.on('mouseout', function() {
            this.setStyle({
                fillOpacity: 0.6,
                weight: 2,
                radius: radius
            });
        });

        marker.addTo(map);
        markers.push(marker);

        // Dramatic entrance animation
        setTimeout(() => {
            // Initial pop
            marker.setStyle({
                radius: radius * 1.5,
                fillOpacity: 0.9,
                opacity: 1
            });

            // Elastic settle
            setTimeout(() => {
                marker.setStyle({
                    radius: radius * 0.8,
                    fillOpacity: 0.7
                });
                
                setTimeout(() => {
                    marker.setStyle({
                        radius: radius * 1.1,
                        fillOpacity: 0.8
                    });
                    
                    setTimeout(() => {
                        marker.setStyle({
                            radius: radius,
                            fillOpacity: 0.6
                        });
                    }, 100);
                }, 100);
            }, 150);

            addD3Animation(town);
        }, index * staggerDelay);
    });
}
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');
    const systemIcon = document.getElementById('systemIcon');
    
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme;
        
        if (!currentTheme || currentTheme === 'system') {
            newTheme = 'light';
        } else if (currentTheme === 'light') {
            newTheme = 'dark';
        } else {
            newTheme = 'system';
        }
        
        setTheme(newTheme);
    });

    function setTheme(theme) {
        lightIcon.classList.remove('active');
        darkIcon.classList.remove('active');
        systemIcon.classList.remove('active');

        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            lightIcon.classList.add('active');
        } else if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkIcon.classList.add('active');
        } else {
            systemIcon.classList.add('active');
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        }
        
        localStorage.setItem('theme', theme);
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
            if (localStorage.getItem('theme') === 'system') {
                setTheme('system');
            }
        });
}

// Performance optimization for map updates
let updateTimeout;
function debouncedMapUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        loadTowns();
    }, 300);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize map and theme
    initMap();
    initTheme();

    // Reload button handler
    document.getElementById('reloadBtn').addEventListener('click', loadTowns);
    
    // Map style selector handler
    document.getElementById('mapStyle').addEventListener('change', (e) => {
        setMapStyle(e.target.value);
    });

    // Town count slider handlers
    const slider = document.getElementById('townSlider');
    const townCount = document.getElementById('townCount');

    slider.addEventListener('input', (e) => {
        townCount.textContent = e.target.value;
    });

    slider.addEventListener('change', debouncedMapUpdate);

    // Add error handling for missing elements
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + error);
        return false;
    };

    // Add service worker for offline support if supported
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
    }

    // Handle visibility change to pause/resume animations
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isTransitioning = true;
        } else {
            isTransitioning = false;
            updateD3Overlay();
        }
    });

    // Handle window resize efficiently
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateD3Overlay();
        }, 250);
    });
});

// Export for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UK_BOUNDS,
        initMap,
        setMapStyle,
        updateD3Overlay,
        loadTowns,
        initTheme
    };
}