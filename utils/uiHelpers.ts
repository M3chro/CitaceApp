import { PixelRatio } from 'react-native';

const fontScale = PixelRatio.getFontScale();
export const getResponsiveFontSize = (baseSize: number): number => Math.round(baseSize / fontScale);