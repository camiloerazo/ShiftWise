import AppHeader from '@/components/app-header';
import ShiftWiseApp from '@/components/shiftwise-app';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-grow">
        <ShiftWiseApp />
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        ShiftWise &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
