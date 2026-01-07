import React, { useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { CameraMod } from '../components/organisms/CameraMod'; 
import { PhotoCard } from '../components/molecules/PhotoCard'; //usar
import { galleryStore } from '../lib/store/galleryStore';

export default function Index() {
  const [currentPhotoUri, setCurrentPhotoUri] = useState<string | null>(null);

  //Callback: Foto capturada
  const handlePictureTaken = (uri: string) => {
    console.log('foto capturada:', uri);
    setCurrentPhotoUri(uri);
  };

  // Callback: Swipe Right (Guardar)
  const handleSave = () => {
    if (currentPhotoUri) {
      console.log('foto guardada');
      
      galleryStore.addPhoto({
        id: Date.now().toString(),
        uri: currentPhotoUri,
        date: new Date(),
      });

      setCurrentPhotoUri(null);
    }
  };

  // Callback: Swipe Left (Descartar)
  const handleDiscard = () => {
    console.log('foto descartada');
    setCurrentPhotoUri(null);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {!currentPhotoUri ? (
        // FASE 1: Captura
        <CameraMod onPictureTaken={handlePictureTaken} />
      ) : (
        // FASE 2: Decision (Usando PhotoCard corregido)
        <View style={styles.reviewContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Revisar Foto</Text>
          </View>
          
          <PhotoCard 
            imageUri={currentPhotoUri} 
            onSwipeRight={handleSave} 
            onSwipeLeft={handleDiscard} 
          />

          <View style={styles.footer}>
            <Text style={styles.hint}>Desliza para decidir</Text>
            <Button 
              title="Ver Galeria Guardada" 
              onPress={() => router.push('/gallery')} 
              color="#3b82f6"
            />
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  reviewContainer: { 
    flex: 1, 
    backgroundColor: '#111827',
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 60,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    gap: 15,
  },
  hint: {
    color: '#9ca3af',
    fontSize: 14,
  }
});
