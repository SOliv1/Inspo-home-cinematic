
// ------------------------------
// Seasonal Helpers (exported)
// ------------------------------


export const getSeason = () => {
  const month = new Date().getMonth();

  if ([11, 0, 1].includes(month)) return 'winter';
  if (month === 2) return 'spring';
  if ([5, 6, 7].includes(month)) return 'summer';
  return 'autumn';
};

export const getSeasonalOrb = () => {
  const season = getSeason();

  const orbMap = {
    winter: '/orbs/winter/silver-moon-orb.png',
    spring: '/orbs/spring/blush-curtain-orb.png',
    summer: '/orbs/summer/solar-flare-orb.png',
    autumn: '/orbs/autumn/ember-arc-orb.png'
  };

  return orbMap[season];
};

export const getSeasonalAccent = () => {
  const season = getSeason();

  const accents = {
    winter: '#A0C4FF',
    spring: '#FBB1BD',
    summer: '#FFD166',
    autumn: '#FF9F1C'
  };

  return accents[season];
};

export const getSeasonalGreeting = () => {
  const season = getSeason();

  const greetings = {
    winter: 'A quiet winter glow',
    spring: 'The curtain lifts on spring',
    summer: 'High noon, radiant and alive',
    autumn: 'Warm embers of autumn'
  };

  return greetings[season];
};



export const getSeasonalQuote = () => {
  const season = getSeason();

   // Seasonal quotes
  const seasonalQuotes = {
    winter: "Even the quiet season has its glow.",
    spring: "New beginnings bloom softly.",
    summer: "Warmth finds its way into everything.",
    autumn: "Let go gently, and let beauty remain."
  }

  const quotes = {
    winter: 'In the quiet glow of winter, the world whispers.',
    spring: 'The curtain lifts; the world begins again.',
    summer: 'At high noon, everything is alive with light.',
    autumn: 'Warm embers carry us gently into reflection.'
  };

  return quotes[season];
};

export const seasonalQuotes = {
  winter: "Even the quiet season has its glow.",
  spring: "New beginnings bloom softly.",
  summer: "Warmth finds its way into everything.",
  autumn: "Let go gently, and let beauty remain."
};

