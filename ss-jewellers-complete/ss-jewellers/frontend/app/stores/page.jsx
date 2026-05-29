// ============================================================
// app/stores/page.jsx — Store Locator
// ============================================================
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const STORES = [
  { city: 'Hyderabad',  area: 'Banjara Hills', address: 'Road No. 12, Banjara Hills, Hyderabad – 500034', phone: '+91 40 2345 6789', hours: '10:00 AM – 9:00 PM · All Days', mapUrl: 'https://maps.google.com' },
  { city: 'Hyderabad',  area: 'Jubilee Hills',  address: 'Plot 89, Road No. 36, Jubilee Hills, Hyderabad – 500033', phone: '+91 40 2345 6790', hours: '10:00 AM – 9:00 PM · All Days', mapUrl: 'https://maps.google.com' },
  { city: 'Hyderabad',  area: 'Himayatnagar',   address: '12-2-827, Himayatnagar, Hyderabad – 500029', phone: '+91 40 2345 6791', hours: '10:00 AM – 8:30 PM · All Days', mapUrl: 'https://maps.google.com' },
  { city: 'Bengaluru',  area: 'Indiranagar',    address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru – 560038', phone: '+91 80 2345 6789', hours: '10:00 AM – 8:30 PM · All Days', mapUrl: 'https://maps.google.com' },
  { city: 'Bengaluru',  area: 'Jayanagar',      address: '4th Block, 11th Main, Jayanagar, Bengaluru – 560041', phone: '+91 80 2345 6790', hours: '10:00 AM – 8:30 PM · All Days', mapUrl: 'https://maps.google.com' },
  { city: 'Chennai',    area: 'T. Nagar',       address: '45, Pondy Bazaar, T. Nagar, Chennai – 600017', phone: '+91 44 2345 6789', hours: '10:00 AM – 9:00 PM · All Days', mapUrl: 'https://maps.google.com' },
  { city: 'Visakhapatnam', area: 'Dwaraka Nagar', address: '12-1-28, Main Road, Dwaraka Nagar, Vizag – 530016', phone: '+91 891 234 5678', hours: '10:00 AM – 8:30 PM · All Days', mapUrl: 'https://maps.google.com' },
  { city: 'Vijayawada', area: 'MG Road',        address: '40-1-5, MG Road, One Town, Vijayawada – 520002', phone: '+91 866 234 5678', hours: '10:00 AM – 9:00 PM · All Days', mapUrl: 'https://maps.google.com' },
  { city: 'Warangal',   area: 'Hanamkonda',     address: '3-1-456, Balayya Sastri Layout, Hanamkonda – 506001', phone: '+91 870 234 5678', hours: '10:00 AM – 8:30 PM · All Days', mapUrl: 'https://maps.google.com' },
  { city: 'Tirupati',   area: 'Leela Mahal',    address: '14-28, Leela Mahal Circle, Tirupati – 517501', phone: '+91 877 234 5678', hours: '10:00 AM – 9:00 PM · All Days', mapUrl: 'https://maps.google.com' },
  { city: 'Nellore',    area: 'Trunk Road',     address: '27-1-44, Trunk Road, Nellore – 524001', phone: '+91 861 234 5678', hours: '10:00 AM – 8:30 PM · All Days', mapUrl: 'https://maps.google.com' },
  { city: 'Kurnool',    area: 'Park Road',      address: '14-1-8, Park Road, Kurnool – 518001', phone: '+91 8518 234 567', hours: '10:00 AM – 8:30 PM · All Days', mapUrl: 'https://maps.google.com' },
];
const CITIES = ['All', ...new Set(STORES.map((s) => s.city))];
const COMING_SOON = ['Mumbai', 'Pune', 'Delhi NCR', 'Kolkata', 'Coimbatore'];

export default function StoresPage() {
  const [activeCity, setActiveCity] = useState('All');
  const filtered = activeCity === 'All' ? STORES : STORES.filter((s) => s.city === activeCity);

  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Find Us Near You</div>
          <h1 className="font-display text-5xl text-cream mb-3">Our Showrooms</h1>
          <p className="font-serif text-[17px] italic text-fog">12 premium locations across South India</p>
        </div>

        {/* City filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CITIES.map((city) => (
            <button key={city} onClick={() => setActiveCity(city)}
              className={`font-sans text-[10px] tracking-[2px] uppercase px-5 py-2.5 border transition-all ${activeCity === city ? 'bg-gold text-obsidian border-gold font-bold' : 'border-gold/20 text-fog hover:text-cream hover:border-gold/40'}`}>
              {city}
            </button>
          ))}
        </div>

        {/* Stores grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {filtered.map((store, i) => (
            <motion.div key={`${store.city}-${store.area}`} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.05 }}
              className="group bg-charcoal border border-gold/12 hover:border-gold/40 p-6 transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-display text-[20px] text-gold-light">{store.city}</div>
                  <div className="font-sans text-[10px] tracking-[2px] uppercase text-gold mt-0.5">{store.area}</div>
                </div>
                <a href={store.mapUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 border border-gold/20 flex items-center justify-center text-fog hover:text-gold hover:border-gold transition-all">
                  <ExternalLink size={13} />
                </a>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <MapPin size={13} className="text-gold mt-0.5 flex-shrink-0" />
                  <p className="font-sans text-[12px] text-fog leading-relaxed">{store.address}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={13} className="text-gold flex-shrink-0" />
                  <p className="font-sans text-[11px] text-fog">{store.hours}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={13} className="text-gold flex-shrink-0" />
                  <a href={`tel:${store.phone.replace(/\s/g,'')}`} className="font-sans text-[12px] text-cream hover:text-gold transition-colors">{store.phone}</a>
                </div>
              </div>
              <a href={store.mapUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-5 font-sans text-[10px] tracking-[2px] uppercase text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                Get Directions →
              </a>
            </motion.div>
          ))}
        </div>

        {/* Coming soon */}
        <div className="text-center p-12 border border-gold/15 bg-white/2">
          <div className="font-sans text-[10px] tracking-[4px] uppercase text-gold mb-3">Expanding Soon</div>
          <h2 className="font-display text-2xl text-cream mb-4">Coming to New Cities</h2>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {COMING_SOON.map((city) => (
              <span key={city} className="font-sans text-[11px] tracking-[1px] text-fog border border-gold/15 px-4 py-2">{city}</span>
            ))}
          </div>
          <p className="font-serif text-[14px] italic text-fog">Want us in your city? Let us know at <a href="mailto:expand@ssjewellers.in" className="text-gold">expand@ssjewellers.in</a></p>
        </div>

        {/* Book appointment CTA */}
        <div className="mt-12 text-center">
          <h2 className="font-display text-3xl text-cream mb-3">Can't visit us?</h2>
          <p className="font-serif text-[16px] italic text-fog mb-6">We offer home visits in Hyderabad & Bengaluru, and video consultations pan-India.</p>
          <Link href="/#appointment" className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all">
            Book a Consultation ✦
          </Link>
        </div>
      </div>
    </div>
  );
}
