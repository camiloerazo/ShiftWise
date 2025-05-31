import { Briefcase } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="bg-card border-b border-border p-4 shadow-sm">
      <div className="container mx-auto flex items-center">
        <Briefcase className="h-8 w-8 text-primary mr-2" />
        <h1 className="text-2xl font-headline font-bold text-primary">ShiftWise</h1>
      </div>
    </header>
  );
}
