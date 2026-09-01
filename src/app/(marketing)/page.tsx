import Link from 'next/link';
import { ArrowRight, Smartphone, Zap, FileText, ChevronDown } from 'lucide-react';
import type { Metadata } from 'next';
import MarketingHeader from '@/components/MarketingHeader';

// SEO METADATA
export const metadata: Metadata = {
  title: 'Segmentics | Free Mobile Billing App for Small Shops',
  description: 'Create bills in seconds from your phone. The perfect digital cash counter for street vendors, tea shops, bakeries, and small businesses. Start billing free today.',
  keywords: ['free billing software', 'mobile billing app', 'POS for small business', 'simple billing app', 'digital cash counter'],
  openGraph: {
    title: 'Segmentics | Free Mobile Billing App for Small Shops',
    description: 'Create bills in seconds from your phone. Start billing free today.',
    type: 'website',
  }
};

export default function LandingPage() {
  const faqs = [
    {
      q: "Do I need a computer to use this?",
      a: "No! This app is designed specifically for both desktop and mobile phones. You can manage your entire shop, add products, and generate bills using just your smartphone with one hand just by using your phone."
    },
    {
      q: "Is it really free?",
      a: "Yes! The core billing features, product management, and daily sales tracking are completely free to use to help your small business grow."
    },
    {
      q: "How do I share bills with customers?",
      a: "You can instantly generate bills as PDF files. From there, you can easily share them directly with your customers via WhatsApp, email, or simply show the digital receipt on your screen."
    },
    {
      q: "Do my customers need to download an app?",
      a: "No, your customers don't need to do anything. You can share a PDF receipt with them, or show them the bill on your screen to collect payment."
    },
    {
      q: "How do I add my products?",
      a: "Once you log in, go to the 'Menu' section. You can type in your product names, set the prices, and categorize them (like 'Beverage', 'Snacks') in seconds."
    },
    {
      q: "Does it work on both Android and iPhone?",
      a: "Yes! It works on any device with a web browser. You can even tap 'Add to Home Screen' to install it directly to your phone like a native app."
    },
    {
      q: "Can I track my daily earnings?",
      a: "Yes. Your dashboard automatically calculates your total sales and the number of bills you generated for the current day."
    },
    {
      q: "What if I make a mistake on a bill?",
      a: "You can view all your past transactions in the 'Bills' history tab to verify exactly what was charged and when and edit them if required."
    },
    {
      q: "Is my business data safe?",
      a: "Very safe. We use enterprise-grade cloud security. Your data is strictly locked to your specific account—no one else can see your sales or menu."
    },
    {
      q: "Can I add my shop's name to the bill?",
      a: "Yes, you can customize your Shop Name, Address, Phone Number, and even add a GST Number from the Settings page, and it will be included on every PDF receipt."
    }
  ];

  // Dynamically generate the SEO/AI schema from your exact FAQ list above
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      
      {/* NAVBAR */}
      <MarketingHeader />

      <main>
        {/* INVISIBLE SEO / AI SCHEMA SCRIPT */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* HERO SECTION */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Simple Billing. <br className="hidden md:block" />
            <span className="text-gray-400">Faster Business.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create bills in seconds right from your mobile phone. Add your menu, tap the items, checkout, and you're done. No complex accounting, just fast billing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-transform active:scale-95 shadow-lg shadow-black/10">
              Start Billing Free <ArrowRight size={20} />
            </Link>
            
            {/* TRY DEMO BUTTON */}
            <Link href="/demo" className="w-full sm:w-auto bg-gray-100 text-black px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
              <Smartphone size={20} /> Try Demo
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500 font-medium">No credit card required. Setup in 60 seconds.</p>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 bg-gray-50 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for speed and simplicity.</h2>
              <p className="text-gray-600">Everything you need to manage your counter, nothing you don't.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-6">
                  <Smartphone size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Mobile First</h3>
                <p className="text-gray-600 leading-relaxed">Designed to be used with one hand on your phone. Large buttons, simple layouts, and fast taps.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">Generate a bill in under 10 seconds. Keep your line moving and your customers happy.</p>
              </div>

              {/* DIGITAL BILLS CARD */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
                <div className="bg-black text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Save & Share Bills</h3>
                <p className="text-gray-600 leading-relaxed">
                  Generate bills instantly and save them as PDF files. Easily share them with customers on the spot, or view your saved bill history whenever you need it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How it works</h2>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-extrabold shrink-0">1</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Add your menu</h3>
                <p className="text-gray-600 text-lg">Quickly type in the items you sell and their prices. Group them into categories like "Tea", "Snacks", or "Juice".</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-extrabold shrink-0">2</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Tap to bill</h3>
                <p className="text-gray-600 text-lg">When a customer orders, just tap the items on your screen. The app calculates the total instantly.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-extrabold shrink-0">3</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Checkout & Track</h3>
                <p className="text-gray-600 text-lg">Hit generate bill. The order is securely saved to your daily dashboard so you know exactly how much you earned today.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-24 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {faqs.map((faq, index) => (
                <details 
                  key={index} 
                  className="group border-b border-gray-100 last:border-0"
                >
                  <summary className="flex justify-between items-center font-bold text-lg p-6 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                    <span className="pr-6">{faq.q}</span>
                    <span className="transition-transform duration-300 group-open:-rotate-180 text-gray-400">
                      <ChevronDown size={20} />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BOTTOM */}
        <section className="py-20 px-4 bg-black text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to digitize your shop?</h2>
            <p className="text-gray-400 text-lg mb-10">Join smart shopkeepers who are saving time and tracking their daily sales effortlessly.</p>
            <Link href="/login" className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 hover:bg-gray-200 transition-transform active:scale-95">
              Create Your Free Account
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Segmentics. Built for small businesses.</p>
      </footer>
    </div>
  );
}
