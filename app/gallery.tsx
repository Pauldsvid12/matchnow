import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { galleryStore, Photo } from '../lib/store/galleryStore';
import { ArrowLeft } from 'lucide-react-native'; // O usa un texto "<" si no tienes lucide

const { width } = Dimensions.get('window');

export default function Gallery() {
  // Inicializamos con las fotos actuales
  const [photos, setPhotos] = useState<Photo[]>(galleryStore.getPhotos());

  useEffect(() => {
    // Actualizar al montar para asegurar datos frescos
    setPhotos(galleryStore.getPhotos());

    // Suscribirse a cambios futuros
    const unsubscribe = galleryStore.subscribe((updatedPhotos) => {
      setPhotos(updatedPhotos);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header simple */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Galería ({photos.length})</Text>
      </View>

      {photos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay fotos guardadas aún.</Text>
          <Text style={styles.emptySubText}>Desliza a la derecha para guardar alguna.</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Image 
              source={{ uri: item.uri }} 
              style={styles.thumbnail} 
              resizeMode="cover"
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#111827', // Fondo oscuro acorde al tema
    paddingTop: 50, // Espacio para status bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    paddingTop: 10,
  },
  thumbnail: {
    width: width / 3,
    height: width / 3,
    borderWidth: 1,
    borderColor: '#111827',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubText: {
    color: '#9ca3af',
    fontSize: 14,
  }
});
