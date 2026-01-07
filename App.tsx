
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, HalalStatus, Category } from './types.ts';
import { CATEGORIES, INITIAL_PRODUCTS } from './constants.ts';
import { analyzeProductWithAI, analyzeProductImage } from './services/geminiService.ts';
import ProductCard from './components/ProductCard.tsx';
import ProductModal from './components/ProductModal.tsx';
import AIChatAssistant from './components/AIChatAssistant.tsx';

type Language = 'ru' | 'en' | 'ky' | 'kk' | 'ar';

const translations = {
  ru: {
    appName: 'HALAL HARAM',
    tagline: 'Путеводитель Мусульманина',
    searchPlaceholder: 'Продукт, бренд или E-код...',
    find: 'Проверить в Базе',
    analyzing: 'Сканирую библиотеку знаний...',
    database: 'В базе: {count} продуктов',
    errorMsg: 'Не удалось проанализировать продукт. Попробуйте позже.',
    noResults: 'Продукт не найден в локальной базе',
    categories: { all: 'Все', snacks: 'Снеки', sweets: 'Сладости', drinks: 'Напитки', dairy: 'Молочное', meat: 'Мясное', favs: 'Избранное', 'e-numbers': 'E-коды', sauces: 'Соусы', frozen: 'Заморозка', bakery: 'Выпечка', baby: 'Детское' },
    status: { HALAL: 'ХАЛЯЛЬ', HARAM: 'ХАРАМ', MUSHBOOH: 'СОМНИТЕЛЬНО' }
  },
  ky: {
    appName: 'HALAL HARAM',
    tagline: 'Мусулмандын жол көрсөткүчү',
    searchPlaceholder: 'Продукт, бренди же E-код...',
    find: 'Базадан издөө',
    analyzing: 'Билим базасынан издөөдө...',
    database: 'Базада: {count} продукт',
    errorMsg: 'Ката кетти. Кийинчерээк кайталаңыз.',
    noResults: 'Табылган жок',
    categories: { all: 'Бардыгы', snacks: 'Снектер', sweets: 'Таттуулар', drinks: 'Суусундуктар', dairy: 'Сүт азыктары', meat: 'Эт азыктары', favs: 'Тандалгандар', 'e-numbers': 'E-коддор', sauces: 'Соустар', frozen: 'Заморозка', bakery: 'Нан азыктары', baby: 'Балдар үчүн' },
    status: { HALAL: 'ХАЛАЛ', HARAM: 'ХАРАМ', MUSHBOOH: 'КҮМӨН' }
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('halal_lang') as Language) || 'ru');
  const t = (translations as any)[lang] || translations.ru;
  
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('halal_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('halal_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('halal_products', JSON.stringify(products));
    localStorage.setItem('halal_favorites', JSON.stringify(favorites));
    localStorage.setItem('halal_lang', lang);
  }, [products, favorites, lang]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory === 'favs') {
      result = products.filter(p => favorites.includes(p.id));
    } else if (selectedCategory !== 'all') {
      result = products.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    return result;
  }, [products, searchQuery, selectedCategory, favorites]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSearching(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        const aiProduct = await analyzeProductImage(base64Data);
        if (aiProduct) {
          const newProduct = aiProduct as Product;
          setProducts(prev => [newProduct, ...prev]);
          setSelectedProduct(newProduct);
        } else {
          setError(t.errorMsg);
        }
      } catch (err) {
        setError(t.errorMsg);
      } finally {
        setIsSearching(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setError(null);
    try {
      const aiProduct = await analyzeProductWithAI(query);
      if (aiProduct) {
        const newProduct = aiProduct as Product;
        setProducts(prev => [newProduct, ...prev]);
        setSelectedProduct(newProduct);
      } else {
        setError(t.errorMsg);
      }
    } catch (err) {
      setError(t.errorMsg);
    } finally {
      setIsSearching(false);
    }
  };

  const categoriesWithFav = useMemo(() => {
    return [...CATEGORIES, { id: 'favs', name: 'favs', icon: '❤️' }];
  }, []);

  return (
    <div className={`min-h-screen bg-[#022c22] islamic-pattern text-emerald-50 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <header className="relative bg-[#064e3b] pt-16 pb-40 px-6 ogee-arch mx-auto max-w-[98%] shadow-oriental border-b-2 border-yellow-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col items-center">
           <div className="text-7xl mb-6 text-yellow-400 animate-float drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]">🌙</div>
           <h1 className="text-4xl md:text-6xl font-black gold-text font-islamic tracking-tight mb-4 text-center uppercase">{t.appName}</h1>
           
           <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['ru', 'ky', 'kk', 'en', 'ar'].map(l => (
                <button key={l} onClick={() => setLang(l as Language)} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest gold-border transition-all ${lang === l ? 'bg-yellow-400 text-emerald-950 scale-110' : 'bg-emerald-900/50 hover:bg-emerald-800'}`}>
                  {l}
                </button>
              ))}
           </div>

           <div className="w-full max-w-xl">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-emerald-900/90 text-white px-8 py-5 rounded-[2.5rem] gold-border outline-none focus:ring-4 focus:ring-yellow-400/10 transition-all text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                />
                <button onClick={() => fileInputRef.current?.click()} className="absolute right-6 top-1/2 -translate-y-1/2 text-yellow-400 hover:scale-125 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
              <button onClick={() => handleSearch(searchQuery)} className="w-full mt-4 bg-yellow-400 text-emerald-950 font-black py-4 rounded-[2rem] shadow-2xl hover:bg-yellow-300 transition-all uppercase tracking-widest border-b-4 border-yellow-600">
                {isSearching ? t.analyzing : t.find}
              </button>
              {error && <p className="text-red-400 text-center mt-4 text-xs font-bold animate-pulse">{error}</p>}
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-10">
          {categoriesWithFav.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)} 
              className={`flex flex-col items-center justify-center gap-1 p-3 rounded-[1.5rem] font-black transition-all gold-border group ${selectedCategory === cat.id ? 'bg-yellow-400 text-emerald-950 scale-105' : 'bg-emerald-900/90 hover:bg-emerald-800'}`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="whitespace-nowrap uppercase text-[7px] tracking-widest text-center">{t.categories[cat.id] || cat.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <ProductCard 
              key={p.id}
              product={p} 
              isFavorite={favorites.includes(p.id)}
              onClick={setSelectedProduct} 
              onToggleFavorite={(e) => {
                e.stopPropagation();
                setFavorites(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]);
              }}
              statusLabel={t.status[p.status] || p.status}
            />
          ))}
        </div>
      </main>

      <footer className="mt-40 bg-emerald-950/80 p-10 text-center border-t-2 border-yellow-500/10">
        <p className="gold-text text-2xl font-islamic mb-2">{t.appName}</p>
        <p className="text-[10px] text-emerald-400/50 uppercase tracking-[0.3em]">Built by Orozbekov Sultan</p>
      </footer>

      <ProductModal 
        product={selectedProduct} 
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)} 
        onToggleFavorite={(p) => setFavorites(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])}
        statusLabel={selectedProduct ? (t.status[selectedProduct.status] || selectedProduct.status) : ''}
      />
      <AIChatAssistant lang={lang} />
    </div>
  );
};

export default App;
