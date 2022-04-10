<template>
  <div class="Music">
    <ol class="MusicNotes">
      <li class="MusicNote" v-for="(note, index) in notes" :key="note + index">
        {{ note }}
      </li>
    </ol>

    <fieldset class="MusicInputs">
      <b-field label="Chords">
        <b-input
          type="textarea"
          v-model="chordsString"
          ref="chordInput"
        ></b-input>
      </b-field>

      <b-field label="Beats per minute (BPM)">
        <b-input
          class="MusicInput"
          type="number"
          v-model="bpm"
          min="24"
          max="300"
        ></b-input>
      </b-field>
    </fieldset>

    <b-button
      @click.stop.prevent="isPlaying ? stopSequence() : beginSequence()"
      :type="isPlaying ? 'is-danger' : 'is-primary'"
      :disabled="isPreparingToPlay"
    >
      {{ isPlaying ? "cancel ✕" : "play ▶️" }}
    </b-button>
  </div>
</template>

<script>
import Vue from "vue";
import { Button, Field, Input } from "buefy";
import { parseChord, playChord } from "@/plugins/chords";

Vue.use(Input);
Vue.use(Button);
Vue.use(Field);

const MS_PER_SECOND = 1000;
const SECOND_PER_MINUTE = 60;
const MS_PER_MINUTE = MS_PER_SECOND * SECOND_PER_MINUTE;

export default {
  computed: {
    bpmMS() {
      return MS_PER_MINUTE / this.bpm;
    },
    chordInputElement() {
      return this.$refs.chordInput.getElement();
    }
  },
  data: function () {
    return {
      bpm: 100,
      chordsString: "I V vi V7/IV IV I ii V7 Isus4 Isus2 I",
      highlightPointer: 0,
      isPlaying: false,
      isPreparingToPlay: false,
      notes: ["--"],
      remainingChords: null,
      sequencePlayerID: null
    };
  },
  methods: {
    beginSequence() {
      this.isPreparingToPlay = true;
      this.remainingChords = this.chordsString.split(/\s+/).reverse();
      this.sequencePlayerID = setInterval(this.playNextChord, this.bpmMS);
    },
    highlightChord(chordString) {
      const currentChordIndex = this.chordsString.indexOf(
        chordString,
        this.highlighterPointer
      );

      this.highlighterPointer = currentChordIndex + chordString.length;

      this.chordInputElement.setSelectionRange(
        currentChordIndex,
        this.highlighterPointer
      );

      this.chordInputElement.focus();
    },
    async playNextChord() {
      this.isPlaying = true;
      this.isPreparingToPlay = false;

      const currentChordString = this.remainingChords.pop();

      if (!currentChordString) return;

      if (!this.remainingChords.length) {
        setTimeout(this.stopSequence, this.bpmMS);
      }

      this.highlightChord(currentChordString);

      this.notes = parseChord(currentChordString);

      await playChord(this.notes, (this.bpmMS / MS_PER_SECOND).toFixed(1));
    },
    stopSequence() {
      clearInterval(this.sequencePlayerID);

      this.isPlaying = false;
      this.highlightPointer = 0;
      this.notes = ["--"];
      this.remainingChords = null;

      this.chordInputElement.blur();
    }
  }
};
</script>

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
  margin: var(--gutter-large) 0;
  max-width: var(--tablet-device-width);
  padding: 0 var(--gutter-small);
  width: 100%;
}

.MusicNotes {
  display: flex;
  justify-content: space-around;
  list-style-type: none;
  margin-bottom: var(--gutter-large);
  min-width: var(--mobile-device-width);
}

.MusicNote {
  color: var(--primary-color);
  font-size: 3rem;
  margin-top: var(--gutter-large);
}
</style>
