const invariant = require('fbjs/lib/invariant');

function getStyle(style) {
  if (style && typeof style === 'number') {
    invariant(
      false,
      'Error when using Navigator from react-native-custom-components. Please provide a raw object to `props.sceneStyle` instead of a StyleSheet reference.'
    );
  }
  return style;
}
function flattenStyle(style) {
  if (!style) {
    return undefined;
  }
  invariant(style !== true, 'style may be false but not true');
  if (!Array.isArray(style)) {
    return getStyle(style);
  }
  const result = {};
  for (let i = 0, styleLength = style.length; i < styleLength; ++i) {
    const computedStyle = flattenStyle(style[i]);
    if (computedStyle) {
      for (const key in computedStyle) {
        result[key] = computedStyle[key];
      }
    }
  }
  return result;
}
module.exports = flattenStyle;
