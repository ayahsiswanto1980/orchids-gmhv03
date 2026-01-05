import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const { user, loading, isAdmin, adminLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for both loading states to complete before redirecting
    if (!loading && !adminLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, loading, isAdmin, adminLoading, navigate]);

  // Show loading while auth or admin role is being checked
  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto" />
          <p className="mt-4 text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="lg:pl-64 min-h-screen transition-all duration-300">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="mb-8 pt-12 lg:pt-0">
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>

          {/* Content */}
          <div className="animate-fade-up">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
