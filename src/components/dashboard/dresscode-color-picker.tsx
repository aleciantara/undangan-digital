"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { parseDresscodeColors, serializeDresscodeColors } from "@/lib/dresscode-colors";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const DEFAULT_COLOR = "#C4A35A";

type Props = {
  name: string;
  defaultValue?: string | null;
};

export function DresscodeColorPicker({ name, defaultValue }: Props) {
  const initial = parseDresscodeColors(defaultValue);
  const [colors, setColors] = useState<string[]>(initial.length > 0 ? initial : [DEFAULT_COLOR]);

  function updateColor(index: number, value: string) {
    setColors((prev) => prev.map((c, i) => (i === index ? value : c)));
  }

  function removeColor(index: number) {
    setColors((prev) => (prev.length <= 1 ? [] : prev.filter((_, i) => i !== index)));
  }

  function addColor() {
    setColors((prev) => [...prev, DEFAULT_COLOR]);
  }

  const serialized = serializeDresscodeColors(colors);

  return (
    <div className="space-y-2">
      <Label>Warna dress code</Label>
      <input type="hidden" name={name} value={serialized} />
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <div
            key={`${index}-${color}`}
            className="flex items-center gap-1 rounded-xl border border-stone-200 bg-white p-1.5 shadow-sm"
          >
            <label className="relative cursor-pointer">
              <span
                className="block h-9 w-9 rounded-lg border border-stone-200 shadow-inner"
                style={{ backgroundColor: color }}
              />
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label={`Pilih warna ${index + 1}`}
              />
            </label>
            <span className="min-w-[4.5rem] font-mono text-xs text-stone-500">{color.toUpperCase()}</span>
            <button
              type="button"
              onClick={() => removeColor(index)}
              className="rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
              aria-label="Hapus warna"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addColor}
          className="h-[3.25rem] rounded-xl border-dashed"
        >
          <Plus className="h-4 w-4" />
          Tambah warna
        </Button>
      </div>
      <p className="text-xs text-stone-500">
        Pilih satu atau lebih warna tema. Tamu akan melihat swatch warna di undangan.
      </p>
    </div>
  );
}
