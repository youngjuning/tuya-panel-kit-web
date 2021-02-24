import { Dimensions, Platform, StatusBar } from 'react-native';

const baseHeight = 667;
const height = 667;
const width = 375;
const baseWidth = 375;
const baseX = Math.sqrt(baseHeight * baseHeight + baseWidth * baseWidth);
const x = Math.sqrt(height * height + width * width);
const statusHeight = StatusBar.currentHeight || 0;
// export const isIos = Platform.OS === 'ios';
// export const isWeb = Platform.OS === 'web';
export const isIos = true; // 为了在 Web 上更好的模拟 RN
export const isWeb = false;
export const isIphoneX = isIos && height >= 812;
export const HRatio = width / baseWidth;
export const VRatio = height / baseHeight;
export const winWidth = width;
export const winHeight = height;
export const viewWidth = width;
export const viewHeight = height - (isIos ? (isIphoneX ? 88 : 64) : 56 + statusHeight);
let finalRatio = x / baseX;
if (baseWidth === width && finalRatio > 1) {
  finalRatio = 1;
}
export const ratio = finalRatio;
export const convertX = width => (isWeb ? width : width * HRatio);
export const convertY = height => (isWeb ? height : height * VRatio);
export const convert = number => (isWeb ? number : number * ratio);
export const topBarHeight = isIos ? (isIphoneX ? 88 : 64) : 56;
export const statusBarHeight = isIos ? (isIphoneX ? 44 : 20) : statusHeight;

export const isSmallW = width < 375;
export const isSmallH = height < 667;

const getDimension = () => {
  if (isWeb) {
    try {
      return Dimensions.get('osWindow');
    } catch (error) {
      return Dimensions.get('window');
    }
  }
  return Dimensions.get('window');
};

/**
 * 安卓或 Web 环境下，屏幕宽度等参数是动态的;
 */
export default {
  get hRatio() {
    return 1;
  },
  get vRatio() {
    return 1;
  },
  get ratio() {
    return 1;
  },
  get width() {
    return 375;
  },
  get height() {
    return 667;
  },
  get winWidth() {
    return 375;
  },
  get winHeight() {
    return 375;
  },
  get viewWidth() {
    return 375;
  },
  get viewHeight() {
    return 667 - (64 + 20);
  },
  convertX: number => {
    return number;
  },
  convertY: number => {
    return number;
  },
  convert: number => {
    return number;
  },
  get isSmallW() {
    return false;
  },
  get isSmallH() {
    return false;
  },
  isIos,
  isIphoneX,
  iPhoneX: isIphoneX,
  topBarHeight,
  statusBarHeight,
};
