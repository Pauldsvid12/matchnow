export interface Photo {
    id: string;
    uri: string;
    date: Date;
  }
  
  //Store simple tipo Singleton para persistencia en memoria durante la sesión
  class GalleryStore {
    private static instance: GalleryStore;
    private photos: Photo[] = [];
    private listeners: ((photos: Photo[]) => void)[] = [];
  
    private constructor() {}
  
    public static getInstance(): GalleryStore {
      if (!GalleryStore.instance) {
        GalleryStore.instance = new GalleryStore();
      }
      return GalleryStore.instance;
    }
  
    public addPhoto(photo: Photo) {
      this.photos = [photo, ...this.photos];
      this.notify();
    }
  
    public getPhotos(): Photo[] {
      return this.photos;
    }
  
    public subscribe(listener: (photos: Photo[]) => void) {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    }
  
    private notify() {
      this.listeners.forEach(l => l(this.photos));
    }
  }
  
  export const galleryStore = GalleryStore.getInstance();  