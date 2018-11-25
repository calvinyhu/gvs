import axios from 'axios';

import * as types from './types';

export const search = (gene, desiredHeaders) => dispatch => {
  dispatch(searchStart());
  axios
    .post('/api/search', { gene, desiredHeaders })
    .then(response => dispatch(searchSuccess(response.data.genes)))
    .catch(error => dispatch(searchFail(error)));
};

export const searchStart = () => ({
  type: types.GET_SEARCH_RESULTS_START,
  payload: {
    isLoadingSearchResults: true,
    searchResults: [],
    error: {}
  }
});

export const searchSuccess = searchResults => ({
  type: types.GET_SEARCH_RESULTS_SUCCESS,
  payload: {
    isLoadingSearchResults: false,
    searchResults
  }
});

export const searchFail = error => ({
  type: types.GET_SEARCH_RESULTS_FAIL,
  payload: {
    isLoadingSearchResults: false,
    error
  }
});

export const suggest = gene => dispatch => {
  dispatch(suggestStart());
  axios
    .post('/api/search/suggestion', { gene })
    .then(response => dispatch(suggestSuccess(response.data.suggestions)))
    .catch(error => dispatch(suggestFail(error)));
};

export const suggestStart = () => ({
  type: types.GET_SUGGESTIONS_START,
  payload: {
    isLoadingSuggestions: true,
    suggestions: [],
    error: {}
  }
});

export const suggestSuccess = suggestions => ({
  type: types.GET_SUGGESTIONS_SUCCESS,
  payload: {
    isLoadingSuggestions: false,
    suggestions
  }
});

export const suggestFail = error => ({
  type: types.GET_SUGGESTIONS_FAIL,
  payload: {
    isLoadingSuggestions: false,
    error
  }
});

export const sortSearchResults = searchResults => ({
  type: types.SORT_SEARCH_RESULTS,
  payload: {
    searchResults
  }
});

export const resetSuggestions = () => ({
  type: types.RESET_SUGGESTIONS,
  payload: {
    isLoadingSuggestions: false,
    suggestions: []
  }
});
