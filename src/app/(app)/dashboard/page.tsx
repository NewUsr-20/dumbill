'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, TrendingUp, Receipt, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  
  // Stats state
  const [todaySales, setTodaySales] = useState(0);
  const [billsCount, setBillsCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Get the current user and their shop
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: shop } = await supabase
          .from('shops')
          .select('id, name')
          .eq('owner_id', user.id)
          .single();

        if (!shop) throw new Error("Shop not found");

        // 2. Calculate "Today's" date boundaries
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

        // 3. Fetch today's orders
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('shop_id', shop.id)
          .gte('created_at', today.toISOString())
          .lt('created_at', tomorrow.toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;

        // 4. Calculate stats
        const total = orders.reduce((sum, order) => sum + Number(order.total), 0);
        setTodaySales(total);
        setBillsCount(orders.length);
        setRecentOrders(orders.slice(0, 5)); // Just keep the 5 most recent for the list

      } catch (error: any) {
        toast.error('Failed to load dashboard: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Today's Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <IndianRupee size={18} />
            <span className="font-medium text-sm">Today's Sales</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">₹{todaySales.toFixed(2)}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Receipt size={18} />
            <span className="font-medium text-sm">Bills Today</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{billsCount}</p>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} /> Recent Transactions
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No bills generated today yet.
            </div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-bold text-gray-800">Bill #{order.order_number || order.id.slice(0,6).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • {order.payment_method}
                  </p>
                </div>
                <div className="font-bold text-lg text-green-600">
                  +₹{Number(order.total).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}