"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  ShoppingCart, Plus, Minus, Trash2, CreditCard, Truck,
  Gift, Tag, Percent, Shield, Star, ArrowRight, ArrowLeft,
  Package, MapPin, Clock, Check, AlertCircle, Info,
  Heart, Share2, RefreshCw, ShoppingBag, X
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";
import { LoadingSpinner } from "./LoadingSpinner";
import { SEOHead } from "./SEOHead";

interface ShoppingCartPageProps {
  navigate?: (page: string) => void;
}

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  size?: string;
  color?: string;
  quantity: number;
  inStock: boolean;
  maxQuantity: number;
  rating: number;
  reviews: number;
}

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: any;
}

interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder?: number;
}

export function ShoppingCartPage({ navigate }: ShoppingCartPageProps) {
  const { isDark } = useDarkMode();
  const { t, language } = useLanguage();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShipping, setSelectedShipping] = useState<string>('standard');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  // Mock data - in production, this would come from API
  useEffect(() => {
    const loadCartItems = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCartItems: CartItem[] = [
        {
          id: '1',
          name: 'Delibix AI Consulting T-Shirt',
          description: 'Premium cotton t-shirt with Delibix AI logo. Comfortable fit perfect for tech professionals.',
          price: 29.99,
          originalPrice: 34.99,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
          category: 'Apparel',
          size: 'Large',
          color: 'Navy Blue',
          quantity: 2,
          inStock: true,
          maxQuantity: 10,
          rating: 4.8,
          reviews: 124
        },
        {
          id: '2',
          name: 'Digital Transformation Mug',
          description: 'Ceramic coffee mug with inspirational quotes about digital transformation. Dishwasher safe.',
          price: 19.99,
          image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=300&fit=crop',
          category: 'Accessories',
          quantity: 1,
          inStock: true,
          maxQuantity: 5,
          rating: 4.6,
          reviews: 89
        },
        {
          id: '3',
          name: 'AI Strategy Guidebook',
          description: 'Comprehensive guidebook covering AI implementation strategies for businesses. 250+ pages of expert insights.',
          price: 49.99,
          originalPrice: 59.99,
          image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=300&fit=crop',
          category: 'Books',
          quantity: 1,
          inStock: true,
          maxQuantity: 3,
          rating: 4.9,
          reviews: 67
        },
        {
          id: '4',
          name: 'Delibix Laptop Sticker Pack',
          description: 'Set of 12 premium vinyl stickers featuring AI and tech-themed designs. Weather resistant.',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=300&fit=crop',
          category: 'Accessories',
          quantity: 3,
          inStock: false,
          maxQuantity: 0,
          rating: 4.4,
          reviews: 156
        }
      ];
      
      setCartItems(mockCartItems);
      setIsLoading(false);
    };

    loadCartItems();
  }, []);

  // Shipping options
  const shippingOptions: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Free shipping on orders over $75',
      price: 0,
      estimatedDays: '5-7 business days',
      icon: Package
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Faster delivery for urgent orders',
      price: 9.99,
      estimatedDays: '2-3 business days',
      icon: Truck
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day delivery',
      price: 24.99,
      estimatedDays: '1 business day',
      icon: Clock
    }
  ];

  // Available promo codes
  const promoCodes: PromoCode[] = [
    { code: 'WELCOME10', discount: 10, type: 'percentage' },
    { code: 'SAVE20', discount: 20, type: 'fixed', minOrder: 100 },
    { code: 'NEWCLIENT', discount: 15, type: 'percentage', minOrder: 50 }
  ];

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);
  const shippingCost = subtotal >= 75 && selectedShipping === 'standard' ? 0 : (selectedShippingOption?.price || 0);
  const promoDiscount = appliedPromo ? 
    (appliedPromo.type === 'percentage' ? subtotal * (appliedPromo.discount / 100) : appliedPromo.discount) : 0;
  const tax = (subtotal - promoDiscount) * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax - promoDiscount;

  // Update item quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Remove item from cart
  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Apply promo code
  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    setIsApplyingPromo(true);
    setPromoError('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const validPromo = promoCodes.find(promo => 
      promo.code.toLowerCase() === promoCode.toLowerCase() &&
      (!promo.minOrder || subtotal >= promo.minOrder)
    );
    
    if (validPromo) {
      setAppliedPromo(validPromo);
      setPromoCode('');
    } else {
      const existingPromo = promoCodes.find(promo => 
        promo.code.toLowerCase() === promoCode.toLowerCase()
      );
      
      if (existingPromo && existingPromo.minOrder && subtotal < existingPromo.minOrder) {
        setPromoError(`Minimum order of $${existingPromo.minOrder} required for this promo code.`);
      } else {
        setPromoError('Invalid promo code. Please check and try again.');
      }
    }
    
    setIsApplyingPromo(false);
  };

  // Remove promo code
  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  // Continue shopping
  const continueShopping = () => {
    navigate?.('merchandise-store');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Shopping Cart - Delibix"
          description="Review your items and complete your purchase of Delibix merchandise and resources."
        />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" variant="delibix" text="Loading your cart..." />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Shopping Cart - Delibix"
          description="Your shopping cart is empty. Browse our merchandise and resources to add items."
        />

        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Shopping Cart
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Your cart is currently empty
                  </p>
                </div>
              </div>

              <Button 
                onClick={continueShopping}
                className="gradient-bg-blue text-white"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>

        {/* Empty Cart Content */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="glass-heavy max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-12 h-12 text-slate-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  Your cart is empty
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Looks like you haven't added any items to your cart yet. Browse our merchandise and resources to get started.
                </p>
                <Button 
                  onClick={continueShopping}
                  className="w-full gradient-bg-blue text-white"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Browse Merchandise
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Shopping Cart - Delibix"
        description="Review your items and complete your purchase of Delibix merchandise and resources."
      />

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Shopping Cart
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="outline" className="text-xs">
                    Subtotal: ${subtotal.toFixed(2)}
                  </Badge>
                  {subtotal >= 75 && (
                    <Badge variant="default" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Free Shipping Eligible
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                variant="outline"
                onClick={continueShopping}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
              <Button 
                onClick={() => setShowCheckout(true)}
                className="gradient-bg-blue text-white"
                disabled={cartItems.some(item => !item.inStock)}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="glass-heavy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  Cart Items
                </CardTitle>
                <CardDescription>
                  Review and modify your selected items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-4 border border-slate-200 dark:border-slate-700 rounded-lg ${
                        !item.inStock ? 'bg-red-50 dark:bg-red-900/10' : 'bg-slate-50 dark:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                {item.name}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                                {item.description}
                              </p>
                              
                              <div className="flex items-center gap-4 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-amber-500 fill-current" />
                                  <span className="text-xs text-slate-600 dark:text-slate-400">
                                    {item.rating} ({item.reviews})
                                  </span>
                                </div>
                              </div>

                              {/* Product Options */}
                              {(item.size || item.color) && (
                                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-2">
                                  {item.size && <span>Size: {item.size}</span>}
                                  {item.color && <span>Color: {item.color}</span>}
                                </div>
                              )}

                              {/* Stock Status */}
                              {!item.inStock && (
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mb-2">
                                  <AlertCircle className="w-4 h-4" />
                                  Out of Stock
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-500 hover:text-red-600 dark:hover:text-red-400"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 dark:text-slate-100">
                                ${item.price.toFixed(2)}
                              </span>
                              {item.originalPrice && (
                                <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                                  ${item.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || !item.inStock}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.maxQuantity || !item.inStock}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-100 min-w-[60px] text-right">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Promo Code */}
              <Card className="glass-secondary">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-500" />
                    Promo Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!appliedPromo ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value);
                            setPromoError('');
                          }}
                          className="flex-1"
                        />
                        <Button
                          onClick={applyPromoCode}
                          disabled={!promoCode.trim() || isApplyingPromo}
                          size="sm"
                        >
                          {isApplyingPromo ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            'Apply'
                          )}
                        </Button>
                      </div>
                      {promoError && (
                        <p className="text-red-600 dark:text-red-400 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {promoError}
                        </p>
                      )}
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Available codes: WELCOME10, SAVE20, NEWCLIENT
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-900 dark:text-green-100">
                          {appliedPromo.code}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={removePromoCode}
                        className="text-green-700 dark:text-green-300 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Shipping Options */}
              <Card className="glass-secondary">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-500" />
                    Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedShipping === option.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedShipping(option.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <option.icon className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                              {option.name}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {option.estimatedDays}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                            {option.price === 0 && subtotal >= 75 ? 'Free' : `$${option.price.toFixed(2)}`}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 ml-7">
                        {option.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="glass-heavy">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Shipping</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400">
                          Discount ({appliedPromo.code})
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          -${promoDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Tax</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">${tax.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Total</span>
                      <span className="font-bold text-xl text-slate-900 dark:text-slate-100">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button 
                      className="w-full gradient-bg-blue text-white py-6"
                      onClick={() => setShowCheckout(true)}
                      disabled={cartItems.some(item => !item.inStock)}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Shield className="w-3 h-3" />
                      Secure checkout with SSL encryption
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card className="glass-secondary">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <span className="text-slate-600 dark:text-slate-400">Free shipping on orders over $75</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                      <span className="text-slate-600 dark:text-slate-400">30-day return policy</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-slate-600 dark:text-slate-400">Secure payment processing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal Placeholder */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Checkout</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Checkout functionality would be implemented here with payment processing, billing information, and order confirmation.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
                  Close
                </Button>
                <Button className="flex-1 gradient-bg-blue text-white">
                  Continue
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}