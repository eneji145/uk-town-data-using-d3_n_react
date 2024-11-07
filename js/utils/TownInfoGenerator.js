// Town Information Generator
const TownInfoGenerator = (() => {
    // Private data arrays
    const _attractions = [
        'Historical Museum',
        'Central Park',
        'Shopping Centre',
        'Cathedral',
        'Castle Ruins',
        'Botanical Gardens',
        'Art Gallery',
        'Theater',
        'Public Library',
        'Sports Complex',
        'Town Hall',
        'Ancient Church',
        'Local Market',
        'Heritage Railway',
        'Nature Reserve',
        'Maritime Museum',
        'Science Center',
        'Historic Lighthouse',
        'Medieval Castle',
        'Victorian Park',
        'Wildlife Sanctuary',
        'Cultural Center',
        'Open Air Market',
        'Historic Dockyard',
        'Roman Ruins'
    ];

    const _events = [
        'Summer Festival',
        'Food Fair',
        'Music Festival',
        'Cultural Week',
        'Christmas Market',
        'Agricultural Show',
        'Arts Festival',
        'Sport Tournament',
        'Literary Festival',
        'Film Festival',
        'Beer Festival',
        'Heritage Day',
        'Flower Show',
        'Jazz Weekend',
        'Folk Music Festival',
        'Winter Carnival',
        'Food & Wine Festival',
        'Classical Music Concert',
        'Theater Festival',
        'Harvest Festival',
        'Maritime Festival',
        'Science Fair',
        'Street Art Festival',
        'Medieval Fair',
        'Spring Garden Show'
    ];

    const _weatherConditions = [
        {
            condition: 'Sunny',
            tempRange: { min: 15, max: 25 },
            humidityRange: { min: 40, max: 60 }
        },
        {
            condition: 'Partly Cloudy',
            tempRange: { min: 12, max: 22 },
            humidityRange: { min: 45, max: 65 }
        },
        {
            condition: 'Cloudy',
            tempRange: { min: 10, max: 18 },
            humidityRange: { min: 60, max: 75 }
        },
        {
            condition: 'Light Rain',
            tempRange: { min: 8, max: 16 },
            humidityRange: { min: 70, max: 85 }
        },
        {
            condition: 'Overcast',
            tempRange: { min: 9, max: 17 },
            humidityRange: { min: 65, max: 80 }
        }
    ];

    // Private utility functions
    const _getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const _getRandomFloat = (min, max, decimals = 1) => {
        const rand = Math.random() * (max - min) + min;
        const power = Math.pow(10, decimals);
        return Math.round(rand * power) / power;
    };

    const _getRandomItems = (array, count) => {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    // Public interface
    return {
        getWeather() {
            const weatherType = _weatherConditions[Math.floor(Math.random() * _weatherConditions.length)];
            return {
                condition: weatherType.condition,
                temperature: _getRandomFloat(weatherType.tempRange.min, weatherType.tempRange.max),
                humidity: _getRandomInt(weatherType.humidityRange.min, weatherType.humidityRange.max)
            };
        },

        getNearbyAttractions() {
            const count = _getRandomInt(2, 4);
            const selected = new Set();
            while(selected.size < count) {
                selected.add(_attractions[Math.floor(Math.random() * _attractions.length)]);
            }
            return Array.from(selected);
        },

        getTransport() {
            const hasRail = Math.random() > 0.3;
            const hasBus = Math.random() > 0.1;
            const airports = ['None', 'None', 'None', 'None', 'Regional', 'International'];
            const nearestAirport = airports[Math.floor(Math.random() * airports.length)];
            
            return {
                rail: hasRail ? 'Yes' : 'No',
                bus: hasBus ? 'Yes' : 'No',
                nearestAirport: nearestAirport,
                distanceToAirport: nearestAirport !== 'None' ? _getRandomInt(5, 50) : null,
                busFrequency: hasBus ? _getRandomInt(10, 60) : null,
                trainFrequency: hasRail ? _getRandomInt(15, 120) : null
            };
        },

        getAmenities() {
            // Population-based amenities calculation
            return {
                schools: _getRandomInt(1, 5),
                hospitals: Math.random() > 0.7 ? _getRandomInt(1, 2) : 0,
                supermarkets: _getRandomInt(1, 3),
                restaurants: _getRandomInt(5, 15),
                cafes: _getRandomInt(3, 10),
                pubs: _getRandomInt(2, 8),
                parks: _getRandomInt(1, 4),
                gyms: _getRandomInt(0, 3),
                cinemas: Math.random() > 0.7 ? 1 : 0,
                shoppingCenters: Math.random() > 0.8 ? 1 : 0
            };
        },

        getHousing() {
            const basePrice = _getRandomInt(150000, 350000);
            const pricePerSqm = _getRandomInt(2000, 4000);
            
            return {
                avgHousePrice: basePrice,
                rentPrice: Math.round(basePrice / 200) * 1.2,
                newDevelopments: Math.random() > 0.7 ? 'Yes' : 'No',
                pricePerSquareMeter: pricePerSqm,
                propertyTypes: {
                    detached: _getRandomInt(20, 40),
                    semiDetached: _getRandomInt(25, 45),
                    terraced: _getRandomInt(15, 35),
                    apartments: _getRandomInt(10, 30)
                },
                rentalDemand: _getRandomInt(1, 5), // 1-5 scale
                buyerDemand: _getRandomInt(1, 5),  // 1-5 scale
                avgTimeOnMarket: _getRandomInt(30, 120) // days
            };
        },

        getEvents() {
            const mainEvents = _getRandomItems(_events, _getRandomInt(1, 3));
            const seasonalEvents = [];
            
            // Add seasonal events based on probabilities
            if (Math.random() > 0.6) seasonalEvents.push('Christmas Market');
            if (Math.random() > 0.7) seasonalEvents.push('Summer Music Festival');
            if (Math.random() > 0.8) seasonalEvents.push('Spring Food Festival');
            
            return [...mainEvents, ...seasonalEvents];
        },

        // New method for generating economic data
        getEconomics() {
            return {
                unemployment: _getRandomFloat(3, 8),
                averageSalary: _getRandomInt(25000, 45000),
                mainIndustries: _getRandomItems([
                    'Manufacturing',
                    'Tourism',
                    'Technology',
                    'Retail',
                    'Healthcare',
                    'Education',
                    'Agriculture',
                    'Financial Services'
                ], _getRandomInt(2, 4)),
                businessCount: _getRandomInt(50, 500),
                growthRate: _getRandomFloat(-2, 5)
            };
        },

        // New method for generating demographic data
        getDemographics() {
            return {
                ageDistribution: {
                    under18: _getRandomInt(15, 25),
                    _18to30: _getRandomInt(15, 25),
                    _30to50: _getRandomInt(25, 35),
                    _50plus: _getRandomInt(20, 30)
                },
                averageAge: _getRandomFloat(35, 45),
                householdSize: _getRandomFloat(2.1, 3.2),
                economicallyActive: _getRandomInt(60, 80)
            };
        }
    };
})();