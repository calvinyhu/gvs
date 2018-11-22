import React from 'react';
import { mount } from 'enzyme';
import moxios from 'moxios';

import Search from '../Search/Search';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchGrid from '../../components/SearchGrid/SearchGrid';

let numSearchResults = 10;
const searchResults = [];
for (let i = 0; i < numSearchResults; i++) {
  searchResults.push({
    _id: '5bf59eaca552eb9cdb767d77',
    Gene: 'BRAF',
    'Nucleotide Change': 'NM_004333.4:c.1068A>G',
    'Protein Change': 'p.Gln356=',
    'Other Mappings':
      'LRG_299t1:c.1068A>G,NM_004333.4:c.1068A>G,LRG_299:g.135385A>G,NG_007873.3:g.135385A>G,NC_000007.14:g.140794380T>C,NC_000007.13:g.140494180T>C,c.1068A>G,p.Gln356Gln,LRG_299p1:p.Gln356=,NP_004324.2:p.Gln356=',
    Alias: '',
    Region: 'NM_004333.4:EXON 8',
    'Reported Classification': 'Likely benign',
    'Inferred Classification':
      'Variant of uncertain significance, likely benign',
    Source: 'ClinVar',
    'Last Evaluated': '2012-08-16',
    'Last Updated': '2017-09-14',
    URL: 'https://www.ncbi.nlm.nih.gov/clinvar/RCV000037898'
  });
}

describe('the search container', () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest('http://localhost:5000/api/search', {
      status: 200,
      response: { genes: searchResults }
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('can fetch an array of genes and display it', done => {
    const wrapper = mount(<Search />);
    wrapper.setState({ gene: 'BRAF' });
    expect(wrapper.find(SearchBar).props().gene).toEqual('BRAF');

    wrapper.find('button').simulate('click');
    expect(wrapper.state().isLoading).toEqual(true);

    moxios.wait(() => {
      wrapper.update();
      expect(wrapper.state().isLoading).toEqual(false);
      expect(wrapper.find(SearchGrid).length).toEqual(1);
      expect(wrapper.find(SearchGrid).props().searchResults.length).toEqual(
        numSearchResults * 11
      );
      wrapper.unmount();
      done();
    });
  });
});
