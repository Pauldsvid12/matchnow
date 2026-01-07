📸 SwapCamera - Mobile Swipe Experience
Aplicación nativa construida con React Native, Expo Router y Reanimated. Captura momentos y organízalos con gestos intuitivos estilo Tinder.

🚀 Características Principales
Cámara Integrada: Captura de fotos en alta calidad con soporte para cámara frontal y trasera (Selfie Mode).
Gestos Avanzados: Interfaz de decisión "Swipe" (Deslizar) potenciada por react-native-gesture-handler.
Animaciones Físicas: Interpolación fluida a 60fps usando react-native-reanimated.
Galería Persistente: Almacenamiento local de fotos aceptadas.
Arquitectura Atómica: Estructura de componentes escalable y mantenible.

🏗️ Arquitectura del Proyecto
Este proyecto sigue estrictamente el patrón Atomic Design y separación de responsabilidades:

bash
/
├── app/                  # Rutas y Navegación (Expo Router)
├── components/           # UI (Atomic Design)
│   ├── atoms/            # Botones, Iconos base (RoundButton)
│   ├── molecules/        # Componentes compuestos (PhotoCard)
│   └── organisms/        # Bloques complejos de lógica (CameraMod)
└── lib/                  # Lógica de Negocio Pura
    ├── modules/camera/   # Hooks de Cámara (useCameraLogic)
    ├── ui/               # Hooks de Gestos/Animación (useSwipeLogic)
    └── store/            # Gestión de Estado (galleryStore)
🛠️ Tecnologías
Core: React Native, TypeScript, Expo SDK 52

Navegación: Expo Router v4
- Cámara: Expo Camera (Legacy & Modern support)
- Gestos: React Native Gesture Handler
- Animaciones: React Native Reanimated 3
- Iconos: Lucide React Native
