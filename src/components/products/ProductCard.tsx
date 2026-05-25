
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye, Zap, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product, ProductVariant } from '../../types';
import useCartStore from '../../store/cartStore';

const clsx = (...classes: (string | undefined | false | null)[]): string =>
  classes.filter(Boolean).join(' ');

const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);

const discountPercent = (original: number, current: number) =>
  Math.round(((original - current) / original) * 100);

export const ProductCardSkeleton: React.FC = () => (
  <div className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
    <div className="skeleton aspect-[4/5] w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-3 w-2/3 rounded" />
      <div className="skeleton h-5 w-4/5 rounded" />
      <div className="flex gap-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-3 w-10 rounded" />
      </div>
      <div className="skeleton h-10 w-full rounded-xl mt-2" />
    </div>
  </div>
);

const cartBtnVariants = {
  idle:    { scale: 1 },
  hover:   { scale: 1.02, transition: { duration: 0.2 } },
  tap:     { scale: 0.96, transition: { duration: 0.1 } },
  success: {
    scale:           [1, 1.15, 1],
    backgroundColor: ['#6366f1', '#10b981', '#6366f1'],
    transition:      { duration: 0.5, times: [0, 0.5, 1] },
  },
};

export const cardVariants = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity:    1,
    y:          0,
    scale:      1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const heartVariants = {
  unliked: { scale: 1, fill: 'transparent' },
  liked:   { scale: [1, 1.4, 1], fill: '#f43f5e', transition: { duration: 0.35 } },
};

interface ProductCardProps {
  product: Product;
  priority?: boolean; 
}

