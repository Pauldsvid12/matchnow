import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy'; // ✅ IMPORTANTE

export interface Photo {
  id: string;
  uri: string;
  date: number;
}

type Listener = (photos: Photo[]) => void;

export class GalleryStore {
  private photos: Photo[] = [];
  private listeners: Listener[] = [];
  private readonly STORAGE_KEY = 'swap_camera_gallery_v2';

  constructor() {
    this.loadPhotos();
  }

  getPhotos(): Photo[] {
    return [...this.photos].sort((a, b) => b.date - a.date);
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  async addPhoto(uri: string) {
    const now = Date.now();
    const newPhoto: Photo = { id: now.toString(), uri, date: now };

    this.photos = [newPhoto, ...this.photos];
    this.notify();
    await this.persist();
  }

  async deletePhoto(id: string) {
    const photoToDelete = this.photos.find((p) => p.id === id);

    this.photos = this.photos.filter((p) => p.id !== id);
    this.notify();
    await this.persist();

    // ✅ Borrado físico sin crashear (legacy)
    if (photoToDelete?.uri) {
      try {
        await FileSystem.deleteAsync(photoToDelete.uri, { idempotent: true });
      } catch (e) {
        // Si no se puede borrar el archivo físico, igual la quitamos de la galería.
        console.warn('No se pudo borrar archivo físico:', e);
      }
    }
  }

  private notify() {
    const snapshot = this.getPhotos();
    this.listeners.forEach((l) => l(snapshot));
  }

  private async persist() {
    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.photos));
  }

  private normalizeUri(value: any): string | null {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && typeof value.uri === 'string') return value.uri;
    if (value && typeof value === 'object' && value.uri && typeof value.uri.uri === 'string') {
      return value.uri.uri;
    }
    return null;
  }

  private async loadPhotos() {
    const raw = await AsyncStorage.getItem(this.STORAGE_KEY);

    if (!raw) {
      this.photos = [];
      this.notify();
      return;
    }

    try {
      const parsed = JSON.parse(raw) as any[];

      const cleaned: Photo[] = (Array.isArray(parsed) ? parsed : [])
        .map((p) => {
          const fixedUri = this.normalizeUri(p?.uri);
          if (!fixedUri) return null;

          return {
            id: String(p?.id ?? Date.now()),
            uri: fixedUri,
            date: typeof p?.date === 'number' ? p.date : Date.now(),
          } as Photo;
        })
        .filter(Boolean) as Photo[];

      this.photos = cleaned;
      this.notify();
      await this.persist();
    } catch {
      this.photos = [];
      this.notify();
    }
  }
}

export const galleryStore = new GalleryStore();