import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Bed, Building2, Wrench, Star, TrendingUp, Users } from 'lucide-react';

interface Stats {
  rooms: number;
  facilities: number;
  services: number;
  reviews: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    rooms: 0,
    facilities: 0,
    services: 0,
    reviews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [roomsRes, facilitiesRes, servicesRes, reviewsRes] = await Promise.all([
          supabase.from('rooms').select('id', { count: 'exact', head: true }),
          supabase.from('facilities').select('id', { count: 'exact', head: true }),
          supabase.from('services').select('id', { count: 'exact', head: true }),
          supabase.from('reviews').select('id', { count: 'exact', head: true })
        ]);

        if (roomsRes.error) console.error('Rooms fetch error:', roomsRes.error);
        if (facilitiesRes.error) console.error('Facilities fetch error:', facilitiesRes.error);
        if (servicesRes.error) console.error('Services fetch error:', servicesRes.error);
        if (reviewsRes.error) console.error('Reviews fetch error:', reviewsRes.error);

        setStats({
          rooms: roomsRes.count || 0,
          facilities: facilitiesRes.count || 0,
          services: servicesRes.count || 0,
          reviews: reviewsRes.count || 0
        });
      } catch (error) {
        console.error('Error in fetchStats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Kamar', value: stats.rooms, icon: Bed, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Fasilitas', value: stats.facilities, icon: Building2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Layanan', value: stats.services, icon: Wrench, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Ulasan', value: stats.reviews, icon: Star, color: 'text-gold', bg: 'bg-gold/10' },
  ];

  return (
    <AdminLayout title="Dashboard" description="Ringkasan konten website hotel">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={stat.title} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-normal mt-1">
                    {loading ? '-' : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="/admin/rooms" className="p-4 rounded-lg border border-border hover:border-gold/30 hover:bg-gold/5 transition-all group">
              <Bed className="w-8 h-8 text-gold mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-normal">Kelola Kamar</h3>
              <p className="text-sm text-muted-foreground">Tambah atau edit data kamar</p>
            </a>
            <a href="/admin/facilities" className="p-4 rounded-lg border border-border hover:border-gold/30 hover:bg-gold/5 transition-all group">
              <Building2 className="w-8 h-8 text-gold mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-normal">Kelola Fasilitas</h3>
              <p className="text-sm text-muted-foreground">Atur fasilitas hotel</p>
            </a>
            <a href="/admin/reviews" className="p-4 rounded-lg border border-border hover:border-gold/30 hover:bg-gold/5 transition-all group">
              <Star className="w-8 h-8 text-gold mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-normal">Kelola Ulasan</h3>
              <p className="text-sm text-muted-foreground">Moderasi ulasan tamu</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;
