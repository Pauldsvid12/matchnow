export interface Profile {
    id: string;
    name: string;
    image: string; // URL de la imagen (https://...)
    age?: number;  // Opcional
    bio?: string;  // Opcional
  }
  
  export interface SwipeResult {
    userId: string;
    action: 'LIKE' | 'NOPE';
  }