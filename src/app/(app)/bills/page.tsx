'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Search, Calendar, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import ReceiptModal from '@/components/ReceiptModal';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';

export default function BillsPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const clearCart = useCartStore((state) => state.clearCart);
  const addToCart = useCartStore((state) => state.addToCart);

  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderToEdit, setOrderToEdit] = useState<any>(null); 
  
  const [shopName, setShopName] = useState('My Shop');
  const [shopAddress, setShopAddress] = useState('');
  const [shopPhone, setShopPhone] = useState('');

  // NEW: Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: shop } = await supabase
        .from('shops')
        .select('id, name, address, phone')
        .eq('owner_id', user.id)
        .single();
        
      if (!shop) throw new Error("Shop not found");
      
      setShopName(shop.name);
      setShopAddress(shop.address || '');
      setShopPhone(shop.phone || '');

      const { data: orderData, error } = await supabase
        .from('orders')
        .select(`*, order_items (*)`)
        .eq('shop_id', shop.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(orderData || []);
    } catch (error: any) {
      toast.error('Failed to load bills: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleViewBill = (order: any) => {
    const itemsList = order.order_items || [];
    const formattedOrder = {
      ...order,
      items: itemsList.map((item: any) => ({
        id: item.product_id,
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price, 
        total: Number(item.total || 0)
      })),
      total: Number(order.total || 0)
    };
    setSelectedOrder(formattedOrder);
  };

  const handleEditClick = () => {
    setOrderToEdit(selectedOrder);
    setSelectedOrder(null); 
  };

  const confirmEditAction = () => {
    if (!orderToEdit) return;

    try {
      sessionStorage.setItem('edit_order_id', orderToEdit.id);

      clearCart();
      orderToEdit.items.forEach((item: any) => {
        for(let i = 0; i < item.quantity; i++) {
          addToCart({
            id: item.id || Math.random().toString(), 
            name: item.name,
            price: item.price
          } as any);
        }
      });

      toast.success("Ready to edit! Keeping original Bill #.");
      router.push('/billing'); 

    } catch (err: any) {
      toast.error("Failed to edit bill: " + err.message);
    }
  };

  // NEW: Filter the orders before rendering based on Search Query and Date
  const displayOrders = orders.filter((order) => {
    // 1. Text Search (Matches Bill Number OR Items inside the bill)
   const billNumber = String(order.order_number || order.id.slice(0,6)).toUpperCase();
    const itemsString = (order.order_items || []).map((i: any) => i.product_name).join(' ').toUpperCase();
    
    const searchUpper = searchQuery.toUpperCase();
    const matchesText = billNumber.includes(searchUpper) || itemsString.includes(searchUpper);

    // 2. Date Search
    let matchesDate = true;
    if (searchDate) {
      const d = new Date(order.created_at);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const orderDateStr = `${yyyy}-${mm}-${dd}`; // Converts to YYYY-MM-DD
      
      matchesDate = orderDateStr === searchDate;
    }

    return matchesText && matchesDate;
  });

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-gray-400" size={40} /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 print:h-auto print:min-h-0 print:bg-white">
      <div className="p-4 md:p-6 max-w-4xl mx-auto pb-24 print:hidden">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Bill History</h1>

        {/* NEW: SEARCH AND DATE FILTER UI */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search Bill # or items..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black outline-none text-gray-800 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-3.5 text-gray-400 pointer-events-none">
              <Calendar size={20} />
            </div>
            <input 
              type="date" 
              className="w-full sm:w-auto pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-black outline-none text-gray-700 h-full min-h-[48px] shadow-sm cursor-pointer"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            {searchDate && (
              <button 
                onClick={() => setSearchDate('')} 
                className="absolute right-3 top-3.5 text-gray-400 hover:text-black transition-colors bg-white"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {displayOrders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500 shadow-sm">
              <FileText className="mx-auto mb-3 text-gray-300" size={48} />
              {orders.length === 0 ? "No bills generated yet." : "No bills found matching your search."}
            </div>
          ) : (
            displayOrders.map((order) => {
              const itemsList = order.order_items || [];
              return (
                <div key={order.id} onClick={() => handleViewBill(order)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 transition-colors cursor-pointer active:scale-[0.99]">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Bill #{order.order_number || order.id.slice(0,6).toUpperCase()}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1 gap-1">
                        <Calendar size={12} />
                        {new Date(order.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-lg text-gray-900">₹{Number(order.total).toFixed(2)}</span>
                      <p className="text-xs text-green-600 font-semibold uppercase">{order.payment_method}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-600 flex justify-between items-center">
                    <span className="truncate pr-4">{itemsList.length > 0 ? itemsList.map((i: any) => i.product_name).join(', ') : <span className="text-red-400">Empty</span>}</span>
                    <span className="text-black font-medium text-xs bg-white px-2 py-1 rounded-md shadow-sm whitespace-nowrap">View Bill</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RECEIPT MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 print:static print:block print:bg-transparent print:p-0">
          <ReceiptModal 
            order={selectedOrder} 
            shopName={shopName} 
            shopAddress={shopAddress}
            shopPhone={shopPhone}
            onClose={() => setSelectedOrder(null)} 
            onEdit={handleEditClick} 
          />
        </div>
      )}

      {/* CUSTOM EDIT CONFIRMATION MODAL */}
      {orderToEdit && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Edit this bill?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              This will move the items back to your cart so you can modify them. <br/><br/>
              <strong>Bill #{orderToEdit.order_number || orderToEdit.id.slice(0,6).toUpperCase()}</strong> will be updated without changing its number.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setOrderToEdit(null)} 
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={confirmEditAction} 
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
              >
                Yes, Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}