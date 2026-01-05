import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Hotel, Loader2, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" })
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Nama minimal 2 karakter" }),
  email: z.string().trim().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"]
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, isAdmin, adminLoading, signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  
  // Signup form state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Only redirect if we're sure the user is an admin
    if (user && !adminLoading && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, adminLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    
    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setLoginErrors(errors);
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: error.message === "Invalid login credentials" 
          ? "Email atau password salah"
          : error.message
      });
    } else {
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali!"
      });
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});
    
    const result = signupSchema.safeParse({
      fullName: signupFullName,
      email: signupEmail,
      password: signupPassword,
      confirmPassword: signupConfirmPassword
    });
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setSignupErrors(errors);
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signUp(signupEmail, signupPassword, signupFullName);
    
    if (error) {
      let errorMessage = error.message;
      if (error.message.includes("already registered")) {
        errorMessage = "Email sudah terdaftar";
      }
      toast({
        variant: "destructive",
        title: "Registrasi Gagal",
        description: errorMessage
      });
    } else {
      toast({
        title: "Registrasi Berhasil",
        description: "Akun Anda telah dibuat!"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
      {/* Brand Section - Visible on desktop */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-navy overflow-hidden p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfe81?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/50 to-transparent" />
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Kembali ke Beranda</span>
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gold/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-gold/30">
              <Hotel className="w-6 h-6 text-gold" />
            </div>
            <h1 className="font-montserrat text-3xl text-cream tracking-tight">
              Grand Master
            </h1>
          </div>
          
          <h2 className="text-4xl xl:text-5xl font-montserrat text-cream mb-6 leading-tight max-w-md">
            Kelola Pengalaman <span className="text-gold">Mewah</span> Tamu Anda
          </h2>
          <p className="text-cream/70 text-lg max-w-md leading-relaxed">
            Sistem manajemen properti terpadu untuk memberikan pelayanan terbaik bagi tamu Hotel Grand Master Purwodadi.
          </p>
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-gold/20 p-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-gold" />
            </div>
            <div>
              <p className="text-cream font-medium">Manajemen Real-time</p>
              <p className="text-cream/50 text-sm">Update ketersediaan kamar dan layanan secara instan.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-gold/20 p-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-gold" />
            </div>
            <div>
              <p className="text-cream font-medium">Analitik Mendalam</p>
              <p className="text-cream/50 text-sm">Pahami preferensi tamu melalui ulasan dan data.</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-cream/10">
            <p className="text-cream/40 text-sm">
              &copy; 2024 Hotel Grand Master Purwodadi. Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 lg:p-20 bg-background relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <Hotel className="w-6 h-6 text-gold" />
            <span className="font-display font-bold text-lg">Grand Master</span>
          </div>
          <Link to="/" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

          <div className="mx-auto w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
              <h3 className="text-3xl font-montserrat tracking-tight">Selamat Datang</h3>
              <p className="text-muted-foreground">Silakan masuk ke akun Anda untuk melanjutkan.</p>
            </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-muted/50 rounded-lg">
              <TabsTrigger 
                value="login" 
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                Masuk
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                Daftar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2 group">
                  <Label htmlFor="login-email" className="group-focus-within:text-gold transition-colors">Alamat Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="admin@grandmaster.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={`h-12 bg-muted/30 border-muted focus:border-gold transition-all duration-300 ${loginErrors.email ? "border-destructive focus:ring-destructive" : ""}`}
                    required
                  />
                  {loginErrors.email && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1 animate-in fade-in">
                      <ShieldCheck className="w-3 h-3" /> {loginErrors.email}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2 group">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="group-focus-within:text-gold transition-colors">Kata Sandi</Label>
                    <button type="button" className="text-xs text-gold hover:underline font-medium">Lupa sandi?</button>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={`h-12 bg-muted/30 border-muted focus:border-gold transition-all duration-300 pr-12 ${loginErrors.password ? "border-destructive focus:ring-destructive" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1 animate-in fade-in">
                      <ShieldCheck className="w-3 h-3" /> {loginErrors.password}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gold hover:bg-gold-dark text-navy font-bold text-base transition-all duration-300 shadow-lg shadow-gold/10 active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Masuk ke Dashboard"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2 group">
                  <Label htmlFor="signup-name" className="group-focus-within:text-gold transition-colors">Nama Lengkap</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    className={`h-12 bg-muted/30 border-muted focus:border-gold transition-all duration-300 ${signupErrors.fullName ? "border-destructive focus:ring-destructive" : ""}`}
                    required
                  />
                  {signupErrors.fullName && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1 animate-in fade-in">
                      <ShieldCheck className="w-3 h-3" /> {signupErrors.fullName}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2 group">
                  <Label htmlFor="signup-email" className="group-focus-within:text-gold transition-colors">Alamat Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className={`h-12 bg-muted/30 border-muted focus:border-gold transition-all duration-300 ${signupErrors.email ? "border-destructive focus:ring-destructive" : ""}`}
                    required
                  />
                  {signupErrors.email && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1 animate-in fade-in">
                      <ShieldCheck className="w-3 h-3" /> {signupErrors.email}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2 group">
                  <Label htmlFor="signup-password" className="group-focus-within:text-gold transition-colors">Kata Sandi</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className={`h-12 bg-muted/30 border-muted focus:border-gold transition-all duration-300 pr-12 ${signupErrors.password ? "border-destructive focus:ring-destructive" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {signupErrors.password && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1 animate-in fade-in">
                      <ShieldCheck className="w-3 h-3" /> {signupErrors.password}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2 group">
                  <Label htmlFor="signup-confirm" className="group-focus-within:text-gold transition-colors">Konfirmasi Kata Sandi</Label>
                  <Input
                    id="signup-confirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ulangi kata sandi"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className={`h-12 bg-muted/30 border-muted focus:border-gold transition-all duration-300 ${signupErrors.confirmPassword ? "border-destructive focus:ring-destructive" : ""}`}
                    required
                  />
                  {signupErrors.confirmPassword && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1 animate-in fade-in">
                      <ShieldCheck className="w-3 h-3" /> {signupErrors.confirmPassword}
                    </p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gold hover:bg-gold-dark text-navy font-bold text-base transition-all duration-300 shadow-lg shadow-gold/10 active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Buat Akun Admin"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="pt-6 border-t border-muted text-center space-y-4">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-muted" />
              Bantuan & Dukungan
              <span className="w-8 h-px bg-muted" />
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-full text-xs font-medium">
                Pusat Bantuan
              </Button>
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-full text-xs font-medium">
                Kontak IT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
