import searchReducer from '../reducers/searchReducer';
import * as types from '../actions/types';

describe('search reducer', () => {
  const initalState = {
    isLoadingSearchResults: false,
    isLoadingSuggestions: false,
    searchResults: [],
    suggestions: [],
    error: {}
  };

  it('should return the initial state', () => {
    expect(searchReducer(initalState, {})).toEqual(initalState);
  });

  it('should handle GET_SEARCH_RESULTS_START', () => {
    const action = {
      type: types.GET_SEARCH_RESULTS_START,
      payload: {
        isLoadingSearchResults: true,
        searchResults: [],
        error: {}
      }
    };
    const expectedState = {
      isLoadingSearchResults: true,
      isLoadingSuggestions: false,
      searchResults: [],
      suggestions: [],
      error: {}
    };
    expect(searchReducer(initalState, action)).toEqual(expectedState);
  });

  it('should handle GET_SEARCH_RESULTS_SUCCESS', () => {
    const searchResults = ['result'];
    const action = {
      type: types.GET_SEARCH_RESULTS_SUCCESS,
      payload: {
        isLoadingSearchResults: false,
        searchResults
      }
    };
    const expectedState = {
      isLoadingSearchResults: false,
      isLoadingSuggestions: false,
      searchResults,
      suggestions: [],
      error: {}
    };
    expect(searchReducer(initalState, action)).toEqual(expectedState);
  });

  it('should handle GET_SEARCH_RESULTS_FAIL', () => {
    const error = { error: 'Failed' };
    const action = {
      type: types.GET_SEARCH_RESULTS_FAIL,
      payload: {
        isLoadingSearchResults: false,
        error
      }
    };
    const expectedState = {
      isLoadingSearchResults: false,
      isLoadingSuggestions: false,
      searchResults: [],
      suggestions: [],
      error
    };
    expect(searchReducer(initalState, action)).toEqual(expectedState);
  });

  it('should handle GET_SUGGESTIONS_START', () => {
    const action = {
      type: types.GET_SUGGESTIONS_START,
      payload: {
        isLoadingSuggestions: true,
        suggestions: [],
        error: {}
      }
    };
    const expectedState = {
      isLoadingSearchResults: false,
      isLoadingSuggestions: true,
      searchResults: [],
      suggestions: [],
      error: {}
    };
    expect(searchReducer(initalState, action)).toEqual(expectedState);
  });

  it('should handle GET_SUGGESTIONS_SUCCESS', () => {
    const suggestions = ['suggestion1'];
    const action = {
      type: types.GET_SUGGESTIONS_SUCCESS,
      payload: {
        isLoadingSuggestions: false,
        suggestions
      }
    };
    const expectedState = {
      isLoadingSearchResults: false,
      isLoadingSuggestions: false,
      searchResults: [],
      suggestions,
      error: {}
    };
    expect(searchReducer(initalState, action)).toEqual(expectedState);
  });

  it('should handle GET_SUGGESTIONS_FAIL', () => {
    const error = { error: 'failed' };
    const action = {
      type: types.GET_SUGGESTIONS_FAIL,
      payload: {
        isLoadingSuggestions: false,
        error
      }
    };
    const expectedState = {
      isLoadingSearchResults: false,
      isLoadingSuggestions: false,
      searchResults: [],
      suggestions: [],
      error
    };
    expect(searchReducer(initalState, action)).toEqual(expectedState);
  });

  it('should handle SORT_SEARCH_RESULTS', () => {
    const searchResults = ['result'];
    const action = {
      type: types.SORT_SEARCH_RESULTS,
      payload: {
        searchResults
      }
    };
    const expectedState = {
      isLoadingSearchResults: false,
      isLoadingSuggestions: false,
      searchResults,
      suggestions: [],
      error: {}
    };
    expect(searchReducer(initalState, action)).toEqual(expectedState);
  });

  it('should handle RESET_SUGGESTIONS', () => {
    const action = {
      type: types.RESET_SUGGESTIONS,
      payload: {
        isLoadingSuggestions: false,
        suggestions: []
      }
    };
    const expectedState = {
      isLoadingSearchResults: false,
      isLoadingSuggestions: false,
      searchResults: [],
      suggestions: [],
      error: {}
    };
    expect(searchReducer(initalState, action)).toEqual(expectedState);
  });
});
