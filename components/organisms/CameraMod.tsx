import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { CameraView } from 'expo-camera'; 
import { Aperture } from 'lucide-react-native'; // Usamos Aperture o Camera
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
        facing="back"
      >
        <View style={styles.controls}>
          {/* Botón de Captura Mejorado */}
          <RoundButton 
            onPress={handleCapture} 
            size={80} 
            color="white"
            style={styles.captureBtn}
          >
             <Aperture size={40} color="#000" strokeWidth={1.5} />
          </RoundButton>
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
    alignItems: 'center',
  },
  captureBtn: {
    borderWidth: 4,
    borderColor: '#e5e5e5', // Anillo exterior sutil
  }
});