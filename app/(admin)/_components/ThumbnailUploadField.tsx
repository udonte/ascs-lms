"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  HiOutlinePhotograph,
  HiOutlineUpload,
  HiOutlineX,
} from "react-icons/hi";
import { createClient } from "@/lib/supabase/client";

type ThumbnailUploadFieldProps = {
  currentUrl: string | null;
  courseId: string;
};

/**
 * Client-side thumbnail upload field.
 * Uploads directly to Supabase Storage (course-thumbnails bucket) using
 * the browser client, then stores the resulting public URL in a hidden
 * form input so the parent Server Action can persist it via updateCourseAction.
 */
export function ThumbnailUploadField({
  currentUrl,
  courseId,
}: ThumbnailUploadFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl);
  const [storedUrl, setStoredUrl] = useState<string>(currentUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately for snappy UX
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploadError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      // Use courseId as folder so each course has its own path
      const path = `${courseId}/thumbnail.${ext}`;

      const { data, error } = await supabase.storage
        .from("course-thumbnails")
        .upload(path, file, {
          upsert: true, // Replace existing thumbnail
          contentType: file.type,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("course-thumbnails").getPublicUrl(data.path);

      setStoredUrl(publicUrl);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setUploadError(message);
      // Revert preview on failure
      setPreviewUrl(currentUrl);
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setPreviewUrl(null);
    setStoredUrl("");
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <label className="text-sm font-medium text-customer-charcoal">
        Thumbnail
      </label>
      <p className="mt-0.5 text-xs text-neutral-500">
        JPG, PNG or WebP · max 5 MB · recommended 1280×720px
      </p>

      {/* Hidden input carries the final URL into the Server Action */}
      <input type="hidden" name="thumbnail_url" value={storedUrl} />

      <div className="mt-2 space-y-2">
        {previewUrl ? (
          /* Preview */
          <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
            <div className="relative aspect-video w-full">
              <Image
                src={previewUrl}
                alt="Course thumbnail preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-customer-charcoal shadow">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-customer-teal border-t-transparent" />
                    Uploading…
                  </div>
                </div>
              )}
            </div>
            {/* Actions overlay */}
            {!uploading && (
              <div className="flex gap-2 border-t border-neutral-200 bg-white px-3 py-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-customer-teal transition hover:bg-customer-teal/10"
                >
                  <HiOutlineUpload className="h-3.5 w-3.5" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                >
                  <HiOutlineX className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Upload prompt */
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 px-6 py-8 text-center text-neutral-500 transition hover:border-customer-teal hover:text-customer-teal"
          >
            <HiOutlinePhotograph className="h-8 w-8" aria-hidden />
            <span className="text-sm font-medium">
              Click to upload thumbnail
            </span>
            <span className="text-xs">or drag and drop</span>
          </button>
        )}

        {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
