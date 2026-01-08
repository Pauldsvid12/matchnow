import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Image as ImageIcon } from 'lucide-react-native';
import { galleryStore, Photo } from '../lib/store/galleryStore';
import { ImageViewerModal } from '../components/organisms/ImageViewerModal';

const { width } = Dimensions.get('window');

function normalizeUri(value: any): string | null {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && typeof value.uri === 'string') return value.uri;
  if (value && typeof value === 'object' && value.uri && typeof value.uri.uri === 'string') return value.uri.uri;
  return null;
}

export default function Gallery() {
  const [photosRaw, setPhotosRaw] = useState<Photo[]>(galleryStore.getPhotos());

  // Modal visor
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setPhotosRaw(galleryStore.getPhotos());
    const unsubscribe = galleryStore.subscribe((updated) => setPhotosRaw(updated));
    return () => unsubscribe();
  }, []);

  // ✅ Limpiar/normalizar: garantiza que SIEMPRE mandamos strings a <Image />
  const photos = useMemo(() => {
    return (photosRaw || [])
      .map((p: any) => {
        const fixed = normalizeUri(p?.uri);
        if (!fixed) return null;
        return { ...p, uri: fixed } as Photo;
      })
      .filter(Boolean) as Photo[];
  }, [photosRaw]);

  const imageUris = useMemo(() => photos.map((p) => p.uri), [photos]);

  const handleOpenImage = (index: number) => {
    setSelectedIndex(index);
    setViewerVisible(true);
  };

  const handleDeletePhoto = async (indexToDelete: number) => {
    const photoToDelete = photos[indexToDelete];
    if (!photoToDelete) return;

    const del = (galleryStore as any)?.deletePhoto;
    if (typeof del !== 'function') {
      Alert.alert(
        'Falta deletePhoto',
        'Tu galleryStore no tiene deletePhoto(). Revisa lib/store/galleryStore.ts y reinicia con: npx expo start -c'
      );
      return;
    }

    await (galleryStore as any).deletePhoto(photoToDelete.id);

    const nextPhotos = galleryStore.getPhotos();
    if (!nextPhotos || nextPhotos.length === 0) {
      setViewerVisible(false);
      setSelectedIndex(0);
      return;
    }

    // Mantener índice válido
    setSelectedIndex((prev) => Math.min(prev, nextPhotos.length - 1));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Empty / Grid */}
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
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handleOpenImage(index)} activeOpacity={0.85}>
              <Image source={{ uri: item.uri }} style={styles.thumbnail} resizeMode="cover" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal visor */}
      <ImageViewerModal
        visible={viewerVisible}
        images={imageUris}
        initialIndex={Math.min(selectedIndex, Math.max(imageUris.length - 1, 0))}
        onClose={() => setViewerVisible(false)}
        onDelete={handleDeletePhoto}
      />
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
  },
});