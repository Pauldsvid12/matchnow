import { useState, useRef, useCallback } from 'react';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';

export const useCameraLogic = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>('back'); // Estado inicial: trasera

  // Función para alternar cámara
  const toggleCameraFacing = useCallback(() => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }, []);

  const takePicture = useCallback(async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          skipProcessing: true, // Optimización de velocidad
        });
        if (photo?.uri) {
          setPhotoUri(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  }, []);

  const resetCamera = useCallback(() => {
    setPhotoUri(null);
  }, []);

  return {
    permission,
    requestPermission,
    cameraRef,
    photoUri,
    facing,              // Exponemos estado actual
    toggleCameraFacing,  // Exponemos función de cambio
    takePicture,
    resetCamera,
  };
};