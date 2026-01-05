import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// Umbral para considerar que se deslizó (30% del ancho de pantalla)
export const SWIPE_THRESHOLD = width * 0.3;

// Velocidad de la animación al soltar
export const SPRING_CONFIG = {
  damping: 15,
  stiffness: 120,
};