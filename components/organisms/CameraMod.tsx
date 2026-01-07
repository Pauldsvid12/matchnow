import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { CameraView } from 'expo-camera'; 
import { useCameraLogic } from '../../lib/modules/camera/useCameraLogic';
import { RoundButton } from '@/components/atoms/RoundButton'; //falta aun


const CameraIcon = () => <Text style={{fontSize: 30}}>📸</Text>;

interface CameraModProps {
  onPictureTaken: (uri: string) => void;
}

export const CameraMod: React.FC<CameraModProps> = ({ onPictureTaken }) => {
  // Hook de logica de camara (aislado de UI)
  const { 
    permission, 
    requestPermission, 
    cameraRef, 
    // takePicture no lo usamos directo aqui porque necesitamos interceptar el resultado
    // pero podemos usar la ref directo
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
          <RoundButton onPress={handleCapture} size={80} color="white">
             <CameraIcon />
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
});
