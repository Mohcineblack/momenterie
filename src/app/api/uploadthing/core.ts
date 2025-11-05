import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Image uploader for product customization (puzzles, photo prints, etc.)
  productImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth();

      // Allow guests to upload for customization
      return {
        userId: session?.user?.id || "guest",
        uploadedAt: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", {
        userId: metadata.userId,
        fileUrl: file.url,
        uploadedAt: metadata.uploadedAt,
      });

      return {
        url: file.url,
        userId: metadata.userId,
      };
    }),

  // Multiple images for reviews
  reviewImages: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user) {
        throw new Error("Unauthorized - must be logged in to upload review images");
      }

      return {
        userId: session.user.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Review image uploaded:", {
        userId: metadata.userId,
        fileUrl: file.url,
      });

      return { url: file.url };
    }),

  // Avatar images
  avatar: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user) {
        throw new Error("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar uploaded:", {
        userId: metadata.userId,
        fileUrl: file.url,
      });

      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
