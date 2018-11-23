import React from 'react';
import { shallow } from 'enzyme';

import SearchGridItem from '../SearchGridItem/SearchGridItem';

let wrapper;
const clickMock = jest.fn();

beforeEach(() => {
  wrapper = shallow(
    <SearchGridItem
      isCondensed={true}
      isDarkRow={false}
      isNucleotideChange={false}
      isSource={false}
      openGeneId=""
      entryValue=""
      result={{}}
      click={clickMock}
    />
  );
});

afterEach(() => {
  wrapper.unmount();
});

describe('the search grid item', () => {
  it('shows a search grid item with NO entry name', () => {
    expect(wrapper.find('div').length).toEqual(2);
    expect(wrapper.find('p').length).toEqual(1);
    expect(wrapper.find('p').text()).toEqual('-');
  });

  it('shows a search grid item with an entry name', () => {
    const entryValue = 'entry';
    wrapper.setProps({ entryValue });
    expect(wrapper.find('div').length).toEqual(2);
    expect(wrapper.find('p').length).toEqual(1);
    expect(wrapper.find('p').text()).toEqual(entryValue);
  });
});

describe('the search grid item when it is a Nucleotide Change', () => {
  it('shows a search grid item with an entry name, gene variants, and carrot', () => {
    const numMappings = 10;
    const mappings = [];
    for (let i = 0; i < numMappings; i++) mappings.push('mapping' + i);

    wrapper.setProps({
      isNucleotideChange: true,
      entryValue: 'entry',
      result: {
        _id: '912834bsdf',
        'Other Mappings': mappings.join(',')
      }
    });

    expect(wrapper.find('div').length).toEqual(5);
    expect(wrapper.find('p').length).toEqual(numMappings + 1);
  });
});

describe('the search grid item when it is a Source', () => {
  it('shows a search grid item with an entry name as an external link', () => {
    wrapper.setProps({ isSource: true, result: { URL: 'some url' } });
    expect(wrapper.find('div').length).toEqual(2);
    expect(wrapper.find('a').length).toEqual(1);
  });
});
