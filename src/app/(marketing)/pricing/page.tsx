'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Check, X, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import MarketingHeader from '@/components/MarketingHeader';

export default function PricingPage() {
  const supabase = createClient();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('pro_requests')
        .insert([
          { 
            email, 
            shop_name: shopName, 
            contact_number: contactNumber || null 
          }
        ]);

      if (error) throw error;

      toast.success("Request sent! Our team will contact you shortly.");
      
      // Reset form and close modal
      setIsModalOpen(false);
      setEmail('');
      setShopName('');
      setContactNumber('');
      
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-black selection:text-white">
      
      {/* Assuming you have this component from your landing page */}
      <MarketingHeader />

      <main className="pt-32 pb-24 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Simple pricing for <br className="hidden md:block" />
            <span className="text-gray-400">shops of all sizes.</span>
          </h1>
          <p className="text-lg text-gray-600">
            Start for free and upgrade when your business needs more power. No hidden fees.
          </p>
        </div>

        {/* PRICING CARDS */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Free Tier */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Basic Shop</h3>
            <p className="text-gray-500 mb-6">Perfect for small counters just starting out.</p>
            <div className="mb-6">
              <span className="text-5xl font-extrabold">₹0</span>
              <span className="text-gray-500 font-medium"> / forever</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-gray-700">
                <Check className="text-black" size={20} /> Unlimited Product Menu
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <Check className="text-black" size={20} /> Digital PDF Receipts
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <Check className="text-black" size={20} /> Daily Sales Dashboard
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <X size={20} /> Advanced Analytics
              </li>
            </ul>
            
            <a href="/login" className="w-full bg-gray-100 text-black py-4 rounded-xl font-bold flex justify-center items-center hover:bg-gray-200 transition-colors">
              Get Started Free
            </a>
          </div>

          {/* Pro Tier */}
          <div className="bg-black text-white p-8 rounded-3xl border border-black shadow-xl flex flex-col relative scale-[1.02]">
            <div className="absolute -top-4 right-8 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
              <Zap size={14} /> RECOMMENDED
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro Business</h3>
            <p className="text-gray-400 mb-6">For growing businesses that need superpowers.</p>
            <div className="mb-6">
              <span className="text-5xl font-extrabold">₹229</span>
              <span className="text-gray-400 font-medium"> / month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-gray-200">
                <Check className="text-blue-400" size={20} /> Everything in Basic
              </li>
              <li className="flex items-center gap-3 text-gray-200">
                <Check className="text-blue-400" size={20} /> Thermal Printer Support
              </li>
              <li className="flex items-center gap-3 text-gray-200">
                <Check className="text-blue-400" size={20} /> Multiple Staff Accounts
              </li>
              <li className="flex items-center gap-3 text-gray-200">
                <Check className="text-blue-400" size={20} /> Advanced Sales Analytics
              </li>
            </ul>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-white text-black py-4 rounded-xl font-bold flex justify-center items-center hover:bg-gray-200 transition-colors active:scale-95"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </main>

      {/* UPGRADE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 hover:text-black transition-colors"
            >
              <X size={20}/>
            </button>
            
            <div className="text-center mb-6 mt-2">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Get Pro Features</h2>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Leave your details below and our team will get your shop upgraded to Pro instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shop@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Shop Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="My Super Shop"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contact Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input 
                  type="tel" 
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" size={18}/> Sending...</> : 'Request Pro'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}