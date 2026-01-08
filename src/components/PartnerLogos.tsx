import React from 'react';

export default function PartnerLogos() {
  return (
    <div className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-400 mb-6">Our Partners</p>
        <div className="flex flex-wrap justify-center gap-8 opacity-50">
          {/* Logo sederhana menggunakan teks untuk sementara agar build aman */}
          <span className="font-bold text-xl">PARTNER 1</span>
          <span className="font-bold text-xl">PARTNER 2</span>
          <span className="font-bold text-xl">PARTNER 3</span>
          <span className="font-bold text-xl">PARTNER 4</span>
        </div>
      </div>
    </div>
  );
}
