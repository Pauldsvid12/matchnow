import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Camera, ArrowRight } from 'lucide-react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      {}
      <View style={styles.blobA} />
      <View style={styles.blobB} />

      <View style={styles.content}>
        <Text style={styles.title}>Listo para capturar?</Text>
        <Text style={styles.subtitle}>
          Desliza para decidir. Guarda solo lo mejor.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.button}
          onPress={() => router.push('/camera')}
        >
          <View style={styles.buttonLeft}>
            <View style={styles.iconWrap}>
              <Camera size={20} color="white" strokeWidth={2.2} />
            </View>
            <Text style={styles.buttonText}>Empezar</Text>
          </View>

          <ArrowRight size={18} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>
      </View>

      <Text style={styles.footerHint}>Made in UETS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
    paddingTop: 70,
    paddingHorizontal: 18,
    paddingBottom: 22,
  },

  blobA: {
    position: 'absolute',
    top: -130,
    right: -140,
    width: 280,
    height: 280,
    borderRadius: 160,
    backgroundColor: 'rgba(59,130,246,0.18)',
  },
  blobB: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 320,
    height: 320,
    borderRadius: 180,
    backgroundColor: 'rgba(16,185,129,0.12)',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    lineHeight: 22,
  },

  button: {
    marginTop: 26,
    height: 58,
    borderRadius: 18,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(59,130,246,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },

  footerHint: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
  },
});