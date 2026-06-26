type Props = { show: boolean };

export function GardenPlaceholderNote({ show }: Props) {
  if (!show) return null;

  return (
    <p className="garden-placeholder-note mx-auto max-w-lg px-4 py-6 text-center text-xs leading-relaxed text-inv-faint">
      Foto contoh dari Unsplash — unggah foto & sampul Anda di dashboard untuk menggantinya.
    </p>
  );
}
