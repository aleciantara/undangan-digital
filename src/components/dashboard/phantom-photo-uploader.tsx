"use client";

import { OrientedPhotoUploader } from "@/components/dashboard/oriented-photo-uploader";
import {
  PHANTOM_PHOTO_SLOTS,
  classifyPhantomDashboardPhotos,
} from "@/lib/phantom-media";

type Props = {
  invitationId: string;
  photos: { id: string; url: string; caption: string | null }[];
  coverPhotoUrl: string | null;
  landscapeBackdropFill: boolean;
};

export function PhantomPhotoUploader(props: Props) {
  return (
    <OrientedPhotoUploader
      {...props}
      slots={PHANTOM_PHOTO_SLOTS}
      classifyPhotos={classifyPhantomDashboardPhotos}
    />
  );
}
