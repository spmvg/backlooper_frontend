<template>
  <div>
    <div class="row my-2 py-2">
      <div class="col-3 align-middle rounded"
           v-for="number in [...Array(beats).keys()]"
           :key="number"
           :style="[number+1==beat ? 'background-color:rgb(43, 43, 43)' : 'background-color:rgb(60, 63, 65)']">
        <span style="font-size: 40pt">{{ number + 1 }}</span>
      </div>
    </div>
    <div class="col-12 my-1 px-2 rounded"
         :style="(info_bar.includes('Error') || info_bar.startsWith('Latency has not been set. '))? 'background-color:rgb(100, 43, 43)' : 'background-color:rgb(43, 43, 43)'">
      <span style="font-size:20pt">STATUS <br></span>
      <span style="font-size:13pt">{{ info_bar }}</span>
    </div>
    <div class="my-1 py-2">
      <table>
        <colgroup>
          <col style="width: 30%">
          <col style="width: 70%">
        </colgroup>
        <tbody>
          <tr v-for="track in tracks"
              :key="track">
            <td class="centered-col">
              <span style="font-size: 20pt">
                TRACK {{ track.track_id + 1 }}
              </span>
            </td>
            <td class="left-aligned-col">
              <button type="button"
                      :class="track_status_map[track.state]"
                      v-on:click="click_on_track(track)"
                      :disabled="latency == 0 ? true : false">
                TRACK {{ track.track_id + 1 }}
              </button>
              <button type="button"
                      :class="midi_mapping['TRACK '+(track.track_id + 1)][0] ? 'btn btn-lg btn-success m-2' : 'btn btn-lg btn-secondary m-2'"
                      v-on:click="set_midi('TRACK '+(track.track_id + 1))">
                MIDI MAP
              </button>
              <span class="m-2 centered-span">{{ track.state }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="my-1 py-2">
      <table>
        <colgroup>
          <col style="width: 30%">
          <col style="width: 70%">
        </colgroup>
        <tbody>
          <tr>
            <td class="centered-col">
              <span style="font-size: 20pt">
                LATENCY
              </span>
            </td>
            <td class="left-aligned-col">
              <span class="centered-span m-2">{{ Math.round(1000*latency) }} ms</span>
              <button type="button"
                      class="btn btn-lg btn-danger m-2"
                      v-on:click="calibrate()"
                      :disabled="tracks.every(item => item['state'] == 'EMPTY') ? false : true">
                CALIBRATE
              </button>
              <button type="button"
                      class="btn btn-lg btn-dark m-2"
                      v-on:click="view_calibration_help()">
                HELP
              </button>
              <!-- TODO: latency correction using a slider? -->
            </td>
          </tr>
          <tr>
            <td class="centered-col">
              <span style="font-size: 20pt">
                CLICKTRACK VOLUME
              </span>
            </td>
            <td class="left-aligned-col">
              <input type="range"
                     min="0"
                     max="127"
                     v-model="clicktrack_volume"
                     id="clicktrack_volume"
                     @change="set_clicktrack_volume()"
                     class="m-2">
              <button type="button"
                      :class="midi_mapping['CLICKTRACK VOLUME'][0] ? 'btn btn-lg btn-success m-2' : 'btn btn-lg btn-secondary m-2'"
                      v-on:click="set_midi('CLICKTRACK VOLUME')">
                MIDI MAP
              </button>
            </td>
          </tr>
          <tr>
            <td class="centered-col">
              <span style="font-size: 20pt">
                TEMPO
              </span>
            </td>
            <td class="left-aligned-col">
              <input type="range"
                     min="40"
                     max="200"
                     v-model="bpm"
                     id="bpm"
                     @change="set_bpm()"
                     class="m-2"
                     :disabled="tracks.every(item => item['state'] == 'EMPTY') ? false : true">
              <button type="button"
                      :class="midi_mapping['SET BPM'][0] ? 'btn btn-lg btn-success m-2' : 'btn btn-lg btn-secondary m-2'"
                      v-on:click="set_midi('SET BPM')">
                MIDI MAP
              </button>
              <span class="m-2 centered-span">{{ bpm }} BPM</span>
            </td>
          </tr>
          <tr>
            <td class="centered-col">
              <span style="font-size: 20pt">
                BARS TO RECORD
              </span>
            </td>
            <td class="left-aligned-col">
              <input type="range"
                     min="0"
                     max="3"
                     v-model="log_bars_to_record"
                     id="log_bars_to_record"
                     class="m-2">
              <button type="button"
                      :class="midi_mapping['BARS TO RECORD'][0] ? 'btn btn-lg btn-success m-2' : 'btn btn-lg btn-secondary m-2'"
                      v-on:click="set_midi('BARS TO RECORD')">
                MIDI MAP
              </button>
              <span class="m-2 centered-span">{{ bars_to_record }} BARS TO RECORD</span>
            </td>
          </tr>
          <tr>
            <td class="centered-col">
              <span style="font-size: 20pt">
                RESET TRACKS
              </span>
            </td>
            <td class="left-aligned-col">
              <button type="button"
                      class="btn btn-lg btn-danger m-2"
                      v-on:click="reset_tracks()">
                RESET TRACKS
              </button>
              <button type="button"
                      :class="midi_mapping['RESET TRACKS'][0] ? 'btn btn-lg btn-success m-2' : 'btn btn-lg btn-secondary m-2'"
                      v-on:click="set_midi('RESET TRACKS')">
                MIDI MAP
              </button>
            </td>
          </tr>
          <tr>
            <td class="centered-col">
              <span style="font-size: 20pt">
                LATENCY CALIBRATION DIAGRAM
              </span>
            </td>
            <td class="left-aligned-col">
              <button type="button"
                      class="btn btn-lg btn-dark m-2"
                      data-bs-toggle="collapse"
                      data-bs-target="#calibrationresultid"
                      :disabled="!has_triggered_calibration">
                SHOW CALIBRATION DIAGRAM
              </button>
              <div class="text-center collapse" id="calibrationresultid">
                <img class="m-2 img-fluid rounded"
                     :src="'data:image/png;base64, '+calibration_result"
                     alt="Calibration result"
                     v-if="calibration_result"
                     style="max-width: 75%" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  let tracks = []
  for (let track_id = 0; track_id < 8; track_id++) {
    tracks.push({
      track_id: track_id,
      state: "EMPTY",
    })
  }

  export default {
    name: 'BackLooper',
    data: function () {
      return {
        major_version: 0,
        calibration_result: null,
        connection: null,
        bpm: 120,
        beat: null,
        beats: 4,
        tracks: tracks,
        clicktrack_volume: "127",
        log_bars_to_record: 2,
        latency: 0,
        midi_mapping: {
          'SET BPM': [null, null],
          'RESET TRACKS': [null, null],
          'CLICKTRACK VOLUME': [null, null],
          'BARS TO RECORD': [null, null],
          'TRACK 1': [null, null],
          'TRACK 2': [null, null],
          'TRACK 3': [null, null],
          'TRACK 4': [null, null],
          'TRACK 5': [null, null],
          'TRACK 6': [null, null],
          'TRACK 7': [null, null],
          'TRACK 8': [null, null]
        },
        last_midi: [null, null],
        info_bar: 'Latency has not been set. Please perform calibration to synchronize the audio. Looping is not possible until calibration is successful. Click "HELP" below for more information.',
        track_status_map: {
          EMPTY: "btn btn-lg btn-secondary m-2",
          TRIGGERED: "btn btn-lg btn-warning m-2",
          RECORDING: "btn btn-lg btn-danger m-2",
          PLAYING: "btn btn-lg btn-success m-2",
          STOPPING: "btn btn-lg btn-warning m-2",
          STOPPED: "btn btn-lg btn-primary m-2",
        },
        has_triggered_calibration: false,
      }
    },
    computed: {
      bars_to_record: function () {
        return Math.pow(2, this.log_bars_to_record)
      }
    },
    created: function () {
      let map_from_local = JSON.parse(localStorage.getItem("midi_mapping"));
      if (map_from_local) {
        // add non-existing fields
        for (const key in this.midi_mapping) {
          if (!(key in map_from_local)) {
            map_from_local[key] = [null, null]
          }
        }

        this.midi_mapping = map_from_local
      }

      var websocket = new WebSocket("ws://localhost:8001/")
      this.connection = websocket
      websocket.onopen = function () {
        websocket.send(JSON.stringify({
          "event": "initialize"
        }));
      }

      this.connection.onmessage = this.handle_message_from_backend
      this.connection.onerror = this.handle_connection_error

      navigator.requestMIDIAccess().then(this.hasMidi, this.noMidi)
    },
    mounted: function () {
    },
    methods: {
      hasMidi: function (midi) {
        midi.inputs.forEach(input => {
          input.onmidimessage = this.onMidi
        })
      },
      noMidi: function () {
        console.log('No MIDI devices found')
      },
      onMidi: function (message) {
        if (!(message.data[0] == 144 || message.data[0] == 176)) { return }

        this.last_midi = [message.data[0], message.data[1]]

        if (message.data[0] == 176) {
          if (this.last_midi_equals('CLICKTRACK VOLUME')) {
            this.clicktrack_volume = message.data[2]
            this.set_clicktrack_volume(this.clicktrack_volume)
            return
          }
          if (this.last_midi_equals('BARS TO RECORD')) {
            this.log_bars_to_record = Math.round(3 * message.data[2] / 127)
            return
          }
          if (this.last_midi_equals('SET BPM')) {
            if (!(this.tracks.every(item => item['state'] == 'EMPTY'))) {
              return
            }
            this.bpm = Math.round(160 * message.data[2] / 127 + 40)
            this.set_bpm()
            return
          }
        }

        if (message.data[0] != 144) { return }

        if (this.last_midi_equals('RESET TRACKS')) {
          this.reset_tracks()
          return
        }

        if (this.latency == 0) { return }

        let track_id = null
        if (this.last_midi_equals('TRACK 1')) {
          track_id = 0
        } else if (this.last_midi_equals('TRACK 2')) {
          track_id = 1
        } else if (this.last_midi_equals('TRACK 3')) {
          track_id = 2
        } else if (this.last_midi_equals('TRACK 4')) {
          track_id = 3
        } else if (this.last_midi_equals('TRACK 5')) {
          track_id = 4
        } else if (this.last_midi_equals('TRACK 6')) {
          track_id = 5
        } else if (this.last_midi_equals('TRACK 7')) {
          track_id = 6
        } else if (this.last_midi_equals('TRACK 8')) {
          track_id = 7
        }
        let track = this.tracks[track_id]
        if (!track) { return }

        this.click_on_track(track)
      },
      last_midi_equals: function (mapping_name) {
        return this.last_midi[0] == this.midi_mapping[mapping_name][0] && this.last_midi[1] == this.midi_mapping[mapping_name][1]
      },
      handle_connection_error: function () {
        this.info_bar = "Error reaching the backend. Is the backend running on your local machine? Check the documentation for more information about resolving common issues."
      },
      handle_message_from_backend: function (event) {
        var data = JSON.parse(event.data)
        if (data["event"] == "tempo") {
          setTimeout(() => this.beat = data["beat"], 0.5 * this.latency / 1000)  // assume half of round trip latency
        } else if (data["event"] == "bpm") {
          this.bpm = Math.round(data["bpm"])
        } else if (data["event"] == "tracks") {
          this.tracks = data["tracks"]
        } else if (data["event"] == "calibration_result") {
          this.calibration_result = data["figure"]
          if (data["message"] != "SUCCESS") {
            this.info_bar = "Error performing calibration. Check the latency calibration diagram for more information. Try increasing the signal-to-noise ratio."
          }
        } else if (data["event"] == "clicktrack_volume") {
          this.clicktrack_volume = data["volume"] * 127
        } else if (data["event"] == "latency") {
          this.info_bar = "Updated latency to " + Math.round(1000 * data["latency_seconds"]) + " ms."
          this.latency = data["latency_seconds"]
        } else if (data["event"] == "major_version") {
          if (this.major_version != data["message"]) {
            this.info_bar = "Error: this version of the backend on your local machine (v" + data["message"] + ") is outdated and incompatible with the frontend (v" + this.major_version + "). Please upgrade the backend to the latest version. Check the documentation for more information."
          }
        } else {
          console.log('Unknown message from backend:', event)
        }
      },
      set_bpm: function () {
        this.connection.send(JSON.stringify({ "event": "set_bpm", "bpm": parseInt(this.bpm) }))
      },
      click_on_track: function (track) {
        if (track.state == "EMPTY") {
          this.connection.send(JSON.stringify({
            "event": "backloop",
            "track": track.track_id,
            "bars_to_record": this.bars_to_record,
          }));
          return
        }
        if (track.state == "PLAYING") {
          this.connection.send(JSON.stringify({
            "event": "stop",
            "track": track.track_id
          }))
          return
        }
        if (track.state == "STOPPED") {
          this.connection.send(JSON.stringify({
            "event": "start",
            "track": track.track_id
          }))
          return
        }
      },
      calibrate() {
        this.info_bar = "Running calibration, please wait..."
        this.connection.send(JSON.stringify({
          "event": "calibrate",
        }))
        this.has_triggered_calibration = true
      },
      reset_tracks() {
        this.connection.send(JSON.stringify({
          "event": "reset",
        }));
      },
      set_midi(midi_map) {
        this.last_midi = [null, null]
        this.midi_mapping[midi_map] = [null, null]
        this.info_bar = "Waiting 3 seconds for a MIDI note..."
        setTimeout(() => {
          if (!this.last_midi[0]) {
            this.info_bar = "Error setting MIDI map for " + midi_map + ": no MIDI note received within the interval."
            localStorage.setItem("midi_mapping", JSON.stringify(this.midi_mapping))
            return
          }
          this.midi_mapping[midi_map] = this.last_midi
          this.info_bar = "Set MIDI map for " + midi_map + " to " + this.last_midi[1] + "."
          localStorage.setItem("midi_mapping", JSON.stringify(this.midi_mapping))
        }, 3000)
      },
      set_clicktrack_volume() {
        this.connection.send(JSON.stringify({
          "event": "clicktrack_volume",
          "volume": this.clicktrack_volume / 127,
        }));
      },
      view_calibration_help() {
        window.open('docs/calibration', '_blank')
      }
    }
  }
</script>
<style scoped>
  table {
    background-color: rgb(43, 43, 43);
    width: 100%;
    border-radius: 10px;
  }

  tr td {
    border: 2px solid rgb(60, 63, 65);
  }

  .rounded {
    border-radius: 10px;
  }
</style>
