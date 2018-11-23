const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeneSchema = new Schema({
  Gene: { type: String },
  'Nucleotide Change': { type: String },
  'Protein Change': { type: String },
  'Other Mappings': { type: String },
  Alias: { type: String },
  Transcripts: { type: String },
  Region: { type: String },
  'Reported Classification': { type: String },
  'Inferred Classification': { type: String },
  Source: { type: String },
  'Last Evaluated': { type: String },
  'Last Updated': { type: String },
  URL: { type: String },
  'Submitter Comment': { type: String },
  Assembly: { type: String },
  Chr: {
    type: Number
  },
  'Genomic Start': {
    type: Number
  },
  'Genomic Stop': {
    type: Number
  },
  Ref: { type: String },
  Alt: { type: String },
  Accession: { type: String },
  'Reported Ref': { type: String },
  'Reported Alt': { type: String }
});

const GeneModel = mongoose.model('gene', GeneSchema);

module.exports = GeneModel;
