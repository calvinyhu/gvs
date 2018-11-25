import * as types from '../actions/types';
import * as actions from '../actions/searchActions';

describe('synchronous search actions', () => {
  it('should create an action to start a search', () => {
    const expectedAction = {
      type: types.GET_SEARCH_RESULTS_START,
      payload: {
        isLoadingSearchResults: true,
        searchResults: [],
        error: {}
      }
    };
    expect(actions.searchStart()).toEqual(expectedAction);
  });

  it('should create an action to end a successful search', () => {
    const searchResults = ['sd', 'sd'];
    const expectedAction = {
      type: types.GET_SEARCH_RESULTS_SUCCESS,
      payload: {
        isLoadingSearchResults: false,
        searchResults
      }
    };
    expect(actions.searchSuccess(searchResults)).toEqual(expectedAction);
  });

  it('should create an action to end a failed search', () => {
    const error = { error: 'failed' };
    const expectedAction = {
      type: types.GET_SEARCH_RESULTS_FAIL,
      payload: {
        isLoadingSearchResults: false,
        error
      }
    };
    expect(actions.searchFail(error)).toEqual(expectedAction);
  });

  it('should create an action to start a suggestion', () => {
    const expectedAction = {
      type: types.GET_SUGGESTIONS_START,
      payload: {
        isLoadingSuggestions: true,
        suggestions: [],
        error: {}
      }
    };
    expect(actions.suggestStart()).toEqual(expectedAction);
  });

  it('should create an action to end a successful suggestion', () => {
    const suggestions = ['suggest1', 'suggest2'];
    const expectedAction = {
      type: types.GET_SUGGESTIONS_SUCCESS,
      payload: {
        isLoadingSuggestions: false,
        suggestions
      }
    };
    expect(actions.suggestSuccess(suggestions)).toEqual(expectedAction);
  });

  it('should create an action to end a failed suggestion', () => {
    const error = { error: 'failed' };
    const expectedAction = {
      type: types.GET_SUGGESTIONS_FAIL,
      payload: {
        isLoadingSuggestions: false,
        error
      }
    };
    expect(actions.suggestFail(error)).toEqual(expectedAction);
  });

  it('should create an action to sort the search results', () => {
    const searchResults = ['1', '2', '3'];
    const expectedAction = {
      type: types.SORT_SEARCH_RESULTS,
      payload: {
        searchResults
      }
    };
    expect(actions.sortSearchResults(searchResults)).toEqual(expectedAction);
  });

  it('should create an action to reset the suggestions', () => {
    const expectedAction = {
      type: types.RESET_SUGGESTIONS,
      payload: {
        isLoadingSuggestions: false,
        suggestions: []
      }
    };
    expect(actions.resetSuggestions()).toEqual(expectedAction);
  });
});
