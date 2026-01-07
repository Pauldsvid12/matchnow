module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        // ← ESTO ES OBLIGATORIO para animaciones Reanimated
        'react-native-reanimated/plugin',
      ],
    };
  };
  