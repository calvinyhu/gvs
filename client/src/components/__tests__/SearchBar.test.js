import React from 'react';
import { shallow } from 'enzyme';

import SearchBar from '../SearchBar/SearchBar';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';

let wrapper;
let handleInputChangeMock = jest.fn();
let handleSearchMock = jest.fn();

beforeEach(() => {
  wrapper = shallow(
    <SearchBar
      isLoadingSuggestions={false}
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
    expect(wrapper.find(Input).length).toEqual(1);
    expect(wrapper.find('datalist').length).toEqual(1);
    expect(wrapper.find(Button).length).toEqual(1);
  });
});
