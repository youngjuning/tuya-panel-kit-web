const _createClass = (function() {
  function defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
const EventSubscription = (function() {
  function EventSubscription(subscriber) {
    _classCallCheck(this, EventSubscription);
    this.subscriber = subscriber;
  }
  _createClass(EventSubscription, [
    {
      key: 'remove',
      value: function remove() {
        this.subscriber.removeSubscription(this);
      },
    },
  ]);
  return EventSubscription;
})();
module.exports = EventSubscription;
