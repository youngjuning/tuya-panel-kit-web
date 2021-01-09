const _jsxFileName = 'src/NavigatorBreadcrumbNavigationBar.js';
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
const _react = require('react');

const _react2 = _interopRequireDefault(_react);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
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
const NavigatorBreadcrumbNavigationBarStyles = require('./NavigatorBreadcrumbNavigationBarStyles');
const NavigatorNavigationBarStylesAndroid = require('./NavigatorNavigationBarStylesAndroid');
const NavigatorNavigationBarStylesIOS = require('./NavigatorNavigationBarStylesIOS');
const guid = require('./guid');
const invariant = require('fbjs/lib/invariant');
let _require = require('immutable'),
  Map = _require.Map;

const Interpolators = NavigatorBreadcrumbNavigationBarStyles.Interpolators;
const NavigatorNavigationBarStyles =
  _reactNative.Platform.OS === 'android'
    ? NavigatorNavigationBarStylesAndroid
    : NavigatorNavigationBarStylesIOS;
const PropTypes = require('prop-types');

const CRUMB_PROPS = Interpolators.map(function() {
  return { style: {} };
});
const ICON_PROPS = Interpolators.map(function() {
  return { style: {} };
});
const SEPARATOR_PROPS = Interpolators.map(function() {
  return { style: {} };
});
const TITLE_PROPS = Interpolators.map(function() {
  return { style: {} };
});
const RIGHT_BUTTON_PROPS = Interpolators.map(function() {
  return { style: {} };
});
function navStatePresentedIndex(navState) {
  if (navState.presentedIndex !== undefined) {
    return navState.presentedIndex;
  }
  return navState.observedTopOfStack;
}
function initStyle(index, presentedIndex) {
  return index === presentedIndex
    ? NavigatorBreadcrumbNavigationBarStyles.Center[index]
    : index < presentedIndex
    ? NavigatorBreadcrumbNavigationBarStyles.Left[index]
    : NavigatorBreadcrumbNavigationBarStyles.Right[index];
}
const NavigatorBreadcrumbNavigationBar = (function(_React$Component) {
  _inherits(NavigatorBreadcrumbNavigationBar, _React$Component);
  function NavigatorBreadcrumbNavigationBar() {
    let _ref;
    let _temp, _this, _ret;
    _classCallCheck(this, NavigatorBreadcrumbNavigationBar);
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return (
      (_ret =
        ((_temp =
          ((_this = _possibleConstructorReturn(
            this,
            (_ref =
              NavigatorBreadcrumbNavigationBar.__proto__ ||
              Object.getPrototypeOf(NavigatorBreadcrumbNavigationBar)).call.apply(
              _ref,
              [this].concat(args)
            )
          )),
          _this)),
        (_this._getBreadcrumb = function(route, index) {
          const pointerEvents =
            _this.props.navState.routeStack.length <= 1 && index === 0 ? 'none' : 'auto';
          const navBarRouteMapper = _this.props.routeMapper;
          const firstStyles = initStyle(index, navStatePresentedIndex(_this.props.navState));
          const breadcrumbDescriptor = _react2.default.createElement(
            _reactNative.View,
            {
              key: `crumb_${index}`,
              pointerEvents,
              ref: `crumb_${index}`,
              style: firstStyles.Crumb,
              __source: { fileName: _jsxFileName, lineNumber: 232 },
            },
            _react2.default.createElement(
              _reactNative.View,
              {
                ref: `icon_${index}`,
                style: firstStyles.Icon,
                __source: { fileName: _jsxFileName, lineNumber: 237 },
              },
              navBarRouteMapper.iconForRoute(route, _this.props.navigator)
            ),
            _react2.default.createElement(
              _reactNative.View,
              {
                ref: `separator_${index}`,
                style: firstStyles.Separator,
                __source: { fileName: _jsxFileName, lineNumber: 240 },
              },
              navBarRouteMapper.separatorForRoute(route, _this.props.navigator)
            )
          );
          return breadcrumbDescriptor;
        }),
        (_this._getTitle = function(route, index) {
          if (_this._descriptors.title.has(route)) {
            return _this._descriptors.title.get(route);
          }
          const titleContent = _this.props.routeMapper.titleContentForRoute(
            _this.props.navState.routeStack[index],
            _this.props.navigator
          );
          const firstStyles = initStyle(index, navStatePresentedIndex(_this.props.navState));
          const titleDescriptor = _react2.default.createElement(
            _reactNative.View,
            {
              key: `title_${index}`,
              ref: `title_${index}`,
              style: firstStyles.Title,
              __source: { fileName: _jsxFileName, lineNumber: 261 },
            },
            titleContent
          );
          _this._descriptors.title = _this._descriptors.title.set(route, titleDescriptor);
          return titleDescriptor;
        }),
        (_this._getRightButton = function(route, index) {
          if (_this._descriptors.right.has(route)) {
            return _this._descriptors.right.get(route);
          }
          const rightContent = _this.props.routeMapper.rightContentForRoute(
            _this.props.navState.routeStack[index],
            _this.props.navigator
          );
          if (!rightContent) {
            _this._descriptors.right = _this._descriptors.right.set(route, null);
            return null;
          }
          const firstStyles = initStyle(index, navStatePresentedIndex(_this.props.navState));
          const rightButtonDescriptor = _react2.default.createElement(
            _reactNative.View,
            {
              key: `right_${index}`,
              ref: `right_${index}`,
              style: firstStyles.RightItem,
              __source: { fileName: _jsxFileName, lineNumber: 286 },
            },
            rightContent
          );
          _this._descriptors.right = _this._descriptors.right.set(route, rightButtonDescriptor);
          return rightButtonDescriptor;
        }),
        _temp)),
      _possibleConstructorReturn(_this, _ret)
    );
  }
  _createClass(NavigatorBreadcrumbNavigationBar, [
    {
      key: '_updateIndexProgress',
      value: function _updateIndexProgress(progress, index, fromIndex, toIndex) {
        const amount = toIndex > fromIndex ? progress : 1 - progress;
        const oldDistToCenter = index - fromIndex;
        const newDistToCenter = index - toIndex;
        let interpolate;
        invariant(Interpolators[index], `Cannot find breadcrumb interpolators for ${index}`);
        if (
          (oldDistToCenter > 0 && newDistToCenter === 0) ||
          (newDistToCenter > 0 && oldDistToCenter === 0)
        ) {
          interpolate = Interpolators[index].RightToCenter;
        } else if (
          (oldDistToCenter < 0 && newDistToCenter === 0) ||
          (newDistToCenter < 0 && oldDistToCenter === 0)
        ) {
          interpolate = Interpolators[index].CenterToLeft;
        } else if (oldDistToCenter === newDistToCenter) {
          interpolate = Interpolators[index].RightToCenter;
        } else {
          interpolate = Interpolators[index].RightToLeft;
        }
        if (interpolate.Crumb(CRUMB_PROPS[index].style, amount)) {
          this._setPropsIfExists(`crumb_${index}`, CRUMB_PROPS[index]);
        }
        if (interpolate.Icon(ICON_PROPS[index].style, amount)) {
          this._setPropsIfExists(`icon_${index}`, ICON_PROPS[index]);
        }
        if (interpolate.Separator(SEPARATOR_PROPS[index].style, amount)) {
          this._setPropsIfExists(`separator_${index}`, SEPARATOR_PROPS[index]);
        }
        if (interpolate.Title(TITLE_PROPS[index].style, amount)) {
          this._setPropsIfExists(`title_${index}`, TITLE_PROPS[index]);
        }
        const right = this.refs[`right_${index}`];
        const rightButtonStyle = RIGHT_BUTTON_PROPS[index].style;
        if (right && interpolate.RightItem(rightButtonStyle, amount)) {
          right.setNativeProps({
            style: rightButtonStyle,
            pointerEvents: rightButtonStyle.opacity === 0 ? 'none' : 'auto',
          });
        }
      },
    },
    {
      key: 'updateProgress',
      value: function updateProgress(progress, fromIndex, toIndex) {
        const max = Math.max(fromIndex, toIndex);
        const min = Math.min(fromIndex, toIndex);
        for (let index = min; index <= max; index++) {
          this._updateIndexProgress(progress, index, fromIndex, toIndex);
        }
      },
    },
    {
      key: 'onAnimationStart',
      value: function onAnimationStart(fromIndex, toIndex) {
        const max = Math.max(fromIndex, toIndex);
        const min = Math.min(fromIndex, toIndex);
        for (let index = min; index <= max; index++) {
          this._setRenderViewsToHardwareTextureAndroid(index, true);
        }
      },
    },
    {
      key: 'onAnimationEnd',
      value: function onAnimationEnd() {
        const max = this.props.navState.routeStack.length - 1;
        for (let index = 0; index <= max; index++) {
          this._setRenderViewsToHardwareTextureAndroid(index, false);
        }
      },
    },
    {
      key: '_setRenderViewsToHardwareTextureAndroid',
      value: function _setRenderViewsToHardwareTextureAndroid(index, renderToHardwareTexture) {
        const props = { renderToHardwareTextureAndroid: renderToHardwareTexture };
        this._setPropsIfExists(`icon_${index}`, props);
        this._setPropsIfExists(`separator_${index}`, props);
        this._setPropsIfExists(`title_${index}`, props);
        this._setPropsIfExists(`right_${index}`, props);
      },
    },
    {
      key: 'componentWillMount',
      value: function componentWillMount() {
        this._reset();
      },
    },
    {
      key: 'render',
      value: function render() {
        const navState = this.props.navState;
        const icons = navState && navState.routeStack.map(this._getBreadcrumb);
        const titles = navState.routeStack.map(this._getTitle);
        const buttons = navState.routeStack.map(this._getRightButton);
        return _react2.default.createElement(
          _reactNative.View,
          {
            key: this._key,
            style: [styles.breadCrumbContainer, this.props.style],
            __source: { fileName: _jsxFileName, lineNumber: 194 },
          },
          titles,
          icons,
          buttons
        );
      },
    },
    {
      key: 'immediatelyRefresh',
      value: function immediatelyRefresh() {
        this._reset();
        this.forceUpdate();
      },
    },
    {
      key: '_reset',
      value: function _reset() {
        this._key = guid();
        this._descriptors = { title: new Map(), right: new Map() };
      },
    },
    {
      key: '_setPropsIfExists',
      value: function _setPropsIfExists(ref, props) {
        var ref = this.refs[ref];
        ref && ref.setNativeProps(props);
      },
    },
  ]);
  return NavigatorBreadcrumbNavigationBar;
})(_react2.default.Component);
NavigatorBreadcrumbNavigationBar.Styles = NavigatorBreadcrumbNavigationBarStyles;
var styles = _reactNative.StyleSheet.create({
  breadCrumbContainer: {
    overflow: 'hidden',
    position: 'absolute',
    height: NavigatorNavigationBarStyles.General.TotalNavHeight,
    top: 0,
    left: 0,
    right: 0,
  },
});
module.exports = NavigatorBreadcrumbNavigationBar;
