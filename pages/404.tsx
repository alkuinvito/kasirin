import MainLayout from "@/components/shared/MainLayout";
import ErrorWrapper from "@/components/shared/errorWrapper";

export default function Custom404() {
  return (
    <MainLayout title="404">
      <ErrorWrapper message="Page you're looking for is not here" />
    </MainLayout>
  );
}
