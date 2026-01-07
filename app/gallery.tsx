import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Image as ImageIcon } from 'lucide-react-native';
import { galleryStore, Photo } from '../lib/store/galleryStore';

const { width } = Dimensions.get('window');

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>(galleryStore.getPhotos());

  useEffect(() => {
    setPhotos(galleryStore.getPhotos());
    const unsubscribe = galleryStore.subscribe((updatedPhotos) => {
      setPhotos(updatedPhotos);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft color="#3b82f6" size={28} />
          <Text style={styles.backText}>Volver</Text> 
        </TouchableOpacity>
        <Text style={styles.title}>Galeria</Text>
        <View style={{ width: 40 }} />
      </View>

      {photos.length === 0 ? (
        <View style={styles.emptyState}>
          <ImageIcon size={64} color="#374151" />
          <Text style={styles.emptyText}>Sin fotos guardadas</Text>
          <Text style={styles.emptySubText}>Tus fotos aceptadas apareceran aqui</Text>
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
    backgroundColor: '#111827',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  backText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: -2,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingTop: 2,
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
    gap: 15,
    paddingBottom: 100,
  },
  emptyText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptySubText: {
    color: '#9ca3af',
    fontSize: 16,
  }
});