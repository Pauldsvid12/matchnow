import React, { useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';

// Imports de Arquitectura Atómica
import { TinderCard } from '../components/molecules/TinderCard';
import { galleryStore } from '../lib/store/galleryStore';

export default function Index() {
  // Estado local mínimo solo para controlar el flujo visual (Cámara vs Revisión)
  const [currentPhotoUri, setCurrentPhotoUri] = useState<string | null>(null);

  // Callback: Cuando la cámara captura una foto
  const handlePictureTaken = (uri: string) => {
    console.log('📸 Foto capturada:', uri);
    setCurrentPhotoUri(uri);
  };

  // Callback: Swipe Right (Guardar)
  const handleSave = () => {
    if (currentPhotoUri) {
      console.log('✅ Foto guardada en Store');
      
      // Lógica de negocio delegada a la Store
      galleryStore.addPhoto({
        id: Date.now().toString(),
        uri: currentPhotoUri,
        date: new Date(),
      });

      // Reset para tomar nueva foto
      setCurrentPhotoUri(null);
    }
  };

  // Callback: Swipe Left (Descartar)
  const handleDiscard = () => {
    console.log('🗑️ Foto descartada');
    setCurrentPhotoUri(null); // Solo reseteamos el estado
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {!currentPhotoUri ? (
        // FASE 1: Captura (Organismo Cámara)
        <CameraMod onPictureTaken={handlePictureTaken} />
      ) : (
        // FASE 2: Decisión (Molécula SwipeCard)
        <View style={styles.reviewContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Revisar Foto</Text>
          </View>
          
          <TinderCard 
            imageUri={currentPhotoUri} 
            onSwipeRight={handleSave} 
            onSwipeLeft={handleDiscard} 
          />

          <View style={styles.footer}>
            <Text style={styles.hint}>Desliza para decidir</Text>
            <Button 
              title="Ver Galería Guardada" 
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
    backgroundColor: '#111827', // Gris muy oscuro
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