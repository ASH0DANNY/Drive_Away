"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Upload, X, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/cloudinary";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploads = await Promise.all(Array.from(files).map((f) => uploadToCloudinary(f)));
      onChange([...value, ...uploads]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const makeCover = (index: number) => {
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
            <Image src={url} alt="" fill className="object-cover" />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium">
                <Star className="size-2.5 fill-primary text-primary" /> Cover
              </span>
            )}
            <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/50 group-hover:flex">
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => makeCover(i)}
                  className="rounded-full bg-background/90 p-1.5"
                  aria-label="Make cover image"
                >
                  <Star className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="rounded-full bg-background/90 p-1.5 text-destructive"
                aria-label="Remove image"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
          <span className="text-xs">{uploading ? "Uploading…" : "Add photo"}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {value.length === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          No photos yet — the listing will show a placeholder icon until you add some.
        </p>
      )}
    </div>
  );
}
