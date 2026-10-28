import { explorerSectors, families, emotionInfo } from '../explorer/explorer-data.js';

const aliases = {
  Offended: 'Hurt', Hateful: 'Hate', Mad: 'Anger', Aggressive: 'Hostile', Irritated: 'Irritable',
  Disapproval: 'Disgust', Awful: 'Suffering', Aversion: 'Disgust', Shame: 'Shameful', Guilt: 'Guilty',
  Happy: 'Joy', Sad: 'Sadness', Intimate: 'Love', Courageous: 'Hopeful', Curious: 'Enthusiastic',
  Excitement: 'Excited', Awe: 'Awe-struck', Confusion: 'Confused', Shock: 'Shocked',
  Unwanted: 'Neglected', Embarrassed: 'Mortified', Distant: 'Isolated', Critical: 'Displeased', Apathetic: 'Depressed',
  grief: 'Grief', sadness: 'Sadness', despair: 'Despair', emptiness: 'Lonely', hopelessness: 'Despair',
  anxiety: 'Anxious', worry: 'Worried', stress: 'Nervous', panic: 'Panic', confusion: 'Confused', overload: 'Overcome',
  fear: 'Fear', dread: 'Dread', unease: 'Nervous', vulnerability: 'Insecure', insecurity: 'Insecure', hesitation: 'Scared',
  jealousy: 'Jealous', envy: 'Envy', inadequacy: 'Inadequate', 'self-doubt': 'Insecure', resentment: 'Resentful', bitterness: 'Resentful',
  shame: 'Shameful', guilt: 'Guilty', embarrassment: 'Mortified', regret: 'Regretful', 'self-blame': 'Guilty', 'disappointment in self': 'Disappointed',
  belonging: 'Love', closeness: 'Affectionate', trust: 'Peaceful', affection: 'Affectionate', warmth: 'Tenderness', acceptance: 'Content',
  loneliness: 'Lonely', invisibility: 'Neglected', distance: 'Isolated', isolation: 'Isolated', exclusion: 'Neglected', rejection: 'Hurt',
  defensiveness: 'Insecure', injustice: 'Anger', annoyance: 'Annoyed', frustration: 'Frustrated', anger: 'Anger',
  helplessness: 'Helpless', resignation: 'Powerless', impatience: 'Irritable', discouragement: 'Disappointed', disappointment: 'Disappointed',
  ease: 'Peaceful', gratitude: 'Touched', contentment: 'Content', calm: 'Peaceful', happiness: 'Happy', joy: 'Joy',
  inspiration: 'Enthusiastic', motivation: 'Eager', excitement: 'Excited', hope: 'Hopeful', curiosity: 'Enthusiastic', interest: 'Enthralled',
  'self-compassion': 'Compassionate', pride: 'Proud', insight: 'Moved', awareness: 'Content',
};
const definitions = {
  gratitude: 'A feeling of appreciation for something meaningful, helpful, or welcome.',
  motivation: 'A sense of energy or willingness to work toward something that matters.',
  inspiration: 'Feeling sparked by a new idea, example, or possibility.',
  curiosity: 'Feeling interested in learning more or exploring something unfamiliar.',
  interest: 'A pull of attention toward something you want to know or experience.',
  stress: 'Feeling pressure when demands stretch your available energy or capacity.',
  emptiness: 'A hollow or absent sense of feeling, meaning, or connection.',
  overload: 'Feeling that more information, demands, or feelings are arriving than you can take in.',
  Distant: 'Feeling emotionally far away or less inclined to engage.',
  Critical: 'Focusing on faults or shortcomings in something that matters to you.',
  Disapproval: 'Feeling that an action or situation goes against your values or expectations.',
  Awful: 'Feeling deeply unpleasant, distressed, or uncomfortable.',
  Aversion: 'A strong wish to turn away from something that feels unpleasant.',
  Shame: 'A painful feeling of being exposed, inadequate, or negatively judged.',
  Apathetic: 'Feeling little interest, concern, or motivation to engage.',
  Intimate: 'Feeling close, safe, and open with someone.',
  Courageous: 'Feeling willing to act despite discomfort, uncertainty, or fear.',
  Curious: 'Feeling interested in learning more about something.',
  Unwanted: 'Feeling that your presence or wish for connection is not welcomed.',
  Embarrassed: 'Feeling self-conscious after a moment leaves you exposed or draws unwanted attention.',
  trust: 'A sense that you can rely on someone, something, or your own judgment.',
  acceptance: 'Making room for a situation or feeling as it is right now.',
  awareness: 'Noticing what is happening within you or around you.',
  insight: 'A new understanding of an experience, pattern, or part of yourself.',
  'self-compassion': 'Meeting your own difficulty with care rather than harsh judgment.',
};
function infoFor(name) {
  const info = emotionInfo[name] || emotionInfo[aliases[name]];
  if (!info) throw new Error(`Missing wheel content for ${name}`);
  return { ...info, definition: definitions[name] || info.definition };
}
const tint = (hex, amount) => '#' + hex.slice(1).match(/../g).map(v => Math.round(parseInt(v, 16) * (1 - amount) + 255 * amount).toString(16).padStart(2, '0')).join('');
const title = text => text.charAt(0).toUpperCase() + text.slice(1);

