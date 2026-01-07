import React from 'react';
import { Image, StyleSheet, Text, Dimensions } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSwipeLogic } from '../../lib/ui/useSwipeLogic';

interface PhotoCardProps {
  imageUri: string;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

const { width } = Dimensions.get('window');

export const PhotoCard: React.FC<PhotoCardProps> = ({ 
  imageUri, 
  onSwipeRight, 
  onSwipeLeft 
}) => {
  // usamos los nombres exactos que retorna useSwipeLogic
  const { 
    panGesture, 
    cardStyle, 
    likeOpacityStyle, 
    nopeOpacityStyle 
  } = useSwipeLogic({
    onSwipeRight,
    onSwipeLeft,
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, cardStyle]}>
        <Image 
          source={{ uri: imageUri }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        
        <Animated.View style={[styles.label, styles.likeLabel, likeOpacityStyle]}>
          <Text style={[styles.labelText, { color: '#4ade80' }]}>GUARDAR</Text>
        </Animated.View>

        <Animated.View style={[styles.label, styles.nopeLabel, nopeOpacityStyle]}>
          <Text style={[styles.labelText, { color: '#ef4444' }]}>BASURA</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    height: width * 1.3,
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    position: 'relative',
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
    zIndex: 99,
  },
  likeLabel: {
    left: 40,
    borderColor: '#4ade80',
    transform: [{ rotate: '-15deg' }],
  },
  nopeLabel: {
    right: 40,
    borderColor: '#ef4444',
    transform: [{ rotate: '15deg' }],
  },
  labelText: {
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});