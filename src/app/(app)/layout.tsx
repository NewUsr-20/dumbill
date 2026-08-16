import { Toaster } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 min-h-screen w-full flex flex-col">
      {/* Main Content Area - pb-16 ensures content isn't hidden behind the bottom nav */}
      <div className="flex-1 pb-16">
        {children}
      </div>
      
      {/* Global Notifications */}
      <Toaster position="top-center" richColors /> 
      
      {/* Global Mobile Navigation */}
      <BottomNav />
    </div>
  );
}