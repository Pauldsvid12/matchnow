import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

//Definimos la configuración del resorte
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 120,
  mass: 0.5,
};

type SwipeAction = () => void;

interface UseSwipeLogicProps {
  onSwipeRight?: SwipeAction; //Acción al aceptar (Guardar)
  onSwipeLeft?: SwipeAction;  //Acción al descartar (Basura)
}

export const useSwipeLogic = ({ onSwipeRight, onSwipeLeft }: UseSwipeLogicProps) => {
  //1. Valores compartidos (Shared Values)
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  //2. Funciones auxiliares para ejecutar callbacks en el hilo JS
  const handleRightAction = useCallback(() => {
    if (onSwipeRight) onSwipeRight();
  }, [onSwipeRight]);

  const handleLeftAction = useCallback(() => {
    if (onSwipeLeft) onSwipeLeft();
  }, [onSwipeLeft]);

  //3. Definición del Gesto (Pan)
  const panGesture = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.2; // Movimiento vertical reducido
    })
    .onEnd((event) => {
      // Física: Decisión basada en posición final
      if (translateX.value > SWIPE_THRESHOLD) {
        // -> Derecha (Guardar)
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, SPRING_CONFIG);
        runOnJS(handleRightAction)();
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        // <- Izquierda (Descarte)
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, SPRING_CONFIG);
        runOnJS(handleLeftAction)();
      } else {
        // Regreso al centro (Spring Back)
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
      }
    });

  //4. Estilos Animados (Interpolaciones)
  
  //Estilo de la tarjeta (Movimiento + Rotación)
  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15], // Rotación máxima de 15 grados
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  //opacidad del sello "LIKE/GUARDAR" (Verde)
  const likeOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SCREEN_WIDTH / 4],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));
  //opacidad del sello "NOPE/BASURA" (Rojo)
  const nopeOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 4, 0],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));
  //todo lo necesario para la UI
  return {
    panGesture,
    cardStyle,
    likeOpacityStyle,
    nopeOpacityStyle,
    translateX, //si necesitamos resetear externamente
  };
};