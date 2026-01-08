import React from 'react';

const partners = [
  { name: 'Partner 1', logo: 'https://via.placeholder.com/150x50?text=Logo+1' },
  { name: 'Partner 2', logo: 'https://via.placeholder.com/150x50?text=Logo+2' },
  { name: 'Partner 3', logo: 'https://via.placeholder.com/150x50?text=Logo+3' },
  { name: 'Partner 4', logo: 'https://via.placeholder.com/150x50?text=Logo+4' },
  { name: 'Partner 5', logo: 'https://via.placeholder.com/150x50?text=Logo+5' },
];

export const PartnerLogos = () => {
  return (
    <div className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-gray-500 text-sm font-semibold uppercase tracking-widest mb-8">
          Our Trusted Partners
        </h2>
        
        {/* Container untuk Animasi Marquee (Berjalan) */}
        <div className="relative flex overflow-x-hidden">
          <div className="flex animate-marquee whitespace-nowrap items-center">
            {partners.concat(partners).map((partner, index) => (
              <img
                key={index}
                src={partner.logo}
                alt={partner.name}
                className="mx-8 h-12 grayscale hover:grayscale-0 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tambahkan Style Khusus di bawah ini jika Tailwind config belum ada animasinya */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PartnerLogos;
