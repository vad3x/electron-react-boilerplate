export const SET_AUDIO_CONTEXT = 'SET_AUDIO_CONTEXT';
export const ADD_AUDIO_BUFFER = 'ADD_AUDIO_BUFFER';
export const NEEDLE_SEARCH = 'NEEDLE_SEARCH';
export const SET_NEEDLE = 'SET_NEEDLE';

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

      audioSource1.start(0, analyzer.time);

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
    const { audioSource } = analyzer;

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
  };
}

export function addAudioBuffer(audioBuffer) {
  return {
    type: ADD_AUDIO_BUFFER,
    audioBuffer
  };
}

export function setNeedle(time) {
  return {
    type: SET_NEEDLE,
    time
  };
}

export function needleSearch(time) {
  return (dispatch, getState) => {
    const { analyzer } = getState();
    const { audioSource } = analyzer;

    if (audioSource) {
      dispatch(stop());
    }

    dispatch(setNeedle(time));

    if (audioSource) {
      dispatch(play());
    }
  };
}
