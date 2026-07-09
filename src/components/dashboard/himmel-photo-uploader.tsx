"use client";

import { OrientedPhotoUploader } from "@/components/dashboard/oriented-photo-uploader";
import {
  HIMMEL_PHOTO_SLOTS,
  classifyHimmelDashboardPhotos,
} from "@/lib/himmel-media";

type Props = {
  invitationId: string;
  photos: { id: string; url: string; caption: string | null }[];
  coverPhotoUrl: string | null;
  landscapeBackdropFill: boolean;
};

export function HimmelPhotoUploader(props: Props) {
  return (
    <OrientedPhotoUploader
      {...props}
      slots={HIMMEL_PHOTO_SLOTS}
      classifyPhotos={classifyHimmelDashboardPhotos}
      heroPortraitEmptyLabel="Animasi bunga"
    />
  );
}
