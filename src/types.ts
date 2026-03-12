export interface VideoItem {
  id: string;
  title: string;
  category: string;
  youtubeId?: string;
  shortsId?: string;
  thumbnailUrl?: string;
  downloadUrl: string;
}

export interface ManualItem {
  id: string;
  title: string;
  description: string;
  downloadUrl: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  downloadUrl?: string;
}
