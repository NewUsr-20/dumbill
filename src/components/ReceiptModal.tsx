'use client';

import { Printer, X, Pencil } from 'lucide-react';

export default function ReceiptModal({ 
  order, 
  shopName, 
  shopAddress, 
  shopPhone, 
  onClose, 
  onEdit 
}: { 
  order: any, 
  shopName: string, 
  shopAddress?: string, 
  shopPhone?: string, 
  onClose: () => void, 
  onEdit?: () => void 
}) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const billNumber = order.order_number || order.id?.slice(0, 6).toUpperCase();

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none print:overflow-visible">
        
        {/* Receipt Content */}
        <div id="print-area" className="p-6 bg-white overflow-y-auto text-black print:p-0 print:overflow-visible">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider">{shopName}</h2>
            
            {/* DYNAMIC SHOP ADDRESS & PHONE */}
            {shopAddress && <p className="text-xs text-gray-600 mt-1 px-4">{shopAddress}</p>}
            {shopPhone && <p className="text-xs text-gray-600 mt-0.5">Phone: {shopPhone}</p>}

            <p className="text-sm text-gray-500 mt-2">Cash Receipt</p>
            <p className="text-base font-bold text-gray-900 mt-1">Bill #{billNumber}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(order.created_at || new Date()).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
            </p>
          </div>

          <div className="border-t border-dashed border-gray-300 my-4"></div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-dashed border-gray-300">
                <th className="pb-2 font-normal">Item</th>
                <th className="pb-2 font-normal text-center">Qty</th>
                <th className="pb-2 font-normal text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="py-2 pr-2">{item.name}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-dashed border-gray-300 my-4"></div>

          <div className="flex justify-between items-center font-bold text-lg">
            <span>TOTAL</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
          
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Thank you!</p>
            <p>Visit Again</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2 print:hidden">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl flex justify-center items-center gap-1 hover:bg-gray-300 transition-colors"
          >
            <X size={18} /> Close
          </button>
          
          {onEdit && (
            <button 
              onClick={onEdit}
              className="flex-1 py-3 bg-blue-100 text-blue-700 font-bold rounded-xl flex justify-center items-center gap-1 hover:bg-blue-200 transition-colors"
            >
              <Pencil size={18} /> Edit
            </button>
          )}

          <button 
            onClick={handlePrint}
            className="flex-1 py-3 bg-black text-white font-bold rounded-xl flex justify-center items-center gap-1 hover:bg-gray-800 transition-colors"
          >
            <Printer size={18} /> Print
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { 
            position: absolute; left: 0; top: 0; width: 100%; 
            margin: 0; padding: 0; overflow: visible !important; max-height: none !important;
          }
        }
      `}} />
    </div>
  );
}