import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSwipeLogic } from '../../lib/ui/useSwipeLogic'; // ✅ Importa la lógica desde LIB

interface TinderCardProps {
  imageUri: string;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

const { width } = Dimensions.get('window');

export const TinderCard: React.FC<TinderCardProps> = ({ 
  imageUri, 
  onSwipeRight, 
  onSwipeLeft 
}) => {
  // 🔌 Hook de Lógica: Aquí ocurre toda la magia física
  const { panGesture, cardStyle, likeOpacity, nopeOpacity } = useSwipeLogic({
    onSwipeRight,
    onSwipeLeft,
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, cardStyle]}>
        {/* Imagen Principal */}
        <Image 
          source={{ uri: imageUri }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        
        {/* Sello animado: GUARDAR (Verde) */}
        <Animated.View style={[styles.label, styles.likeLabel, likeOpacity]}>
          <Text style={[styles.labelText, { color: '#4ade80' }]}>GUARDAR</Text>
        </Animated.View>

        {/* Sello animado: DESCARTAR (Rojo) */}
        <Animated.View style={[styles.label, styles.nopeLabel, nopeOpacity]}>
          <Text style={[styles.labelText, { color: '#ef4444' }]}>BASURA</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,      // 90% del ancho de pantalla
    height: width * 1.3,     // Aspect ratio vertical
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,           // Sombra para Android
    position: 'relative',    // Para posicionar los sellos absolute
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  label: {
    position: 'absolute',
    top: 50,
    borderWidth: 4,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 99,              // Asegura que esté sobre la imagen
  },
  likeLabel: {
    left: 40,
    borderColor: '#4ade80', // Verde
    transform: [{ rotate: '-15deg' }],
  },
  nopeLabel: {
    right: 40,
    borderColor: '#ef4444', // Rojo
    transform: [{ rotate: '15deg' }],
  },
  labelText: {
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});