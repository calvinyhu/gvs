import React from 'react';
import { shallow } from 'enzyme';

import Button from '../UI/Button/Button';

let wrapper;
const clickMock = jest.fn();

beforeEach(() => {
  wrapper = shallow(<Button children="Click Me" click={clickMock} />);
});

afterEach(() => {
  wrapper.unmount();
});

describe('the Button', () => {
  it('shows a button', () => {
    expect(wrapper.find('button').length).toEqual(1);
  });

  it('shows a button named Click Me', () => {
    expect(wrapper.find('button').text()).toEqual('Click Me');
  });

  it('should call the function when clicked', () => {
    wrapper.find('button').simulate('click');
    expect(clickMock).toHaveBeenCalled();
  });
});
