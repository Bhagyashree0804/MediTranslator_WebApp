import { TranslationApp } from '@/components/translation-app';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1">
        <TranslationApp />
      </div>
    </main>
  );
}