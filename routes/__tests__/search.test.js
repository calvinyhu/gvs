const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const app = require('../../app');

chai.use(chaiHttp);

// Test POST /api/search
describe('POST /api/search', () => {
  const data = {
    gene: 'BRAF',
    desiredHeaders: {
      Gene: 1,
      'Nucleotide Change': 1,
      'Protein Change': 1,
      'Other Mappings': 1,
      Alias: 1,
      Region: 1,
      'Reported Classification': 1,
      'Inferred Classification': 1,
      Source: 1,
      'Last Evaluated': 1,
      'Last Updated': 1,
      URL: 1
    }
  };

  it('should fetch gene data', done => {
    chai
      .request(app)
      .post('/api/search')
      .send(data)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('genes');
        response.body.genes.should.be.a('array');
        done();
      });
  });
});

// Test POST /api/search/suggestion
describe('POST /api/search/suggestion', () => {
  const data = { gene: 'BRAF', desiredHeaders: 'Gene' };

  it('should fetch auto-complete suggestions', done => {
    chai
      .request(app)
      .post('/api/search/suggestion')
      .send(data)
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('suggestions');
        response.body.suggestions.should.be.a('array');
        done();
      });
  });
});
