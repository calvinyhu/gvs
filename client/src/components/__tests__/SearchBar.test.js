import React from 'react';
import { shallow } from 'enzyme';

import SearchBar from '../SearchBar/SearchBar';

let wrapper;
let handleInputChangeMock = jest.fn();
let handleSearchMock = jest.fn();

beforeEach(() => {
  wrapper = shallow(
    <SearchBar
      gene=""
      suggestions={[]}
      handleInputChange={handleInputChangeMock}
      handleSearch={handleSearchMock}
    />
  );
});

afterEach(() => {
  wrapper.unmount();
});

describe('the search bar', () => {
  it('shows 1 form, 1 datalist, 1 input, and 1 button', () => {
    expect(wrapper.find('form').length).toEqual(1);
    expect(wrapper.find('input').length).toEqual(1);
    expect(wrapper.find('datalist').length).toEqual(1);
    expect(wrapper.find('button').length).toEqual(1);
  });
});

describe('the search bar when the input is changed', () => {
  it('should call handleInputChange with the same values', () => {
    const event = { target: { name: 'gene', value: 'BRAF' } };
    wrapper.find('input').simulate('change', event);
    expect(handleInputChangeMock).toHaveBeenCalledWith(event);
  });
});

describe('the search bar when the search button is clicked', () => {
  it('should call handleSearch', () => {
    wrapper.find('button').simulate('click');
    expect(handleSearchMock).toHaveBeenCalled();
  });
});
