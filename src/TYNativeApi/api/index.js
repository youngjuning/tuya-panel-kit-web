Object.defineProperty(exports, '__esModule', { value: true });
const _extends =
  Object.assign ||
  function(target) {
    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i];
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
const _modules = require('./modules');

const _modules2 = _interopRequireDefault(_modules);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
const Event = {};
let _require = require('events'),
  EventEmitter = _require.EventEmitter;

const RNEventEmitter = new EventEmitter();
RNEventEmitter.setMaxListeners(0);
const eventsFns = ['on', 'once', 'emit'];
eventsFns.forEach(function(it) {
  return (Event[it] = RNEventEmitter[it].bind(RNEventEmitter));
});
Event.fire = RNEventEmitter.emit.bind(RNEventEmitter);
Event.remove = RNEventEmitter.removeListener.bind(RNEventEmitter);
Event.off = function(type) {
  if (arguments.length === 1) {
    RNEventEmitter.removeAllListeners(type);
  }
  if (arguments.length === 2) {
    RNEventEmitter.removeListener(type, arguments[1]);
  }
};
const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.navigator &&
  window.document &&
  window.document.createElement
);
const TYWebApi = {
  devInfo: {},
  lang: {},
  uiConfig: {},
  mobileInfo: { lang: canUseDOM ? navigator.language || navigator.userLanguage : 'zh' },
  native: { mobileInfo: {}, getUiConfig: {} },
  mobile: {
    verSupported: function verSupported(version) {
      console.log('TYSdk', version);
    },
  },
  putDpData: function putDpData(cmd) {
    console.log(`TYNative.putDpData: ${JSON.stringify(cmd)}`);
  },
  Navigator: {
    push: function push(route) {
      console.log(`TYNative.Navigator.push: ${route && route.id}`);
    },
    pop: function pop() {
      console.log('TYNative.Navigator.pop');
    },
  },
  event: _extends({}, Event),
};
_modules2.default.forEach(function(key) {
  if (typeof TYWebApi[key] === 'undefined') {
    TYWebApi[key] = function() {
      if (process.env.NODE_ENV === 'development') {
        console.log(`TYNative.${key}: unimplemented`);
      }
    };
  }
});
exports.default = TYWebApi;
