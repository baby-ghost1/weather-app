export const weatherFacts = [
  { title: "Lightning", fact: "Lightning strikes the Earth about 100 times per second. That's 8.6 million times a day." },
  { title: "Snow", fact: "No two snowflakes are exactly alike. Each has over 100 trillion ice crystals." },
  { title: "Rain", fact: "A single raindrop falls at about 14 mph and can contain 100,000 bacteria." },
  { title: "Wind", fact: "The fastest wind speed ever recorded was 253 mph on Mount Washington, NH in 1934." },
  { title: "Temperature", fact: "The hottest temperature recorded was 134°F (56.7°C) in Death Valley, 1913." },
  { title: "Clouds", fact: "A cumulonimbus cloud can weigh over 1.1 million pounds." },
  { title: "Fog", fact: "Fog is actually a cloud that forms at ground level." },
  { title: "Rainbow", fact: "A rainbow is actually a full circle. We only see the top half." },
  { title: "Tornado", fact: "Tornadoes can have wind speeds over 300 mph." },
  { title: "Hurricane", fact: "A hurricane releases energy equivalent to 10,000 nuclear bombs every 20 minutes." },
  { title: "Hail", fact: "The largest hailstone recorded was 8 inches in diameter, found in South Dakota." },
  { title: "Dew", fact: "Morning dew forms when objects cool below the dew point, causing condensation." },
  { title: "Frost", fact: "Frost is frozen dew that forms when the surface temperature drops below 0°C." },
  { title: "Aurora", fact: "Auroras happen when charged particles from the sun hit Earth's atmosphere." },
  { title: "Monsoon", fact: "The word 'monsoon' comes from Arabic 'mawsim' meaning 'season'." },
  { title: "Ice", fact: "Ice is less dense than water, which is why it floats." },
  { title: "Cold", fact: "Frostbite can occur in as little as 10 minutes at -30°F with wind." },
  { title: "Climate", fact: "Earth's climate has changed 5 major times in the past 4.5 billion years." },
  { title: "Thunder", fact: "Thunder can be heard from about 12 miles away." },
  { title: "Heat Index", fact: "The heat index is what temperature it feels like when humidity is added." },
];

export const quizQuestions = [
  { question: "What does AQI stand for?", options: ["Air Quality Index", "Atmospheric Quality Index", "Air Quantity Index", "Atmospheric Quantity Index"], correct: 0 },
  { question: "Which gas is most responsible for the greenhouse effect?", options: ["CO2", "O2", "N2", "Ar"], correct: 0 },
  { question: "At what temperature does water boil (at sea level)?", options: ["90°C", "100°C", "110°C", "120°C"], correct: 1 },
  { question: "What is the Beaufort scale used for?", options: ["Wind speed", "Earthquake intensity", "Temperature", "Humidity"], correct: 0 },
  { question: "What causes a rainbow?", options: ["Refraction and reflection of light", "UV radiation", "Ozone layer", "Air pressure"], correct: 0 },
  { question: "Which cloud type is associated with thunderstorms?", options: ["Cumulonimbus", "Cirrus", "Stratus", "Altocumulus"], correct: 0 },
  { question: "What instrument measures atmospheric pressure?", options: ["Barometer", "Thermometer", "Anemometer", "Hygrometer"], correct: 0 },
  { question: "The Saffir-Simpson scale categorizes what?", options: ["Hurricanes", "Tornadoes", "Earthquakes", "Tsunamis"], correct: 0 },
  { question: "What is the eye of a hurricane?", options: ["Clear center", "Outer edge", "Cloud wall", "Rain band"], correct: 0 },
  { question: "Which country experiences the most tornadoes?", options: ["USA", "India", "Australia", "Japan"], correct: 0 },
];

export const recipes = [
  { id: "hot-1", category: "hot", name: "Mango Lassi", icon: "🥭", time: "5 min", desc: "Cool down with a refreshing mango yogurt drink." },
  { id: "hot-2", category: "hot", name: "Lemonade", icon: "🍋", time: "3 min", desc: "Classic chilled lemonade to beat the heat." },
  { id: "hot-3", category: "hot", name: "Ice Cream Sundae", icon: "🍦", time: "10 min", desc: "Quick homemade sundae with your favorite toppings." },
  { id: "hot-4", category: "hot", name: "Cucumber Salad", icon: "🥒", time: "10 min", desc: "Light and refreshing cucumber salad with mint." },
  { id: "hot-5", category: "hot", name: "Cold Coffee", icon: "☕", time: "5 min", desc: "Blended iced coffee for an instant energy boost." },
  { id: "cold-1", category: "cold", name: "Hot Chocolate", icon: "🍫", time: "5 min", desc: "Rich and creamy hot chocolate to warm you up." },
  { id: "cold-2", category: "cold", name: "Tomato Soup", icon: "🍅", time: "20 min", desc: "Classic warm tomato soup perfect for cold days." },
  { id: "cold-3", category: "cold", name: "Ginger Tea", icon: "🫚", time: "10 min", desc: "Soothing ginger tea with honey and lemon." },
  { id: "cold-4", category: "cold", name: "Vegetable Stew", icon: "🥘", time: "30 min", desc: "Hearty vegetable stew with warm spices." },
  { id: "cold-5", category: "cold", name: "Oatmeal", icon: "🥣", time: "10 min", desc: "Warm oatmeal with nuts and honey." },
  { id: "rain-1", category: "rain", name: "Pakoras", icon: "🥟", time: "20 min", desc: "Crispy onion and spinach fritters for rainy evenings." },
  { id: "rain-2", category: "rain", name: "Chai", icon: "🫖", time: "10 min", desc: "Spiced masala chai to enjoy with the sound of rain." },
  { id: "rain-3", category: "rain", name: "Corn on the Cob", icon: "🌽", time: "15 min", desc: "Roasted corn with lemon and chili powder." },
  { id: "rain-4", category: "rain", name: "Noodles", icon: "🍜", time: "15 min", desc: "Quick hot noodle soup perfect for a rainy day." },
  { id: "default-1", category: "default", name: "Grilled Sandwich", icon: "🥪", time: "10 min", desc: "Classic grilled veggie sandwich." },
  { id: "default-2", category: "default", name: "Fruit Smoothie", icon: "🥤", time: "5 min", desc: "Mixed fruit smoothie with yogurt." },
  { id: "default-3", category: "default", name: "Salad Bowl", icon: "🥗", time: "10 min", desc: "Fresh garden salad with vinaigrette." },
];

