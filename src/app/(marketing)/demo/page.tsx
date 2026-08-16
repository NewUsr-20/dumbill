'use client';

import { useState } from 'react';
import { Search, ShoppingCart, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import ReceiptModal from '@/components/ReceiptModal';

// Mock Data from your prompt
const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Beverages' },
  { id: 'cat-2', name: 'Snacks' }
];

const MOCK_PRODUCTS = [
  { id: 'p-1', categoryId: 'cat-1', name: 'Tea', price: 15 },
  { id: 'p-2', categoryId: 'cat-1', name: 'Coffee', price: 20 },
  { id: 'p-3', categoryId: 'cat-2', name: 'Samosa', price: 15 },
  { id: 'p-4', categoryId: 'cat-2', name: 'Vada', price: 12 },
  { id: 'p-5', categoryId: 'cat-1', name: 'Juice', price: 40 },
  { id: 'p-6', categoryId: 'cat-1', name: 'Water', price: 20 }
];

export default function DemoPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Self-contained demo cart logic
  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const decrement = (productId: string) => {
    setCart((prev) => prev.map(item => 
      item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    (activeCategory === 'All' || p.categoryId === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Simulate processing
    toast.success('Demo Bill Generated Successfully!');
    
    // Format for the receipt modal
    setCompletedOrder({
      total: cartTotal,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        total: item.price * item.quantity
      }))
    });
    
    setCart([]); // Clear cart
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 pb-24">
      {/* DEMO BANNER */}
      <div className="bg-blue-600 text-white px-4 py-2 text-sm font-medium flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <span className="animate-pulse h-2 w-2 bg-white rounded-full"></span>
          Interactive Demo Mode
        </div>
        <Link href="/" className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs transition-colors">
          Exit Demo
        </Link>
      </div>

      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">New Bill</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-600 outline-none text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Categories */}
      <div className="flex overflow-x-auto gap-2 p-4 no-scrollbar bg-gray-50 border-b border-gray-100">
        <button 
          onClick={() => setActiveCategory('All')}
          className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
            activeCategory === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          All
        </button>
        {MOCK_CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
              activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <main className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {filteredProducts.map(product => {
          const cartItem = cart.find(item => item.id === product.id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg leading-tight mb-1">{product.name}</h3>
                <p className="text-gray-500 mb-4 font-medium">₹{product.price}</p>
              </div>
              
              {quantity === 0 ? (
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full py-3 bg-gray-100 text-gray-900 font-bold rounded-xl flex justify-center items-center gap-2 active:bg-gray-200"
                >
                  <Plus size={18} /> Add
                </button>
              ) : (
                <div className="flex items-center justify-between bg-blue-600 text-white rounded-xl p-1">
                  <button className="p-2 active:scale-90" onClick={() => decrement(product.id)}>
                    <Minus size={18} />
                  </button>
                  <span className="font-bold text-lg">{quantity}</span>
                  <button className="p-2 active:scale-90" onClick={() => addToCart(product)}>
                    <Plus size={18} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Bottom Cart Bar */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-50">
          <button 
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg flex justify-between items-center px-6 active:scale-[0.98] transition-transform"
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-normal text-blue-200">{cartItemCount} Items</span>
              <span className="text-xl">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              GENERATE BILL <ShoppingCart size={20} />
            </div>
          </button>
        </div>
      )}

      {/* Receipt Modal */}
      {completedOrder && (
        <ReceiptModal 
          order={completedOrder} 
          shopName="Demo Shop" 
          onClose={() => setCompletedOrder(null)} 
        />
      )}
    </div>
  );
}