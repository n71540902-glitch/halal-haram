
import React from 'react';
import { Product, HalalStatus } from '../types.ts';

interface ProductModalProps {
  product: Product | null;
  isFavorite: boolean;
  statusLabel: string;
  onClose: () => void;
  onToggleFavorite: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isFavorite, statusLabel, onClose, onToggleFavorite }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-xl overflow-y-auto">
      <div className="bg-[#042f24] rounded-[3.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-500 gold-border islamic-pattern">
        
        <div className="absolute top-8 right-8 z-30 flex gap-3">
          <button onClick={() => onToggleFavorite(product)} className="bg-emerald-900/90 p-4 rounded-full shadow-xl text-emerald-200 hover:scale-110 transition-transform gold-border">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 ${isFavorite ? 'text-red-500 fill-red-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button onClick={onClose} className="bg-emerald-900/90 p-4 rounded-full shadow-xl text-emerald-200 hover:scale-110 transition-transform gold-border">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="h-96 sm:h-[450px] w-full overflow-hidden relative ogee-arch mx-auto mt-4 max-w-[96%] border-2 border-yellow-500/20">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#042f24] via-transparent to-transparent"></div>
        </div>

        <div className="p-10 -mt-24 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12">
            <div>
              <p className="text-yellow-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">{product.brand}</p>
              <h2 className="text-5xl sm:text-6xl font-bold text-white font-islamic leading-tight">{product.name}</h2>
            </div>
            <div className={`px-12 py-5 rounded-[2.5rem] border-2 font-black text-xs tracking-[0.3em] shadow-oriental ${
              product.status === HalalStatus.HALAL ? 'bg-emerald-700/80 border-emerald-400 text-white' :
              product.status === HalalStatus.HARAM ? 'bg-red-900/80 border-red-500 text-white' : 'bg-amber-700/80 border-amber-400 text-white'
            }`}>
              {statusLabel}
            </div>
          </div>

          <div className="space-y-12">
            {product.isBoycotted && (
              <section className="bg-red-950/40 border-2 border-red-500/30 p-8 rounded-[3rem] shadow-oriental">
                <h4 className="text-red-400 font-black text-xs mb-4 uppercase flex items-center gap-3 tracking-[0.2em]">
                  <span className="text-3xl">🚫</span> BOYCOTT ADVISORY
                </h4>
                <p className="text-red-100/70 text-sm leading-relaxed font-semibold italic">
                  {product.boycottReason}
                </p>
              </section>
            )}

            <section>
              <h4 className="text-[11px] font-black text-yellow-500/40 uppercase tracking-[0.5em] mb-6">Product Ingredients</h4>
              <div className="flex flex-wrap gap-3">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="px-6 py-2.5 bg-emerald-900/40 text-emerald-100 rounded-full text-[11px] font-bold border border-yellow-500/20 shadow-sm hover:border-yellow-400 transition-colors italic">
                    {ing}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-emerald-950/60 p-10 rounded-[3rem] border-2 border-yellow-500/10 shadow-oriental relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="currentColor" className="text-yellow-400"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z"/></svg>
              </div>
              <h4 className="font-black text-yellow-400 mb-6 flex items-center gap-4 text-xs uppercase tracking-[0.3em]">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.312-2.841.873-4.085m1.542 11.225c.66-1.438 1.585-2.744 2.737-3.869" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Scholarly Verdict
              </h4>
              <p className="text-emerald-50/90 font-medium text-base leading-relaxed italic">
                {product.explanation}
              </p>
            </section>

            {product.religiousReference && (
              <section className="border-l-8 border-yellow-500 pl-10 py-4 bg-yellow-500/5 rounded-r-[3rem] pr-8 shadow-oriental">
                <h4 className="font-black text-yellow-500 text-[10px] mb-4 uppercase tracking-[0.4em]">Spiritual Guidance</h4>
                <p className="text-white font-islamic text-3xl sm:text-4xl leading-relaxed italic opacity-90">
                  {product.religiousReference}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