export const playlists = [
  { condition: "Clear", songs: [{ title: "Here Comes the Sun", artist: "Beatles" }, { title: "Walking on Sunshine", artist: "Katrina & The Waves" }, { title: "Sunny", artist: "Bobby Hebb" }, { title: "Good Vibrations", artist: "Beach Boys" }, { title: "Island in the Sun", artist: "Weezer" }] },
  { condition: "Rain", songs: [{ title: "Singin' in the Rain", artist: "Gene Kelly" }, { title: "Rain", artist: "The Beatles" }, { title: "November Rain", artist: "Guns N' Roses" }, { title: "Purple Rain", artist: "Prince" }, { title: "Raindrops Keep Fallin'", artist: "B.J. Thomas" }] },
  { condition: "Clouds", songs: [{ title: "Clouds", artist: "Before You Exit" }, { title: "Both Sides Now", artist: "Joni Mitchell" }, { title: "Cloud Nine", artist: "The Temptations" }, { title: "A Sky Full of Stars", artist: "Coldplay" }, { title: "Feeling Good", artist: "Nina Simone" }] },
  { condition: "Snow", songs: [{ title: "Let It Snow", artist: "Dean Martin" }, { title: "White Christmas", artist: "Bing Crosby" }, { title: "Jingle Bell Rock", artist: "Bobby Helms" }, { title: "Winter Wonderland", artist: "Ella Fitzgerald" }, { title: "Cold", artist: "Chris Stapleton" }] },
  { condition: "Thunderstorm", songs: [{ title: "Thunder", artist: "Imagine Dragons" }, { title: "Riders on the Storm", artist: "The Doors" }, { title: "Thunderstruck", artist: "AC/DC" }, { title: "Storm", artist: "Lifehouse" }, { title: "Set Fire to the Rain", artist: "Adele" }] },
  { condition: "default", songs: [{ title: "Weather With You", artist: "Crowded House" }, { title: "Chasing the Sun", artist: "The Wanted" }, { title: "Sunshine", artist: "Gabrielle" }, { title: "Here Comes the Sun", artist: "Beatles" }, { title: "Walking on Sunshine", artist: "Katrina & The Waves" }] },
];

export const sounds = [
  { id: "rain", name: "Rain", icon: "🌧️" },
  { id: "thunder", name: "Thunderstorm", icon: "⛈️" },
  { id: "wind", name: "Wind", icon: "💨" },
  { id: "forest", name: "Forest", icon: "🌲" },
  { id: "ocean", name: "Ocean Waves", icon: "🌊" },
  { id: "fire", name: "Campfire", icon: "🔥" },
  { id: "night", name: "Night", icon: "🌙" },
  { id: "white-noise", name: "White Noise", icon: "⬜" },
];

export const seasonalEvents = [
  { name: "Spring Equinox", date: "Mar 20", type: "astronomical" },
  { name: "Summer Solstice", date: "Jun 21", type: "astronomical" },
  { name: "Autumn Equinox", date: "Sep 22", type: "astronomical" },
  { name: "Winter Solstice", date: "Dec 21", type: "astronomical" },
];

export const festivals = [
  { name: "Diwali", date: "Oct-Nov", type: "festival" },
  { name: "Holi", date: "Mar", type: "festival" },
  { name: "Independence Day", date: "Aug 15", type: "national" },
  { name: "Republic Day", date: "Jan 26", type: "national" },
];

export const themes = [
  { id: "ocean", name: "Ocean", colors: ["#0f2027", "#203a43", "#2c5364"] },
  { id: "sunset", name: "Sunset", colors: ["#ff7e5f", "#feb47b", "#ff6a88"] },
  { id: "forest", name: "Forest", colors: ["#134e5e", "#71b280", "#2c5e2a"] },
  { id: "night", name: "Night", colors: ["#0f0c29", "#302b63", "#24243e"] },
  { id: "rose", name: "Rose", colors: ["#e44d76", "#c850c0", "#ffecd2"] },
  { id: "default", name: "Default", colors: ["#1a9fff", "#6dd5fa", "#ffecd2"] },
];
