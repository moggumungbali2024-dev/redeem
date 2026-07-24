import React, { useState } from 'react';
import { Coupon } from '../types';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';

interface VisualCouponEditorProps {
  coupons: Coupon[];
  onChange: (updated: Coupon[]) => void;
  lang?: 'en' | 'ko' | 'id'; // Optional current language for UI
}

export function VisualCouponEditor({ coupons, onChange, lang = 'en' }: VisualCouponEditorProps) {
  const [showJsonMode, setShowJsonMode] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [titleStr, setTitleStr] = useState('');
  const [type, setType] = useState<'free' | 'redeem' | 'event'>('free');
  const [cost, setCost] = useState<number>(500);

  const resetForm = () => {
    setCode('');
    setTitleStr('');
    setType('free');
    setCost(500);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !titleStr) return;

    const newCoupon: Coupon = {
      id: editingId || 'c_' + Date.now(),
      type,
      title: { ko: titleStr, en: titleStr, id: titleStr },
      code: code.toUpperCase(),
      ...(type === 'redeem' ? { cost: Number(cost) || 0 } : {})
    };

    let updated: Coupon[];
    if (editingId) {
      updated = (coupons || []).map(c => c.id === editingId ? newCoupon : c);
    } else {
      updated = [...(coupons || []), newCoupon];
    }
    onChange(updated);
    resetForm();
  };

  const handleStartEdit = (c: Coupon) => {
    setEditingId(c.id);
    setCode(c.code);
    setTitleStr(typeof c.title === 'string' ? c.title : (c.title?.id || c.title?.en || c.title?.ko || ''));
    setType(c.type || 'free');
    setCost(c.cost || 500);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus kupon/voucher ini?')) {
      onChange((coupons || []).filter(c => c.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-3 border-4 border-black rounded-2xl p-4 bg-[#FFF8F0] text-black">
      <div className="flex justify-between items-center border-b-2 border-black/10 pb-2">
        <div>
          <h4 className="font-black text-sm uppercase flex items-center gap-1.5">
            🎫 Vouchers & Coupons ({coupons?.length || 0})
          </h4>
          <p className="text-[11px] font-bold text-stone-500">Kelola kupon yang tersedia untuk partner ini</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowJsonMode(!showJsonMode)}
            className="text-[11px] font-black underline text-stone-600 hover:text-black"
          >
            {showJsonMode ? 'Visual Mode' : 'JSON Mode'}
          </button>
          {!showJsonMode && !isAdding && (
            <button
              type="button"
              onClick={() => { resetForm(); setIsAdding(true); }}
              className="bg-[#FDD835] border-2 border-black px-2.5 py-1 rounded-xl font-black text-xs uppercase flex items-center gap-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
            >
              <Plus size={14} strokeWidth={3} /> Tambah Voucher
            </button>
          )}
        </div>
      </div>

      {showJsonMode ? (
        <textarea
          value={JSON.stringify(coupons || [], null, 2)}
          onChange={e => {
            try {
              onChange(JSON.parse(e.target.value));
            } catch (err) { /* ignore while typing */ }
          }}
          className="border-2 border-black rounded-xl p-3 font-mono text-xs h-36 bg-white"
        />
      ) : (
        <>
          {isAdding && (
            <div className="bg-white border-2 border-black rounded-xl p-3 flex flex-col gap-3 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center">
                <span className="font-black text-xs uppercase">{editingId ? 'Edit Voucher' : 'Voucher Baru'}</span>
                <button type="button" onClick={resetForm} className="text-stone-500 hover:text-black"><X size={14} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black uppercase block">Kode Voucher *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="MOGGU-DISCOUNT"
                    className="w-full border-2 border-black p-2 rounded-lg text-xs font-mono font-bold uppercase bg-[#FFF8F0]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase block">Judul / Deskripsi Voucher *</label>
                  <input
                    type="text"
                    required
                    value={titleStr}
                    onChange={e => setTitleStr(e.target.value)}
                    placeholder="Diskon 10% Semua Menu"
                    className="w-full border-2 border-black p-2 rounded-lg text-xs font-bold bg-[#FFF8F0]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black uppercase block">Tipe Voucher</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full border-2 border-black p-2 rounded-lg text-xs font-bold bg-[#FFF8F0]"
                  >
                    <option value="free">Free / Diskon Langsung</option>
                    <option value="redeem">Redeem Poin (Point Voucher)</option>
                    <option value="event">Event Special</option>
                  </select>
                </div>
                {type === 'redeem' && (
                  <div>
                    <label className="text-[10px] font-black uppercase block">Biaya Poin (PTS)</label>
                    <input
                      type="number"
                      value={cost}
                      onChange={e => setCost(parseInt(e.target.value) || 0)}
                      placeholder="500"
                      className="w-full border-2 border-black p-2 rounded-lg text-xs font-bold bg-[#FFF8F0]"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-1">
                <button type="button" onClick={resetForm} className="px-3 py-1.5 border-2 border-black rounded-lg text-xs font-bold hover:bg-stone-100">Batal</button>
                <button type="button" onClick={handleSaveCoupon} className="px-3 py-1.5 border-2 border-black bg-[#1E88E5] text-white rounded-lg text-xs font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">{editingId ? 'Simpan' : 'Tambah'}</button>
              </div>
            </div>
          )}

          {(!coupons || coupons.length === 0) ? (
            <div className="text-center py-4 text-xs font-bold text-stone-400 border-2 border-dashed border-stone-300 rounded-xl bg-white">
              Belum ada voucher. Klik "+ Tambah Voucher" di atas.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {coupons.map(c => {
                const titleText = typeof c.title === 'string' ? c.title : (c.title?.[lang] || c.title?.['id'] || c.title?.['en'] || c.title?.['ko'] || '');
                return (
                  <div key={c.id} className="bg-white border-2 border-black rounded-xl p-2.5 flex items-center justify-between shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#FDD835] border border-black font-mono font-black text-xs px-2 py-0.5 rounded-md">{c.code}</span>
                      <div className="text-left">
                        <p className="font-black text-xs text-black">{titleText}</p>
                        <p className="text-[10px] font-bold text-stone-500 uppercase">{c.type} {c.type === 'redeem' ? `• ${c.cost} PTS` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => handleStartEdit(c)} className="p-1 border border-black rounded bg-stone-50 hover:bg-stone-100"><Edit2 size={12} /></button>
                      <button type="button" onClick={() => handleDelete(c.id)} className="p-1 border border-black rounded bg-rose-50 text-rose-700 hover:bg-rose-100"><Trash2 size={12} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
