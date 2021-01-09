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
const _reactNative = require('react-native');
const buildStyleInterpolator = require('./buildStyleInterpolator');

const IS_RTL = _reactNative.I18nManager.isRTL;
const SCREEN_WIDTH = _reactNative.Dimensions.get('window').width;
const SCREEN_HEIGHT = _reactNative.Dimensions.get('window').height;
const PIXEL_RATIO = _reactNative.PixelRatio.get();
const ToTheLeftIOS = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: -SCREEN_WIDTH * 0.3, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  opacity: { value: 1.0, type: 'constant' },
};
const ToTheRightIOS = _extends({}, ToTheLeftIOS, {
  transformTranslate: { from: { x: 0, y: 0, z: 0 }, to: { x: SCREEN_WIDTH * 0.3, y: 0, z: 0 } },
});
const FadeToTheLeft = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: -Math.round(SCREEN_WIDTH * 0.3), y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  transformScale: {
    from: { x: 1, y: 1, z: 1 },
    to: { x: 0.95, y: 0.95, z: 1 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
  },
  opacity: { from: 1, to: 0.3, min: 0, max: 1, type: 'linear', extrapolate: false, round: 100 },
  translateX: {
    from: 0,
    to: -Math.round(SCREEN_WIDTH * 0.3),
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  scaleX: { from: 1, to: 0.95, min: 0, max: 1, type: 'linear', extrapolate: true },
  scaleY: { from: 1, to: 0.95, min: 0, max: 1, type: 'linear', extrapolate: true },
};
const FadeToTheRight = _extends({}, FadeToTheLeft, {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: Math.round(SCREEN_WIDTH * 0.3), y: 0, z: 0 },
  },
  translateX: { from: 0, to: Math.round(SCREEN_WIDTH * 0.3) },
});
const FadeIn = {
  opacity: { from: 0, to: 1, min: 0.5, max: 1, type: 'linear', extrapolate: false, round: 100 },
};
const FadeOut = {
  opacity: { from: 1, to: 0, min: 0, max: 0.5, type: 'linear', extrapolate: false, round: 100 },
};
const ToTheLeft = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: -SCREEN_WIDTH, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  opacity: { value: 1.0, type: 'constant' },
  translateX: {
    from: 0,
    to: -SCREEN_WIDTH,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
};
const ToTheRight = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: SCREEN_WIDTH, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  opacity: { value: 1.0, type: 'constant' },
  translateX: {
    from: 0,
    to: SCREEN_WIDTH,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
};
const ToTheUp = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: 0, y: -SCREEN_HEIGHT, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  opacity: { value: 1.0, type: 'constant' },
  translateY: {
    from: 0,
    to: -SCREEN_HEIGHT,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
};
const ToTheDown = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: 0, y: SCREEN_HEIGHT, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  opacity: { value: 1.0, type: 'constant' },
  translateY: {
    from: 0,
    to: SCREEN_HEIGHT,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
};
const FromTheRight = {
  opacity: { value: 1.0, type: 'constant' },
  transformTranslate: {
    from: { x: SCREEN_WIDTH, y: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  translateX: {
    from: SCREEN_WIDTH,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  scaleX: { value: 1, type: 'constant' },
  scaleY: { value: 1, type: 'constant' },
};
const FromTheLeft = _extends({}, FromTheRight, {
  transformTranslate: {
    from: { x: -SCREEN_WIDTH, y: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  translateX: {
    from: -SCREEN_WIDTH,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
});
const FromTheDown = _extends({}, FromTheRight, {
  transformTranslate: {
    from: { y: SCREEN_HEIGHT, x: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  translateY: {
    from: SCREEN_HEIGHT,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
});
const FromTheTop = _extends({}, FromTheRight, {
  transformTranslate: {
    from: { y: -SCREEN_HEIGHT, x: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  translateY: {
    from: -SCREEN_HEIGHT,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
});
const ToTheBack = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  transformScale: {
    from: { x: 1, y: 1, z: 1 },
    to: { x: 0.95, y: 0.95, z: 1 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
  },
  opacity: { from: 1, to: 0.3, min: 0, max: 1, type: 'linear', extrapolate: false, round: 100 },
  scaleX: { from: 1, to: 0.95, min: 0, max: 1, type: 'linear', extrapolate: true },
  scaleY: { from: 1, to: 0.95, min: 0, max: 1, type: 'linear', extrapolate: true },
};
const FromTheFront = {
  opacity: { value: 1.0, type: 'constant' },
  transformTranslate: {
    from: { x: 0, y: SCREEN_HEIGHT, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  translateY: {
    from: SCREEN_HEIGHT,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  scaleX: { value: 1, type: 'constant' },
  scaleY: { value: 1, type: 'constant' },
};
const ToTheBackAndroid = { opacity: { value: 1, type: 'constant' } };
const FromTheFrontAndroid = {
  opacity: { from: 0, to: 1, min: 0.5, max: 1, type: 'linear', extrapolate: false, round: 100 },
  transformTranslate: {
    from: { x: 0, y: 100, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
  translateY: {
    from: 100,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO,
  },
};
const BaseOverswipeConfig = { frictionConstant: 1, frictionByDistance: 1.5 };
const BaseLeftToRightGesture = {
  isDetachable: false,
  gestureDetectMovement: 2,
  notMoving: 0.3,
  directionRatio: 0.66,
  snapVelocity: 2,
  edgeHitWidth: 30,
  stillCompletionRatio: 3 / 5,
  fullDistance: SCREEN_WIDTH,
  direction: 'left-to-right',
};
const BaseRightToLeftGesture = _extends({}, BaseLeftToRightGesture, { direction: 'right-to-left' });
const BaseDownUpGesture = _extends({}, BaseLeftToRightGesture, {
  fullDistance: SCREEN_HEIGHT,
  direction: 'bottom-to-top',
});
const BaseUpDownGesture = _extends({}, BaseLeftToRightGesture, {
  fullDistance: SCREEN_HEIGHT,
  direction: 'top-to-bottom',
});
let directionMapping = {
  ToTheStartIOS: ToTheLeftIOS,
  ToTheEndIOS: ToTheRightIOS,
  FadeToTheStart: FadeToTheLeft,
  FadeToTheEnd: FadeToTheRight,
  ToTheStart: ToTheLeft,
  ToTheEnd: ToTheRight,
  FromTheStart: FromTheLeft,
  FromTheEnd: FromTheRight,
  BaseStartToEndGesture: BaseLeftToRightGesture,
  BaseEndToStartGesture: BaseRightToLeftGesture,
};
if (IS_RTL) {
  directionMapping = {
    ToTheStartIOS: ToTheRightIOS,
    ToTheEndIOS: ToTheLeftIOS,
    FadeToTheStart: FadeToTheRight,
    FadeToTheEnd: FadeToTheLeft,
    ToTheStart: ToTheRight,
    ToTheEnd: ToTheLeft,
    FromTheStart: FromTheRight,
    FromTheEnd: FromTheLeft,
    BaseStartToEndGesture: BaseRightToLeftGesture,
    BaseEndToStartGesture: BaseLeftToRightGesture,
  };
}
const BaseConfig = {
  gestures: { pop: directionMapping.BaseStartToEndGesture },
  springFriction: 26,
  springTension: 200,
  defaultTransitionVelocity: 1.5,
  animationInterpolators: {
    into: buildStyleInterpolator(directionMapping.FromTheEnd),
    out: buildStyleInterpolator(directionMapping.FadeToTheStart),
  },
};
const NavigatorSceneConfigs = {
  PushFromRight: _extends({}, BaseConfig, {
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheEnd),
      out: buildStyleInterpolator(directionMapping.ToTheStartIOS),
    },
  }),
  PushFromLeft: _extends({}, BaseConfig, {
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheStart),
      out: buildStyleInterpolator(directionMapping.ToTheEndIOS),
    },
  }),
  FloatFromRight: _extends({}, BaseConfig),
  FloatFromLeft: _extends({}, BaseConfig, {
    gestures: { pop: directionMapping.BaseEndToStartGesture },
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheStart),
      out: buildStyleInterpolator(directionMapping.FadeToTheEnd),
    },
  }),
  FloatFromBottom: _extends({}, BaseConfig, {
    gestures: {
      pop: _extends({}, directionMapping.BaseStartToEndGesture, {
        edgeHitWidth: 150,
        direction: 'top-to-bottom',
        fullDistance: SCREEN_HEIGHT,
      }),
    },
    animationInterpolators: {
      into: buildStyleInterpolator(FromTheFront),
      out: buildStyleInterpolator(ToTheBack),
    },
  }),
  FloatFromBottomAndroid: _extends({}, BaseConfig, {
    gestures: null,
    defaultTransitionVelocity: 3,
    springFriction: 20,
    animationInterpolators: {
      into: buildStyleInterpolator(FromTheFrontAndroid),
      out: buildStyleInterpolator(ToTheBackAndroid),
    },
  }),
  FadeAndroid: _extends({}, BaseConfig, {
    gestures: null,
    animationInterpolators: {
      into: buildStyleInterpolator(FadeIn),
      out: buildStyleInterpolator(FadeOut),
    },
  }),
  SwipeFromLeft: _extends({}, BaseConfig, {
    gestures: {
      jumpBack: _extends({}, directionMapping.BaseEndToStartGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true,
      }),
      jumpForward: _extends({}, directionMapping.BaseStartToEndGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true,
      }),
    },
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheStart),
      out: buildStyleInterpolator(directionMapping.ToTheEnd),
    },
  }),
  HorizontalSwipeJump: _extends({}, BaseConfig, {
    gestures: {
      jumpBack: _extends({}, directionMapping.BaseStartToEndGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true,
      }),
      jumpForward: _extends({}, directionMapping.BaseEndToStartGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true,
      }),
    },
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheEnd),
      out: buildStyleInterpolator(directionMapping.ToTheStart),
    },
  }),
  HorizontalSwipeJumpFromRight: _extends({}, BaseConfig, {
    gestures: {
      jumpBack: _extends({}, directionMapping.BaseEndToStartGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true,
      }),
      jumpForward: _extends({}, directionMapping.BaseStartToEndGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true,
      }),
      pop: directionMapping.BaseEndToStartGesture,
    },
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheStart),
      out: buildStyleInterpolator(directionMapping.FadeToTheEnd),
    },
  }),
  HorizontalSwipeJumpFromLeft: _extends({}, BaseConfig, {
    gestures: {
      jumpBack: _extends({}, directionMapping.BaseEndToStartGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true,
      }),
      jumpForward: _extends({}, directionMapping.BaseStartToEndGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true,
      }),
      pop: directionMapping.BaseEndToStartGesture,
    },
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheStart),
      out: buildStyleInterpolator(directionMapping.ToTheEnd),
    },
  }),
  VerticalUpSwipeJump: _extends({}, BaseConfig, {
    gestures: {
      jumpBack: _extends({}, BaseUpDownGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true,
      }),
      jumpForward: _extends({}, BaseDownUpGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true,
      }),
    },
    animationInterpolators: {
      into: buildStyleInterpolator(FromTheDown),
      out: buildStyleInterpolator(ToTheUp),
    },
  }),
  VerticalDownSwipeJump: _extends({}, BaseConfig, {
    gestures: {
      jumpBack: _extends({}, BaseDownUpGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true,
      }),
      jumpForward: _extends({}, BaseUpDownGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true,
      }),
    },
    animationInterpolators: {
      into: buildStyleInterpolator(FromTheTop),
      out: buildStyleInterpolator(ToTheDown),
    },
  }),
};
module.exports = NavigatorSceneConfigs;
