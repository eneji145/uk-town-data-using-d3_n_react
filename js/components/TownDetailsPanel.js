// Town Details Panel Component
const TownDetailsPanel = (() => {
    const TownDetailsPanelComponent = ({ data, selectedTown = null }) => {
        if (!selectedTown) {
            // Show overview stats when no town is selected
            const stats = React.useMemo(() => {
                if (!data?.length) return null;

                const totalPop = data.reduce((sum, town) => sum + town.Population, 0);
                const avgHousePrice = data.reduce((sum, town) => sum + town.housing?.avgHousePrice || 0, 0) / data.length;

                return {
                    totalTowns: data.length,
                    totalPopulation: totalPop,
                    averageHousePrice: avgHousePrice
                };
            }, [data]);

            return React.createElement('div', { className: 'stats-panel p-4' },
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('h2', { className: 'text-xl font-bold mb-4' }, 'UK Towns Overview'),
                    React.createElement('p', { className: 'mb-2' }, 
                        `Total Towns: ${stats.totalTowns}`
                    ),
                    React.createElement('p', { className: 'mb-2' }, 
                        `Total Population: ${stats.totalPopulation.toLocaleString()}`
                    ),
                    React.createElement('p', { className: 'mb-2' }, 
                        `Average House Price: £${Math.round(stats.averageHousePrice).toLocaleString()}`
                    ),
                    React.createElement('h3', { className: 'mt-4 text-sm text-gray-600' }
                      
                        
                    )
                )
            );
        }

        // Show detailed town information when a town is selected
        return React.createElement('div', { className: 'town-details-panel p-4 overflow-y-auto' },
            React.createElement('h2', { className: 'text-2xl font-bold mb-4' }, selectedTown.Town),
            
            // Current Weather
            React.createElement('div', { className: 'stat-card mb-4' },
                React.createElement('h3', { className: 'font-bold mb-2' }, '🌤 Current Weather'),
                React.createElement('div', { className: 'pl-4' },
                    React.createElement('p', null, `${selectedTown.weather.condition}, ${selectedTown.weather.temperature}°C`),
                    React.createElement('p', null, `Humidity: ${selectedTown.weather.humidity}%`)
                )
            ),

            // Location & Demographics
            React.createElement('div', { className: 'stat-card mb-4' },
                React.createElement('h3', { className: 'font-bold mb-2' }, '📍 Location & Demographics'),
                React.createElement('div', { className: 'pl-4' },
                    React.createElement('p', null, `County: ${selectedTown.County}`),
                    React.createElement('p', null, `Population: ${selectedTown.Population.toLocaleString()}`),
                    React.createElement('p', null, `Average Age: ${selectedTown.demographics.averageAge} years`),
                    React.createElement('p', null, `Household Size: ${selectedTown.demographics.householdSize}`),
                    React.createElement('p', null, `Economically Active: ${selectedTown.demographics.economicallyActive}%`)
                )
            ),

            // Transportation
            React.createElement('div', { className: 'stat-card mb-4' },
                React.createElement('h3', { className: 'font-bold mb-2' }, '🚆 Transportation'),
                React.createElement('div', { className: 'pl-4' },
                    React.createElement('p', null, `Train Station: ${selectedTown.transport.rail}`),
                    React.createElement('p', null, `Bus Service: ${selectedTown.transport.bus}`),
                    React.createElement('p', null, `Nearest Airport: ${selectedTown.transport.nearestAirport}`),
                    selectedTown.transport.distanceToAirport && 
                    React.createElement('p', null, `Distance to Airport: ${selectedTown.transport.distanceToAirport}km`),
                    selectedTown.transport.busFrequency &&
                    React.createElement('p', null, `Bus Frequency: Every ${selectedTown.transport.busFrequency} minutes`)
                )
            ),

            // Housing & Living
            React.createElement('div', { className: 'stat-card mb-4' },
                React.createElement('h3', { className: 'font-bold mb-2' }, '🏠 Housing & Living'),
                React.createElement('div', { className: 'pl-4' },
                    React.createElement('p', null, `Average House Price: £${selectedTown.housing.avgHousePrice.toLocaleString()}`),
                    React.createElement('p', null, `Monthly Rent: £${selectedTown.housing.rentPrice.toFixed(0)}`),
                    React.createElement('p', null, `Price per m²: £${selectedTown.housing.pricePerSquareMeter}`),
                    React.createElement('p', null, `New Developments: ${selectedTown.housing.newDevelopments}`),
                    React.createElement('p', null, `Time on Market: ${selectedTown.housing.avgTimeOnMarket} days`)
                )
            ),

            // Amenities
            React.createElement('div', { className: 'stat-card mb-4' },
                React.createElement('h3', { className: 'font-bold mb-2' }, '🏫 Local Amenities'),
                React.createElement('div', { className: 'pl-4' },
                    React.createElement('p', null, `Schools: ${selectedTown.amenities.schools}`),
                    React.createElement('p', null, `Hospitals: ${selectedTown.amenities.hospitals}`),
                    React.createElement('p', null, `Supermarkets: ${selectedTown.amenities.supermarkets}`),
                    React.createElement('p', null, `Restaurants: ${selectedTown.amenities.restaurants}`)
                )
            ),

            // Attractions
            React.createElement('div', { className: 'stat-card mb-4' },
                React.createElement('h3', { className: 'font-bold mb-2' }, '🏛 Notable Attractions'),
                React.createElement('div', { className: 'pl-4' },
                    React.createElement('p', null, selectedTown.attractions.join(', '))
                )
            ),

            // Events
            React.createElement('div', { className: 'stat-card mb-4' },
                React.createElement('h3', { className: 'font-bold mb-2' }, '🎪 Annual Events'),
                React.createElement('div', { className: 'pl-4' },
                    React.createElement('p', null, selectedTown.events.join(', '))
                )
            )
        );
    };

    return TownDetailsPanelComponent;
})();