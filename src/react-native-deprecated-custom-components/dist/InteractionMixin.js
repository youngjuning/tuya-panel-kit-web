const _reactNative = require('react-native');

const InteractionMixin = {
  componentWillUnmount: function componentWillUnmount() {
    while (this._interactionMixinHandles.length) {
      _reactNative.InteractionManager.clearInteractionHandle(this._interactionMixinHandles.pop());
    }
  },
  _interactionMixinHandles: [],
  createInteractionHandle: function createInteractionHandle() {
    const handle = _reactNative.InteractionManager.createInteractionHandle();
    this._interactionMixinHandles.push(handle);
    return handle;
  },
  clearInteractionHandle: function clearInteractionHandle(clearHandle) {
    _reactNative.InteractionManager.clearInteractionHandle(clearHandle);
    this._interactionMixinHandles = this._interactionMixinHandles.filter(function(handle) {
      return handle !== clearHandle;
    });
  },
  runAfterInteractions: function runAfterInteractions(callback) {
    _reactNative.InteractionManager.runAfterInteractions(callback);
  },
};
module.exports = InteractionMixin;
