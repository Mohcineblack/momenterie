"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { usePhotoPrintStore } from "@/store/photoprint-store";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export function PhotoPrintUploader() {
  const {
    setImage,
    setIsUploading,
    setUploadProgress,
    isUploading,
    uploadProgress,
  } = usePhotoPrintStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image is too large. Maximum size is 10MB.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }

      try {
        setIsUploading(true);
        setUploadProgress(0);

        // Create a local preview URL
        const previewUrl = URL.createObjectURL(file);

        // Simulate upload progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 10;
          if (progress >= 90) {
            clearInterval(progressInterval);
            setUploadProgress(90);
          } else {
            setUploadProgress(progress);
          }
        }, 100);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        clearInterval(progressInterval);
        setUploadProgress(100);

        setImage(previewUrl, file);

        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [setImage, setIsUploading, setUploadProgress]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all
        ${isDragActive ? "border-gray-900 bg-gray-50" : "border-gray-300 hover:border-gray-400"}
        ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <div className="space-y-4">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Uploading... {uploadProgress}%</p>
          <div className="max-w-xs mx-auto bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {isDragActive ? (
              <ImageIcon className="w-10 h-10 text-gray-600" />
            ) : (
              <Upload className="w-10 h-10 text-gray-400" />
            )}
          </div>

          {isDragActive ? (
            <p className="text-lg text-gray-700 font-medium">
              Drop your photo here
            </p>
          ) : (
            <>
              <p className="text-lg text-gray-900 font-medium mb-2">
                Drop your photo here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports: JPG, PNG, WEBP, HEIC (Max 10MB)
              </p>
              <button
                type="button"
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Choose File
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
