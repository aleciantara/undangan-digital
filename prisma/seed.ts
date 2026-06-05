import { config } from "dotenv";
import { resolve } from "node:path";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL tidak ditemukan. Isi .env.local dulu.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

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

  console.log("\nSelesai. Gunakan email & password di atas untuk masuk di /masuk");
}

main()
  .catch((e) => {
    console.error("Seed gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
