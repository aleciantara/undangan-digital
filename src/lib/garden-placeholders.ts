import { landingImages } from "@/lib/landing-images";

export type GardenMediaPhoto = {
  id: string;
  url: string;
  caption: string | null;
};

/** Unsplash placeholders for preview when couple hasn't uploaded yet */
export const gardenPlaceholderCover = landingImages.hero.src;

export const gardenPlaceholderPhotos: GardenMediaPhoto[] = [
  {
    id: "placeholder-couple",
    url: landingImages.gallery.couple.src,
    caption: "Pre-wedding",
  },
  {
    id: "placeholder-bouquet",
    url: landingImages.gallery.bouquet.src,
    caption: "Buket pengantin",
  },
  {
    id: "placeholder-rings",
    url: landingImages.gallery.rings.src,
    caption: "Sesi detail",
  },
  {
    id: "placeholder-table",
    url: landingImages.gallery.table.src,
    caption: "Dekorasi meja",
  },
  {
    id: "placeholder-theme",
    url: landingImages.theme.src,
    caption: "Floral flatlay",
  },
  {
    id: "placeholder-reception",
    url: landingImages.steps.share.src,
    caption: "Suasana resepsi",
  },
];

export function resolveGardenMedia(invitation: {
  coverPhotoUrl?: string | null;
  photos: GardenMediaPhoto[];
}) {
  const hasCover = Boolean(invitation.coverPhotoUrl);
  const hasPhotos = invitation.photos.length > 0;

  return {
    coverUrl: invitation.coverPhotoUrl ?? gardenPlaceholderCover,
    galleryPhotos: hasPhotos ? invitation.photos : gardenPlaceholderPhotos,
    isPlaceholderMedia: !hasCover || !hasPhotos,
  };
}
