import AutoLabelInterface from '@/components/ImageUploader/AutoLabelInterface';
import Header from '@/components/Header';

export default function AutoLabelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-6">
        <AutoLabelInterface />
      </main>
    </div>
  );
}