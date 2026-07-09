"use client";

import { OrientedPhotoUploader } from "@/components/dashboard/oriented-photo-uploader";
import {
  RAOUL_PHOTO_SLOTS,
  classifyRaoulDashboardPhotos,
} from "@/lib/raoul-media";

type Props = {
  invitationId: string;
  photos: { id: string; url: string; caption: string | null }[];
  coverPhotoUrl: string | null;
  landscapeBackdropFill: boolean;
};

export function RaoulPhotoUploader(props: Props) {
  return (
    <OrientedPhotoUploader
      {...props}
      slots={RAOUL_PHOTO_SLOTS}
      classifyPhotos={classifyRaoulDashboardPhotos}
    />
  );
}
