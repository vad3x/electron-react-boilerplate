import { SET_AUDIO_CONTEXT, SELECT_FILE, ADD_AUDIO_BUFFER } from '../actions/analyzer';

const initialState = {
  audioContext: new AudioContext(),
  filePath: '',
  audioBuffer: null
}

export default function analyzer(state = initialState, action) {
  switch (action.type) {
    case SET_AUDIO_CONTEXT:
      return {
        ...state,
        audioContext: action.audioContext
      }
    case SELECT_FILE:
      return {
        ...state,
        filePath: action.filePath
      }
    case ADD_AUDIO_BUFFER:
      return {
        ...state,
        audioBuffer: action.audioBuffer
      }
    default:
      return state;
  }
}
