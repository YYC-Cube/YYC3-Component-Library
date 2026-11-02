"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingCart,
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Star,
  Plus,
  Minus,
  X,
  ArrowRight,
  Package,
  Truck,
  Shield,
  RotateCcw,
  CreditCard,
  Users,
  Mail,
  Phone,
  Eye,
  Share2,
  Tag,
  Zap,
  Brain,
  Cpu,
  Lightbulb
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MerchandiseStorePageProps {
  navigate: (page: string) => void;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  tags: string[];
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  colors?: string[];
  sizes?: string[];
}

interface CartItem {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export function MerchandiseStorePage({ navigate }: MerchandiseStorePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Sample products data
  const products: Product[] = [
    {
      id: '1',
      name: 'Delibix AI Neural Network T-Shirt',
      description: 'Premium cotton t-shirt featuring an elegant neural network design representing the future of AI.',
      price: 29.99,
      originalPrice: 39.99,
      category: 'apparel',
      tags: ['cotton', 'unisex', 'ai-design', 'neural-network'],
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 124,
      inStock: true,
      featured: true,
      isNew: false,
      colors: ['black', 'white', 'navy', 'gray'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: '2',
      name: 'Smart AI Mug with Temperature Display',
      description: 'Intelligent coffee mug that displays temperature and changes color based on heat.',
      price: 24.99,
      category: 'accessories',
      tags: ['smart', 'temperature', 'ceramic', 'tech'],
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 89,
      inStock: true,
      featured: true,
      isNew: true,
      colors: ['black', 'white']
    },
    {
      id: '3',
      name: 'Delibix Quantum Computing Hoodie',
      description: 'Comfortable hoodie with quantum circuit patterns and Delibix branding.',
      price: 59.99,
      originalPrice: 79.99,
      category: 'apparel',
      tags: ['hoodie', 'quantum', 'warm', 'winter'],
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 156,
      inStock: true,
      featured: false,
      isNew: false,
      colors: ['black', 'gray', 'navy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: '4',
      name: 'AI Assistant Wireless Charger',
      description: 'Sleek wireless charger with AI voice assistant integration and LED indicators.',
      price: 49.99,
      category: 'tech',
      tags: ['wireless', 'charging', 'ai-assistant', 'led'],
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 203,
      inStock: false,
      featured: true,
      isNew: true
    },
    {
      id: '5',
      name: 'Machine Learning Notebook',
      description: 'Professional notebook designed for data scientists with graph paper and ML templates.',
      price: 19.99,
      category: 'stationery',
      tags: ['notebook', 'data-science', 'graphs', 'templates'],
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 67,
      inStock: true,
      featured: false,
      isNew: false
    },
    {
      id: '6',
      name: 'Delibix Backpack with USB Charging',
      description: 'Modern backpack with built-in USB charging port and laptop compartment.',
      price: 89.99,
      originalPrice: 119.99,
      category: 'accessories',
      tags: ['backpack', 'usb', 'laptop', 'travel'],
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 142,
      inStock: true,
      featured: true,
      isNew: false,
      colors: ['black', 'gray', 'blue']
    },
    {
      id: '7',
      name: 'AI Brain Enamel Pin Set',
      description: 'Collectible enamel pin set featuring AI brain designs and neural pathways.',
      price: 12.99,
      category: 'accessories',
      tags: ['pins', 'collectible', 'enamel', 'brain'],
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      rating: 4.4,
      reviews: 78,
      inStock: true,
      featured: false,
      isNew: true
    },
    {
      id: '8',
      name: 'Quantum Algorithm Poster Set',
      description: 'Beautiful poster set showcasing famous AI and quantum algorithms.',
      price: 34.99,
      category: 'stationery',
      tags: ['posters', 'algorithms', 'educational', 'wall-art'],
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 91,
      inStock: true,
      featured: false,
      isNew: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: Grid3X3 },
    { id: 'apparel', name: 'Apparel', icon: Users },
    { id: 'accessories', name: 'Accessories', icon: Package },
    { id: 'tech', name: 'Tech', icon: Cpu },
    { id: 'stationery', name: 'Stationery', icon: Lightbulb }
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const addToCart = (productId: string, quantity: number = 1, color?: string, size?: string) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.productId === productId && 
        item.selectedColor === color && 
        item.selectedSize === size
      );
      
      if (existingItem) {
        return prev.map(item =>
          item.productId === productId && 
          item.selectedColor === color && 
          item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { productId, quantity, selectedColor: color, selectedSize: size }];
      }
    });
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.productId === productId && 
        item.selectedColor === color && 
        item.selectedSize === size)
    ));
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
    } else {
      setCartItems(prev => prev.map(item =>
        item.productId === productId && 
        item.selectedColor === color && 
        item.selectedSize === size
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      className="glass card-hover rounded-2xl overflow-hidden"
      variants={itemVariants}
      whileHover={{ y: -4 }}
    >
      <div className="relative">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isNew && (
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
              New
            </Badge>
          )}
          {product.featured && (
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              Featured
            </Badge>
          )}
          {product.originalPrice && (
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
              Sale
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 glass-secondary"
            onClick={() => toggleWishlist(product.id)}
          >
            <Heart 
              className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
            />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 glass-secondary"
            onClick={() => setSelectedProduct(product)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge className="bg-red-600 text-white">Out of Stock</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            className="gradient-bg-blue text-white hover:opacity-90"
            onClick={() => addToCart(product.id)}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-3">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color}
                className={`w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 ${
                  color === 'black' ? 'bg-black' :
                  color === 'white' ? 'bg-white' :
                  color === 'navy' ? 'bg-blue-900' :
                  color === 'gray' ? 'bg-gray-500' :
                  color === 'blue' ? 'bg-blue-500' :
                  'bg-gray-400'
                }`}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-slate-500">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );

  const ProductModal = () => {
    const [selectedColor, setSelectedColor] = useState(selectedProduct?.colors?.[0] || '');
    const [selectedSize, setSelectedSize] = useState(selectedProduct?.sizes?.[0] || '');
    const [quantity, setQuantity] = useState(1);

    if (!selectedProduct) return null;

    return (
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ImageWithFallback
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {selectedProduct.isNew && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      New
                    </Badge>
                  )}
                  {selectedProduct.featured && (
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(selectedProduct.rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">({selectedProduct.reviews} reviews)</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    ${selectedProduct.price}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-lg text-slate-500 line-through">
                      ${selectedProduct.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400">
                {selectedProduct.description}
              </p>

              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-slate-300 dark:border-slate-600'
                        } ${
                          color === 'black' ? 'bg-black' :
                          color === 'white' ? 'bg-white' :
                          color === 'navy' ? 'bg-blue-900' :
                          color === 'gray' ? 'bg-gray-500' :
                          color === 'blue' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Size
                  </label>
                  <div className="flex gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 rounded border ${
                          selectedSize === size 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                            : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 gradient-bg-blue text-white hover:opacity-90"
                  onClick={() => {
                    addToCart(selectedProduct.id, quantity, selectedColor, selectedSize);
                    setSelectedProduct(null);
                  }}
                  disabled={!selectedProduct.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleWishlist(selectedProduct.id)}
                >
                  <Heart 
                    className={`w-4 h-4 ${wishlist.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedProduct.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const CartModal = () => (
    <Dialog open={showCart} onOpenChange={setShowCart}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Shopping Cart ({getCartItemCount()} items)</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Your cart is empty</p>
              <Button
                onClick={() => setShowCart(false)}
                className="mt-4 gradient-bg-blue text-white hover:opacity-90"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;

              return (
                <div key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`} className="flex items-center gap-4 p-4 glass-secondary rounded-xl">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">{product.name}</h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                      {item.selectedColor && item.selectedSize && <span> • </span>}
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">${product.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.selectedColor, item.selectedSize)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.selectedColor, item.selectedSize)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Total: ${getCartTotal().toFixed(2)}
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCart(false)}
                className="flex-1"
              >
                Continue Shopping
              </Button>
              <Button
                className="flex-1 gradient-bg-blue text-white hover:opacity-90"
                onClick={() => navigate('contact')}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Checkout
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated product icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute text-blue-500"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0.5, 1, 0.5],
                  opacity: [0, 0.3, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              >
                {i % 4 === 0 ? <ShoppingCart className="w-8 h-8" /> : 
                 i % 4 === 1 ? <Package className="w-8 h-8" /> : 
                 i % 4 === 2 ? <Zap className="w-8 h-8" /> :
                 <Brain className="w-8 h-8" />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                Premium AI Merchandise
              </span>
              <Package className="w-4 h-4 text-amber-500" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-slate-900 dark:text-slate-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="gradient-text-blue">Delibix</span> Store
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Premium AI-themed merchandise and tech accessories. Show your passion for artificial intelligence with our exclusive collection.
              </motion.p>
            </div>

            {/* Store Features */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: Truck, text: 'Free shipping' },
                { icon: Shield, text: 'Secure payment' },
                { icon: RotateCcw, text: 'Easy returns' },
                { icon: Users, text: '24/7 support' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="pt-8 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button
                onClick={() => setShowCart(true)}
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg relative"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                View Cart
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
              <Button
                onClick={() => navigate('contact')}
                variant="outline"
                className="h-14 px-8 border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <Mail className="w-5 h-5 mr-2" />
                Bulk Orders
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Store Features */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', description: 'On orders over $50' },
              { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy' },
              { icon: Shield, title: 'Secure Payment', description: 'Protected transactions' },
              { icon: Users, title: 'Customer Support', description: '24/7 assistance' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass text-center p-6 rounded-2xl card-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Content */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Filters and Search */}
          <div className="mb-8">
            <div className="glass p-6 rounded-2xl">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10 glass-secondary"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 glass-secondary">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 glass-secondary">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <motion.div
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No products found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Need Custom Merchandise?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Looking for bulk orders or custom branded merchandise for your company? Our team can help create personalized AI-themed products.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('contact')}
                  className="gradient-bg-blue text-white hover:opacity-90"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Sales Team
                </Button>
                
                <Button
                  onClick={() => navigate('support')}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Get Support
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Email: <span className="font-medium text-blue-600 dark:text-blue-400">store@delibix.com</span> • 
                  Phone: <span className="font-medium text-blue-600 dark:text-blue-400">+62-XXX-XXXX-XXXX</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Modals */}
      <ProductModal />
      <CartModal />
    </div>
  );
}