import { createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  sportsCardUploader: f({
    image: {
      maxFileSize: '8MB',
      maxFileCount: 1
    }
  })
    .middleware(async () => {
      return { uploadedBy: 'photodrop-sports-card-customer' };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete:', metadata.uploadedBy, file.url);
      return { uploadedBy: metadata.uploadedBy, fileUrl: file.url };
    })
};
