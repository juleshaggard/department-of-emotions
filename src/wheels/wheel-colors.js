// Perceptual palette anchors: [lightness, chroma, hue, branch hue sweep].
// These are separate from the source Feelings palette and its saved settings.
const embodiedPalettes = {
  sensations: {
    Anger: [0.79, 0.115, 27, [10, 44]],
    Disgust: [0.80, 0.10, 305, [320, 287]],
    Sad: [0.81, 0.105, 247, [266, 226]],
    Happy: [0.83, 0.105, 170, [187, 149]],
    Surprise: [0.88, 0.12, 90, [103, 78]],
    Fear: [0.84, 0.11, 58, [72, 43]],
  },
  behaviors: {
    Anger: [0.79, 0.15, 350, [365, 338]],
    Disgust: [0.79, 0.13, 294, [310, 278]],
    Sad: [0.82, 0.12, 225, [240, 207]],
    Happy: [0.85, 0.14, 140, [155, 125]],
    Surprise: [0.90, 0.145, 96, [108, 85]],
    Fear: [0.83, 0.135, 50, [65, 34]],
  },
};

const situationPalettes = {
  'We feel hurt': [0.79, 0.14, 5],
  'We feel overwhelmed': [0.84, 0.13, 45],
  'Life feels unsafe or uncertain': [0.88, 0.14, 88],
  'We compare ourselves': [0.83, 0.13, 125],
  'We feel we are not enough': [0.81, 0.12, 160],
  'We want connection': [0.83, 0.105, 199],
  'We feel disconnected from others': [0.79, 0.12, 249],
  'We are treated unfairly': [0.79, 0.135, 286],
  'Things do not go to plan': [0.80, 0.14, 323],
  'Life feels good': [0.84, 0.125, 359],
  'We feel open and engaged': [0.89, 0.14, 70],
  'We reflect on ourselves': [0.80, 0.10, 35],
};

function linearRgb(lightness, chroma, hue) {
  const angle = hue * Math.PI / 180;
  const a = chroma * Math.cos(angle), b = chroma * Math.sin(angle);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

// Reduce chroma for sRGB rather than clipping individual channels and shifting hue.
function fill(lightness, chroma, hue) {
  const inGamut = rgb => rgb.every(channel => channel >= 0 && channel <= 1);
  let rgb = linearRgb(lightness, chroma, hue);
  if (!inGamut(rgb)) {
    let low = 0, high = chroma;
    for (let i = 0; i < 20; i++) {
      const candidate = (low + high) / 2;
      if (inGamut(linearRgb(lightness, candidate, hue))) low = candidate;
      else high = candidate;
    }
    rgb = linearRgb(lightness, low, hue);
  }
  return '#' + rgb.map(channel => {
    const value = channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;
    return Math.round(Math.max(0, Math.min(1, value)) * 255).toString(16).padStart(2, '0');
  }).join('');
}

export function embodiedPalette(kind, family, count) {
  const [lightness, chroma, hue, sweep] = embodiedPalettes[kind][family];
  const lift = Math.min(0.055, (0.94 - lightness) * 0.75);
  return {
    core: fill(lightness, chroma, hue),
    branches: Array.from({ length: count }, (_, index) => {
      const progress = count > 1 ? index / (count - 1) : 0.5;
      const branchHue = sweep[0] + (sweep[1] - sweep[0]) * progress;
      const middleLightness = lightness + lift + 0.012 * progress;
      return {
        middle: fill(middleLightness, chroma * 0.74, branchHue),
        leaves: kind === 'sensations' ? [
          fill(middleLightness - 0.045, chroma * 0.98, branchHue - 2),
          fill(Math.min(0.95, middleLightness + 0.018), chroma * 0.55, branchHue + 2),
        ] : [fill(middleLightness - (index % 2 ? 0.015 : 0.055), chroma * (index % 2 ? 0.86 : 1.05), branchHue)],
      };
    }),
  };
}

export function situationPalette(name, count) {
  const [lightness, chroma, hue] = situationPalettes[name];
  return {
    core: fill(lightness, chroma, hue),
    leaves: Array.from({ length: count }, (_, index) => {
      const progress = count > 1 ? index / (count - 1) : 0.5;
      const soft = index % 2 === 1;
      return fill(
        Math.min(0.95, lightness + (soft ? 0.065 : 0.015) + progress * 0.015),
        chroma * (soft ? 0.58 : 0.94),
        hue - 9 + progress * 18,
      );
    }),
  };
}
