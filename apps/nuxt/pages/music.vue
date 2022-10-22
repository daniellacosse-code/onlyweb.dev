<script setup>
import { playChord, parseChord } from "@only-web/chords";

const { public: { music, MILLISECONDS_PER_SECOND,
  SECONDS_PER_MINUTE } } = useRuntimeConfig();

let highlightPointer = 0;
let isPlaying = false;
let isPreparingToPlay = false;
let remainingChords = [];
let sequencePlayerID = null;

const chordInstructions = ref(music.playerChordInstructionsDefault);
const chordInstructionsInput = ref(null);
const chordInstructionsInputElement = computed(() => chordInstructionsInput.value?.$refs.textarea);
const displayedNotes = ref(music.playerNoteReadoutDefault);
const bpm = ref(music.playerBeatsPerMinuteDefault);
const bpmMS = computed(() => (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE) / bpm.value);

function startSequence() {
  isPreparingToPlay = true;
  remainingChords = chordInstructions.value.split(/\s+/).reverse();
  sequencePlayerID = setInterval(playNextChord, bpmMS.value);
}

function highlightChord(chordString) {
  const currentChordIndex = chordInstructions.value.indexOf(
    chordString,
    highlightPointer
  );

  highlightPointer = currentChordIndex + chordString.length;

  chordInstructionsInputElement.value.setSelectionRange(
    currentChordIndex,
    highlightPointer
  );

  chordInstructionsInputElement.value.focus();
}

async function playNextChord() {
  [isPlaying, isPreparingToPlay] = [true, false];

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
    isPlaying,
    highlightPointer,
    displayedNotes.value,
    remainingChords
  ] = [false, 0, music.playerNoteReadoutDefault, []];

  chordInstructionsInputElement.value.blur();
}
</script>

<template>
  <div class="Music">
    <ol class="MusicNotes">
      <li class="MusicNote" v-for="(note, index) in displayedNotes"
        :key="note + index">
        {{ note }}
      </li>
    </ol>

    <fieldset class="MusicInputs">
      <o-field label="Chords">
        <o-input type="textarea" v-model="chordInstructions"
          ref="chordInstructionsInput">
        </o-input>
      </o-field>

      <o-field label="Beats per minute (BPM)">
        <o-input class="MusicInput" type="number" v-model="bpm" min="24"
          max="300"></o-input>
      </o-field>
    </fieldset>

    <o-button v-if="isPlaying" @click.stop.prevent="stopSequence()"
      :disabled="isPreparingToPlay" variant="danger" icon-left="alert-octagon">
      cancel
    </o-button>

    <o-button v-else @click.stop.prevent="startSequence()" variant="primary"
      icon-left="play">play
    </o-button>
  </div>

</template>

<style scoped>
.Music {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
  width: 100vw;
}

.MusicInputs {
  margin: var(--size-large) 0;
  max-width: var(--device-width-tablet);
  padding: 0 var(--size-small);
  width: 100%;
}

.MusicNotes {
  display: flex;
  justify-content: space-around;
  list-style-type: none;
  margin-bottom: var(--size-large);
  min-width: var(--device-width-mobile);
}

.MusicNote {
  color: var(--color-default);
  font-size: var(--size-extra-large);
  margin-top: var(--size-large);
}
</style>