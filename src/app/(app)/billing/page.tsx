'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Minus, Loader2, Pencil } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import ReceiptModal from '@/components/ReceiptModal';

export default function BillingScreen() {
  const supabase = createClient();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Shop details state
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  
  // Editing state
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const decrement = useCartStore((state) => state.decrement);
  const cartTotal = useCartStore((state) => state.getTotal());
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const editId = sessionStorage.getItem('edit_order_id');
    if (editId) {
      setEditingOrderId(editId);
    }

    async function fetchData() {
      try {
        const { data: catData, error: catError } = await supabase.from('categories').select('*');
        if (catError) throw catError;
        
        if (catData) {
          const uniqueCategories: any[] = [];
          const seenNames = new Set();
          catData.forEach((cat) => {
            const lowerName = cat.name.toLowerCase().trim();
            if (!seenNames.has(lowerName)) {
              seenNames.add(lowerName);
              uniqueCategories.push(cat);
            }
          });
          setCategories(uniqueCategories);
        }

        const { data: prodData, error: prodError } = await supabase.from('products').select('*').eq('is_active', true);
        if (prodError) throw prodError;
        
        const formattedProducts = (prodData || []).map(p => ({
          id: p.id, name: p.name, price: Number(p.price), categoryId: p.category_id
        }));
        
        setProducts(formattedProducts);
      } catch (error: any) {
        toast.error('Failed to load menu: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProducts = products.filter(p => 
    (activeCategory === 'All' || p.categoryId === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to generate a bill.");

      // Fetch shop details including address and phone
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('id, name, address, phone')
        .eq('owner_id', user.id)
        .limit(1)
        .single();

      let currentShopId = shop?.id;
      let currentShopName = shop?.name; 
      let currentShopAddress = shop?.address;
      let currentShopPhone = shop?.phone;

      if (!currentShopId) {
        const { data: newShop, error: createError } = await supabase.from('shops').insert({ owner_id: user.id, name: 'My Shop' }).select().single();
        if (createError) throw createError;
        currentShopId = newShop.id;
        currentShopName = newShop.name;
      }
      
      setShopName(currentShopName || 'My Shop');
      setShopAddress(currentShopAddress || '');
      setShopPhone(currentShopPhone || '');

      let finalOrder;

      if (editingOrderId) {
        // UPDATE EXISTING BILL (Preserves the original Bill ID and Number)
        const { data: updatedOrder, error: orderError } = await supabase
          .from('orders')
          .update({
            subtotal: cartTotal,
            total: cartTotal,
          })
          .eq('id', editingOrderId)
          .select()
          .single();

        if (orderError) throw orderError;
        finalOrder = updatedOrder;

        // Clear old items to replace with updated cart items
        await supabase.from('order_items').delete().eq('order_id', editingOrderId);

      } else {
        // GENERATE NEW BILL
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert({
            shop_id: currentShopId,
            subtotal: cartTotal,
            total: cartTotal,
            payment_method: 'CASH'
          })
          .select()
          .single();

        if (orderError) throw orderError;
        finalOrder = newOrder;
      }

      const orderItems = cart.map(item => ({
        order_id: finalOrder.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total: (Math.round(item.price * 100) * item.quantity) / 100 
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      sessionStorage.removeItem('edit_order_id');
      setEditingOrderId(null);

      toast.success(editingOrderId ? `Bill Updated Successfully!` : `Bill Generated Successfully!`);
      
      setCompletedOrder({
        ...finalOrder,
        total: cartTotal,
        items: cart.map(item => ({
          ...item,
          total: item.price * item.quantity
        })) 
      });
      clearCart();

    } catch (error: any) {
      toast.error("Checkout failed: " + error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-gray-400" size={48} /></div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 pb-24">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {editingOrderId ? <><Pencil size={20} className="text-blue-600"/> Editing Bill</> : 'New Bill'}
        </h1>
      </header>
      
      <div className="px-4 pt-4 bg-white pb-2 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-black outline-none text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 p-4 no-scrollbar bg-gray-50 border-b border-gray-100">
        <button onClick={() => setActiveCategory('All')} className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${activeCategory === 'All' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${activeCategory === cat.id ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>{cat.name}</button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 md:grid-cols-4 content-start">
        {products.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 mt-10">No products found. Add some to start billing!</div>
        ) : (
          filteredProducts.map(product => {
            const cartItem = cart.find(item => item.id === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
              <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg leading-tight mb-1">{product.name}</h3>
                  <p className="text-gray-500 mb-4 font-medium">₹{product.price}</p>
                </div>
                {quantity === 0 ? (
                  <button onClick={() => addToCart(product)} className="w-full py-3 bg-gray-100 text-gray-900 font-bold rounded-xl flex justify-center items-center gap-2 active:bg-gray-200"><Plus size={18} /> Add</button>
                ) : (
                  <div className="flex items-center justify-between bg-black text-white rounded-xl p-1">
                    <button className="p-2 active:scale-90" onClick={() => decrement(product.id)}><Minus size={18} /></button>
                    <span className="font-bold text-lg">{quantity}</span>
                    <button className="p-2 active:scale-90" onClick={() => addToCart(product)}><Plus size={18} /></button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>

      {cartItemCount > 0 && (
        <div className="fixed bottom-[72px] left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-50">
          <button 
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className={`w-full text-white py-4 rounded-xl font-bold text-lg flex justify-between items-center px-6 active:scale-[0.98] transition-all disabled:opacity-75 ${editingOrderId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'}`}
          >
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-normal text-gray-300">{cartItemCount} Items</span>
              <span className="text-xl text-white">₹{cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {isCheckingOut ? (
                <>PROCESSING <Loader2 className="animate-spin" size={20} /></>
              ) : (
                <>{editingOrderId ? 'UPDATE BILL' : 'GENERATE BILL'} <ShoppingCart size={20} /></>
              )}
            </div>
          </button>
        </div>
      )}
      
      {completedOrder && (
        <ReceiptModal 
          order={completedOrder} 
          shopName={shopName} 
          shopAddress={shopAddress}
          shopPhone={shopPhone}
          onClose={() => setCompletedOrder(null)} 
        />
      )}
    </div>
  );
}