// Clockwise order, transcribed from the supplied Junto Institute wheel.
// Every secondary emotion has two equally sized tertiary sectors.
export const emotions = [
  {
    name: 'Anger',
    children: [
      ['Rage', ['Hate', 'Hostile']],
      ['Exasperated', ['Agitated', 'Frustrated']],
      ['Irritable', ['Annoyed', 'Aggravated']],
      ['Envy', ['Resentful', 'Jealous']],
      ['Disgust', ['Contempt', 'Revolted']],
    ],
  },
  {
    name: 'Sadness',
    children: [
      ['Suffering', ['Agony', 'Hurt']],
      ['Sadness', ['Depressed', 'Sorrow']],
      ['Disappointed', ['Dismayed', 'Displeased']],
      ['Shameful', ['Regretful', 'Guilty']],
      ['Neglected', ['Isolated', 'Lonely']],
      ['Despair', ['Grief', 'Powerless']],
    ],
  },
  {
    name: 'Surprise',
    children: [
      ['Stunned', ['Shocked', 'Dismayed']],
      ['Confused', ['Disillusioned', 'Perplexed']],
      ['Amazed', ['Astonished', 'Awe-struck']],
      ['Overcome', ['Speechless', 'Astounded']],
      ['Moved', ['Stimulated', 'Touched']],
    ],
  },
  {
    name: 'Joy',
    children: [
      ['Content', ['Pleased', 'Satisfied']],
      ['Happy', ['Amused', 'Delighted']],
      ['Cheerful', ['Jovial', 'Blissful']],
      ['Proud', ['Triumphant', 'Illustrious']],
      ['Optimistic', ['Eager', 'Hopeful']],
      ['Enthusiastic', ['Excited', 'Zeal']],
      ['Elation', ['Euphoric', 'Jubilation']],
      ['Enthralled', ['Enchanted', 'Rapture']],
    ],
  },
  {
    name: 'Love',
    children: [
      ['Affectionate', ['Romantic', 'Fondness']],
      ['Longing', ['Sentimental', 'Attracted']],
      ['Desire', ['Passion', 'Infatuation']],
      ['Tenderness', ['Caring', 'Compassionate']],
      ['Peaceful', ['Relieved', 'Satisfied']],
    ],
  },
  {
    name: 'Fear',
    children: [
      ['Scared', ['Frightened', 'Helpless']],
      ['Terror', ['Panic', 'Hysterical']],
      ['Insecure', ['Inferior', 'Inadequate']],
      ['Nervous', ['Worried', 'Anxious']],
      ['Horror', ['Mortified', 'Dread']],
    ],
  },
];
