const Schema = require('schm');
const moment = require('moment');

const re = /in (\d+) days/

const parseToDate = (val) => {
  val = val.toLowerCase().trim();
  if (val === 'tomorrow') return moment(new Date()).add(1, 'days');
  if (val === 'today') return moment(new Date());
  if (re.test(val)) {
    const days = val.match(re)[1];
    return moment(new Date()).add(Number(days), 'days');
  };
  return moment(new Date(val));
}

const primarySchema = {
  text: { type: String, default: '' },
  done: { type: Boolean, default: false },
  dueDate: { type: String, required: false, dehumanize: true },
  ancestors: { type: [String], default: [] },
};

const toDataBase = new Schema(primarySchema, previous => previous.merge({
  parsers: {
    dehumanize: value => {
      return parseToDate(value).toString()
    },
  },
}))

const fromDataBase = new Schema({
  ...primarySchema,
  _id: { type: String }
}, previous => previous.merge({
  parsers: {
    dehumanize: value => {
      return moment(value)
    },
  },
}))

module.exports = {
  toDataBase,
  fromDataBase
}