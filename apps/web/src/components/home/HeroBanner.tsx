'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const heroSlides = [
  {
    src: '/media/galaxy-heritage-world/faq/images/177.jpg',
    alt: 'Majestic Pagoda and Mount Fuji in Spring - International Escapes',
    tag: 'Iconic Destinations',
  },
  {
    src: '/media/galaxy-heritage-world/faq/images/1073.jpg',
    alt: 'Golden Sunset Luxury Beach Resort Pool - Coastal Retreats',
    tag: 'Coastal Luxury',
  },
  {
    src: '/media/galaxy-heritage-world/faq/images/4900.jpg',
    alt: 'Tropical Palm Resort & Serene Swimming Pool - Leisure Holidays',
    tag: 'Tropical Escapes',
  },
  {
    src: '/media/galaxy-heritage-world/faq/images/18726.jpg',
    alt: 'Grand Heritage Palace Resort with Sprawling Infinity Pool - Heritage Stays',
    tag: 'Palatial Stays',
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Swipe gesture handling for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Auto-play slider every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-[#0B1320] text-white overflow-hidden pt-24 pb-6 sm:pt-28 sm:pb-8 lg:pt-28 lg:pb-8 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Slides with Crossfade Animation */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                sizes="100vw"
              />
            </div>
          );
        })}

      </div>

      {/* Slider Left & Right Navigation Arrows */}
      <button
        type="button"
        id="hero-prev-btn"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-black/35 hover:bg-[#D4AF37] hover:text-[#0B1320] text-white backdrop-blur-md border border-white/20 hover:border-[#D4AF37] transition-all duration-200 active:scale-95 shadow-xl group cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
      </button>

      <button
        type="button"
        id="hero-next-btn"
        onClick={nextSlide}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-black/35 hover:bg-[#D4AF37] hover:text-[#0B1320] text-white backdrop-blur-md border border-white/20 hover:border-[#D4AF37] transition-all duration-200 active:scale-95 shadow-xl group cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* Hero Content - Shifted slightly up for balanced viewport spacing */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center -translate-y-4 sm:-translate-y-8 lg:-translate-y-10">
        {/* Ambient Dark Shadow Backdrop directly behind the Header Text */}
        <div
          className="absolute -inset-x-8 sm:-inset-x-20 -inset-y-6 sm:-inset-y-10 -z-10 rounded-[3rem] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.45) 45%, rgba(0, 0, 0, 0.15) 70%, transparent 85%)',
            filter: 'blur(20px)',
          }}
          aria-hidden="true"
        />

        {/* Top Luxury Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-[#D4AF37]/60 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India&apos;s Premium Holiday & Hospitality Network</span>
        </div>

        {/* Main Headline with Deep Multi-layered Text Shadow */}
        <h1
          className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white max-w-4xl leading-tight sm:leading-tight mb-3 sm:mb-4"
          style={{
            textShadow:
              '0 2px 4px rgba(0, 0, 0, 0.95), 0 4px 14px rgba(0, 0, 0, 0.9), 0 8px 28px rgba(0, 0, 0, 0.8), 0 16px 48px rgba(0, 0, 0, 0.7)',
          }}
        >
          Crafting Unforgettable Journeys Across{' '}
          <span
            className="text-[#D4AF37] italic"
            style={{
              textShadow:
                '0 2px 4px rgba(0, 0, 0, 0.95), 0 4px 14px rgba(0, 0, 0, 0.9), 0 8px 28px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.35)',
            }}
          >
            India
          </span>{' '}
          & The World
        </h1>

        {/* Subtitle with Shadow Effect */}
        <p
          className="text-sm sm:text-base lg:text-lg text-white font-medium max-w-2xl leading-relaxed"
          style={{
            textShadow:
              '0 1px 3px rgba(0, 0, 0, 0.95), 0 3px 10px rgba(0, 0, 0, 0.85), 0 6px 20px rgba(0, 0, 0, 0.75)',
          }}
        >
          Discover handpicked luxury resorts, bespoke family holiday packages, and seamless travel desk privileges with authentic hospitality and guaranteed transparency.
        </p>
      </div>

      {/* Slide Indicators - Positioned at bottom of header section with ample space */}
      <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2.5 z-20">
        {heroSlides.map((slide, idx) => (
          <button
            key={slide.src}
            type="button"
            id={`hero-dot-${idx}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentSlide
                ? 'w-8 bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.7)]'
                : 'w-2 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
