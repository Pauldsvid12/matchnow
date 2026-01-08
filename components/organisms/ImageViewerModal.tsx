import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { X, Trash2 } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface ImageViewerModalProps {
  visible: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
  onDelete: (index: number) => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  visible,
  images,
  initialIndex,
  onClose,
  onDelete,
}) => {
  const flatListRef = useRef<FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (!visible) return;

    setCurrentIndex(initialIndex);

    // Espera mínima para asegurar layout antes de scroll
    const t = setTimeout(() => {
      if (images.length > 0) {
        flatListRef.current?.scrollToIndex({ index: initialIndex, animated: false });
      }
    }, 50);

    return () => clearTimeout(t);
  }, [visible, initialIndex, images.length]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const first = viewableItems?.[0];
    if (first?.index != null) setCurrentIndex(first.index);
  }).current;

  const handleDelete = () => {
    Alert.alert('Eliminar foto', '¿Seguro que quieres eliminar esta foto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => onDelete(currentIndex),
      },
    ]);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
      <StatusBar hidden />
      <View style={styles.container}>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
          <Trash2 color="#ef4444" size={28} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
          <X color="white" size={30} />
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
            }, 300);
          }}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  deleteBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  imageContainer: { width, height, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
});