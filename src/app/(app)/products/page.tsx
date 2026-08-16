'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Plus, Trash2, Pencil, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ManageMenuPage() {
  const supabase = createClient();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data States
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [shopId, setShopId] = useState<string | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  // Edit State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuData();
  }, []);

  async function fetchMenuData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get Shop ID
      const { data: shop } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!shop) throw new Error("Shop not found");
      setShopId(shop.id);

      // Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('shop_id', shop.id);
      if (catError) throw catError;
      
      // Deduplicate categories (in case of legacy duplicate data)
      const uniqueCategories: any[] = [];
      const seenNames = new Set();
      (catData || []).forEach((cat) => {
        const lowerName = cat.name.toLowerCase().trim();
        if (!seenNames.has(lowerName)) {
          seenNames.add(lowerName);
          uniqueCategories.push(cat);
        }
      });
      setCategories(uniqueCategories);
      if (uniqueCategories.length > 0) {
        setCategoryId(uniqueCategories[0].id);
      }

      // Fetch Products
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shop.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
        
      if (prodError) throw prodError;
      setProducts(prodData || []);

    } catch (error: any) {
      toast.error('Failed to load menu: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // CREATE OR UPDATE PRODUCT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId || !shopId) {
      toast.error("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingProductId) {
        // UPDATE EXISTING ITEM
        const { error } = await supabase
          .from('products')
          .update({
            name: name,
            price: Number(price),
            category_id: categoryId
          })
          .eq('id', editingProductId);

        if (error) throw error;
        toast.success("Item updated successfully!");
      } else {
        // ADD NEW ITEM
        const { error } = await supabase
          .from('products')
          .insert({
            shop_id: shopId,
            name: name,
            price: Number(price),
            category_id: categoryId,
            is_active: true
          });

        if (error) throw error;
        toast.success("Item added successfully!");
      }

      // Reset form
      setName('');
      setPrice('');
      setEditingProductId(null);
      fetchMenuData(); // Refresh list

    } catch (error: any) {
      toast.error(error.message || "Failed to save item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // PREPARE ITEM FOR EDITING
  const handleEditClick = (product: any) => {
    setEditingProductId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setCategoryId(product.category_id);
    
    // Scroll to the top to see the form on mobile devices
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CANCEL EDITING
  const cancelEdit = () => {
    setEditingProductId(null);
    setName('');
    setPrice('');
  };

  // DELETE PRODUCT (Soft delete by setting is_active = false)
  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this item?");
    if (!confirm) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      toast.success("Item deleted.");
      
      // If we deleted the item we were currently editing, cancel the edit
      if (editingProductId === id) {
        cancelEdit();
      }
      
      fetchMenuData();
    } catch (error: any) {
      toast.error("Failed to delete item.");
    }
  };

  // ADD NEW CATEGORY
  const handleAddCategory = async () => {
    const newCat = window.prompt("Enter new category name:");
    if (!newCat || !newCat.trim() || !shopId) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ shop_id: shopId, name: newCat.trim() })
        .select()
        .single();

      if (error) throw error;
      
      toast.success("Category added!");
      setCategories([...categories, data]);
      setCategoryId(data.id); // Auto-select the new category
    } catch (error: any) {
      toast.error("Failed to add category.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4 md:p-6 sticky top-0 bg-gray-50 z-10">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Manage Menu</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6">
        
        {/* ADD / EDIT FORM */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 transition-all">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {editingProductId ? 'Edit Item' : 'Add New Item'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="text" 
              placeholder="Item Name (e.g. Masala Tea)" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-black transition-colors"
            />
            
            <input 
              type="number" 
              placeholder="Price (₹)" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-black transition-colors"
            />

            <div className="flex gap-2">
              <select 
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-black transition-colors appearance-none"
              >
                {categories.length === 0 && <option value="" disabled>No categories available</option>}
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              
              <button 
                type="button" 
                onClick={handleAddCategory}
                className="w-12 flex-shrink-0 bg-gray-100 text-black rounded-xl flex items-center justify-center font-bold hover:bg-gray-200 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              {editingProductId && (
                <button 
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold flex justify-center items-center hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] bg-black text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-75"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  editingProductId ? 'Update Item' : <><Plus size={20} /> Add to Menu</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* CURRENT MENU LIST */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Current Menu</h2>
        
        <div className="space-y-3">
          {products.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500 shadow-sm">
              Your menu is empty. Add your first item above!
            </div>
          ) : (
            products.map((product) => {
              // Find category name for the badge
              const catName = categories.find(c => c.id === product.category_id)?.name || 'Uncategorized';
              const isCurrentlyEditing = editingProductId === product.id;

              return (
                <div 
                  key={product.id} 
                  className={`bg-white p-4 rounded-2xl shadow-sm border transition-colors flex justify-between items-center ${
                    isCurrentlyEditing ? 'border-black ring-1 ring-black' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-gray-700">₹{product.price}</span>
                      <span className="text-gray-300">•</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                        {catName}
                      </span>
                    </div>
                  </div>
                  
                  {/* ACTIONS: Edit & Delete */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="p-2.5 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                      title="Edit Item"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}