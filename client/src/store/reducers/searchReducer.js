import * as types from '../actions/types';
import geneHeaders from '../../database/geneHeaders';

const initalState = {
  isLoadingSearchResults: false,
  isLoadingSuggestions: false,
  isCondensed: true,
  searchResults: [],
  headers: geneHeaders,
  desiredHeaders: {},
  numCols: 0,
  suggestions: [],
  error: {}
};

const searchReducer = (state = initalState, action) => {
  switch (action.type) {
    case types.GET_SEARCH_RESULTS_START:
      return { ...state, ...action.payload };
    case types.GET_SEARCH_RESULTS_SUCCESS:
      return { ...state, ...action.payload };
    case types.GET_SEARCH_RESULTS_FAIL:
      return { ...state, ...action.payload };
    case types.GET_SUGGESTIONS_START:
      return { ...state, ...action.payload };
    case types.GET_SUGGESTIONS_SUCCESS:
      return { ...state, ...action.payload };
    case types.GET_SUGGESTIONS_FAIL:
      return { ...state, ...action.payload };
    case types.SORT_SEARCH_RESULTS:
      return { ...state, ...action.payload };
    case types.RESET_SUGGESTIONS:
      return { ...state, ...action.payload };
    case types.SET_HEADERS:
      return { ...state, ...action.payload };
    case types.TOGGLE_CONDENSED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default searchReducer;
