import * as types from '../actions/types';

const initalState = {
  isLoadingSearchResults: false,
  isLoadingSuggestions: false,
  searchResults: [],
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
    default:
      return state;
  }
};

export default searchReducer;
