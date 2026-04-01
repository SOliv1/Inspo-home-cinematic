// src/utils/tagline/taglineEngine.js

// --- 1. Tagline Data --------------------------------------------------------

const taglines = {
  dawn: {
    warm: [
      "A gentle glow rises; begin with what feels true.",
      "Begin where the warmth is."
    ],
    tender: [
      "The day opens quietly; choose the next frame with care.",
      "Let clarity arrive in small, kind pieces."
    ]
  },

  midday: {
    warm: [
      "Your story moves forward one honest step at a time.",
      "A small intention can shift the whole horizon."
    ],
    tender: [
      "One clear action brings the whole day into focus.",
      "Breathe, choose, begin; the rest will follow."
    ]
  },

  dusk: {
    warm: [
      "Let the light guide you to the task that matters."
    ],
    tender: [
      "Move gently ~ the moment is already enough.",
      "Let your focus settle like light on still water."
    ]
  },

  night: {
    warm: [
      "The scene is set ~ start where your heart feels steady."
    ],
    tender: [
      "Let clarity arrive in small, kind pieces.",
      "Move gently; the moment is already enough."
    ]
  }
};


// --- 2. Time-of-Day Logic ---------------------------------------------------

function getTimeOfDay() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) return "dawn";
  if (hour >= 11 && hour < 17) return "midday";
  if (hour >= 17 && hour < 21) return "dusk";
  return "night";
}


// --- 3. Tagline Selection Logic --------------------------------------------

export function getTagline(mood = "neutral") {
  const time = getTimeOfDay();
  const bucket = taglines[time];

  let pool = [];

  if (mood === "warm" || mood === "energised") {
    pool = [...bucket.warm, ...bucket.tender]; // warm first
  } else if (mood === "low" || mood === "tender") {
    pool = [...bucket.tender, ...bucket.warm]; // tender first
  } else {
    pool = [...bucket.warm, ...bucket.tender]; // neutral blend
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}



