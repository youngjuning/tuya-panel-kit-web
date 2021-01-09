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
const NavigationEvent = require('./NavigationEvent');
const NavigationEventEmitter = require('./NavigationEventEmitter');
const NavigationTreeNode = require('./NavigationTreeNode');
const emptyFunction = require('fbjs/lib/emptyFunction');
const invariant = require('fbjs/lib/invariant');

let AT_TARGET = NavigationEvent.AT_TARGET,
  BUBBLING_PHASE = NavigationEvent.BUBBLING_PHASE,
  CAPTURING_PHASE = NavigationEvent.CAPTURING_PHASE;
const LegacyEventTypes = new Set(['willfocus', 'didfocus']);
const NavigationContext = (function() {
  function NavigationContext() {
    _classCallCheck(this, NavigationContext);
    this._bubbleEventEmitter = new NavigationEventEmitter(this);
    this._captureEventEmitter = new NavigationEventEmitter(this);
    this._currentRoute = null;
    this.__node = new NavigationTreeNode(this);
    this._emitCounter = 0;
    this._emitQueue = [];
    this.addListener('willfocus', this._onFocus);
    this.addListener('didfocus', this._onFocus);
  }
  _createClass(NavigationContext, [
    {
      key: 'appendChild',
      value: function appendChild(childContext) {
        this.__node.appendChild(childContext.__node);
      },
    },
    {
      key: 'addListener',
      value: function addListener(eventType, listener, useCapture) {
        if (LegacyEventTypes.has(eventType)) {
          useCapture = false;
        }
        const emitter = useCapture ? this._captureEventEmitter : this._bubbleEventEmitter;
        if (emitter) {
          return emitter.addListener(eventType, listener, this);
        }
        return { remove: emptyFunction };
      },
    },
    {
      key: 'emit',
      value: function emit(eventType, data, didEmitCallback) {
        const _this = this;
        if (this._emitCounter > 0) {
          var args = Array.prototype.slice.call(arguments);
          this._emitQueue.push(args);
          return;
        }
        this._emitCounter++;
        if (LegacyEventTypes.has(eventType)) {
          this.__emit(eventType, data, null, {
            defaultPrevented: false,
            eventPhase: AT_TARGET,
            propagationStopped: true,
            target: this,
          });
        } else {
          const targets = [this];
          let parentTarget = this.parent;
          while (parentTarget) {
            targets.unshift(parentTarget);
            parentTarget = parentTarget.parent;
          }
          var propagationStopped = false;
          var defaultPrevented = false;
          const callback = function callback(event) {
            propagationStopped = propagationStopped || event.isPropagationStopped();
            defaultPrevented = defaultPrevented || event.defaultPrevented;
          };
          targets.some(function(currentTarget) {
            if (propagationStopped) {
              return true;
            }
            const extraInfo = {
              defaultPrevented,
              eventPhase: CAPTURING_PHASE,
              propagationStopped,
              target: _this,
            };
            currentTarget.__emit(eventType, data, callback, extraInfo);
          }, this);
          targets.reverse().some(function(currentTarget) {
            if (propagationStopped) {
              return true;
            }
            const extraInfo = {
              defaultPrevented,
              eventPhase: BUBBLING_PHASE,
              propagationStopped,
              target: _this,
            };
            currentTarget.__emit(eventType, data, callback, extraInfo);
          }, this);
        }
        if (didEmitCallback) {
          const event = NavigationEvent.pool(eventType, this, data);
          propagationStopped && event.stopPropagation();
          defaultPrevented && event.preventDefault();
          didEmitCallback.call(this, event);
          event.dispose();
        }
        this._emitCounter--;
        while (this._emitQueue.length) {
          var args = this._emitQueue.shift();
          this.emit.apply(this, args);
        }
      },
    },
    {
      key: 'dispose',
      value: function dispose() {
        this._bubbleEventEmitter && this._bubbleEventEmitter.removeAllListeners();
        this._captureEventEmitter && this._captureEventEmitter.removeAllListeners();
        this._bubbleEventEmitter = null;
        this._captureEventEmitter = null;
        this._currentRoute = null;
      },
    },
    {
      key: '__emit',
      value: function __emit(eventType, data, didEmitCallback, extraInfo) {
        let emitter;
        switch (extraInfo.eventPhase) {
          case CAPTURING_PHASE:
            emitter = this._captureEventEmitter;
            break;
          case AT_TARGET:
            emitter = this._bubbleEventEmitter;
            break;
          case BUBBLING_PHASE:
            emitter = this._bubbleEventEmitter;
            break;
          default:
            invariant(false, 'invalid event phase %s', extraInfo.eventPhase);
        }
        if (extraInfo.target === this) {
          extraInfo.eventPhase = AT_TARGET;
        }
        if (emitter) {
          emitter.emit(eventType, data, didEmitCallback, extraInfo);
        }
      },
    },
    {
      key: '_onFocus',
      value: function _onFocus(event) {
        invariant(
          event.data && event.data.hasOwnProperty('route'),
          'event type "%s" should provide route',
          event.type
        );
        this._currentRoute = event.data.route;
      },
    },
    {
      key: 'parent',
      get: function get() {
        const parent = this.__node.getParent();
        return parent ? parent.getValue() : null;
      },
    },
    {
      key: 'top',
      get: function get() {
        let result = null;
        let parentNode = this.__node.getParent();
        while (parentNode) {
          result = parentNode.getValue();
          parentNode = parentNode.getParent();
        }
        return result;
      },
    },
    {
      key: 'currentRoute',
      get: function get() {
        return this._currentRoute;
      },
    },
  ]);
  return NavigationContext;
})();
module.exports = NavigationContext;
