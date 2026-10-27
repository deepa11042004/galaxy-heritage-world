'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const heroSlides = [
  {
    src: '/media/hero/resort-pool-palms.jpg',
    alt: 'Turquoise resort pool lined with loungers and palm trees - Tropical Escapes',
    tag: 'Tropical Escapes',
  },
  {
    src: '/media/hero/tropical-pool-mountains.jpg',
    alt: 'Tropical resort pool beneath green mountains - Coastal Retreats',
    tag: 'Coastal Retreats',
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

const headingShadow = '0 2px 6px rgba(0, 0, 0, 0.45), 0 10px 36px rgba(0, 0, 0, 0.4)';

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
      className="hero-frame-wrap select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative flex min-h-[calc(100svh-var(--utility-h)-1.5rem)] items-center justify-center overflow-hidden rounded-hero bg-ink pt-[var(--nav-h)] pb-20 text-white">
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
          className="group absolute top-1/2 left-4 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-ink active:scale-95 md:flex lg:left-6"
        >
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <button
          type="button"
          id="hero-next-btn"
          onClick={nextSlide}
          aria-label="Next slide"
          className="group absolute top-1/2 right-4 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-ink active:scale-95 md:flex lg:right-6"
        >
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 text-center sm:px-6 lg:px-8">
          {/* Soft localized backdrop behind the text only (no full-image overlay) */}
          <div
            className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 rounded-[3rem] sm:-inset-x-20 sm:-inset-y-10"
            style={{
              background:
                'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.35) 45%, rgba(0, 0, 0, 0.1) 70%, transparent 85%)',
              filter: 'blur(20px)',
            }}
            aria-hidden="true"
          />

          {/* Eyebrow pill */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur-md animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-accent-strong" />
            <span>India&apos;s Premium Holiday & Hospitality Network</span>
          </div>

          {/* Main headline */}
          <h1 className="heading-hero mb-5 max-w-4xl text-white" style={{ textShadow: headingShadow }}>
            Crafting Unforgettable Journeys Across{' '}
            <span className="text-accent" style={{ textShadow: headingShadow }}>
              India
            </span>{' '}
            &amp;{' '}
            <span className="text-accent" style={{ textShadow: headingShadow }}>
              The World
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg"
            style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.6), 0 4px 18px rgba(0, 0, 0, 0.45)' }}
          >
            Discover handpicked luxury resorts, bespoke family holiday packages, and seamless travel desk privileges with authentic hospitality and guaranteed transparency.
          </p>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-md sm:bottom-8">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.src}
              type="button"
              id={`hero-dot-${idx}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-accent' : 'w-2 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
