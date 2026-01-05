import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  FlatList,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CameraView, useCameraPermissions } from 'expo-camera';
import TinderCard from '../components/TinderCard';
import { PROFILES } from '../data/profiles';
import { Profile } from '../types';

const Dashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(PROFILES);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // Callback para cuando se desliza a la izquierda (Basura)
  const handleSwipeLeft = useCallback((index: number) => {
    const profile = profiles[index];
    Alert.alert('🗑️ Basura', `${profile.name} descartado`);
    removeProfile(index);
  }, [profiles]);

  // Callback para cuando se desliza a la derecha (Aceptar)
  const handleSwipeRight = useCallback((index: number) => {
    const profile = profiles[index];
    Alert.alert('✨ Aceptado', `${profile.name} guardado en favoritos`);
    removeProfile(index);
  }, [profiles]);

  // Eliminar perfil de la pila (lógica de Tinder)
  const removeProfile = (index: number) => {
    setProfiles((prev) => {
      const newProfiles = prev.filter((_, i) => i !== index);
      // Si no quedan perfiles, puedes recargar o mostrar mensaje
      if (newProfiles.length === 0) {
        Alert.alert('¡Listo!', 'No hay más perfiles por revisar');
      }
      return newProfiles;
    });
  };

  // Renderizar solo la tarjeta superior (la interactiva)
  const renderTopCard = () => {
    if (profiles.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>¡No hay más perfiles!</Text>
          <Text style={styles.emptySubtext}>Recarga para continuar</Text>
        </View>
      );
    }

    const topProfile = profiles[0];
    return (
      <TinderCard
        key={topProfile.id}
        item={topProfile}
        index={0}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      />
    );
  };

  // Vista de Cámara
  if (showCamera) {
    if (!permission?.granted) {
      return (
        <View style={styles.center}>
          <Text style={styles.permissionText}>
            Necesitamos acceso a la cámara
          </Text>
          <Button onPress={requestPermission} title="Dar Permiso" />
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back" />
        <View style={styles.cameraControls}>
          <Button
            title="Cerrar Cámara"
            onPress={() => setShowCamera(false)}
            color="#ef4444"
          />
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tinder Dashboard</Text>
        <Text style={styles.subtitle}>
          {profiles.length} perfiles restantes
        </Text>
      </View>

      {/* Contenedor de tarjetas (solo la superior es interactiva) */}
      <View style={styles.cardsContainer} pointerEvents="box-none">
        {renderTopCard()}
        
        {/* Cartas de fondo (solo visuales, no interactivas) */}
        {profiles.slice(1, 3).map((profile, index) => (
          <View
            key={profile.id}
            style={[
              styles.backgroundCard,
              { zIndex: profiles.length - (index + 1) },
            ]}
          >
            <Text style={styles.backgroundText}>{profile.name}</Text>
          </View>
        ))}
      </View>

      {/* Botones de acción */}
      <View style={styles.actions}>
        <Button
          title="📸 Cámara"
          onPress={() => setShowCamera(true)}
          color="#3b82f6"
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  backgroundCard: {
    position: 'absolute',
    width: '90%',
    height: 480,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  backgroundText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.6)',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#94a3b8',
  },
  actions: {
    padding: 30,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
});

export default Dashboard;