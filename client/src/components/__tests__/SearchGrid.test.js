import React from 'react';
import { shallow } from 'enzyme';

import SearchGrid from '../SearchGrid/SearchGrid';

let wrapper;

beforeEach(() => {
  wrapper = shallow(<SearchGrid numCols={0} searchResults={[]} />);
});

afterEach(() => {
  wrapper.unmount();
});

describe('the search grid', () => {
  it('shows a grid', () => {
    expect(wrapper.find('div').length).toEqual(1);
  });
});

describe('the search grid when searchResults contains items', () => {
  it('shows a grid with the correct number of items', () => {
    const numSearchResults = 50;
    const searchResults = [];
    for (let i = 0; i < numSearchResults; i++)
      searchResults.push(<div key={i} />);
    wrapper.setProps({ searchResults });

    expect(wrapper.find('div').length).toEqual(numSearchResults + 1);
  });
});