// Clockwise transcription of the supplied sensation and behavior references.
// Each row is a secondary emotion, its two sensations, and one behavior.
const groups = [
  { name: 'Anger', sensationColor: '#e7a8a5', behaviorColor: '#f492b2', rows: [
    ['Offended', ['Lip-tremble', 'Limp'], 'Getting defensive', 'Protecting yourself from criticism by explaining, denying, or pushing back.'],
    ['Insecure', ['Hiding', 'Hot'], 'Showing off', 'Drawing attention to abilities or possessions to feel noticed or valued.'],
    ['Hateful', ['Scowling', 'Turning away'], 'Saying mean things', 'Using hurtful words to express strong rejection or hostility.'],
    ['Mad', ['Loud words', 'Flushed'], 'Yelling or storming off', 'Raising your voice or leaving abruptly when anger is hard to contain.'],
    ['Aggressive', ['Heart racing', 'Clenching'], 'Picking a fight', 'Moving toward confrontation or provoking an argument.'],
    ['Irritated', ['Tight jaw', 'Headache'], 'Not listening', 'Struggling to take in what someone is saying while irritation holds your attention.'],
    ['Distant', ['Numb', 'Gut-turning'], 'Ignoring', 'Withholding attention or response and stepping back from contact.'],
    ['Critical', ['Feeling hot', 'Lip curled'], 'Giving feedback unkindly', 'Pointing out a problem in a sharp, dismissive, or hurtful way.'],
  ] },
  { name: 'Disgust', sensationColor: '#b5aed0', behaviorColor: '#b0a0d5', rows: [
    ['Disapproval', ['Shuddering', 'Writhing'], 'Telling them they’re wrong', 'Directly challenging another person’s view or actions.'],
    ['Disappointed', ['Need to move', 'Face-scrunched'], 'Withdrawing trust', 'Becoming more guarded after an expectation or promise is not met.'],
    ['Awful', ['Nausea', 'Lump in throat'], 'Expressing disgust', 'Showing strong rejection through words, expression, or turning away.'],
    ['Aversion', ['Queasy', 'Turn away'], 'Avoiding or leaving', 'Creating distance from something that feels unpleasant or unwelcome.'],
  ] },
  { name: 'Sad', sensationColor: '#9fbfcf', behaviorColor: '#86c7e5', rows: [
    ['Shame', ['Looking down', 'Empty'], 'Hiding or blaming', 'Trying to escape exposure by becoming less visible or shifting responsibility.'],
    ['Apathetic', ['Curling up', 'Crying'], 'Giving up or not caring', 'Pulling effort or attention away when engagement feels difficult.'],
    ['Despair', ['Body aches', 'Tiredness'], 'Shutting down', 'Becoming quiet, still, or less able to keep engaging with what is happening.'],
    ['Depressed', ['Hollow feeling', 'Slow heart'], 'Low energy', 'Moving slowly or finding ordinary tasks harder to begin.'],
    ['Lonely', ['Teariness', 'Weak'], 'Clingy or dismissive', 'Seeking repeated reassurance or pulling away while wanting connection.'],
    ['Guilt', ['Eye rolls', 'Tensing up'], 'Fessing up or telling truth', 'Acknowledging what happened and taking responsibility for your part.'],
  ] },
  { name: 'Happy', sensationColor: '#abe1c9', behaviorColor: '#a2dfb8', rows: [
    ['Optimistic', ['Buzzing', 'Light'], 'Solution-seeking', 'Looking for a workable next step and imagining how things could improve.'],
    ['Intimate', ['Warm', 'Sensitive'], 'Sharing touch', 'Expressing closeness through welcome, consensual physical contact.'],
    ['Peaceful', ['Still', 'Relaxed'], 'Being still', 'Resting in a quiet moment without feeling a need to act.'],
    ['Courageous', ['Steady', 'Jaw set'], 'Sticking up for self or others', 'Speaking or acting in support of a need, boundary, or person despite discomfort.'],
    ['Satisfied', ['Calm', 'Soft'], 'Admiring', 'Pausing to appreciate a result, experience, or quality you value.'],
    ['Proud', ['Tall', 'Inflated'], 'Boasting and bragging', 'Drawing attention to an achievement or quality that feels important to you.'],
    ['Curious', ['Brow-furrowed', 'Awake'], 'Questioning and listening', 'Asking for more information and making room for an answer.'],
    ['Joy', ['Energetic', 'Open'], 'Being cheerful', 'Sharing a light expression, lively movement, or warm engagement.'],
  ] },
  { name: 'Surprise', sensationColor: '#f5eab0', behaviorColor: '#f1e783', rows: [
    ['Excitement', ['Jumpy', 'Electrified'], 'Talking fast and smiling', 'Expressing rising energy through quick words and a bright expression.'],
    ['Awe', ['Eyebrows up', 'Jaw drop'], 'Being mindful and reverent', 'Pausing with attentive respect or wonder at what you are experiencing.'],
    ['Confusion', ['Speechless', 'Breathless'], 'Head tilting and questions', 'Showing uncertainty while trying to make sense of something.'],
    ['Shock', ['Sweaty palms', 'Startled'], 'Silence, then reaction', 'Taking a moment to register the unexpected before responding.'],
  ] },
  { name: 'Fear', sensationColor: '#f2cdb4', behaviorColor: '#f8c49c', rows: [
    ['Scared', ['Trembling', 'Numb hands'], 'Getting away', 'Moving toward distance, safety, or an exit when something feels threatening.'],
    ['Anxious', ['Fidgety', 'Foot tapping'], 'Fidgeting and discomfort', 'Making repeated small movements while feeling unsettled.'],
    ['Powerless', ['Racing heart', 'Quiet'], 'Giving up or acting out', 'Withdrawing effort or reacting strongly when influence feels out of reach.'],
    ['Inferior', ['Frozen', 'Tense'], 'Trying to fit in', 'Adjusting what you say or do in the hope of feeling accepted.'],
    ['Unwanted', ['Cold', 'Unsteady'], 'Isolating', 'Creating distance from others when connection feels unwelcome or uncertain.'],
    ['Embarrassed', ['Blushing', 'Tender'], 'Covering up the source', 'Trying to hide or explain the part of a moment that feels exposing.'],
  ] },
];
const sensationDefinitions = {
  'Lip-tremble': 'A small quiver or shaking in the lips.', Limp: 'A sense of reduced firmness or energy in the body.',
  Hiding: 'An urge to make the body less visible or draw inward.', Hot: 'A noticeable rise in warmth in the face or body.',
  Scowling: 'Tension around the brow, eyes, or mouth that forms a frown.', 'Turning away': 'An impulse to turn the face or body away from something.',
  'Loud words': 'A voice that comes out louder or with more force than usual.', Flushed: 'Warmth or visible color rising in the face.',
  'Heart racing': 'A heartbeat that feels faster or more noticeable.', Clenching: 'Muscles tightening firmly, often in the hands or jaw.',
  'Tight jaw': 'Pressure or held tension in the jaw muscles.', Headache: 'Aching, pressure, or discomfort in the head.',
  Numb: 'A muted or reduced sense of sensation or feeling.', 'Gut-turning': 'An unsettled twisting or rolling feeling in the stomach.',
  'Feeling hot': 'Heat rising through the face, chest, or rest of the body.', 'Lip curled': 'Tension lifting one side of the upper lip.',
  Shuddering: 'A brief ripple of shaking through the body.', Writhing: 'An urge to twist or shift the body in discomfort.',
  'Need to move': 'Restless energy that makes staying still difficult.', 'Face-scrunched': 'Tightening around the nose, eyes, or mouth.',
  Nausea: 'An uneasy stomach sensation that can feel close to being sick.', 'Lump in throat': 'A feeling of tightness or fullness in the throat.',
  Queasy: 'A mildly unsettled or uncomfortable feeling in the stomach.', 'Turn away': 'An urge to move attention, face, or body away.',
  'Looking down': 'Eyes or head lowering rather than meeting what is in front of you.', Empty: 'A hollow or absent feeling, often noticed in the chest or belly.',
  'Curling up': 'An urge to draw the limbs closer and make the body smaller.', Crying: 'Tears arriving, sometimes with changes in breathing or facial tension.',
  'Body aches': 'Dull soreness or heaviness across parts of the body.', Tiredness: 'Low energy or a sense that the body needs rest.',
  'Hollow feeling': 'A sense of emptiness or space in the chest or stomach.', 'Slow heart': 'A sense that the heartbeat or the body’s pace has slowed.',
  Teariness: 'Prickly eyes or tears gathering near the surface.', Weak: 'A sense of reduced strength or steadiness.',
  'Eye rolls': 'Eyes moving upward or away in a brief gesture.', 'Tensing up': 'Muscles becoming more held or rigid.',
  Buzzing: 'A lively tingling or vibrating sense of energy.', Light: 'A feeling of ease, lift, or reduced heaviness.',
  Warm: 'A comfortable sense of warmth in the body.', Sensitive: 'Sensations or touch feeling more noticeable than usual.',
  Still: 'A settled body with little impulse to move.', Relaxed: 'An easing of held muscle tension or effort.',
  Steady: 'A grounded sense of balance, breathing, or physical readiness.', 'Jaw set': 'The jaw held firmly in place.',
  Calm: 'A quieter, more settled pace in the body.', Soft: 'Muscles and expression feeling less held or guarded.',
  Tall: 'A sense of lifting or lengthening through the posture.', Inflated: 'A feeling of expansion or fullness in the chest and posture.',
  'Brow-furrowed': 'A small gathering of tension between the eyebrows.', Awake: 'A more alert or attentive physical state.',
  Energetic: 'A ready supply of movement or physical vitality.', Open: 'A sense of space, expansion, or less guarding in the body.',
  Jumpy: 'A readiness to move or startle quickly.', Electrified: 'A strong, sudden sense of energy moving through the body.',
  'Eyebrows up': 'Eyebrows lifting as attention is caught.', 'Jaw drop': 'The mouth opening or jaw lowering briefly.',
  Speechless: 'A moment when words do not come easily.', Breathless: 'A brief sense of catching or losing the rhythm of the breath.',
  'Sweaty palms': 'Moisture or clamminess on the palms.', Startled: 'A sudden jolt, flinch, or sharp shift in attention.',
  Trembling: 'Small, involuntary shaking or quivering in the body.', 'Numb hands': 'Muted sensation, tingling, or an unfamiliar feeling in the hands.',
  Fidgety: 'An urge to keep making small, repeated movements.', 'Foot tapping': 'A foot moving repeatedly against the ground.',
  'Racing heart': 'A heartbeat that feels quicker or stronger than usual.', Quiet: 'A tendency for the voice or body to become less active.',
  Frozen: 'A sense of becoming still or finding movement difficult to begin.', Tense: 'Muscles feeling tight, held, or braced.',
  Cold: 'A feeling of coolness or reduced warmth in the body.', Unsteady: 'A sense of wobbliness or reduced physical confidence.',
  Blushing: 'Warmth or color rising in the cheeks or face.', Tender: 'A soft, vulnerable, or easily affected bodily feeling.',
};

