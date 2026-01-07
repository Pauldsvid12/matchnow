import { useState, useRef, useCallback } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';

export const useCameraLogic = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const takePicture = useCallback(async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          skipProcessing: true, // Más rápido
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
    takePicture,
    resetCamera,
  };
};