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
const _jsxFileName = 'src/Navigator.js';
const _reactNative = require('react-native');
const buildStyleInterpolator = require('./buildStyleInterpolator');

const AnimationsDebugModule = _reactNative.NativeModules.AnimationsDebugModule;
const InteractionMixin = require('./InteractionMixin');
const NavigationContext = require('./NavigationContext');
const NavigatorBreadcrumbNavigationBar = require('./NavigatorBreadcrumbNavigationBar');
const NavigatorNavigationBar = require('./NavigatorNavigationBar');
const NavigatorSceneConfigs = require('./NavigatorSceneConfigs');
const React = require('react');
const Subscribable = require('./Subscribable');
const TimerMixin = require('react-timer-mixin');
const createReactClass = require('create-react-class');
const clamp = require('./clamp');
const invariant = require('fbjs/lib/invariant');
const rebound = require('rebound');
const flattenStyle = require('./flattenStyle');
const PropTypes = require('prop-types');

const SCREEN_WIDTH = _reactNative.Dimensions.get('window').width;
const SCREEN_HEIGHT = _reactNative.Dimensions.get('window').height;
const SCENE_DISABLED_NATIVE_PROPS = {
  pointerEvents: 'none',
  style: { top: SCREEN_HEIGHT, bottom: -SCREEN_HEIGHT, opacity: 0 },
};
let __uid = 0;
function getuid() {
  return __uid++;
}
function getRouteID(route) {
  if (route === null || typeof route !== 'object') {
    return String(route);
  }
  const key = '__navigatorRouteID';
  if (!route.hasOwnProperty(key)) {
    Object.defineProperty(route, key, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: getuid(),
    });
  }
  return route[key];
}
const BASE_SCENE_STYLE = {
  position: 'absolute',
  overflow: 'hidden',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
};
const DEFAULT_SCENE_STYLE = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  transform: [
    { translateX: 0 },
    { translateY: 0 },
    { scaleX: 1 },
    { scaleY: 1 },
    { rotate: '0deg' },
    { skewX: '0deg' },
    { skewY: '0deg' },
  ],
};
const styles = _reactNative.StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  defaultSceneStyle: DEFAULT_SCENE_STYLE,
  baseScene: BASE_SCENE_STYLE,
  disabledScene: { top: SCREEN_HEIGHT, bottom: -SCREEN_HEIGHT },
  transitioner: { flex: 1, backgroundColor: 'transparent', overflow: 'hidden' },
});
const GESTURE_ACTIONS = ['pop', 'jumpBack', 'jumpForward'];
const Navigator = createReactClass({
  displayName: 'Navigator',
  statics: {
    BreadcrumbNavigationBar: NavigatorBreadcrumbNavigationBar,
    NavigationBar: NavigatorNavigationBar,
    SceneConfigs: NavigatorSceneConfigs,
  },
  mixins: [TimerMixin, InteractionMixin, Subscribable.Mixin],
  getDefaultProps: function getDefaultProps() {
    return {
      configureScene: function configureScene() {
        return NavigatorSceneConfigs.PushFromRight;
      },
      sceneStyle: DEFAULT_SCENE_STYLE,
    };
  },
  getInitialState: function getInitialState() {
    const _this = this;
    this._navigationBarNavigator = this.props.navigationBarNavigator || this;
    this._renderedSceneMap = new Map();
    this._sceneRefs = [];
    const routeStack = this.props.initialRouteStack || [this.props.initialRoute];
    invariant(
      routeStack.length >= 1,
      'Navigator requires props.initialRoute or props.initialRouteStack.'
    );
    let initialRouteIndex = routeStack.length - 1;
    if (this.props.initialRoute) {
      initialRouteIndex = routeStack.indexOf(this.props.initialRoute);
      invariant(initialRouteIndex !== -1, 'initialRoute is not in initialRouteStack.');
    }
    return {
      sceneConfigStack: routeStack.map(function(route) {
        return _this.props.configureScene(route, routeStack);
      }),
      routeStack,
      presentedIndex: initialRouteIndex,
      transitionFromIndex: null,
      activeGesture: null,
      pendingGestureProgress: null,
      transitionQueue: [],
    };
  },
  componentWillMount: function componentWillMount() {
    const _this2 = this;
    this.__defineGetter__('navigationContext', this._getNavigationContext);
    this._subRouteFocus = [];
    this.parentNavigator = this.props.navigator;
    this._handlers = {};
    this.springSystem = new rebound.SpringSystem();
    this.spring = this.springSystem.createSpring();
    this.spring.setRestSpeedThreshold(0.05);
    this.spring.setCurrentValue(0).setAtRest();
    this.spring.addListener({
      onSpringEndStateChange: function onSpringEndStateChange() {
        if (!_this2._interactionHandle) {
          _this2._interactionHandle = _this2.createInteractionHandle();
        }
      },
      onSpringUpdate: function onSpringUpdate() {
        _this2._handleSpringUpdate();
      },
      onSpringAtRest: function onSpringAtRest() {
        _this2._completeTransition();
      },
    });
    this.panGesture = _reactNative.PanResponder.create({
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderRelease: this._handlePanResponderRelease,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderTerminate: this._handlePanResponderTerminate,
    });
    this._interactionHandle = null;
    this._emitWillFocus(this.state.routeStack[this.state.presentedIndex]);
  },
  componentDidMount: function componentDidMount() {
    this._isMounted = true;
    this._handleSpringUpdate();
    this._emitDidFocus(this.state.routeStack[this.state.presentedIndex]);
    this._enableTVEventHandler();
  },
  componentWillUnmount: function componentWillUnmount() {
    this._isMounted = false;
    if (this._navigationContext) {
      this._navigationContext.dispose();
      this._navigationContext = null;
    }
    this.spring.destroy();
    if (this._interactionHandle) {
      this.clearInteractionHandle(this._interactionHandle);
    }
    this._disableTVEventHandler();
  },
  immediatelyResetRouteStack: function immediatelyResetRouteStack(nextRouteStack) {
    const _this3 = this;
    const destIndex = nextRouteStack.length - 1;
    this._emitWillFocus(nextRouteStack[destIndex]);
    this.setState(
      {
        routeStack: nextRouteStack,
        sceneConfigStack: nextRouteStack.map(function(route) {
          return _this3.props.configureScene(route, nextRouteStack);
        }),
        presentedIndex: destIndex,
        activeGesture: null,
        transitionFromIndex: null,
        transitionQueue: [],
      },
      function() {
        _this3._handleSpringUpdate();
        const navBar = _this3._navBar;
        if (navBar && navBar.immediatelyRefresh) {
          navBar.immediatelyRefresh();
        }
        _this3._emitDidFocus(_this3.state.routeStack[_this3.state.presentedIndex]);
      }
    );
  },
  _transitionTo: function _transitionTo(destIndex, velocity, jumpSpringTo, cb) {
    if (this.state.presentedIndex === destIndex) {
      cb && cb();
      return;
    }
    if (this.state.transitionFromIndex !== null) {
      this.state.transitionQueue.push({ destIndex, velocity, cb });
      return;
    }
    this.state.transitionFromIndex = this.state.presentedIndex;
    this.state.presentedIndex = destIndex;
    this.state.transitionCb = cb;
    this._onAnimationStart();
    if (AnimationsDebugModule) {
      AnimationsDebugModule.startRecordingFps();
    }
    const sceneConfig =
      this.state.sceneConfigStack[this.state.transitionFromIndex] ||
      this.state.sceneConfigStack[this.state.presentedIndex];
    invariant(sceneConfig, `Cannot configure scene at index ${this.state.transitionFromIndex}`);
    if (jumpSpringTo != null) {
      this.spring.setCurrentValue(jumpSpringTo);
    }
    this.spring.setOvershootClampingEnabled(true);
    this.spring.getSpringConfig().friction = sceneConfig.springFriction;
    this.spring.getSpringConfig().tension = sceneConfig.springTension;
    this.spring.setVelocity(velocity || sceneConfig.defaultTransitionVelocity);
    this.spring.setEndValue(1);
  },
  _handleSpringUpdate: function _handleSpringUpdate() {
    if (!this._isMounted) {
      return;
    }
    if (this.state.transitionFromIndex != null) {
      this._transitionBetween(
        this.state.transitionFromIndex,
        this.state.presentedIndex,
        this.spring.getCurrentValue()
      );
    } else if (this.state.activeGesture != null) {
      const presentedToIndex =
        this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
      this._transitionBetween(
        this.state.presentedIndex,
        presentedToIndex,
        this.spring.getCurrentValue()
      );
    }
  },
  _completeTransition: function _completeTransition() {
    if (!this._isMounted) {
      return;
    }
    if (this.spring.getCurrentValue() !== 1 && this.spring.getCurrentValue() !== 0) {
      if (this.state.pendingGestureProgress) {
        this.state.pendingGestureProgress = null;
      }
      return;
    }
    this._onAnimationEnd();
    const presentedIndex = this.state.presentedIndex;
    const didFocusRoute =
      this._subRouteFocus[presentedIndex] || this.state.routeStack[presentedIndex];
    if (AnimationsDebugModule) {
      AnimationsDebugModule.stopRecordingFps(Date.now());
    }
    this.state.transitionFromIndex = null;
    this.spring.setCurrentValue(0).setAtRest();
    this._hideScenes();
    if (this.state.transitionCb) {
      this.state.transitionCb();
      this.state.transitionCb = null;
    }
    this._emitDidFocus(didFocusRoute);
    if (this._interactionHandle) {
      this.clearInteractionHandle(this._interactionHandle);
      this._interactionHandle = null;
    }
    if (this.state.pendingGestureProgress) {
      const gestureToIndex =
        this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
      this._enableScene(gestureToIndex);
      this.spring.setEndValue(this.state.pendingGestureProgress);
      return;
    }
    if (this.state.transitionQueue.length) {
      const queuedTransition = this.state.transitionQueue.shift();
      this._enableScene(queuedTransition.destIndex);
      this._emitWillFocus(this.state.routeStack[queuedTransition.destIndex]);
      this._transitionTo(
        queuedTransition.destIndex,
        queuedTransition.velocity,
        null,
        queuedTransition.cb
      );
    }
  },
  _emitDidFocus: function _emitDidFocus(route) {
    this.navigationContext.emit('didfocus', { route });
    if (this.props.onDidFocus) {
      this.props.onDidFocus(route);
    }
  },
  _emitWillFocus: function _emitWillFocus(route) {
    this.navigationContext.emit('willfocus', { route });
    const navBar = this._navBar;
    if (navBar && navBar.handleWillFocus) {
      navBar.handleWillFocus(route);
    }
    if (this.props.onWillFocus) {
      this.props.onWillFocus(route);
    }
  },
  _hideScenes: function _hideScenes() {
    let gesturingToIndex = null;
    if (this.state.activeGesture) {
      gesturingToIndex =
        this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    }
    for (let i = 0; i < this.state.routeStack.length; i++) {
      if (
        i === this.state.presentedIndex ||
        i === this.state.transitionFromIndex ||
        i === gesturingToIndex
      ) {
        continue;
      }
      this._disableScene(i);
    }
  },
  _disableScene: function _disableScene(sceneIndex) {
    this._sceneRefs[sceneIndex] &&
      this._sceneRefs[sceneIndex].setNativeProps(SCENE_DISABLED_NATIVE_PROPS);
  },
  _enableScene: function _enableScene(sceneIndex) {
    const sceneStyle = flattenStyle([BASE_SCENE_STYLE, this.props.sceneStyle]);
    const enabledSceneNativeProps = {
      pointerEvents: 'auto',
      style: { top: sceneStyle.top, bottom: sceneStyle.bottom },
    };
    if (sceneIndex !== this.state.transitionFromIndex && sceneIndex !== this.state.presentedIndex) {
      enabledSceneNativeProps.style.opacity = 0;
    }
    this._sceneRefs[sceneIndex] &&
      this._sceneRefs[sceneIndex].setNativeProps(enabledSceneNativeProps);
  },
  _clearTransformations: function _clearTransformations(sceneIndex) {
    const defaultStyle = flattenStyle([DEFAULT_SCENE_STYLE]);
    this._sceneRefs[sceneIndex].setNativeProps({ style: defaultStyle });
  },
  _onAnimationStart: function _onAnimationStart() {
    let fromIndex = this.state.presentedIndex;
    let toIndex = this.state.presentedIndex;
    if (this.state.transitionFromIndex != null) {
      fromIndex = this.state.transitionFromIndex;
    } else if (this.state.activeGesture) {
      toIndex = this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    }
    this._setRenderSceneToHardwareTextureAndroid(fromIndex, true);
    this._setRenderSceneToHardwareTextureAndroid(toIndex, true);
    const navBar = this._navBar;
    if (navBar && navBar.onAnimationStart) {
      navBar.onAnimationStart(fromIndex, toIndex);
    }
  },
  _onAnimationEnd: function _onAnimationEnd() {
    const max = this.state.routeStack.length - 1;
    for (let index = 0; index <= max; index++) {
      this._setRenderSceneToHardwareTextureAndroid(index, false);
    }
    const navBar = this._navBar;
    if (navBar && navBar.onAnimationEnd) {
      navBar.onAnimationEnd();
    }
  },
  _setRenderSceneToHardwareTextureAndroid: function _setRenderSceneToHardwareTextureAndroid(
    sceneIndex,
    shouldRenderToHardwareTexture
  ) {
    const viewAtIndex = this._sceneRefs[sceneIndex];
    if (viewAtIndex === null || viewAtIndex === undefined) {
      return;
    }
    viewAtIndex.setNativeProps({ renderToHardwareTextureAndroid: shouldRenderToHardwareTexture });
  },
  _handleTouchStart: function _handleTouchStart() {
    this._eligibleGestures = GESTURE_ACTIONS;
  },
  _handleMoveShouldSetPanResponder: function _handleMoveShouldSetPanResponder(e, gestureState) {
    const sceneConfig = this.state.sceneConfigStack[this.state.presentedIndex];
    if (!sceneConfig) {
      return false;
    }
    this._expectingGestureGrant = this._matchGestureAction(
      this._eligibleGestures,
      sceneConfig.gestures,
      gestureState
    );
    return !!this._expectingGestureGrant;
  },
  _doesGestureOverswipe: function _doesGestureOverswipe(gestureName) {
    const wouldOverswipeBack =
      this.state.presentedIndex <= 0 && (gestureName === 'pop' || gestureName === 'jumpBack');
    const wouldOverswipeForward =
      this.state.presentedIndex >= this.state.routeStack.length - 1 &&
      gestureName === 'jumpForward';
    return wouldOverswipeForward || wouldOverswipeBack;
  },
  _deltaForGestureAction: function _deltaForGestureAction(gestureAction) {
    switch (gestureAction) {
      case 'pop':
      case 'jumpBack':
        return -1;
      case 'jumpForward':
        return 1;
      default:
        invariant(false, `Unsupported gesture action ${gestureAction}`);
    }
  },
  _handlePanResponderRelease: function _handlePanResponderRelease(e, gestureState) {
    const _this4 = this;
    const sceneConfig = this.state.sceneConfigStack[this.state.presentedIndex];
    const releaseGestureAction = this.state.activeGesture;
    if (!releaseGestureAction) {
      return;
    }
    const releaseGesture = sceneConfig.gestures[releaseGestureAction];
    const destIndex =
      this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    if (this.spring.getCurrentValue() === 0) {
      this.spring.setCurrentValue(0).setAtRest();
      this._completeTransition();
      return;
    }
    const isTravelVertical =
      releaseGesture.direction === 'top-to-bottom' || releaseGesture.direction === 'bottom-to-top';
    const isTravelInverted =
      releaseGesture.direction === 'right-to-left' || releaseGesture.direction === 'bottom-to-top';
    let velocity, gestureDistance;
    if (isTravelVertical) {
      velocity = isTravelInverted ? -gestureState.vy : gestureState.vy;
      gestureDistance = isTravelInverted ? -gestureState.dy : gestureState.dy;
    } else {
      velocity = isTravelInverted ? -gestureState.vx : gestureState.vx;
      gestureDistance = isTravelInverted ? -gestureState.dx : gestureState.dx;
    }
    let transitionVelocity = clamp(-10, velocity, 10);
    if (Math.abs(velocity) < releaseGesture.notMoving) {
      const hasGesturedEnoughToComplete =
        gestureDistance > releaseGesture.fullDistance * releaseGesture.stillCompletionRatio;
      transitionVelocity = hasGesturedEnoughToComplete
        ? releaseGesture.snapVelocity
        : -releaseGesture.snapVelocity;
    }
    if (transitionVelocity < 0 || this._doesGestureOverswipe(releaseGestureAction)) {
      if (this.state.transitionFromIndex == null) {
        const transitionBackToPresentedIndex = this.state.presentedIndex;
        this.state.presentedIndex = destIndex;
        this._transitionTo(
          transitionBackToPresentedIndex,
          -transitionVelocity,
          1 - this.spring.getCurrentValue()
        );
      }
    } else {
      this._emitWillFocus(this.state.routeStack[destIndex]);
      this._transitionTo(destIndex, transitionVelocity, null, function() {
        if (releaseGestureAction === 'pop') {
          _this4._cleanScenesPastIndex(destIndex);
        }
      });
    }
    this._detachGesture();
  },
  _handlePanResponderTerminate: function _handlePanResponderTerminate(e, gestureState) {
    if (this.state.activeGesture == null) {
      return;
    }
    const destIndex =
      this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    this._detachGesture();
    const transitionBackToPresentedIndex = this.state.presentedIndex;
    this.state.presentedIndex = destIndex;
    this._transitionTo(transitionBackToPresentedIndex, null, 1 - this.spring.getCurrentValue());
  },
  _attachGesture: function _attachGesture(gestureId) {
    this.state.activeGesture = gestureId;
    const gesturingToIndex =
      this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
    this._enableScene(gesturingToIndex);
  },
  _detachGesture: function _detachGesture() {
    this.state.activeGesture = null;
    this.state.pendingGestureProgress = null;
    this._hideScenes();
  },
  _handlePanResponderMove: function _handlePanResponderMove(e, gestureState) {
    if (this._isMoveGestureAttached !== undefined) {
      invariant(this._expectingGestureGrant, 'Responder granted unexpectedly.');
      this._attachGesture(this._expectingGestureGrant);
      this._onAnimationStart();
      this._expectingGestureGrant = undefined;
    }
    const sceneConfig = this.state.sceneConfigStack[this.state.presentedIndex];
    if (this.state.activeGesture) {
      const gesture = sceneConfig.gestures[this.state.activeGesture];
      return this._moveAttachedGesture(gesture, gestureState);
    }
    const matchedGesture = this._matchGestureAction(
      GESTURE_ACTIONS,
      sceneConfig.gestures,
      gestureState
    );
    if (matchedGesture) {
      this._attachGesture(matchedGesture);
    }
  },
  _moveAttachedGesture: function _moveAttachedGesture(gesture, gestureState) {
    const isTravelVertical =
      gesture.direction === 'top-to-bottom' || gesture.direction === 'bottom-to-top';
    const isTravelInverted =
      gesture.direction === 'right-to-left' || gesture.direction === 'bottom-to-top';
    let distance = isTravelVertical ? gestureState.dy : gestureState.dx;
    distance = isTravelInverted ? -distance : distance;
    const gestureDetectMovement = gesture.gestureDetectMovement;
    let nextProgress =
      (distance - gestureDetectMovement) / (gesture.fullDistance - gestureDetectMovement);
    if (nextProgress < 0 && gesture.isDetachable) {
      const gesturingToIndex =
        this.state.presentedIndex + this._deltaForGestureAction(this.state.activeGesture);
      this._transitionBetween(this.state.presentedIndex, gesturingToIndex, 0);
      this._detachGesture();
      if (this.state.pendingGestureProgress != null) {
        this.spring.setCurrentValue(0);
      }
      return;
    }
    if (gesture.overswipe && this._doesGestureOverswipe(this.state.activeGesture)) {
      const frictionConstant = gesture.overswipe.frictionConstant;
      const frictionByDistance = gesture.overswipe.frictionByDistance;
      const frictionRatio = 1 / (frictionConstant + Math.abs(nextProgress) * frictionByDistance);
      nextProgress *= frictionRatio;
    }
    nextProgress = clamp(0, nextProgress, 1);
    if (this.state.transitionFromIndex != null) {
      this.state.pendingGestureProgress = nextProgress;
    } else if (this.state.pendingGestureProgress) {
      this.spring.setEndValue(nextProgress);
    } else {
      this.spring.setCurrentValue(nextProgress);
    }
  },
  _matchGestureAction: function _matchGestureAction(eligibleGestures, gestures, gestureState) {
    const _this5 = this;
    if (!gestures || !eligibleGestures || !eligibleGestures.some) {
      return null;
    }
    let matchedGesture = null;
    eligibleGestures.some(function(gestureName, gestureIndex) {
      const gesture = gestures[gestureName];
      if (!gesture) {
        return;
      }
      if (gesture.overswipe == null && _this5._doesGestureOverswipe(gestureName)) {
        return false;
      }
      const isTravelVertical =
        gesture.direction === 'top-to-bottom' || gesture.direction === 'bottom-to-top';
      const isTravelInverted =
        gesture.direction === 'right-to-left' || gesture.direction === 'bottom-to-top';
      let startedLoc = isTravelVertical ? gestureState.y0 : gestureState.x0;
      let currentLoc = isTravelVertical ? gestureState.moveY : gestureState.moveX;
      let travelDist = isTravelVertical ? gestureState.dy : gestureState.dx;
      let oppositeAxisTravelDist = isTravelVertical ? gestureState.dx : gestureState.dy;
      let edgeHitWidth = gesture.edgeHitWidth;
      if (isTravelInverted) {
        startedLoc = -startedLoc;
        currentLoc = -currentLoc;
        travelDist = -travelDist;
        oppositeAxisTravelDist = -oppositeAxisTravelDist;
        edgeHitWidth = isTravelVertical
          ? -(SCREEN_HEIGHT - edgeHitWidth)
          : -(SCREEN_WIDTH - edgeHitWidth);
      }
      if (startedLoc === 0) {
        startedLoc = currentLoc;
      }
      const moveStartedInRegion = gesture.edgeHitWidth == null || startedLoc < edgeHitWidth;
      if (!moveStartedInRegion) {
        return false;
      }
      const moveTravelledFarEnough = travelDist >= gesture.gestureDetectMovement;
      if (!moveTravelledFarEnough) {
        return false;
      }
      const directionIsCorrect =
        Math.abs(travelDist) > Math.abs(oppositeAxisTravelDist) * gesture.directionRatio;
      if (directionIsCorrect) {
        matchedGesture = gestureName;
        return true;
      }
      _this5._eligibleGestures = _this5._eligibleGestures.slice().splice(gestureIndex, 1);
    });
    return matchedGesture || null;
  },
  _transitionSceneStyle: function _transitionSceneStyle(fromIndex, toIndex, progress, index) {
    const viewAtIndex = this._sceneRefs[index];
    if (viewAtIndex === null || viewAtIndex === undefined) {
      return;
    }
    const sceneConfigIndex = fromIndex < toIndex ? toIndex : fromIndex;
    let sceneConfig = this.state.sceneConfigStack[sceneConfigIndex];
    if (!sceneConfig) {
      sceneConfig = this.state.sceneConfigStack[sceneConfigIndex - 1];
    }
    const styleToUse = {};
    const useFn =
      index < fromIndex || index < toIndex
        ? sceneConfig.animationInterpolators.out
        : sceneConfig.animationInterpolators.into;
    const directionAdjustedProgress = fromIndex < toIndex ? progress : 1 - progress;
    const didChange = useFn(styleToUse, directionAdjustedProgress);
    if (didChange) {
      viewAtIndex.setNativeProps({ style: styleToUse });
    }
  },
  _transitionBetween: function _transitionBetween(fromIndex, toIndex, progress) {
    this._transitionSceneStyle(fromIndex, toIndex, progress, fromIndex);
    this._transitionSceneStyle(fromIndex, toIndex, progress, toIndex);
    const navBar = this._navBar;
    if (navBar && navBar.updateProgress && toIndex >= 0 && fromIndex >= 0) {
      navBar.updateProgress(progress, fromIndex, toIndex);
    }
  },
  _handleResponderTerminationRequest: function _handleResponderTerminationRequest() {
    return false;
  },
  _getDestIndexWithinBounds: function _getDestIndexWithinBounds(n) {
    const currentIndex = this.state.presentedIndex;
    const destIndex = currentIndex + n;
    invariant(destIndex >= 0, 'Cannot jump before the first route.');
    const maxIndex = this.state.routeStack.length - 1;
    invariant(maxIndex >= destIndex, 'Cannot jump past the last route.');
    return destIndex;
  },
  _jumpN: function _jumpN(n) {
    const destIndex = this._getDestIndexWithinBounds(n);
    this._enableScene(destIndex);
    this._emitWillFocus(this.state.routeStack[destIndex]);
    this._transitionTo(destIndex);
  },
  jumpTo: function jumpTo(route) {
    const destIndex = this.state.routeStack.indexOf(route);
    invariant(destIndex !== -1, 'Cannot jump to route that is not in the route stack');
    this._jumpN(destIndex - this.state.presentedIndex);
  },
  jumpForward: function jumpForward() {
    this._jumpN(1);
  },
  jumpBack: function jumpBack() {
    this._jumpN(-1);
  },
  push: function push(route) {
    const _this6 = this;
    invariant(!!route, 'Must supply route to push');
    const activeLength = this.state.presentedIndex + 1;
    const activeStack = this.state.routeStack.slice(0, activeLength);
    const activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
    const nextStack = activeStack.concat([route]);
    const destIndex = nextStack.length - 1;
    const nextSceneConfig = this.props.configureScene(route, nextStack);
    const nextAnimationConfigStack = activeAnimationConfigStack.concat([nextSceneConfig]);
    this._emitWillFocus(nextStack[destIndex]);
    this.setState(
      { routeStack: nextStack, sceneConfigStack: nextAnimationConfigStack },
      function() {
        _this6._enableScene(destIndex);
        _this6._transitionTo(destIndex, nextSceneConfig.defaultTransitionVelocity);
      }
    );
  },
  popN: function popN(n) {
    const _this7 = this;
    invariant(typeof n === 'number', 'Must supply a number to popN');
    n = parseInt(n, 10);
    if (n <= 0 || this.state.presentedIndex - n < 0) {
      return;
    }
    const popIndex = this.state.presentedIndex - n;
    const presentedRoute = this.state.routeStack[this.state.presentedIndex];
    const popSceneConfig = this.props.configureScene(presentedRoute);
    this._enableScene(popIndex);
    this._clearTransformations(popIndex);
    this._emitWillFocus(this.state.routeStack[popIndex]);
    this._transitionTo(popIndex, popSceneConfig.defaultTransitionVelocity, null, function() {
      _this7._cleanScenesPastIndex(popIndex);
    });
  },
  pop: function pop() {
    if (this.state.transitionQueue.length) {
      return;
    }
    this.popN(1);
  },
  replaceAtIndex: function replaceAtIndex(route, index, cb) {
    const _this8 = this;
    invariant(!!route, 'Must supply route to replace');
    if (index < 0) {
      index += this.state.routeStack.length;
    }
    if (this.state.routeStack.length <= index) {
      return;
    }
    const nextRouteStack = this.state.routeStack.slice();
    const nextAnimationModeStack = this.state.sceneConfigStack.slice();
    nextRouteStack[index] = route;
    nextAnimationModeStack[index] = this.props.configureScene(route, nextRouteStack);
    if (index === this.state.presentedIndex) {
      this._emitWillFocus(route);
    }
    this.setState(
      { routeStack: nextRouteStack, sceneConfigStack: nextAnimationModeStack },
      function() {
        if (index === _this8.state.presentedIndex) {
          _this8._emitDidFocus(route);
        }
        cb && cb();
      }
    );
  },
  replace: function replace(route) {
    this.replaceAtIndex(route, this.state.presentedIndex);
  },
  replacePrevious: function replacePrevious(route) {
    this.replaceAtIndex(route, this.state.presentedIndex - 1);
  },
  popToTop: function popToTop() {
    this.popToRoute(this.state.routeStack[0]);
  },
  popToRoute: function popToRoute(route) {
    const indexOfRoute = this.state.routeStack.indexOf(route);
    invariant(indexOfRoute !== -1, 'Calling popToRoute for a route that doesn\'t exist!');
    const numToPop = this.state.presentedIndex - indexOfRoute;
    this.popN(numToPop);
  },
  replacePreviousAndPop: function replacePreviousAndPop(route) {
    if (this.state.routeStack.length < 2) {
      return;
    }
    this.replacePrevious(route);
    this.pop();
  },
  resetTo: function resetTo(route) {
    const _this9 = this;
    invariant(!!route, 'Must supply route to push');
    this.replaceAtIndex(route, 0, function() {
      _this9.popN(_this9.state.presentedIndex);
    });
  },
  getCurrentRoutes: function getCurrentRoutes() {
    return this.state.routeStack.slice();
  },
  _cleanScenesPastIndex: function _cleanScenesPastIndex(index) {
    const newStackLength = index + 1;
    if (newStackLength < this.state.routeStack.length) {
      this.setState({
        sceneConfigStack: this.state.sceneConfigStack.slice(0, newStackLength),
        routeStack: this.state.routeStack.slice(0, newStackLength),
      });
    }
  },
  _renderScene: function _renderScene(route, i) {
    const _this10 = this;
    let disabledSceneStyle = null;
    let disabledScenePointerEvents = 'auto';
    if (i !== this.state.presentedIndex) {
      disabledSceneStyle = styles.disabledScene;
      disabledScenePointerEvents = 'none';
    }
    return React.createElement(
      _reactNative.View,
      {
        collapsable: false,
        key: `scene_${getRouteID(route)}`,
        ref: function ref(scene) {
          _this10._sceneRefs[i] = scene;
        },
        onStartShouldSetResponderCapture: function onStartShouldSetResponderCapture() {
          return _this10.state.transitionFromIndex != null;
        },
        pointerEvents: disabledScenePointerEvents,
        style: [styles.baseScene, this.props.sceneStyle, disabledSceneStyle],
        __source: { fileName: _jsxFileName, lineNumber: 1284 },
      },
      this.props.renderScene(route, this)
    );
  },
  _renderNavigationBar: function _renderNavigationBar() {
    const _this11 = this;
    const navigationBar = this.props.navigationBar;
    if (!navigationBar) {
      return null;
    }
    return React.cloneElement(navigationBar, {
      ref: function ref(navBar) {
        _this11._navBar = navBar;
        if (navigationBar && typeof navigationBar.ref === 'function') {
          navigationBar.ref(navBar);
        }
      },
      navigator: this._navigationBarNavigator,
      navState: this.state,
    });
  },
  _tvEventHandler: _reactNative.TVEventHandler,
  _enableTVEventHandler: function _enableTVEventHandler() {
    if (!_reactNative.TVEventHandler) {
      return;
    }
    this._tvEventHandler = new _reactNative.TVEventHandler();
    this._tvEventHandler.enable(this, function(cmp, evt) {
      if (evt && evt.eventType === 'menu') {
        cmp.pop();
      }
    });
  },
  _disableTVEventHandler: function _disableTVEventHandler() {
    if (this._tvEventHandler) {
      this._tvEventHandler.disable();
      delete this._tvEventHandler;
    }
  },
  render: function render() {
    const _this12 = this;
    const newRenderedSceneMap = new Map();
    const scenes = this.state.routeStack.map(function(route, index) {
      let renderedScene;
      if (_this12._renderedSceneMap.has(route) && index !== _this12.state.presentedIndex) {
        renderedScene = _this12._renderedSceneMap.get(route);
      } else {
        renderedScene = _this12._renderScene(route, index);
      }
      newRenderedSceneMap.set(route, renderedScene);
      return renderedScene;
    });
    this._renderedSceneMap = newRenderedSceneMap;
    return React.createElement(
      _reactNative.View,
      {
        style: [styles.container, this.props.style],
        __source: { fileName: _jsxFileName, lineNumber: 1356 },
      },
      React.createElement(
        _reactNative.View,
        _extends({ style: styles.transitioner }, this.panGesture.panHandlers, {
          onTouchStart: this._handleTouchStart,
          onResponderTerminationRequest: this._handleResponderTerminationRequest,
          __source: { fileName: _jsxFileName, lineNumber: 1357 },
        }),
        scenes
      ),
      this._renderNavigationBar()
    );
  },
  _getNavigationContext: function _getNavigationContext() {
    if (!this._navigationContext) {
      this._navigationContext = new NavigationContext();
    }
    return this._navigationContext;
  },
});
module.exports = Navigator;
