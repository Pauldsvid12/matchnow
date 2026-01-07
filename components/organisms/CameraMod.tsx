import React from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity } from 'react-native';
import { CameraView } from 'expo-camera'; 
import { Aperture, SwitchCamera } from 'lucide-react-native';
import { useCameraLogic } from '../../lib/modules/camera/useCameraLogic';
import { RoundButton } from '../atoms/RoundButton';

interface CameraModProps {
  onPictureTaken: (uri: string) => void;
}

export const CameraMod: React.FC<CameraModProps> = ({ onPictureTaken }) => {
  const { 
    permission, 
    requestPermission, 
    cameraRef, 
    facing,              // Estado de la cámara (front/back)
    toggleCameraFacing,  // Función para alternar
  } = useCameraLogic();

  if (!permission) return <View />;
  
  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.text}>Necesitamos permiso de camara</Text>
        <Button onPress={requestPermission} title="Dar Permiso" />
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
        try {
            const photo = await cameraRef.current.takePictureAsync({ 
                quality: 0.5, 
                skipProcessing: true 
            });
            if (photo?.uri) {
                onPictureTaken(photo.uri);
            }
        } catch (e) {
            console.log(e);
        }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        ref={cameraRef} 
        facing={facing} // Control dinámico de la cámara
      >
        <View style={styles.controls}>
          {/* Espaciador invisible para balancear layout */}
          <View style={styles.spacer} />

          {/* Botón Principal de Disparo */}
          <RoundButton 
            onPress={handleCapture} 
            size={80} 
            color="white"
            style={styles.captureBtn}
          >
             <Aperture size={40} color="#000" strokeWidth={1.5} />
          </RoundButton>

          {/* Botón de Cambio de Cámara */}
          <TouchableOpacity 
            onPress={toggleCameraFacing} 
            style={styles.flipBtn}
            activeOpacity={0.7}
          >
            <SwitchCamera color="white" size={28} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: { justifyContent: 'center', alignItems: 'center' },
  camera: { flex: 1 },
  text: { color: 'white', marginBottom: 20 },
  controls: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribuye elementos a los extremos y centro
    alignItems: 'center',
    paddingHorizontal: 40, // Margen lateral para el botón de flip
  },
  captureBtn: {
    borderWidth: 4,
    borderColor: '#e5e5e5',
  },
  flipBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // Fondo semitransparente
    borderRadius: 25,
  },
  spacer: {
    width: 50, // Mismo ancho que flipBtn para centrar el botón de disparo
  }
});
