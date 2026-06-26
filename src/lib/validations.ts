import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const createInvitationSchema = z.object({
  groomName: z.string().min(2, "Nama mempelai pria minimal 2 karakter"),
  brideName: z.string().min(2, "Nama mempelai wanita minimal 2 karakter"),
  groomFullName: z.string().optional(),
  brideFullName: z.string().optional(),
  groomParents: z.string().optional(),
  brideParents: z.string().optional(),
  templateId: z.string().default("javanese-classic"),
  primaryColor: z.string().default("#8B5E3C"),
  accentColor: z.string().default("#D4AF37"),
  fontFamily: z.string().default("playfair"),
});

function optionalUrlField() {
  return z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => {
      const s = typeof v === "string" ? v.trim() : "";
      return s === "" ? undefined : s;
    })
    .refine((v) => v === undefined || z.string().url().safeParse(v).success, {
      message: "URL tidak valid",
    });
}

export const createEventSchema = z.object({
  name: z.string().min(2, "Nama acara minimal 2 karakter"),
  nameEn: z.string().optional(),
  date: z
    .string()
    .min(1, "Tanggal wajib diisi")
    .refine((v) => !Number.isNaN(new Date(v).getTime()), "Tanggal tidak valid"),
  endTime: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(new Date(v).getTime()), "Waktu selesai tidak valid"),
  venue: z.string().min(2, "Tempat wajib diisi"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  mapsUrl: optionalUrlField(),
  wazeUrl: optionalUrlField(),
  dresscode: z.string().optional(),
  notes: z.string().optional(),
  order: z.number().optional(),
});

export const rsvpSchema = z
  .object({
    guestToken: z.string().optional(),
    invitationId: z.string().optional(),
    guestPhone: z.string().optional(),
    guestName: z.string().optional(),
    eventId: z.string(),
    status: z.enum(["CONFIRMED", "DECLINED", "MAYBE"]),
    pax: z.coerce.number().min(1).max(20).default(1),
    mealPref: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
  })
  .refine(
    (d) =>
      d.guestToken ||
      (d.invitationId && d.guestPhone?.trim() && d.guestName?.trim()),
    { message: "Token tamu atau nama dan nomor WhatsApp wajib" }
  );

export const wishSchema = z.object({
  invitationId: z.string(),
  guestName: z.string().min(1, "Nama harus diisi"),
  message: z.string().min(1, "Pesan harus diisi").max(500),
  emoji: z.string().optional(),
});

export const updateInvitationSchema = z.object({
  groomName: z.string().min(2, "Nama mempelai pria minimal 2 karakter").optional(),
  brideName: z.string().min(2, "Nama mempelai wanita minimal 2 karakter").optional(),
  groomFullName: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => {
      const s = typeof v === "string" ? v.trim() : "";
      return s === "" ? null : s;
    }),
  brideFullName: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => {
      const s = typeof v === "string" ? v.trim() : "";
      return s === "" ? null : s;
    }),
  groomParents: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => {
      const s = typeof v === "string" ? v.trim() : "";
      return s === "" ? null : s;
    }),
  brideParents: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => {
      const s = typeof v === "string" ? v.trim() : "";
      return s === "" ? null : s;
    }),
  templateId: z.string().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  fontFamily: z.string().optional(),
  loveStory: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => {
      const s = typeof v === "string" ? v.trim() : "";
      return s === "" ? null : s;
    }),
  isPublished: z.boolean().optional(),
  seatQuota: z.union([z.number().min(1), z.null(), z.literal("")]).optional(),
  musicUrl: z
    .union([z.string(), z.literal("")])
    .optional()
    .transform((v) => {
      const s = typeof v === "string" ? v.trim() : "";
      return s === "" ? null : s;
    })
    .refine((v) => v === null || v === undefined || /^https?:\/\/.+/i.test(v), {
      message: "URL tidak valid",
    }),
  musicTitle: z
    .union([z.string().max(100), z.literal("")])
    .optional()
    .transform((v) => {
      const s = typeof v === "string" ? v.trim() : "";
      return s === "" ? null : s;
    }),
  musicAutoplay: z.boolean().optional(),
  musicStartSec: z.coerce.number().min(0).max(86400).optional(),
  coverPhotoUrl: z
    .union([z.string(), z.literal(""), z.null()])
    .optional()
    .transform((v) => {
      if (v === null || v === "") return null;
      if (v === undefined) return undefined;
      const s = v.trim();
      return s === "" ? null : s;
    })
    .refine((v) => v === null || v === undefined || z.string().url().safeParse(v).success, {
      message: "URL tidak valid",
    }),
  opensAt: z
    .union([z.string(), z.null(), z.literal("")])
    .optional()
    .transform((v) => {
      if (v === null || v === undefined || v === "") return null;
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? undefined : d;
    }),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type RSVPInput = z.infer<typeof rsvpSchema>;
export type WishInput = z.infer<typeof wishSchema>;
