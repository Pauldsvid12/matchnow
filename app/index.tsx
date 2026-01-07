import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { Image as ImageIcon, Check, X } from 'lucide-react-native'; // Importamos iconos Lucide

import { CameraMod } from '../components/organisms/CameraMod';
import { PhotoCard } from '../components/molecules/PhotoCard';
import { galleryStore } from '../lib/store/galleryStore';

export default function Index() {
  const [currentPhotoUri, setCurrentPhotoUri] = useState<string | null>(null);

  const handlePictureTaken = (uri: string) => {
    setCurrentPhotoUri(uri);
  };

  const handleSave = () => {
    if (currentPhotoUri) {
      galleryStore.addPhoto({
        id: Date.now().toString(),
        uri: currentPhotoUri,
        date: new Date(),
      });
      setCurrentPhotoUri(null);
    }
  };

  const handleDiscard = () => {
    setCurrentPhotoUri(null);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {!currentPhotoUri ? (
        <>
          {/* MODO CÁMARA */}
          <CameraMod onPictureTaken={handlePictureTaken} />
          
          {/* Acceso flotante a Galería desde la cámara */}
          <TouchableOpacity 
            style={styles.floatingGalleryBtn} 
            onPress={() => router.push('/gallery')}
            activeOpacity={0.7}
          >
            <ImageIcon color="white" size={24} />
          </TouchableOpacity>
        </>
      ) : (
        // MODO REVISIÓN
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
            <View style={styles.instructions}>
              <View style={styles.instructionItem}>
                <X color="#ef4444" size={20} />
                <Text style={[styles.hint, {color: '#ef4444'}]}>Izquierda</Text>
              </View>
              <Text style={styles.hint}>Desliza</Text>
              <View style={styles.instructionItem}>
                <Text style={[styles.hint, {color: '#4ade80'}]}>Derecha</Text>
                <Check color="#4ade80" size={20} />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.galleryButton} 
              onPress={() => router.push('/gallery')}
            >
              <ImageIcon color="#3b82f6" size={20} />
              <Text style={styles.galleryButtonText}>Ver Galería Guardada</Text>
            </TouchableOpacity>
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
    gap: 20,
    width: '100%',
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    opacity: 0.8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  hint: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  galleryButtonText: {
    color: '#3b82f6', // Azul
    fontWeight: '600',
    fontSize: 16,
  },
  floatingGalleryBtn: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  }
});