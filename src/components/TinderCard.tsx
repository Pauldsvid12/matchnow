import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { Profile } from '../types';
import {
    SCREEN_WIDTH,
    SPRING_CONFIG,
    SWIPE_THRESHOLD,
} from '../utils/constants';

interface TinderCardProps {
  item: Profile;
  index: number;
  onSwipeLeft: (index: number) => void;
  onSwipeRight: (index: number) => void;
}

const TinderCard: React.FC<TinderCardProps> = ({
  item,
  index,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Gesture Pan (deslizar dedo)
  const pan = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const { translationX } = event;
      
      if (translationX > SWIPE_THRESHOLD) {
        // 👉 LIKE - Deslizó a la derecha
        translateX.value = withSpring(SCREEN_WIDTH + 100, SPRING_CONFIG);
        runOnJS(onSwipeRight)(index);
      } else if (translationX < -SWIPE_THRESHOLD) {
        // 👈 NOPE - Deslizó a la izquierda
        translateX.value = withSpring(-SCREEN_WIDTH - 100, SPRING_CONFIG);
        runOnJS(onSwipeLeft)(index);
      } else {
        // No deslizó suficiente, vuelve al centro
        translateX.value = withSpring(0, SPRING_CONFIG);
        translateY.value = withSpring(0, SPRING_CONFIG);
      }
    });

  // Estilo animado principal (movimiento + rotación)
  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity: opacity.value,
    };
  });

  // Opacidad de etiqueta LIKE (aparece cuando va a la derecha)
  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SCREEN_WIDTH / 4],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  // Opacidad de etiqueta NOPE (aparece cuando va a la izquierda)
  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 4, 0],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, cardStyle]}>
        {/* Imagen de fondo */}
        <Image source={{ uri: item.image }} style={styles.image} />

        {/* Contenido sobre la imagen */}
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          {item.age && <Text style={styles.age}>{item.age} años</Text>}
          {item.bio && <Text style={styles.bio}>{item.bio}</Text>}
        </View>

        {/* Etiqueta LIKE (verde) */}
        <Animated.View style={[styles.label, styles.likeLabel, likeOpacity]}>
          <Text style={styles.labelText}>✨ ACEPTAR</Text>
        </Animated.View>

        {/* Etiqueta NOPE (rojo) */}
        <Animated.View style={[styles.label, styles.nopeLabel, nopeOpacity]}>
          <Text style={styles.labelText}>🗑️ BASURA</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: 520,
    borderRadius: 24,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '75%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  age: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#888',
    lineHeight: 22,
  },
  label: {
    position: 'absolute',
    top: 60,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 4,
    borderRadius: 16,
  },
  likeLabel: {
    right: 40,
    backgroundColor: 'rgba(34,197,94,0.2)',
    borderColor: '#10b981',
  },
  nopeLabel: {
    left: 40,
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderColor: '#ef4444',
    transform: [{ rotate: '15deg' }],
  },
  labelText: {
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default TinderCard;