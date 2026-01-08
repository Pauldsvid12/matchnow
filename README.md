# Proyecto de Cámara + Galería (Expo)

App móvil hecha con **React Native + Expo** que permite capturar fotos, revisarlas con gestos y guardar una galería local.

## Funcionalidades

- Captura de fotos con cámara frontal/trasera.
- Revisión con gesto: desliza para guardar o descartar.
- Galería local con vista a pantalla completa.
- Navegación por swipe izquierda/derecha dentro del visor.
- Eliminar fotos desde el visor con confirmación.
- Persistencia local (se mantienen al cerrar y abrir la app).

## Rutas (Expo Router)

- `/` → Pantalla de bienvenida (simple).
- `/camera` → Cámara + revisión con swipe.
- `/gallery` → Galería guardada + visor a pantalla completa.

Expo Router usa enrutamiento por archivos dentro de `app/` (por ejemplo `app/camera.tsx` crea la ruta `/camera`). [web:87]

## Tecnologías

- Expo + React Native + TypeScript
- Expo Router
- expo-camera
- react-native-gesture-handler + reanimated (gestos/animaciones)
- lucide-react-native (iconos)
- AsyncStorage (persistencia)
- expo-file-system/legacy (borrado físico de archivos)
