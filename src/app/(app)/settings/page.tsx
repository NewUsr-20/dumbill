'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { User, Store, Mail, Phone, MapPin, FileText, Save, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // User & Shop State
  const [email, setEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      // 1. Get Logged In User's Email
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Not authenticated');
      setEmail(user.email || '');

      // 2. Get Shop Details
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (shop) {
        setShopName(shop.name || '');
        setPhone(shop.phone || '');
        setAddress(shop.address || '');
        setGstNumber(shop.gst_number || '');
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('shops')
        .update({
          name: shopName,
          phone: phone,
          address: address,
          gst_number: gstNumber,
        })
        .eq('owner_id', user.id);

      if (error) throw error;
      toast.success('Shop details updated successfully!');
    } catch (error: any) {
      toast.error('Error saving details: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your profile...</div>;

  // Generate a placeholder logo initial (e.g., "T" for "Tea Shop")
  const shopInitial = shopName ? shopName.charAt(0).toUpperCase() : 'S';

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      {/* PROFILE & LOGO SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-6">
        {/* Dynamic Shop Logo */}
        <div className="h-20 w-20 bg-blue-600 text-white flex items-center justify-center rounded-2xl text-3xl font-extrabold shadow-inner shrink-0">
          {shopInitial}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <h2 className="text-xl font-bold text-gray-900 truncate">
            {shopName || 'My Shop'}
          </h2>
          <div className="flex items-center gap-2 text-gray-500 mt-1 truncate">
            <Mail size={16} className="shrink-0" />
            <span className="text-sm truncate">{email}</span>
          </div>
        </div>
      </div>

      {/* SHOP DETAILS FORM */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Store size={20} className="text-blue-600" /> Shop Information
        </h3>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
            <input 
              type="text" 
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="e.g. Raju Tea Stall"
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Shop Contact Number"
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Address</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Area, City"
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
            <div className="relative">
              <FileText size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input 
                type="text" 
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="22AAAAA0000A1Z5"
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-black focus:bg-white transition-colors uppercase"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full mt-2 bg-black text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : <><Save size={20} /> Save Changes</>}
          </button>
        </form>
      </div>

      {/* LOGOUT BUTTON */}
      <button 
        onClick={handleLogout}
        className="w-full bg-red-50 text-red-600 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors border border-red-100"
      >
        <LogOut size={20} /> Log Out
      </button>
    </div>
  );
}