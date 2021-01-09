const mergeInto = require('./mergeInto');

const merge = function merge(one, two) {
  const result = {};
  mergeInto(result, one);
  mergeInto(result, two);
  return result;
};
module.exports = merge;