function buildEmbodiedModel(kind) {
  const sectors = [], roots = [];
  const isBody = kind === 'sensations';
  let angle = -90;
  for (const group of groups) {
    const color = isBody ? group.sensationColor : group.behaviorColor;
    const primary = { name: group.name, ring: 0, start: angle, end: angle + group.rows.length * 10, color, index: sectors.length, info: infoFor(group.name) };
    primary.primary = primary;
    sectors.push(primary); roots.push(primary);
    group.rows.forEach(([name, sensations, behavior, behaviorDefinition], row) => {
      const base = infoFor(name);
      const secondary = { name, ring: 1, start: angle, end: angle + 10, color: tint(color, row % 2 ? .14 : .07), index: sectors.length, primary, parent: null,
        info: { ...base, somaticExperiences: sensations.map(term => sensationDefinitions[term]), responses: [behaviorDefinition, ...base.responses.slice(0, 2)] } };
      sectors.push(secondary);
      const names = isBody ? sensations : [behavior];
      names.forEach((label, i) => sectors.push({ name: label, ring: 2, start: angle + i * 10 / names.length, end: angle + (i + 1) * 10 / names.length,
        color: tint(color, isBody ? .12 + i * .09 : .1), index: sectors.length, primary, parent: secondary,
        info: { ...base, definition: isBody ? sensationDefinitions[label] : behaviorDefinition } }));
      angle += 10;
    });
  }
  return { id: kind, label: isBody ? 'Sensations' : 'Behaviors', sectors, families: roots, radii: [315, 465, 760, 1157], initialName: 'Happy', source: 'Lindsay Braman', sourceUrl: 'https://lindsaybraman.com/', stroke: isBody ? '#50554f' : '#ffffff', strokeWidth: isBody ? 2.5 : 7, petals: !isBody };
}
const situations = [
  ['We feel hurt', '#e59aa8', ['grief', 'sadness', 'despair', 'emptiness', 'hopelessness'], 'A loss, wound, or disappointment can bring several kinds of pain.', ['What feels hurt or lost here?', 'What kind of care would feel supportive?']],
  ['We feel overwhelmed', '#edb899', ['anxiety', 'worry', 'stress', 'panic', 'confusion', 'overload'], 'Demands or feelings can arrive faster than you feel able to process them.', ['What is asking for your attention?', 'What could become smaller or wait?']],
  ['Life feels unsafe or uncertain', '#eedb9a', ['fear', 'dread', 'unease', 'vulnerability', 'insecurity', 'hesitation'], 'A threat or unknown outcome can make it harder to feel settled.', ['What feels uncertain right now?', 'What would help you feel a little steadier?']],
  ['We compare ourselves', '#c4c18d', ['jealousy', 'envy', 'inadequacy', 'self-doubt', 'resentment', 'bitterness'], 'Measuring yourself against someone else can bring up wishes and doubts.', ['What does this comparison seem to promise?', 'What need or wish is underneath it?']],
  ['We feel we are not enough', '#97d1c1', ['shame', 'guilt', 'embarrassment', 'regret', 'self-blame', 'disappointment in self'], 'A painful judgment about yourself can bring a mix of tender feelings.', ['What are you asking yourself to live up to?', 'What would a kinder description of this moment sound like?']],
  ['We want connection', '#9cc8dc', ['belonging', 'closeness', 'trust', 'affection', 'warmth', 'acceptance'], 'Wanting to feel close, welcome, and understood can take several forms.', ['What kind of connection are you wanting?', 'Who or what helps you feel welcome?']],
  ['We feel disconnected from others', '#a8b8d5', ['loneliness', 'invisibility', 'distance', 'isolation', 'exclusion', 'rejection'], 'A gap between the connection you want and feel can bring loneliness or hurt.', ['Where do you notice the distance?', 'What small form of contact would feel possible?']],
  ['We are treated unfairly', '#c1a2d0', ['defensiveness', 'resentment', 'injustice', 'annoyance', 'frustration', 'anger'], 'Feeling overlooked or wronged can signal a need, value, or boundary.', ['What feels unfair about this?', 'What would you want understood or changed?']],
  ['Things do not go to plan', '#dc9cc1', ['helplessness', 'resignation', 'impatience', 'discouragement', 'frustration', 'disappointment'], 'An interrupted expectation can bring disappointment, resistance, or a sense of lost influence.', ['What outcome were you hoping for?', 'What is still within your influence?']],
  ['Life feels good', '#eab4bc', ['ease', 'gratitude', 'contentment', 'calm', 'happiness', 'joy'], 'Comfort, pleasure, and connection can be worth noticing in their quieter forms.', ['What feels good in this moment?', 'What would you like to take in or remember?']],
  ['We feel open and engaged', '#e2cf98', ['inspiration', 'motivation', 'excitement', 'hope', 'curiosity', 'interest'], 'Something catches your interest and invites you to move toward it.', ['What is drawing your attention?', 'What would you like to explore next?']],
  ['We reflect on ourselves', '#c6b49a', ['self-compassion', 'pride', 'acceptance', 'insight', 'awareness'], 'Looking inward can bring understanding, care, or a new view of an experience.', ['What are you noticing about yourself?', 'What understanding would you like to carry forward?']],
];
function buildSituations() {
  const sectors = [], roots = [];
  situations.forEach(([name, color, words, definition, prompts], i) => {
    const start = -90 + i * 30;
    const primary = { name, ring: 0, start, end: start + 30, color, index: sectors.length,
      info: { definition, sections: [
        { title: 'Feelings you may notice', items: [words.slice(0, 3).map(title).join(', ') + '.', words.slice(3).map(title).join(', ') + '.'] },
        { title: 'A question to sit with', items: prompts },
      ] } };
    primary.primary = primary;
    sectors.push(primary); roots.push(primary);
    words.forEach((word, j) => sectors.push({ name: title(word), ring: 1, start: start + j * 30 / words.length, end: start + (j + 1) * 30 / words.length,
      color: tint(color, .17 + (j % 2) * .07), index: sectors.length, primary, parent: null, info: infoFor(word) }));
  });
  return { id: 'situations', label: 'Situations', sectors, families: roots, radii: [390, 790, 1157], initialName: 'Life feels good', source: 'Social Workers Toolbox', sourceUrl: 'https://www.socialworkerstoolbox.com/', stroke: '#ffffff', strokeWidth: 4 };
}

export const wheelModels = [
  { id: 'feelings', label: 'Feelings', sectors: explorerSectors, families, radii: [120, 407, 771, 1157], initialName: 'Joy', source: 'The Junto Institute', sourceUrl: 'https://www.thejuntoinstitute.com/', original: true },
  buildSituations(), buildEmbodiedModel('sensations'), buildEmbodiedModel('behaviors'),
];
