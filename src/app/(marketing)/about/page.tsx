import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import MarketingHeader from '@/components/MarketingHeader';

export const metadata: Metadata = {
  title: 'About Us | Segmentics',
  description: 'We build simple, lightning-fast digital tools for street vendors and small shop owners.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAVIGATION BAR TO GO BACK TO HOME */}
     <MarketingHeader />

      <main className="pt-16 pb-24 px-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center">Built for the backbone of the economy.</h1>
        
        <div className="prose prose-lg text-gray-600 space-y-6 mx-auto leading-relaxed">
          <p className="text-xl font-medium text-black">
            Segmentics didn't start in a corporate boardroom. It started by watching a local small shop owner struggle to write down orders during the morning rush.
          </p>
          
          <p>
            Small shopkeepers, street vendors, and food stalls are the lifeblood of our streets. Yet, most billing software is built for massive supermarkets. It's expensive, requires a computer, and is far too complicated for someone who just needs to bill a cup of coffee or a waffle in under 10 seconds.
          </p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">Our Vision</h2>
          <p>
            We believe technology should adapt to how you work, not the other way around. You shouldn't need a degree in accounting to track your daily sales.
          </p>
          
          <p>
            That's why we built Segmentics as a mobile-first digital cash counter. It's designed to be used with one hand, on a low-end smartphone, in the middle of a busy day. No clutter. No confusing menus. Just tap, bill, and move to the next customer.
          </p>

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mt-12 text-center">
            <h3 className="text-xl font-bold text-black mb-2">Join us</h3>
            <p className="mb-0">Whether you run a customized clothing store, a brownie shop, or a push-cart, we're here to help you digitize your business simply and securely.</p>
          </div>
        </div>
      </main>
    </div>
  );
}