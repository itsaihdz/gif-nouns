import { UploadStudio } from "../components/upload/UploadStudio";
import { PageViewTracker } from "../components/analytics/Tracking";

export default function UploadPage() {
  return (
    <>
      <PageViewTracker page="upload" />
      <UploadStudio />
    </>
  );
} 