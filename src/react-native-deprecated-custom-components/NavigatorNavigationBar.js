const _jsxFileName = 'src/NavigatorNavigationBar.js';
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
const _reactNative = require('react-native');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
  }
  return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      `Super expression must either be null or a function, not ${typeof superClass}`
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, enumerable: false, writable: true, configurable: true },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}
const React = require('react');
const NavigatorNavigationBarStylesAndroid = require('./NavigatorNavigationBarStylesAndroid');
const NavigatorNavigationBarStylesIOS = require('./NavigatorNavigationBarStylesIOS');
const PropTypes = require('prop-types');
const guid = require('./guid');
let _require = require('immutable'),
  Map = _require.Map;

const COMPONENT_NAMES = ['Title', 'LeftButton', 'RightButton'];
const NavigatorNavigationBarStyles =
  _reactNative.Platform.OS === 'android'
    ? NavigatorNavigationBarStylesAndroid
    : NavigatorNavigationBarStylesIOS;
const navStatePresentedIndex = function navStatePresentedIndex(navState) {
  if (navState.presentedIndex !== undefined) {
    return navState.presentedIndex;
  }
  return navState.observedTopOfStack;
};
const NavigatorNavigationBar = (function(_React$Component) {
  _inherits(NavigatorNavigationBar, _React$Component);
  function NavigatorNavigationBar() {
    let _ref;
    let _temp, _this, _ret;
    _classCallCheck(this, NavigatorNavigationBar);
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return (
      (_ret =
        ((_temp =
          ((_this = _possibleConstructorReturn(
            this,
            (_ref =
              NavigatorNavigationBar.__proto__ ||
              Object.getPrototypeOf(NavigatorNavigationBar)).call.apply(_ref, [this].concat(args))
          )),
          _this)),
        (_this.immediatelyRefresh = function() {
          _this._reset();
          _this.forceUpdate();
        }),
        (_this._reset = function() {
          _this._key = guid();
          _this._reusableProps = {};
          _this._components = {};
          _this._descriptors = {};
          COMPONENT_NAMES.forEach(function(componentName) {
            _this._components[componentName] = new Map();
            _this._descriptors[componentName] = new Map();
          });
        }),
        (_this._getReusableProps = function(componentName, index) {
          let propStack = _this._reusableProps[componentName];
          if (!propStack) {
            propStack = _this._reusableProps[componentName] = [];
          }
          let props = propStack[index];
          if (!props) {
            props = propStack[index] = { style: {} };
          }
          return props;
        }),
        (_this._updateIndexProgress = function(progress, index, fromIndex, toIndex) {
          const amount = toIndex > fromIndex ? progress : 1 - progress;
          const oldDistToCenter = index - fromIndex;
          const newDistToCenter = index - toIndex;
          let interpolate;
          if (
            (oldDistToCenter > 0 && newDistToCenter === 0) ||
            (newDistToCenter > 0 && oldDistToCenter === 0)
          ) {
            interpolate = _this.props.navigationStyles.Interpolators.RightToCenter;
          } else if (
            (oldDistToCenter < 0 && newDistToCenter === 0) ||
            (newDistToCenter < 0 && oldDistToCenter === 0)
          ) {
            interpolate = _this.props.navigationStyles.Interpolators.CenterToLeft;
          } else if (oldDistToCenter === newDistToCenter) {
            interpolate = _this.props.navigationStyles.Interpolators.RightToCenter;
          } else {
            interpolate = _this.props.navigationStyles.Interpolators.RightToLeft;
          }
          COMPONENT_NAMES.forEach(function(componentName) {
            const component = this._components[componentName].get(
              this.props.navState.routeStack[index]
            );
            const props = this._getReusableProps(componentName, index);
            if (component && interpolate[componentName](props.style, amount)) {
              props.pointerEvents = props.style.opacity === 0 ? 'none' : 'box-none';
              component.setNativeProps(props);
            }
          }, _this);
        }),
        (_this.updateProgress = function(progress, fromIndex, toIndex) {
          const max = Math.max(fromIndex, toIndex);
          const min = Math.min(fromIndex, toIndex);
          for (let index = min; index <= max; index++) {
            _this._updateIndexProgress(progress, index, fromIndex, toIndex);
          }
        }),
        (_this._getComponent = function(componentName, route, index) {
          if (_this._descriptors[componentName].includes(route)) {
            return _this._descriptors[componentName].get(route);
          }
          let rendered = null;
          const content = _this.props.routeMapper[componentName](
            _this.props.navState.routeStack[index],
            _this.props.navigator,
            index,
            _this.props.navState
          );
          if (!content) {
            return null;
          }
          const componentIsActive = index === navStatePresentedIndex(_this.props.navState);
          const initialStage = componentIsActive
            ? _this.props.navigationStyles.Stages.Center
            : _this.props.navigationStyles.Stages.Left;
          rendered = React.createElement(
            _reactNative.View,
            {
              ref: function ref(_ref2) {
                _this._components[componentName] = _this._components[componentName].set(
                  route,
                  _ref2
                );
              },
              pointerEvents: componentIsActive ? 'box-none' : 'none',
              style: initialStage[componentName],
              __source: { fileName: _jsxFileName, lineNumber: 199 },
            },
            content
          );
          _this._descriptors[componentName] = _this._descriptors[componentName].set(
            route,
            rendered
          );
          return rendered;
        }),
        _temp)),
      _possibleConstructorReturn(_this, _ret)
    );
  }
  _createClass(NavigatorNavigationBar, [
    {
      key: 'componentWillMount',
      value: function componentWillMount() {
        this._reset();
      },
    },
    {
      key: 'render',
      value: function render() {
        const _this2 = this;
        const navBarStyle = { height: this.props.navigationStyles.General.TotalNavHeight };
        const navState = this.props.navState;
        const components = navState.routeStack.map(function(route, index) {
          return COMPONENT_NAMES.map(function(componentName) {
            return _this2._getComponent(componentName, route, index);
          });
        });
        return React.createElement(
          _reactNative.View,
          {
            key: this._key,
            style: [styles.navBarContainer, navBarStyle, this.props.style],
            __source: { fileName: _jsxFileName, lineNumber: 169 },
          },
          components
        );
      },
    },
  ]);
  return NavigatorNavigationBar;
})(React.Component);

NavigatorNavigationBar.Styles = NavigatorNavigationBarStyles;
NavigatorNavigationBar.StylesAndroid = NavigatorNavigationBarStylesAndroid;
NavigatorNavigationBar.StylesIOS = NavigatorNavigationBarStylesIOS;
var styles = _reactNative.StyleSheet.create({
  navBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});
module.exports = NavigatorNavigationBar;
