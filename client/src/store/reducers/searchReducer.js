import * as types from '../actions/types';
import geneHeaders from '../../database/geneHeaders';

const initialState = {
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

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_SEARCH_RESULTS_START:
    case types.GET_SEARCH_RESULTS_SUCCESS:
    case types.GET_SEARCH_RESULTS_FAIL:
    case types.GET_SUGGESTIONS_START:
    case types.GET_SUGGESTIONS_SUCCESS:
    case types.GET_SUGGESTIONS_FAIL:
    case types.SORT_SEARCH_RESULTS:
    case types.RESET_SUGGESTIONS:
    case types.SET_HEADERS:
    case types.TOGGLE_CONDENSED:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default searchReducer;
