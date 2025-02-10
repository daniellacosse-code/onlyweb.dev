import "https://raw.githubusercontent.com/daniellacosse-code/onlyweb.dev/bundles-cleanup/inject-globals/bundles/$Backend.js";

$Backend.Page.Register("/demos/music", {
  handleRequest: () => {
    return $Backend.Page.Response.html`<head>
        <!-- TODO -->
         <style>
          :root {
            font-size: 16px;
          }

          body {
            all: initial;
            background: #eee;
            font-family: system-ui;
            padding-bottom: 10rem;
          }

          main {
            width: 100vw;
            display: flex;
            min-height: 50vh;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            border-bottom: 1px solid lightgray;
            background: white;
            resize: vertical;
            overflow: hidden;
          }

          form {
            display: flex;
            flex-direction: column;
            margin: 2rem 0;
          }

          label {
            display: flex;
            flex-direction: column;
            margin: 0.25rem 0;
          }

          input,
          textarea {
            margin-top: 0.25rem;
            font-size: 1rem;
          }

          button {
            font-size: 1rem;
            height: 2rem;
            margin-top: 0.25rem;
          }

          input:invalid,
          textarea:invalid {
            color: red;
          }

          ol {
            all: initial;
            display: flex;
            justify-content: space-around;
            min-width: 320px;
            margin-bottom: 2rem;
          }

          ol > li {
            all: initial;
            color: blue;
            font-size: 3rem;
            font-family: system-ui;
          }

          i {
            font-style: italic;
          }

          b {
            font-weight: bold;
          }

          pre {
            display: inline;
            font-family: monospace;
            color: red;
          }

          footer {
            margin: 1rem;
          }

          h1 {
            all: initial;
            display: inline;
            font-size: 1.25rem;
            font-family: system-ui;
          }

          h2 {
            all: initial;
            font-weight: bold;
            font-family: system-ui;
          }

          section {
            margin: 0.5rem 0;
            font-family: system-ui;
          }

          ul {
            margin: 0.25rem 0;
            margin-left: 2rem;
            font-family: system-ui;
          }

          ul > li {
            list-style-type: disc;
            line-height: 1.25;
            font-family: system-ui;
          }
        </style>
      </head>
      <body>
        <main>
          <form onsubmit="playSequence(event)">
            <label>
              Chords
              <textarea id="chordsInput" required>I V vi V7/IV IV I ii V7 Isus4 Isus2 I</textarea>
            </label>
            <label>
              Beats per minute (BPM)
              <input id="bpmInput" type="number" value="100" min="24" max="300" required />
            </label>
            <button id="playButton">▶️ Play</button>
          </form>

          <ol id="noteReadout">
            <li>--</li>
          </ol>
        </main>

        <footer>
          <article>
            <details>
              <summary>
                <h1>Universal Key Chord Reader Prototype - <b>Readme & Guide</b></h1>
              </summary>

              <section>
                <h2>How to use</h2>
                <br />
                <i>(If on mobile, make sure you have <b>silent mode</b> off.)</i>
                <ul>
                  <li>The purpose of the chord reader is to enable easy experimentation with chord progressions in <a href="https://en.wikipedia.org/wiki/Universal_key" target="_blank">universal key notation</a>. (e.g.
                    <pre>I V IV</pre>, etc.)
                  </li>
                  <li>The reader reads the chords it is given verbatim, and does not try to infer scale degrees within. This means you may need to spell certain things out <i>(e.g.
                      <pre>vii</pre> in a major key is technically
                      <pre>viidim</pre>).
                    </i>
                  </li>
                  <li>The reason the reader makes no inferences is to allow one to easily experiment with modes. See <a href="https://mockup-api.teespring.com/v3/image/aNrTVQXXYk77WadLmwD0suGjb4w/960/1120.jpg" target="_blank">this guide</a> to reference the different modes.</li>
                </ul>
              </section>
              <section>
                <h2>Supported extensions</h2>
                <ul>
                  <li>triads -
                    <pre>maj</pre>,
                    <pre>min</pre>,
                    <pre>aug</pre>,
                    <pre>dim</pre>
                  </li>
                  <li>seventh chords -
                    <pre>M7</pre>,
                    <pre>7</pre>,
                    <pre>m7</pre>,
                    <pre>m7b5</pre>,
                    <pre>dim7</pre>,
                    <pre>aug7</pre>
                  </li>
                  <li>secondary dominants -
                    <pre>V7/IV</pre>
                  </li>
                  <li>suspensions -
                    <pre>sus2</pre>,
                    <pre>sus4</pre>
                  </li>
                  <li>extensions -
                    <pre>add9</pre>,
                    <pre>add11</pre>
                  </li>
                </ul>
              </section>
              <section>
                <h2>Future improvements</h2>
                <br />
                <i>These would increase complexity quite a bit, so I will have to productionize before proceeding.</i>
                <ul>
                  <li>Setting the universal key and spelling the notes properly.</li>
                  <li>Supporting non-universal notation (e.g
                    <pre>C#M7</pre>).
                  </li>
                  <li>Supporting <a href="https://en.wikipedia.org/wiki/Chord_names_and_symbols_(popular_music)" target="_blank">every</a> valid chord quality notation/extension.</li>
                  <li>Inversions & <a href="https://en.wikipedia.org/wiki/Figured_bass" target="_blank">figured bass</a>.</li>
                </ul>
              </section>
            </details>
          </article>
        </footer>

        <script type="module">
          import * as Tone from "https://cdn.skypack.dev/tone@14.7.77";

          async function playSequence({ target: { chordsInput, bpmInput } }) {
            const MS_PER_MINUTE = 60000;

            const bpmMs = MS_PER_MINUTE / bpmInput.value;
            const chordStrings = chordsInput.value.split(/\\s+/).reverse();
            const updateHighlightedChord = chordsInputSelectionUpdaterFactory(
              chordsInput
            );
            const playButton = document.getElementById("playButton");

            playButton.disabled = true;

            if (Tone.context.state !== "running") {
              await Tone.context.resume();
              await Tone.start();
            }

            const sequencePlayer = setInterval(() => {
              const currentChordString = chordStrings.pop();

              try {
                updateHighlightedChord(currentChordString);

                const notes = parseNotes(currentChordString);

                updateNoteReadout(notes);
                playNotes(notes, (bpmMs / 1000).toFixed(1));
              } catch (error) {
                // assume rest
                updateNoteReadout();
              }

              if (!chordStrings.length) {
                clearInterval(sequencePlayer);
                setTimeout(() => {
                  chordsInput.blur();
                  playButton.disabled = false;
                  updateNoteReadout();
                }, bpmMs);
              }
            }, bpmMs);
          }

          function chordsInputSelectionUpdaterFactory(chordsInput) {
            let highlighterPointer = 0;

            return (activeChord) => {
              const chordLocation = chordsInput.value.indexOf(
                activeChord,
                highlighterPointer
              );

              highlighterPointer = chordLocation + activeChord.length;
              chordsInput.setSelectionRange(chordLocation, highlighterPointer);
              chordsInput.focus();
            };
          }

          function updateNoteReadout(items = ["--"]) {
            const noteReadout = document.getElementById("noteReadout");

            noteReadout.innerHTML = "";

            for (const item of items) {
              const li = document.createElement("li");
              li.innerHTML = item;
              noteReadout.appendChild(li);
            }
          }

          function playNotes(notes, duration) {
            const BASE_OCTAVE = 4;

            const piano = new Tone.Sampler({
              urls: {
                C4: "C4.mp3",
                "D#4": "Ds4.mp3",
                "F#4": "Fs4.mp3",
                A4: "A4.mp3"
              },
              baseUrl: "https://tonejs.github.io/audio/salamander/",
              onload: () => {
                piano.triggerAttackRelease(
                  notes.map((note) => note + BASE_OCTAVE),
                  duration
                );
              }
            }).toDestination();
          }

          function parseNotes(chordString) {
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

            const [root, shape] = [getChordRoot(chordString), getChordShape(chordString)];

            return shape.map((offset) => {
              const scaleDegree = root + offset;
              return PITCH_NAME_LIST[scaleDegree % PITCH_NAME_LIST.length];
            });
          }

          function getChordRoot(symbol) {
            const TONES_IN_OCTAVE = 12;
            const [mainDegree, modifierDegree] = symbol
              .split("/")
              .map((chord) =>
                getNoteDegree(chord.match(/([b#]?[iI]{0,2}[vV]?[iI]{0,2})/)[1])
              );

            if (typeof mainDegree !== "number") throw new Error();

            return (mainDegree + (modifierDegree ?? 0)) % TONES_IN_OCTAVE;
          }

          function getChordShape(symbol) {
            let shape;

            if (symbol.match(/dim|m7b5/)) {
              shape = [0, 3, 6, 12];
            } else if (symbol.match(/aug|\\+/)) {
              shape = [0, 4, 8, 12];
            } else if (
              symbol.toLowerCase() === symbol ||
              (symbol.match(/m|min/) && !symbol.match("maj"))
            ) {
              // minor triad
              shape = [0, 3, 7, 12];
            } else {
              // assume major triad
              shape = [0, 4, 7, 12];
            }

            if (symbol.match("sus2")) {
              shape[1] = 2;
            } else if (symbol.match("sus4")) {
              shape[1] = 5;
            }

            if (symbol.match("M7")) {
              // major seventh
              shape[3] = 11;
            } else if (symbol.match("dim7")) {
              // diminished seventh
              shape[3] = 9;
            } else if (symbol.match("7")) {
              // minor seventh
              shape[3] = 10;
            }

            if (symbol.match("add9")) {
              shape.push(14);
            }

            if (symbol.match("add11")) {
              shape.push(17);
            }

            return shape;
          }

          function getNoteDegree(symbol) {
            switch (symbol) {
              case "#vii":
              case "#VII":
              case "i":
              case "I":
                return 0;
              case "#i":
              case "#I":
              case "bii":
              case "bII":
                return 1;
              case "ii":
              case "II":
                return 2;
              case "#ii":
              case "#II":
              case "biii":
              case "bIII":
                return 3;
              case "iii":
              case "III":
              case "biv":
              case "bIV":
                return 4;
              case "#iii":
              case "#III":
              case "iv":
              case "IV":
                return 5;
              case "#iv":
              case "#IV":
              case "bv":
              case "bV":
                return 6;
              case "v":
              case "V":
                return 7;
              case "#v":
              case "#V":
              case "bvi":
              case "bVI":
                return 8;
              case "vi":
              case "VI":
                return 9;
              case "#vi":
              case "#VI":
              case "bvii":
              case "bVII":
                return 10;
              case "vii":
              case "VII":
              case "bi":
              case "bI":
                return 11;
              default:
                throw new Error();
            }
          }

          // "exports"
          window.playSequence = (event) => {
            event.preventDefault();
            event.stopPropagation();

            playSequence(event);
          };
        </script>
      </body>
    `;
  },
  handleServiceWorker: () =>
    $Backend.Page.Response.js`
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("/demos/music").then((cache) => {
        return cache.addAll([
          "/demos/music",
        ]);
      })
    );
  });

  self.addEventListener("fetch", (event) => {
    event.respondWith(caches.open("/demos/music").then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());

          return networkResponse;
        });

        return cachedResponse || fetchedResponse;
      });
    }));
  });`,
});
