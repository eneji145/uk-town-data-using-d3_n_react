// ChatBot Component
const ChatBot = (() => {
    const ChatBotComponent = ({ data }) => {
        // Initialize states
        const [messages, setMessages] = React.useState([
            { 
                type: 'bot', 
                text: `👋 Hello explorer! I'm Andy, your data-wielding town wizard! 

I'm here to help you explore UK towns in a fun and refreshing way! 🎯

Ask me about:
🏘️ Town details and population
🚆 Transport connections
💰 Local housing prices
🌤️ Current weather conditions
🎯 Attractions and events

Try asking about towns like ${data.slice(0, 3).map(t => t.Town).join(', ')}!

Or just chat with me - I'm quite friendly and always refreshing, like a Coca-Cola! ✨`
            }
        ]);
        const [inputValue, setInputValue] = React.useState('');
        const [isTyping, setIsTyping] = React.useState(false);
        const messagesEndRef = React.useRef(null);
        const [lastInteractionTime, setLastInteractionTime] = React.useState(Date.now());
        const [previousTownMentioned, setPreviousTownMentioned] = React.useState(null);

        // Idle message suggestions
        const idleMessages = [
            "Still exploring? I've got plenty more town facts to share! 🗺️",
            "Need any help finding your way around? I'm your town GPS! 🎯",
            "Getting curious about any particular town? Just ask! 🧙‍♂️",
            "Want to discover something fascinating? Name any town! ✨",
            "Like a Coca-Cola, I'm always here to refresh your knowledge! What town interests you? 🎭"
        ];

        // Personality traits for varied responses
        const personalityTraits = {
            friendly: {
                greetings: ["Hey there!", "Hi friend!", "Hello!", "Greetings!", "Hi explorer!"],
                emojis: ["😊", "👋", "✨", "🌟", "🎯"],
                enthusiasm: ["Awesome!", "Fantastic!", "Brilliant!", "Amazing!", "Excellent!"]
            },
            professional: {
                transitions: ["Moreover,", "Additionally,", "Furthermore,", "Also,", "What's more,"],
                acknowledgments: ["I understand", "I see", "Indeed", "Certainly", "Of course"]
            },
            witty: {
                jokes: [
                    "I'm like a Coca-Cola of knowledge - refreshing and addictive!",
                    "I know these towns better than a GPS, and I never need recalculating!",
                    "I've got more facts than a town has streets!",
                    "Think of me as your personal town encyclopedia, just more fun and less dusty!",
                    "I'm fizzing with information, like a well-shaken Coca-Cola!"
                ]
            }
        };

        // Auto-scroll to bottom on new messages
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        };

        React.useEffect(() => {
            scrollToBottom();
        }, [messages]);

        // Idle message timer
        React.useEffect(() => {
            const idleTimer = setInterval(() => {
                if (Date.now() - lastInteractionTime > 60000) { // 1 minute
                    const randomIdleMessage = idleMessages[Math.floor(Math.random() * idleMessages.length)];
                    setMessages(prev => [...prev, { type: 'bot', text: randomIdleMessage }]);
                    setLastInteractionTime(Date.now());
                }
            }, 60000);

            return () => clearInterval(idleTimer);
        }, [lastInteractionTime]);
        // Response generation function
        const generateResponse = (question) => {
            const getRandomTrait = (traitType, subCategory) => {
                const options = personalityTraits[traitType][subCategory];
                return options[Math.floor(Math.random() * options.length)];
            };

            question = question.toLowerCase().trim();

            // Handle name mentions and personal questions
            if (question.includes('andy') || question === 'andy') {
                if (question.includes('who are you') || question.includes('what are you')) {
                    return `${getRandomTrait('friendly', 'greetings')} I'm Andy, your friendly neighborhood town wizard! 🧙‍♂️ ${getRandomTrait('witty', 'jokes')} What would you like to know about our lovely UK towns?`;
                }
                
                const andyResponses = [
                    "You rang? 🧙‍♂️ Like a freshly opened Coca-Cola, I'm bubbling with town facts! What would you like to know?",
                    `${getRandomTrait('friendly', 'greetings')} Andy here! I'm like a Coca-Cola with unlimited refills of UK town knowledge! 🎯`,
                    "Andy at your service! Unlike Coca-Cola, my facts never go flat! Ready to explore? ✨",
                    "You called? Like Coca-Cola's secret recipe, I've got special ingredients - they're called facts! 🌟",
                    "The one and only Andy here! Bringing you town facts more refreshing than an ice-cold Coke! 🎭"
                ];
                return andyResponses[Math.floor(Math.random() * andyResponses.length)];
            }

            // Handle casual conversation
            if (question.includes('how are you')) {
                return `${getRandomTrait('friendly', 'enthusiasm')} I'm fantastic! Just been updating my knowledge about ${data.length} amazing towns. ${getRandomTrait('witty', 'jokes')} What can I help you discover today? 🎯`;
            }

            if (question.includes('thank')) {
                return `${getRandomTrait('friendly', 'enthusiasm')} You're welcome! Always happy to share my town knowledge. ${previousTownMentioned ? `Want to know anything else about ${previousTownMentioned} or shall we explore another town? 🗺️` : 'Ready to explore more towns? 🗺️'}`;
            }

            // Handle greetings with context awareness
            const greetings = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
            if (greetings.some(greeting => question === greeting)) {
                return `${getRandomTrait('friendly', 'greetings')} ${getRandomTrait('friendly', 'emojis')} Ready to explore some fascinating UK towns? ${previousTownMentioned ? `We were just talking about ${previousTownMentioned}. Would you like to know more about it or explore somewhere else? 🗺️` : 'Name any town, and I\'ll share its secrets! ✨'}`;
            }

            // Handle goodbyes
            if (question.includes('bye') || question.includes('goodbye')) {
                return `Farewell, fellow explorer! 👋 Remember, like a good Coca-Cola, I'm always here when you need a refreshing dose of town knowledge! Come back soon! ✨`;
            }

            // Handle help requests
            if (question.includes('help') || question === 'what can you do') {
                return `${getRandomTrait('friendly', 'greetings')} I'm your go-to source for all things UK towns! 🧙‍♂️

Here's what I can help with:
🏘️ Population and demographics
🚆 Transport connections
💰 Housing market details
🌤️ Weather conditions
🎯 Local attractions
🎪 Events and activities

Just ask me anything naturally - like:
• "Tell me about [town name]"
• "What's the weather in [town]?"
• "How much are houses in [town]?"
• "What can I do in [town]?"

Or just type a town name, and I'll give you the highlights! ✨`;
            }
            
            if (question === 'andy' || question.match(/\bandy\b/i)) {
                const quickResponses = [
                    "Hey there! 🧙‍♂️ Need some refreshing town facts?",
                    "Present! Like a Coca-Cola, I'm always ready to refresh your knowledge! ✨",
                    "You called? I'm fizzing with excitement to share some town facts! 🎯",
                    "Andy here! Ready to explore some fascinating towns? 🗺️",
                    "At your service! Which town shall we discover today? 🌟"
                ];
                return quickResponses[Math.floor(Math.random() * quickResponses.length)];
            }

            // Handle town-specific queries
            const townData = data || [];
            if (!townData.length) {
                return "I don't have any town data at the moment. Please try reloading the data. Like a Coca-Cola without bubbles, I'm not at my best without my data! 🔄";
            }

            const townNames = townData.map(t => t.Town.toLowerCase());
            const mentionedTown = townNames.find(name => question.includes(name));
            const town = mentionedTown ? townData.find(t => t.Town.toLowerCase() === mentionedTown) : null;

            if (!town) {
                if (question.length > 20) {
                    return `I couldn't find that town in our current dataset. ${getRandomTrait('professional', 'acknowledgments')}, how about exploring one of these interesting towns: ${townData.slice(0, 3).map(t => t.Town).join(', ')}? 🗺️`;
                }
                const suggestions = townNames.slice(0, 3).map(name => 
                    name.charAt(0).toUpperCase() + name.slice(1)
                ).join(', ');
                return `I couldn't find that town. Want to explore ${suggestions} instead? They're quite fascinating! ✨`;
            }

            // Update previously mentioned town
            setPreviousTownMentioned(town.Town);

            // Handle general town queries or town name only
            if (question === mentionedTown || 
                question.includes('tell me about') || 
                question.includes('what about') ||
                question.includes('tell me more')) {
                return `${getRandomTrait('friendly', 'enthusiasm')} Let me tell you about the wonderful town of ${town.Town}! 🌟

${getRandomTrait('professional', 'transitions')} here's what makes it special:

🏘️ Home to ${town.Population.toLocaleString()} people, making it a ${town.Population > 50000 ? 'vibrant' : 'cozy'} community.

🌤️ Currently enjoying ${town.weather.condition.toLowerCase()} weather at ${town.weather.temperature}°C - ${town.weather.temperature > 15 ? 'perfect for exploring!' : 'bring a jacket!'}.

🚆 Getting around: ${town.transport.rail === 'Yes' ? 'Conveniently connected by train' : 'No train station, but'}, 
${town.transport.bus === 'Yes' ? 'well-served by buses' : 'limited bus service available'}. 
${town.transport.nearestAirport !== 'None' ? `Nearest airport is ${town.transport.nearestAirport.toLowerCase()}, ${town.transport.distanceToAirport}km away.` : ''}

💰 Property scene: Average house price is £${town.housing.avgHousePrice.toLocaleString()},
with monthly rentals around £${town.housing.rentPrice.toFixed(0)}.
${town.housing.newDevelopments === 'Yes' ? 'Exciting new developments are in progress!' : ''}

🎯 Local highlights: ${town.attractions.join(', ')}

🎪 Don't miss: ${town.events.join(', ')}

Want to know more about anything specific? Just ask! I'm like a town encyclopedia with a personality! ✨`;
            }
            // Handle specific aspect queries
            if (question.includes('population')) {
                return `${town.Town} is home to ${town.Population.toLocaleString()} people! 🏘️ 
${town.Population > 50000 ? 'It\'s quite a bustling place!' : 'It\'s a lovely close-knit community!'} 

${getRandomTrait('professional', 'transitions')} the town has ${town.amenities.schools} schools, ${town.amenities.hospitals} hospitals, and ${town.amenities.restaurants} restaurants serving the community.

Want to know more about life in ${town.Town}? Just ask! 🎯`;
            }

            if (question.includes('transport') || question.includes('transportation') || question.includes('get there')) {
                return `Let me be your transport guide for ${town.Town}! 🚆

${town.transport.rail === 'Yes' ? '🚂 Good news! There\'s a train station' : '🚂 No train station available'}, 
${town.transport.bus === 'Yes' ? `🚌 Regular bus service running every ${town.transport.busFrequency} minutes` : '🚌 Limited bus service available'}
✈️ ${town.transport.nearestAirport !== 'None' ? `${town.transport.nearestAirport} airport is ${town.transport.distanceToAirport}km away` : 'No major airports nearby'}

Need specific transport details or shall we explore other aspects of ${town.Town}? 🗺️`;
            }

            if (question.includes('weather') || question.includes('temperature') || question.includes('climate')) {
                return `Current weather in ${town.Town} is looking ${town.weather.condition.toLowerCase()} at ${town.weather.temperature}°C! 🌤️

Humidity is at ${town.weather.humidity}% - ${town.weather.humidity > 70 ? 'a bit humid today!' : 'quite comfortable!'}

${town.weather.temperature > 20 ? 'Perfect weather for checking out local attractions like ' + town.attractions[0] + '!' : 
town.weather.temperature < 10 ? 'Might want to grab a warm drink at one of the ' + town.amenities.restaurants + ' local restaurants!' :
'Great weather for exploring the town!'}

Want to know about other aspects of ${town.Town}? 🎯`;
            }

            if (question.includes('house') || question.includes('property') || question.includes('prices') || question.includes('rent')) {
                return `Let's talk about ${town.Town}'s property scene! 🏠

💰 Average house price: £${town.housing.avgHousePrice.toLocaleString()}
🏢 Monthly rent: £${town.housing.rentPrice.toFixed(0)}
${town.housing.newDevelopments === 'Yes' ? '🏗️ Exciting new developments are happening!' : ''}

For comparison, this is ${town.housing.avgHousePrice > 300000 ? 'higher' : 'lower'} than many similar-sized towns.
Average time on market: ${town.housing.avgTimeOnMarket} days

Want to know about amenities or other aspects of living in ${town.Town}? Just ask! 🎯`;
            }

            // Handle default response with personality
            return `I found ${town.Town}! ${getRandomTrait('friendly', 'enthusiasm')} 

What would you like to know about:
🏘️ Population (${town.Population.toLocaleString()} residents)
🚆 Transport connections
💰 Housing market
🌤️ Current weather
🎯 Local attractions
🎪 Events and activities

Just ask about any of these - I'm bubbling with information like a freshly opened Coca-Cola! ✨`;
        };

        // Handle form submission
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!inputValue.trim()) return;

            setLastInteractionTime(Date.now());
            const userMessage = { type: 'user', text: inputValue };
            setMessages(prev => [...prev, userMessage]);
            setInputValue('');
            setIsTyping(true);

            // Simulate natural typing delay
            await new Promise(resolve =>
                setTimeout(resolve, Math.min(1000, inputValue.length * 20))
            );

            const botResponse = { 
                type: 'bot', 
                text: generateResponse(inputValue) 
            };
            
            setIsTyping(false);
            setMessages(prev => [...prev, botResponse]);
        };
        // Typing indicator component
        const TypingIndicator = () => {
            return React.createElement('div', { className: 'message bot-message' },
                React.createElement('div', { className: 'message-bubble bot-message-bubble typing-indicator' },
                    React.createElement('div', { className: 'typing-dot' }),
                    React.createElement('div', { className: 'typing-dot' }),
                    React.createElement('div', { className: 'typing-dot' })
                )
            );
        };

        // Suggestion chips component
        const SuggestionChips = () => {
            const suggestions = [
                ""
            ];

            return React.createElement('div', { className: 'suggestion-chips' },
                suggestions.map((suggestion, index) => 
                    React.createElement('button', {
                        key: index,
                        className: 'suggestion-chip',
                        onClick: () => {
                            setInputValue(suggestion);
                            handleSubmit({ preventDefault: () => {} });
                        }
                    }, suggestion)
                )
            );
        };

        // Main render
        return React.createElement('div', { className: 'chat-container flex flex-col h-full' },
            // Chat header
            React.createElement('div', { className: 'chat-header' },
                React.createElement('div', { className: 'chat-title' },
                    "🧙‍♂️ Andy - Your Town Guide"
                ),
                React.createElement('div', { className: 'chat-subtitle' },
                    "Always ready with refreshing town facts!"
                )
            ),
            
            // Messages container
            React.createElement('div', { className: 'chat-messages flex-grow overflow-y-auto p-4' },
                messages.map((msg, index) => 
                    React.createElement('div', {
                        key: index,
                        className: `message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`
                    },
                    React.createElement('div', {
                        className: `message-bubble ${msg.type === 'user' ? 'user-message-bubble' : 'bot-message-bubble'}`
                    }, msg.text)
                    )
                ),
                isTyping && React.createElement(TypingIndicator),
                React.createElement('div', { ref: messagesEndRef })
            ),

            // Input form
            React.createElement('form', {
                className: 'chat-input-form',
                onSubmit: handleSubmit
            },
            React.createElement('div', { className: 'flex flex-col gap-2' },
                
                React.createElement('div', { className: 'flex gap-2' },
                    React.createElement('input', {
                        type: 'text',
                        value: inputValue,
                        onChange: (e) => setInputValue(e.target.value),
                        placeholder: 'Ask about any UK town...',
                        className: 'chat-input'
                    }),
                    React.createElement('button', {
                        type: 'submit',
                        className: 'chat-submit',
                        style: {  // Add inline styles for immediate effect
                            minWidth: '80px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                        }
                    }, 'Send')
                )
            ))
        );
    };

    // Return the component
    return ChatBotComponent;
})();

// Export the component if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatBot;
}