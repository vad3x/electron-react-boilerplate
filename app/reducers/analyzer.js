import { SET_AUDIO_CONTEXT, SELECT_FILE, ADD_AUDIO_BUFFER, PLAY, STOP, SET_NEEDLE } from '../actions/analyzer';

const initialState = {
  audioContext: new AudioContext(),
  filePath: '',
  audioBuffer: null,
  audioSource: null,
  time: 0
};

export default function analyzer(state = initialState, action) {
  switch (action.type) {
    case SET_AUDIO_CONTEXT:
      return {
        ...state,
        audioContext: action.audioContext
      };
    case SELECT_FILE:
      return {
        ...state,
        filePath: action.filePath
      };
    case ADD_AUDIO_BUFFER:
      return {
        ...state,
        audioBuffer: action.audioBuffer
      };
    case PLAY:
      return {
        ...state,
        audioSource: action.audioSource
      };
    case STOP:
      return {
        ...state,
        audioSource: null
      };
    case SET_NEEDLE:
      return {
        ...state,
        time: action.time
      };
    default:
      return state;
  }
}
