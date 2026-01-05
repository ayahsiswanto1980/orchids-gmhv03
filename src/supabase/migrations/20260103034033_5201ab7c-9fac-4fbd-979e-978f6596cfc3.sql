-- Update admin trigger to include new admin email
CREATE OR REPLACE FUNCTION public.setup_admin_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the new user's email is a designated admin email
  IF NEW.email IN ('syswebcosmg@gmail.com', 'admin-gm@gmail.com') THEN
    -- Insert admin role for this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;

-- Add unique constraint on user_roles if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_roles_user_id_role_key'
    ) THEN
        ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
    END IF;
END$$;

-- Seed initial rooms data
INSERT INTO public.rooms (name, description, price, image_url, features, sort_order, is_active) VALUES
('Kamar Standard', 'Kamar nyaman dengan fasilitas lengkap untuk istirahat yang sempurna', 350000, '/room-standard.jpg', ARRAY['AC', 'TV LED', 'WiFi Gratis', 'Kamar Mandi Dalam'], 1, true),
('Kamar Deluxe', 'Kamar luas dengan pemandangan indah dan fasilitas premium', 500000, '/room-deluxe.jpg', ARRAY['AC', 'TV LED 43"', 'WiFi Gratis', 'Kamar Mandi Dalam', 'Mini Bar', 'Balkon'], 2, true),
('Suite Room', 'Suite mewah dengan ruang tamu terpisah dan fasilitas eksklusif', 800000, '/room-suite.jpg', ARRAY['AC', 'Smart TV 55"', 'WiFi Gratis', 'Bathtub', 'Mini Bar', 'Living Room', 'City View'], 3, true)
ON CONFLICT DO NOTHING;

-- Seed initial facilities data
INSERT INTO public.facilities (name, description, image_url, sort_order, is_active) VALUES
('Kolam Renang', 'Kolam renang outdoor dengan pemandangan indah, tersedia untuk dewasa dan anak-anak', '/facility-pool.jpg', 1, true),
('Danau Resto', 'Restaurant dengan suasana tepi danau yang romantis dan menu khas Indonesia', '/facility-danau-resto.jpg', 2, true),
('Master Park', 'Taman bermain anak-anak dengan berbagai wahana menarik dan aman', '/facility-master-park.jpg', 3, true),
('Restaurant', 'Restoran utama menyajikan hidangan Indonesia dan internasional', '/facility-restaurant.jpg', 4, true),
('Spa & Wellness', 'Pusat spa dengan berbagai treatment relaksasi dan pijat tradisional', '/facility-spa.jpg', 5, true),
('Fitness Center', 'Pusat kebugaran dengan peralatan modern dan instruktur profesional', '/facility-gym.jpg', 6, true)
ON CONFLICT DO NOTHING;

-- Seed initial services data
INSERT INTO public.services (title, description, icon, sort_order, is_active) VALUES
('Parkir Gratis', 'Area parkir luas dan aman tersedia untuk semua tamu hotel', 'Car', 1, true),
('WiFi Gratis', 'Koneksi internet cepat tersedia di seluruh area hotel', 'Wifi', 2, true),
('Resepsionis 24 Jam', 'Tim resepsionis siap melayani kebutuhan Anda kapan saja', 'Clock', 3, true),
('Room Service', 'Layanan kamar tersedia untuk pesanan makanan dan minuman', 'Utensils', 4, true),
('Keamanan 24 Jam', 'Tim keamanan profesional menjaga kenyamanan dan keamanan Anda', 'ShieldCheck', 5, true),
('Laundry', 'Layanan laundry dan dry cleaning dengan kualitas terbaik', 'Shirt', 6, true),
('Rental Mobil', 'Layanan penyewaan mobil dengan berbagai pilihan kendaraan', 'CarFront', 7, true),
('Airport Transfer', 'Layanan antar jemput bandara dengan kendaraan nyaman', 'Plane', 8, true)
ON CONFLICT DO NOTHING;

-- Seed initial reviews data
INSERT INTO public.reviews (guest_name, rating, comment, is_active, is_featured) VALUES
('Budi Santoso', 5, 'Hotel yang sangat nyaman dengan pelayanan yang ramah. Kolam renangnya bersih dan luas. Sangat cocok untuk liburan keluarga!', true, true),
('Sari Dewi', 5, 'Lokasi strategis, dekat dengan pusat kota. Kamarnya bersih dan makanannya enak. Pasti akan kembali lagi!', true, true),
('Ahmad Wijaya', 4, 'Pelayanan memuaskan, kamar bersih dan nyaman. Harga sangat terjangkau untuk fasilitas yang didapat.', true, true),
('Linda Kusuma', 5, 'Restaurant Danau Resto-nya amazing! Suasana romantis dengan pemandangan danau yang indah. Makanannya juga lezat.', true, false),
('Rudi Hartono', 4, 'Fasilitas lengkap, staf ramah dan helpful. Master Park-nya cocok untuk anak-anak bermain.', true, false),
('Nina Anggraini', 5, 'Suite room-nya mewah banget! Pemandangan dari balkon sangat indah. Perfect untuk honeymoon!', true, false)
ON CONFLICT DO NOTHING;

-- Seed site settings
INSERT INTO public.site_settings (key, value) VALUES
('hero', '{"hotel_name": "Hotel Grand Master", "tagline": "Pengalaman Menginap Mewah", "description": "Nikmati kemewahan dan kenyamanan di jantung kota Purwodadi dengan fasilitas bintang 3 yang lengkap", "star_rating": "Hotel Bintang 3", "whatsapp": "6281234567890"}'::jsonb)
ON CONFLICT (key) DO NOTHING;