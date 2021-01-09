const mergeHelpers = require('./mergeHelpers');

const checkMergeObjectArg = mergeHelpers.checkMergeObjectArg;
const checkMergeIntoObjectArg = mergeHelpers.checkMergeIntoObjectArg;
function mergeInto(one, two) {
  checkMergeIntoObjectArg(one);
  if (two != null) {
    checkMergeObjectArg(two);
    for (const key in two) {
      if (!two.hasOwnProperty(key)) {
        continue;
      }
      one[key] = two[key];
    }
  }
}
module.exports = mergeInto;
