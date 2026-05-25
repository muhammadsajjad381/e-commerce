
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, Grid3X3, List,
  X, ChevronDown, Star, RotateCcw, Loader2,
} from 'lucide-react';
import ProductCard, { ProductCardSkeleton, cardVariants } from './ProductCard';
import type { Product, ProductFilters } from '../../types';
import api from '../../lib/api';

const gridContainerVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity:    1,
    transition: {
      staggerChildren:  0.07,
      delayChildren:    0.1,
      when: 'beforeChildren',
    },
  },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};
const filterPanelVariants = {
  hidden:  { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { x: '-100%', opacity: 0, transition: { duration: 0.25 } },
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];
const MOCK_PRODUCTS: Product[] = Array.from({ length: 12 }, (_, i) => ({
  _id:          `mock-${i}`,
  slug:         `product-${i + 1}`,
  title:        [
    'Ethereal Noise-Cancelling Headphones',
    'Quantum Mechanical Keyboard',
    'NovaSkin Ultra Smartphone',
    'Apex Ultrawide Gaming Monitor',
    'CyberFrame Laptop Stand Pro',
    'Obsidian Wireless Earbuds',
    'Lumix 4K Webcam Elite',
    'ZenPad Drawing Tablet',
    'HyperCharge 140W Dock',
    'CloudSync SSD 2TB',
    'PrismRGB Mouse Pad XL',
    'Stealth USB-C Hub 12-in-1',
  ][i],
  description:  'Premium quality product with advanced features.',
  vendor:       { _id: 'v1', storeName: 'TechNova', rating: 4.8, isVerified: true } as any,
  category:     { _id: 'c1', name: 'Electronics', slug: 'electronics' } as any,
  tags:         ['tech', 'premium'],
  images:       [`https://picsum.photos/seed/${i + 10}/800/1000`],
  thumbnail:    `https://picsum.photos/seed/${i + 10}/800/1000`,
  attributes: [
    {
      name: 'Color',
      type: 'swatch' as const,
      values: [
        { value: 'black',  label: 'Midnight Black', hex: '#09090b' },
        { value: 'silver', label: 'Brushed Silver',  hex: '#a1a1aa' },
        { value: 'indigo', label: 'Electric Indigo',  hex: '#6366f1' },
      ],
    },
  ],
  variants: [
    {
      _id:            `var-${i}-1`,
      sku:            `PRD-${i}-BLK`,
      attributes:     { Color: 'black' },
      price:          Math.floor(Math.random() * 80000) + 5000,
      compareAtPrice: Math.random() > 0.4 ? Math.floor(Math.random() * 100000) + 90000 : undefined,
      stock:          Math.floor(Math.random() * 20),
      reserved:       0,
      available:      Math.floor(Math.random() * 20),
    },
    {
      _id:            `var-${i}-2`,
      sku:            `PRD-${i}-SLV`,
      attributes:     { Color: 'silver' },
      price:          Math.floor(Math.random() * 80000) + 5000,
      compareAtPrice: undefined,
      stock:          Math.floor(Math.random() * 10),
      reserved:       0,
      available:      Math.floor(Math.random() * 10),
    },
  ],
  basePrice:    0,
  rating:       parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
  reviewCount:  Math.floor(Math.random() * 500) + 10,
  isFeatured:   i < 3,
  isPublished:  true,
  status:       'active' as const,
  createdAt:    new Date().toISOString(),
  updatedAt:    new Date().toISOString(),
}));


interface ProductGridProps {
  categoryId?: string;
  vendorId?:   string;
  title?:      string;
  useMockData?: boolean;  // For demo/offline mode
}

const ProductGrid: React.FC<ProductGridProps> = ({
  categoryId,
  vendorId,
  title = 'All Products',
  useMockData = false,  // Use real API data
}) => {
  const [products,       setProducts]       = useState<Product[]>([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [error,          setError]          = useState<string | null>(null);
  const [layout,         setLayout]         = useState<'grid' | 'list'>('grid');
  const [filterOpen,     setFilterOpen]     = useState(false);
  const [totalPages,     setTotalPages]     = useState(1);

  const [filters, setFilters] = useState<ProductFilters>({
    search:   '',
    priceMin: 0,
    priceMax: 200000,
    sort:     'newest',
    page:     1,
    limit:    12,
    rating:   0,
    category: categoryId,
  });

  const [localSearch, setLocalSearch]   = useState('');
  const [sortOpen,    setSortOpen]      = useState(false);
  const [priceRange,  setPriceRange]    = useState([0, 200000]);

  const debouncedSearch = useDebounce(localSearch, 400);
  const sortRef         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (useMockData) {
    
      await new Promise((r) => setTimeout(r, 800));
      let filtered = [...MOCK_PRODUCTS];

      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(q));
      }
      if (filters.rating) {
        filtered = filtered.filter((p) => p.rating >= (filters.rating ?? 0));
      }
      if (filters.sort === 'price_asc')  filtered.sort((a, b) => a.basePrice - b.basePrice);
      if (filters.sort === 'price_desc') filtered.sort((a, b) => b.basePrice - a.basePrice);
      if (filters.sort === 'rating')     filtered.sort((a, b) => b.rating - a.rating);

      setProducts(filtered);
      setTotalPages(Math.ceil(filtered.length / (filters.limit || 12)));
      setIsLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== 0) {
          params.set(k, String(v));
        }
      });
      if (priceRange[0] > 0)       params.set('priceMin', String(priceRange[0]));
      if (priceRange[1] < 200000)  params.set('priceMax', String(priceRange[1]));

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.data);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, priceRange, useMockData]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Helpers ──────────────────────────────────────────────
  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const resetFilters = () => {
    setLocalSearch('');
    setPriceRange([0, 200000]);
    setFilters({
      search: '', priceMin: 0, priceMax: 200000,
      sort: 'newest', page: 1, limit: 12, rating: 0, category: categoryId,
    });
  };

  const currentSort = SORT_OPTIONS.find((o) => o.value === filters.sort) ?? SORT_OPTIONS[0];


  return (
    <section id="product-grid-section" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">{title}</h2>
          {!isLoading && (
            <p className="text-sm text-zinc-500 mt-0.5">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              id="product-search-input"
              type="text"
              placeholder="Search products…"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-xl
                         bg-zinc-900 border border-zinc-800
                         text-zinc-200 placeholder-zinc-600
                         focus:outline-none focus:border-indigo-500
                         focus:ring-1 focus:ring-indigo-500/30
                         transition-all duration-200 w-48 md:w-64"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div ref={sortRef} className="relative">
            <button
              id="sort-dropdown-btn"
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl
                         bg-zinc-900 border border-zinc-800 text-zinc-300
                         hover:border-zinc-600 transition-colors duration-200"
            >
              <span className="hidden sm:inline">{currentSort.label}</span>
              <span className="sm:hidden">Sort</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 z-30 w-52
                             bg-zinc-900 border border-zinc-800 rounded-xl
                             shadow-2xl overflow-hidden"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      id={`sort-${opt.value}`}
                      onClick={() => { updateFilter('sort', opt.value); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm
                                 transition-colors duration-150
                                 ${filters.sort === opt.value
                                   ? 'bg-indigo-600/20 text-indigo-400'
                                   : 'text-zinc-300 hover:bg-zinc-800'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Toggle */}
          <button
            id="filter-panel-toggle"
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl
                       bg-zinc-900 border border-zinc-800 text-zinc-300
                       hover:border-indigo-500/50 hover:text-indigo-400
                       transition-colors duration-200"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filters</span>
          </button>

          {/* Layout Toggle */}
          <div className="hidden sm:flex items-center gap-1
                          bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            <button
              id="layout-grid-btn"
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors duration-150
                         ${layout === 'grid' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Grid3X3 size={14} />
            </button>
            <button
              id="layout-list-btn"
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-lg transition-colors duration-150
                         ${layout === 'list' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <AnimatePresence>
          {filterOpen && (
            <motion.aside
              variants={filterPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              id="filter-sidebar"
              className="hidden lg:block w-64 flex-shrink-0"
            >
              <div className="sticky top-24 rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-200">Filters</span>
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
                  >
                    <RotateCcw size={11} />
                    Reset
                  </button>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Price Range
                  </label>
                  <div className="space-y-2.5">
                    <input
                      id="price-range-slider"
                      type="range"
                      min={0}
                      max={200000}
                      step={1000}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>PKR {priceRange[0].toLocaleString()}</span>
                      <span>PKR {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Min Rating */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Minimum Rating
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[0, 3, 3.5, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        id={`rating-filter-${r}`}
                        onClick={() => updateFilter('rating', r === filters.rating ? 0 : r)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                                   border transition-all duration-150
                                   ${filters.rating === r
                                     ? 'bg-indigo-600 border-indigo-500 text-white'
                                     : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
                      >
                        <Star size={10} className="fill-current" />
                        {r === 0 ? 'All' : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply */}
                <button
                  id="apply-filters-btn"
                  onClick={fetchProducts}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white
                             text-sm font-semibold rounded-xl transition-colors duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {filterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={() => setFilterOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="lg:hidden fixed bottom-0 inset-x-0 z-50 rounded-t-3xl
                           bg-zinc-900 border-t border-zinc-800 p-6 space-y-5
                           max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-semibold text-zinc-200">Filters</span>
                  <button onClick={() => setFilterOpen(false)}>
                    <X size={20} className="text-zinc-400" />
                  </button>
                </div>
                <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto" />

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Max Price: PKR {priceRange[1].toLocaleString()}
                  </label>
                  <input
                    type="range" min={0} max={200000} step={1000}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Min Rating
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 3, 3.5, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => updateFilter('rating', r === filters.rating ? 0 : r)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border
                                   ${filters.rating === r
                                     ? 'bg-indigo-600 border-indigo-500 text-white'
                                     : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                      >
                        <Star size={10} className="fill-current" />
                        {r === 0 ? 'All' : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={resetFilters}
                    className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm">
                    Reset
                  </button>
                  <button onClick={() => { fetchProducts(); setFilterOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">
                    Apply
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 min-w-0">
          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
                <X size={24} className="text-rose-500" />
              </div>
              <p className="text-zinc-400 text-sm">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-sm hover:bg-zinc-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {isLoading && (
            <motion.div
              className={`grid gap-4
                ${layout === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'}`}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {!isLoading && !error && products.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                <Search size={32} className="text-zinc-600" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-300">No products found</h3>
              <p className="text-zinc-500 text-sm max-w-xs">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold
                           hover:bg-indigo-500 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}

          {/* Product Grid with stagger */}
          {!isLoading && !error && products.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${filters.sort}-${filters.page}-${layout}`}
                variants={gridContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`grid gap-4
                  ${layout === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'}`}
              >
                {products.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    priority={index < 4}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {totalPages > 1 && !isLoading && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                id="pagination-prev"
                disabled={(filters.page ?? 1) <= 1}
                onClick={() => updateFilter('page', (filters.page ?? 1) - 1)}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 text-sm
                           disabled:opacity-30 hover:border-zinc-600 transition-colors"
              >
                ← Prev
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const pg = i + 1;
                const isActive = pg === (filters.page ?? 1);
                return (
                  <motion.button
                    key={pg}
                    id={`pagination-page-${pg}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateFilter('page', pg)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors duration-150
                               ${isActive
                                 ? 'bg-indigo-600 text-white'
                                 : 'border border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
                  >
                    {pg}
                  </motion.button>
                );
              })}

              <button
                id="pagination-next"
                disabled={(filters.page ?? 1) >= totalPages}
                onClick={() => updateFilter('page', (filters.page ?? 1) + 1)}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 text-sm
                           disabled:opacity-30 hover:border-zinc-600 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
