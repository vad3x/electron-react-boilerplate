export const SET_AUDIO_CONTEXT = 'SET_AUDIO_CONTEXT';
export const SELECT_FILE = 'SELECT_FILE';
// export const FETCH_AUDIO_BUFFER = 'FETCH_AUDIO_BUFFER';
export const ADD_AUDIO_BUFFER = 'ADD_AUDIO_BUFFER';

export const PLAY = 'PLAY';
export const STOP = 'STOP';

export function play() {
  return (dispatch, getState) => {
    const { analyzer } = getState();
    const { audioContext, audioBuffer, audioSource } = analyzer;

    if (!audioSource) {
      const audioSource1 = audioContext.createBufferSource();
      audioSource1.buffer = audioBuffer;

      audioSource1.connect(audioContext.destination);

      audioSource1.start(audioContext.currentTime, 0);

      dispatch({
        type: PLAY,
        audioSource: audioSource1
      });
    }
  };
}

export function stop() {
  return (dispatch, getState) => {
    const { analyzer } = getState();
    const { audioContext, audioBuffer, audioSource } = analyzer;

    if (audioSource) {
      audioSource.stop();

      dispatch({
        type: STOP
      });
    }
  };
}

export function setAudioContext(audioContext) {
  return {
    type: SET_AUDIO_CONTEXT,
    audioContext
  };
}

export function selectFile(dialog, window) {
  return dispatch => {
    dialog
      .showOpenDialog(window, {
        filters: [{
          name: 'Audio',
          extensions: ['mp3']
        }]
      }, (fileNames) => {
        if (!fileNames) return;
        
        const filePath = fileNames[0];

        dispatch({
          type: SELECT_FILE,
          filePath
        });

        dispatch(fetchAudioBuffer(filePath));
      });
  }
}

export function fetchAudioBuffer(filePath) {
  return (dispatch, getState) => {
    const fs = require('fs');

    fs.readFile(filePath, (err, data) => {
      const audioContext = getState().analyzer.audioContext;

      audioContext.decodeAudioData(toArrayBuffer(data), (audioBuffer) => {
        dispatch(addAudioBuffer(audioBuffer));
      });
    });
  };
}

export function addAudioBuffer(audioBuffer) {
  return {
    type: ADD_AUDIO_BUFFER,
    audioBuffer
  };
}

function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}
