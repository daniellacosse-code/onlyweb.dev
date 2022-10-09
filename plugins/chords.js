import * as Tone from "tone";

const PITCH_NAME_LIST = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
];

const TONES_IN_OCTAVE = PITCH_NAME_LIST.length;
const BASE_OCTAVE = 4;

const ROOT = 0;
const MINOR_SECOND = 1;
const MAJOR_SECOND = 2;
const DIMINISHED_THIRD = 2;
const MINOR_THIRD = 3;
const MAJOR_THIRD = 4;
const AUGMENTED_THIRD = 5;
const PERFECT_FOURTH = 5;
const TRITONE = 6;
const PERFECT_FIFTH = 7;
const AUGMENTED_FIFTH = 8;
const MINOR_SIXTH = 8;
const MAJOR_SIXTH = 9;
const DIMINISHED_SEVENTH = 9;
const MINOR_SEVENTH = 10;
const MAJOR_SEVENTH = 11;
const MAJOR_NINTH = 14;
const MAJOR_ELEVENTH = 17;

export async function playChord(notes, duration) {
  if (Tone.context.state !== "running") {
    await Tone.context.resume();
    await Tone.start();
  }

  const piano = new Tone.Sampler({
    baseUrl: "https://tonejs.github.io/audio/salamander/",
    onload: () => {
      piano.triggerAttackRelease(
        notes.map((note) => `${note}${BASE_OCTAVE}`),
        duration
      );
    },
    urls: {
      A4: "A4.mp3",
      C4: "C4.mp3",
      "D#4": "Ds4.mp3",
      "F#4": "Fs4.mp3"
    }
  }).toDestination();
}

export function parseChord(chordString) {
  const [root, shape] = [getChordRoot(chordString), getChordShape(chordString)];

  return shape.map((offset) => {
    const scaleDegree = root + offset;
    return PITCH_NAME_LIST[scaleDegree % TONES_IN_OCTAVE];
  });
}

function getChordRoot(symbol) {
  const [mainDegree, modifierDegree] = symbol
    .split("/")
    .map((chord) =>
      getScaleInterval(chord.match(/([b#]?[iI]{0,2}[vV]?[iI]{0,2})/)[1])
    );

  if (typeof mainDegree !== "number") throw new Error();

  return (mainDegree + (modifierDegree ?? 0)) % TONES_IN_OCTAVE;
}

export function getChordShape(symbol) {
  let shape;

  if (symbol.match(/dim|m7b5/)) {
    shape = [ROOT, MINOR_THIRD, TRITONE, TONES_IN_OCTAVE];
  } else if (symbol.match(/aug|\+/)) {
    shape = [ROOT, MAJOR_THIRD, AUGMENTED_FIFTH, TONES_IN_OCTAVE];
  } else if (
    symbol.toLowerCase() === symbol ||
    (symbol.match(/m|min/) && !symbol.match("maj"))
  ) {
    shape = [ROOT, MINOR_THIRD, PERFECT_FIFTH, TONES_IN_OCTAVE];
  } else {
    // assume major triad
    shape = [ROOT, MAJOR_THIRD, PERFECT_FIFTH, TONES_IN_OCTAVE];
  }

  if (symbol.match("sus2")) {
    shape[1] = DIMINISHED_THIRD;
  } else if (symbol.match("sus4")) {
    shape[1] = AUGMENTED_THIRD;
  }

  if (symbol.match("M7")) {
    shape[3] = MAJOR_SEVENTH;
  } else if (symbol.match("dim7")) {
    shape[3] = DIMINISHED_SEVENTH;
  } else if (symbol.match("7")) {
    shape[3] = MINOR_SEVENTH;
  }

  if (symbol.match("add9")) {
    shape.push(MAJOR_NINTH);
  }

  if (symbol.match("add11")) {
    shape.push(MAJOR_ELEVENTH);
  }

  return shape;
}

function getScaleInterval(symbol) {
  switch (symbol) {
    case "#vii":
    case "#VII":
    case "i":
    case "I":
      return ROOT;
    case "#i":
    case "#I":
    case "bii":
    case "bII":
      return MINOR_SECOND;
    case "ii":
    case "II":
      return MAJOR_SECOND;
    case "#ii":
    case "#II":
    case "biii":
    case "bIII":
      return MINOR_THIRD;
    case "iii":
    case "III":
    case "biv":
    case "bIV":
      return MAJOR_THIRD;
    case "#iii":
    case "#III":
    case "iv":
    case "IV":
      return PERFECT_FOURTH;
    case "#iv":
    case "#IV":
    case "bv":
    case "bV":
      return TRITONE;
    case "v":
    case "V":
      return PERFECT_FIFTH;
    case "#v":
    case "#V":
    case "bvi":
    case "bVI":
      return MINOR_SIXTH;
    case "vi":
    case "VI":
      return MAJOR_SIXTH;
    case "#vi":
    case "#VI":
    case "bvii":
    case "bVII":
      return MINOR_SEVENTH;
    case "vii":
    case "VII":
    case "bi":
    case "bI":
      return MAJOR_SEVENTH;
    default:
      throw new RangeError();
  }
}
