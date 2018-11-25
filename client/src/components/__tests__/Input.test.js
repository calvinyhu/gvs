import React from 'react';
import { shallow } from 'enzyme';

import Input from '../UI/Input/Input';

let wrapper;
const changeMock = jest.fn();

beforeEach(() => {
  wrapper = shallow(
    <Input
      required
      type="text"
      name="Input Field"
      placeholder="Input Placeholder"
      value=""
      change={changeMock}
    />
  );
});

afterEach(() => {
  wrapper.unmount();
});

describe('the Input', () => {
  it('shows an input with the correct props', () => {
    expect(wrapper.find('input').length).toEqual(1);
    expect(wrapper.find('input').props().type).toEqual('text');
    expect(wrapper.find('input').props().name).toEqual('Input Field');
    expect(wrapper.find('input').props().placeholder).toEqual(
      'Input Placeholder'
    );
    expect(wrapper.find('input').props().value).toEqual('');
    expect(wrapper.find('input').props().onChange).toEqual(changeMock);
  });

  it('should call the function when it changes', () => {
    const event = { name: 'Input Field', value: 'Hello' };
    wrapper.find('input').simulate('change', event);
    expect(changeMock).toHaveBeenCalledWith(event);
  });
});
