import axios from 'axios';

import * as types from './types';

export const search = (gene, headers) => dispatch => {
  // Copy headers
  const newHeaders = {};
  Object.keys(headers).forEach(key => {
    newHeaders[key] = { ...headers[key] };
  });

  // Change the new headers and create desired headers for network request
  const desiredHeaders = {};
  Object.entries(newHeaders).forEach(entry => {
    if (entry[1].isChecked) {
      newHeaders[entry[0]].isFetched = 1;
      desiredHeaders[entry[0]] = 1;
    } else newHeaders[entry[0]].isFetched = 0;
  });
  const numCols = Object.values(newHeaders).filter(
    header => header.isFetched && header.isHeader
  ).length;

  dispatch(searchStart());
  axios
    .post('/api/search', { gene, desiredHeaders })
    .then(response =>
      dispatch(
        searchSuccess(response.data.genes, newHeaders, desiredHeaders, numCols)
      )
    )
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

export const searchSuccess = (
  searchResults,
  headers,
  desiredHeaders,
  numCols
) => ({
  type: types.GET_SEARCH_RESULTS_SUCCESS,
  payload: {
    isLoadingSearchResults: false,
    searchResults,
    headers,
    desiredHeaders,
    numCols
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

export const sortSearchResults = (searchResults, sortedHeader) => {
  const sortedSearchResults = [];
  searchResults.forEach(result => sortedSearchResults.push({ ...result }));
  sortedSearchResults.sort(compare(sortedHeader));

  return {
    type: types.SORT_SEARCH_RESULTS,
    payload: {
      searchResults: sortedSearchResults
    }
  };
};

const compare = sortedHeader => {
  const header = sortedHeader.name;
  return (a, b) => {
    const left = a[header] ? a[header] : '-';
    const right = b[header] ? b[header] : '-';
    if (left > right) return sortedHeader.isAscending ? 1 : -1;
    if (left < right) return sortedHeader.isAscending ? -1 : 1;
    return 0;
  };
};

export const resetSuggestions = () => ({
  type: types.RESET_SUGGESTIONS,
  payload: {
    isLoadingSuggestions: false,
    suggestions: []
  }
});

export const setHeaders = headers => ({
  type: types.SET_HEADERS,
  payload: {
    headers
  }
});

export const toggleCondensed = isCondensed => ({
  type: types.TOGGLE_CONDENSED,
  payload: {
    isCondensed: !isCondensed
  }
});
