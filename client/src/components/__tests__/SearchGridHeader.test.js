import React from 'react';
import { shallow } from 'enzyme';

import SearchGridHeader from '../SearchGridHeader/SearchGridHeader';

let wrapper;
let clickMock = jest.fn();

beforeEach(() => {
  wrapper = shallow(
    <SearchGridHeader
      isSortable={0}
      isSorted={false}
      isAscending={false}
      click={clickMock}
    />
  );
});

afterEach(() => {
  wrapper.unmount();
});

describe('the search grid header', () => {
  it('shows a search grid header', () => {
    expect(wrapper.find('div').length).toEqual(1);
  });
});

describe('the search grid header when it has a label', () => {
  it('shows a search grid header with the label', () => {
    wrapper.setProps({ children: 'Label' });
    expect(wrapper.find('div').props().children).toContain('Label');
  });
});

describe('the search grid header when it is clicked', () => {
  it('should NOT call clickMock when clicked and isSortable is 0', () => {
    wrapper.find('div').simulate('click');
    expect(clickMock).not.toHaveBeenCalled();
  });

  it('should call clickMock when clicked and isSortable is 1', () => {
    wrapper.setProps({ isSortable: 1 });
    wrapper.find('div').simulate('click');
    expect(clickMock).toHaveBeenCalled();
  });
});
