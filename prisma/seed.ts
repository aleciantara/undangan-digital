import { config } from "dotenv";
import { resolve } from "node:path";
import { hash } from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { phantomDefaultCover, phantomDefaultPhotos } from "../src/lib/phantom-media";
import { raoulDefaultCover, raoulDefaultPhotos } from "../src/lib/raoul-media";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL tidak ditemukan. Isi .env.local dulu.");
}

const SEED_ACCOUNTS = [
  {
    email: process.env.SEED_ADMIN_EMAIL ?? "admin@undangandigital.com",
    password: process.env.SEED_ADMIN_PASSWORD ?? "Admin123!",
    name: "Admin Undangan",
    role: "ADMIN" as const,
  },
  {
    email: process.env.SEED_USER_EMAIL ?? "user@undangandigital.com",
    password: process.env.SEED_USER_PASSWORD ?? "User123!",
    name: "User Demo",
    role: "USER" as const,
  },
];

async function main() {
  console.log("Seeding users...\n");

  for (const account of SEED_ACCOUNTS) {
    const email = account.email.toLowerCase();
    const passwordHash = await hash(account.password, 12);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: account.name,
        passwordHash,
        role: account.role,
      },
      create: {
        email,
        name: account.name,
        passwordHash,
        role: account.role,
      },
    });

    console.log(`✓ ${account.role.padEnd(5)} ${email} (id: ${user.id})`);
  }

  const demoEmail = (process.env.SEED_USER_EMAIL ?? "user@undangandigital.com").toLowerCase();
  const demoUser = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!demoUser) {
    console.log("\nLewati undangan demo — user demo tidak ditemukan.");
    return;
  }

  console.log("\nSeeding demo invitation erik-christine...");

  const weddingDate = new Date("2026-12-12T09:00:00+07:00");
  const receptionDate = new Date("2026-12-12T18:00:00+07:00");

  const invitation = await prisma.invitation.upsert({
    where: { slug: "erik-christine" },
    update: {
      groomName: "Erik",
      brideName: "Christine",
      groomFullName: "Erik de Chagny",
      brideFullName: "Christine Daaé",
      groomParents: "Bpk. Comte de Chagny & Ibu de Chagny",
      brideParents: "Bpk. Gustave Daaé & Ibu Daaé",
      templateId: "phantom-opera",
      primaryColor: "#1A0F14",
      accentColor: "#A4163A",
      fontFamily: "cormorant",
      coverPhotoUrl: phantomDefaultCover,
      loveStory:
        "Anywhere you go, let me go too. Love me — that's all I ask of you.",
      musicUrl: null,
      musicTitle: null,
      musicAutoplay: true,
      musicStartSec: 0,
      isPublished: true,
      publishedAt: new Date(),
    },
    create: {
      slug: "erik-christine",
      userId: demoUser.id,
      groomName: "Erik",
      brideName: "Christine",
      groomFullName: "Erik de Chagny",
      brideFullName: "Christine Daaé",
      groomParents: "Bpk. Comte de Chagny & Ibu de Chagny",
      brideParents: "Bpk. Gustave Daaé & Ibu Daaé",
      templateId: "phantom-opera",
      primaryColor: "#1A0F14",
      accentColor: "#A4163A",
      fontFamily: "cormorant",
      coverPhotoUrl: phantomDefaultCover,
      loveStory:
        "Anywhere you go, let me go too. Love me — that's all I ask of you.",
      musicUrl: null,
      musicTitle: null,
      musicAutoplay: true,
      musicStartSec: 0,
      isPublished: true,
      publishedAt: new Date(),
      events: {
        create: [
          {
            name: "Akad Nikah",
            nameEn: "Wedding Ceremony",
            date: weddingDate,
            venue: "Opéra Garnier",
            address: "Jl. Palais Garnier No. 1, Jakarta",
            dresscode: "Black tie / Masquerade elegan",
            order: 0,
          },
          {
            name: "Resepsi",
            nameEn: "Wedding Reception",
            date: receptionDate,
            venue: "Grand Ballroom",
            address: "Jl. Palais Garnier No. 1, Jakarta",
            dresscode: "Dark formal · Aksen merah mawar",
            notes: "Malam masquerade — topeng opsional",
            order: 1,
          },
        ],
      },
      photos: {
        create: phantomDefaultPhotos.map((photo, order) => ({
          url: photo.url,
          caption: photo.caption,
          order,
        })),
      },
    },
    include: { events: true, photos: true },
  });

  if (invitation.events.length === 0) {
    await prisma.weddingEvent.createMany({
      data: [
        {
          invitationId: invitation.id,
          name: "Akad Nikah",
          nameEn: "Wedding Ceremony",
          date: weddingDate,
          venue: "Opéra Garnier",
          address: "Jl. Palais Garnier No. 1, Jakarta",
          dresscode: "Black tie / Masquerade elegan",
          order: 0,
        },
        {
          invitationId: invitation.id,
          name: "Resepsi",
          nameEn: "Wedding Reception",
          date: receptionDate,
          venue: "Grand Ballroom",
          address: "Jl. Palais Garnier No. 1, Jakarta",
          dresscode: "Dark formal · Aksen merah mawar",
          notes: "Malam masquerade — topeng opsional",
          order: 1,
        },
      ],
    });
  }

  if (invitation.photos.length === 0) {
    await prisma.photo.createMany({
      data: phantomDefaultPhotos.map((photo, order) => ({
        invitationId: invitation.id,
        url: photo.url,
        caption: photo.caption,
        order,
      })),
    });
  } else {
    const stale = invitation.photos.some(
      (p) => p.url.includes("Phantom") || p.url.includes("Sierra") || p.url.includes("caafb8e0")
    );
    if (stale) {
      await prisma.photo.deleteMany({ where: { invitationId: invitation.id } });
      await prisma.photo.createMany({
        data: phantomDefaultPhotos.map((photo, order) => ({
          invitationId: invitation.id,
          url: photo.url,
          caption: photo.caption,
          order,
        })),
      });
    }
  }

  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { coverPhotoUrl: phantomDefaultCover },
  });

  console.log(`✓ Undangan demo: /undangan/erik-christine (id: ${invitation.id})`);

  console.log("\nSeeding demo invitation raoul-christine...");

  const raoulInvitation = await prisma.invitation.upsert({
    where: { slug: "raoul-christine" },
    update: {
      groomName: "Raoul",
      brideName: "Christine",
      groomFullName: "Raoul de Chagny",
      brideFullName: "Christine Daaé",
      groomParents: "Bpk. Comte de Chagny & Ibu de Chagny",
      brideParents: "Bpk. Gustave Daaé & Ibu Daaé",
      templateId: "phantom-opera-daylight",
      primaryColor: "#1C2535",
      accentColor: "#C4A35A",
      fontFamily: "playfair",
      coverPhotoUrl: raoulDefaultCover,
      loveStory:
        "Anywhere you go, let me go too. Love me — that's all I ask of you.",
      musicUrl: null,
      musicTitle: null,
      musicAutoplay: true,
      musicStartSec: 0,
      isPublished: true,
      publishedAt: new Date(),
    },
    create: {
      slug: "raoul-christine",
      userId: demoUser.id,
      groomName: "Raoul",
      brideName: "Christine",
      groomFullName: "Raoul de Chagny",
      brideFullName: "Christine Daaé",
      groomParents: "Bpk. Comte de Chagny & Ibu de Chagny",
      brideParents: "Bpk. Gustave Daaé & Ibu Daaé",
      templateId: "phantom-opera-daylight",
      primaryColor: "#1C2535",
      accentColor: "#C4A35A",
      fontFamily: "playfair",
      coverPhotoUrl: raoulDefaultCover,
      loveStory:
        "Anywhere you go, let me go too. Love me — that's all I ask of you.",
      musicUrl: null,
      musicTitle: null,
      musicAutoplay: true,
      musicStartSec: 0,
      isPublished: true,
      publishedAt: new Date(),
      events: {
        create: [
          {
            name: "Akad Nikah",
            nameEn: "Wedding Ceremony",
            date: weddingDate,
            venue: "Opéra Garnier",
            address: "Jl. Palais Garnier No. 1, Jakarta",
            dresscode: "Light formal · Ivory & gold accents",
            order: 0,
          },
          {
            name: "Resepsi",
            nameEn: "Wedding Reception",
            date: receptionDate,
            venue: "Rooftop Garden",
            address: "Jl. Palais Garnier No. 1, Jakarta",
            dresscode: "Pastel formal · Morning elegance",
            notes: "Perayaan di bawah sinar matahari",
            order: 1,
          },
        ],
      },
      photos: {
        create: raoulDefaultPhotos.map((photo, order) => ({
          url: photo.url,
          caption: photo.caption,
          order,
        })),
      },
    },
    include: { events: true, photos: true },
  });

  if (raoulInvitation.events.length === 0) {
    await prisma.weddingEvent.createMany({
      data: [
        {
          invitationId: raoulInvitation.id,
          name: "Akad Nikah",
          nameEn: "Wedding Ceremony",
          date: weddingDate,
          venue: "Opéra Garnier",
          address: "Jl. Palais Garnier No. 1, Jakarta",
          dresscode: "Light formal · Ivory & gold accents",
          order: 0,
        },
        {
          invitationId: raoulInvitation.id,
          name: "Resepsi",
          nameEn: "Wedding Reception",
          date: receptionDate,
          venue: "Rooftop Garden",
          address: "Jl. Palais Garnier No. 1, Jakarta",
          dresscode: "Pastel formal · Morning elegance",
          notes: "Perayaan di bawah sinar matahari",
          order: 1,
        },
      ],
    });
  }

  if (raoulInvitation.photos.length === 0) {
    await prisma.photo.createMany({
      data: raoulDefaultPhotos.map((photo, order) => ({
        invitationId: raoulInvitation.id,
        url: photo.url,
        caption: photo.caption,
        order,
      })),
    });
  }

  await prisma.invitation.update({
    where: { id: raoulInvitation.id },
    data: { coverPhotoUrl: raoulDefaultCover },
  });

  console.log(`✓ Undangan demo: /undangan/raoul-christine (id: ${raoulInvitation.id})`);

  console.log("\nSelesai. Gunakan email & password di atas untuk masuk di /masuk");
}

main()
  .catch((e) => {
    console.error("Seed gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
