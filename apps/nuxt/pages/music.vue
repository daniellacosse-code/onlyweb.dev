<script setup>
import { playChord, parseChord } from "@only-web/chords";

const { public: { music, MILLISECONDS_PER_SECOND,
  SECONDS_PER_MINUTE } } = useRuntimeConfig();

let highlightPointer = 0;
let remainingChords = [];
let sequencePlayerID = null;

const isPlaying = ref(false);
const isPreparingToPlay = ref(false);
const chordInstructions = ref(music.playerChordInstructionsDefault);
const chordInstructionsInput = ref(null);
const displayedNotes = ref(music.playerNoteReadoutDefault);
const bpm = ref(music.playerBeatsPerMinuteDefault);
const bpmMS = computed(() => (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE) / bpm.value);

function startSequence() {
  isPreparingToPlay.value = true;
  remainingChords = chordInstructions.value.split(/\s+/).reverse();
  sequencePlayerID = setInterval(playNextChord, bpmMS.value);
}

function highlightChord(chordString) {
  const currentChordIndex = chordInstructions.value.indexOf(
    chordString,
    highlightPointer
  );

  highlightPointer = currentChordIndex + chordString.length;

  chordInstructionsInput.value.setSelectionRange(
    currentChordIndex,
    highlightPointer
  );

  chordInstructionsInput.value.focus();
}

async function playNextChord() {
  [isPlaying.value, isPreparingToPlay.value] = [true, false];

  const currentChordString = remainingChords.pop();

  if (!currentChordString) return;
  if (!remainingChords.length) setTimeout(stopSequence, bpmMS.value);

  highlightChord(currentChordString);

  displayedNotes.value = parseChord(currentChordString);

  await playChord(displayedNotes.value, (bpmMS.value / MILLISECONDS_PER_SECOND).toFixed(1));
}

function stopSequence() {
  clearInterval(sequencePlayerID);

  [
    isPlaying.value,
    highlightPointer,
    displayedNotes.value,
    remainingChords
  ] = [false, 0, music.playerNoteReadoutDefault, []];

  chordInstructionsInput.value.blur();
}
</script>

<template>
  <div class="Music">
    <div class="MusicNotes__container">
      <ol class="MusicNotes">
        <li class="MusicNote" v-for="(note, index) in displayedNotes"
          :key="note + index">
          {{ note }}
        </li>
      </ol>
    </div>

    <fieldset class="MusicInputs">
      <label>
        Chords
        <textarea type="textarea" v-model="chordInstructions"
          ref="chordInstructionsInput"></textarea>
      </label>

      <label>
        Beats per minute (BPM)
        <input class="MusicInput" type="number" v-model="bpm" min="24"
          max="300" />
      </label>
    </fieldset>

    <button v-if="isPlaying" @click.stop.prevent="stopSequence()"
      :disabled="isPreparingToPlay">
      🛑 cancel
    </button>

    <button v-else @click.stop.prevent="startSequence()">
      ▶️ play
    </button>
  </div>

</template>

<style scoped>
.Music {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
  width: 100%;
}

.MusicInputs {
  max-width: var(--device-width-tablet);
  padding: var(--size-small);
  display: block;
  width: 100%;
  box-sizing: border-box;
}

.MusicNotes__container {
  background-color: var(--color-highlight);
  height: var(--size-huge);
  margin-bottom: var(--size-large);
  padding: var(--size-small);
  text-align: center;
  width: 100%;
}

.MusicNotes {
  box-sizing: border-box;
  display: inline-flex;
  font-family: var(--font-default);
  justify-content: space-around;
  list-style-type: none;
  max-width: var(--device-width-tablet);
  position: relative;
  top: var(--size-default);
  width: 100%;
}

.MusicNote {
  color: var(--color-default);
  font-size: var(--size-extra-large);
}
</style>