
import React from 'react';
import { Product, HalalStatus } from '../types.ts';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  statusLabel: string;
  onClick: (product: Product) => void;
  onToggleFavorite: (e: React.MouseEvent, product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isFavorite, statusLabel, onClick, onToggleFavorite }) => {
  const getStatusColor = (status: HalalStatus) => {
    switch (status) {
      case HalalStatus.HALAL: return 'bg-emerald-600';
      case HalalStatus.HARAM: return 'bg-red-700';
      case HalalStatus.MUSHBOOH: return 'bg-amber-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div 
      className="bg-[#042f24] rounded-t-[5rem] rounded-b-[2rem] overflow-hidden shadow-oriental hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)] hover:scale-[1.03] transition-all duration-500 cursor-pointer gold-border group relative"
      onClick={() => onClick(product)}
    >
      <button 
        onClick={(e) => onToggleFavorite(e, product)}
        className="absolute top-6 left-6 z-20 p-3 bg-emerald-950/80 backdrop-blur-md rounded-full shadow-lg border border-yellow-500/20 hover:scale-125 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-emerald-200'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {product.isBoycotted && (
        <div className="absolute top-6 right-6 z-20 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl animate-pulse uppercase tracking-[0.1em]">
          BOYCOTT 🚫
        </div>
      )}

      <div className="relative h-64 overflow-hidden ogee-arch mx-2 mt-2 bg-emerald-900 border-b border-yellow-500/20">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
        />
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-[11px] font-black text-white uppercase tracking-[0.2em] ${getStatusColor(product.status)} shadow-2xl border border-white/20 whitespace-nowrap`}>
          {statusLabel}
        </div>
      </div>
      
      <div className="p-7 text-center">
        <p className="text-yellow-500/80 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{product.brand}</p>
        <h3 className="font-bold text-xl text-emerald-50 font-islamic truncate mb-3 group-hover:text-yellow-400 transition-colors tracking-wide">
          {product.name}
        </h3>
        <p className="text-emerald-400/40 text-[11px] mb-6 line-clamp-2 italic leading-relaxed px-4">
          {product.ingredients.join(' • ')}
        </p>
        
        <div className="flex justify-center items-center pt-5 border-t border-yellow-500/10">
          <span className="text-yellow-400 font-black text-[10px] group-hover:scale-110 transition-transform inline-flex items-center gap-3 uppercase tracking-[0.3em]">
            DETAILS <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