const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [isWishlisted,    setIsWishlisted]    = useState(false);
  const [cartState,       setCartState]       = useState<'idle' | 'loading' | 'success'>('idle');
  const [isHovered,       setIsHovered]       = useState(false);
  const [mousePos,        setMousePos]        = useState({ x: 50, y: 50 });

  const cardRef = useRef<HTMLDivElement>(null);

  const discount = selectedVariant.compareAtPrice
    ? discountPercent(selectedVariant.compareAtPrice, selectedVariant.price)
    : 0;

  const isLowStock = selectedVariant.available > 0 && selectedVariant.available <= 5;
  const isOutOfStock = selectedVariant.available === 0;
  const colorSwatches = product.attributes.find((a) => a.name === 'Color')?.values || [];
  const sizeOptions   = product.attributes.find((a) => a.name === 'Size')?.values  || [];

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setMousePos({ x, y });
  }, []);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock || cartState === 'loading') return;

    setCartState('loading');

    await new Promise((r) => setTimeout(r, 300));

    addItem(product, selectedVariant, 1);
    setCartState('success');

    // Reset after animation completes
    setTimeout(() => {
      setCartState('idle');
      openCart();
    }, 1200);
  };
  const handleVariantSelect = (color: string) => {
    const matchingVariant = product.variants.find(
      (v) => v.attributes['Color'] === color
    );
    if (matchingVariant) setSelectedVariant(matchingVariant);
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl overflow-hidden
                 bg-zinc-900 border border-zinc-800
                 transition-shadow duration-300
                 hover:border-indigo-500/40
                 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(99,102,241,0.2)]"
      style={{
        '--x': `${mousePos.x}%`,
        '--y': `${mousePos.y}%`,
      } as React.CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(200px circle at ${mousePos.x}% ${mousePos.y}%, rgba(99,102,241,0.08) 0%, transparent 70%)`,
        }}
      />

      <Link to={`/products/${product.slug}`} className="block">
        <div className="product-img-wrapper relative aspect-[4/5] bg-zinc-950 overflow-hidden">
          <motion.img
            src={selectedVariant.imageUrl || product.thumbnail}
            alt={product.title}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.07 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
            {discount > 0 && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full
                           bg-rose-500 text-white text-[11px] font-bold tracking-wide"
              >
                <Zap size={10} />
                -{discount}%
              </motion.span>
            )}
            {product.isFeatured && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/90
                               text-white text-[11px] font-semibold tracking-wide">
                Featured
              </span>
            )}
            {isLowStock && (
              <motion.span
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full
                           bg-amber-500/90 text-white text-[11px] font-semibold"
              >
                <AlertTriangle size={10} />
                {selectedVariant.available} left
              </motion.span>
            )}
            {isOutOfStock && (
              <span className="px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400
                               text-[11px] font-semibold">
                Out of Stock
              </span>
            )}
          </div>

          <motion.button
            id={`wishlist-${product._id}`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full
                       glass flex items-center justify-center
                       opacity-0 group-hover:opacity-100
                       transition-opacity duration-200"
            onClick={(e) => { e.preventDefault(); setIsWishlisted((w) => !w); }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              variants={heartVariants}
              animate={isWishlisted ? 'liked' : 'unliked'}
            >
              <Heart
                size={16}
                className={clsx(
                  'transition-colors duration-200',
                  isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-zinc-300'
                )}
              />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-x-0 bottom-0 z-20 p-3"
              >
                <Link
                  to={`/products/${product.slug}`}
                  className="flex items-center justify-center gap-2
                             w-full py-2 rounded-xl
                             glass text-zinc-200 text-sm font-medium
                             hover:text-white hover:bg-white/10
                             transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye size={14} />
                  Quick View
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        {/* Category + Rating */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-indigo-400 font-medium tracking-wide uppercase">
            {typeof product.category === 'object' ? product.category.name : 'General'}
          </span>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-zinc-400">
              {product.rating.toFixed(1)}
              <span className="text-zinc-600 ml-1">({product.reviewCount})</span>
            </span>
          </div>
        </div>

        {/* Product Title */}
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-zinc-100 font-semibold text-sm leading-snug
                         line-clamp-2 hover:text-indigo-400 transition-colors duration-200">
            {product.title}
          </h3>
        </Link>

        {/* Colour Swatches */}
        {colorSwatches.length > 0 && (
          <div className="flex items-center gap-1.5">
            {colorSwatches.slice(0, 6).map((swatch) => {
              const isActive = selectedVariant.attributes['Color'] === swatch.value;
              return (
                <motion.button
                  key={swatch.value}
                  id={`swatch-${product._id}-${swatch.value}`}
                  aria-label={`Select colour: ${swatch.label}`}
                  title={swatch.label}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleVariantSelect(swatch.value)}
                  className={clsx(
                    'w-5 h-5 rounded-full border-2 transition-all duration-200',
                    isActive
                      ? 'border-indigo-400 scale-110 shadow-[0_0_8px_rgba(99,102,241,0.6)]'
                      : 'border-transparent hover:border-zinc-500'
                  )}
                  style={{ backgroundColor: swatch.hex || '#3f3f46' }}
                />
              );
            })}
            {colorSwatches.length > 6 && (
              <span className="text-xs text-zinc-500">+{colorSwatches.length - 6}</span>
            )}
          </div>
        )}

        {/* Size chips (compact) */}
        {sizeOptions.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {sizeOptions.map((size) => (
              <button
                key={size.value}
                id={`size-${product._id}-${size.value}`}
                className="px-2 py-0.5 text-[11px] rounded-md
                           border border-zinc-700 text-zinc-400
                           hover:border-indigo-500 hover:text-indigo-400
                           transition-colors duration-150"
              >
                {size.label}
              </button>
            ))}
          </div>
        )}

        {/* Price Row */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-zinc-100">
            {formatPrice(selectedVariant.price)}
          </span>
          {selectedVariant.compareAtPrice && (
            <span className="text-sm text-zinc-500 line-through">
              {formatPrice(selectedVariant.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          id={`add-to-cart-${product._id}`}
          aria-label={`Add ${product.title} to cart`}
          variants={cartBtnVariants}
          initial="idle"
          animate={cartState === 'success' ? 'success' : 'idle'}
          whileHover={isOutOfStock ? undefined : 'hover'}
          whileTap={isOutOfStock ? undefined : 'tap'}
          onClick={handleAddToCart}
          disabled={isOutOfStock || cartState !== 'idle'}
          className={clsx(
            'btn-magnetic w-full py-2.5 rounded-xl font-semibold text-sm',
            'flex items-center justify-center gap-2',
            'transition-colors duration-300',
            isOutOfStock
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
          )}
        >
          <AnimatePresence mode="wait">
            {cartState === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ rotate: { repeat: Infinity, duration: 0.8, ease: 'linear' } }}
                className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
              />
            )}
            {cartState === 'success' && (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-white text-sm"
              >
                ✓ Added!
              </motion.span>
            )}
            {cartState === 'idle' && (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                {isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart size={15} />
                    Add to Cart
                  </>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
