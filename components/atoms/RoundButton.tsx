import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface RoundButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export const RoundButton: React.FC<RoundButtonProps> = ({ 
  onPress, 
  children, 
  color = 'white', 
  size = 64,
  style 
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
