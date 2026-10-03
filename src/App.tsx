/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Leaf, Check, ArrowRight, ChevronLeft } from "lucide-react";
import { products, shippingOptions, paymentOptions, formatIDR, Product } from "./data";

type ViewState = "home" | "checkout" | "success";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function App() {
  const [view, setView] = useState<ViewState>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout state
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0].id);
  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[0].id);

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const shippingCost = shippingOptions.find(s => s.id === selectedShipping)?.price || 0;
  const finalTotal = cartTotal + shippingCost;

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setView("checkout");
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setView("success");
    setCart([]);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-pastel-peach/80 backdrop-blur-md border-b border-pastel-sage-dark/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView("home")}
          >
            <Leaf className="w-6 h-6 text-pastel-sage-darker" />
            <span className="font-serif text-2xl font-semibold tracking-wide text-pastel-sage-darker">Botanica</span>
          </div>
          
          {view === "home" && (
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-pastel-sage/50 transition-colors"
            >
              <ShoppingBag className="w-6 h-6 text-text-dark" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-pastel-rose-dark text-white text-xs flex items-center justify-center rounded-full font-medium shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 pb-20">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6"
            >
              {/* Hero Section */}
              <section className="py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 z-10">
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-semibold leading-tight text-text-dark"
                  >
                    Pure Earth,<br/>
                    <span className="text-pastel-sage-darker italic font-light">Radiant Skin</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-text-muted max-w-md font-light"
                  >
                    Discover our collection of 100% natural, ethically sourced herbal skincare designed to illuminate your natural beauty.
                  </motion.p>
                </div>
                
                <div className="relative flex justify-center items-center">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="w-72 h-72 md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-br from-pastel-rose to-pastel-sage shadow-3d-soft relative"
                  >
                    {/* Decorative 3D elements */}
                    <motion.div 
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-1/4 -left-8 w-32 h-32 rounded-full bg-pastel-sage shadow-3d-hover backdrop-blur-xl opacity-90" 
                    />
                    <motion.div 
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-1/4 -right-4 w-24 h-24 rounded-full bg-pastel-rose shadow-3d-hover backdrop-blur-xl opacity-90" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-4 rounded-full border border-white/40 mix-blend-overlay"
                    />
                  </motion.div>
                </div>
              </section>

              {/* Product Grid */}
              <section className="py-12">
                <h2 className="text-3xl font-serif font-semibold mb-10 text-center">Our Collection</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {products.map((product, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: i * 0.1 }}
                      key={product.id}
                      className="group flex flex-col items-center bg-pastel-peach rounded-[2.5rem] p-6 shadow-3d-soft hover:shadow-3d-hover transition-all duration-500 cursor-pointer"
                    >
                      <div className={`w-48 h-48 ${product.imageColor} rounded-full shadow-inner-soft mb-8 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500 relative overflow-hidden`}>
                         <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent mix-blend-overlay"></div>
                         <Leaf className="w-12 h-12 text-white/70 drop-shadow-md" />
                      </div>
                      <div className="text-center w-full">
                        <span className="text-xs uppercase tracking-widest text-pastel-sage-darker font-semibold block mb-2">{product.category}</span>
                        <h3 className="font-serif text-xl font-semibold mb-2">{product.name}</h3>
                        <p className="text-text-muted text-sm mb-6 line-clamp-2 h-10 font-light px-2">{product.description}</p>
                        <div className="flex items-center justify-between mt-auto bg-white/40 p-2 rounded-full backdrop-blur-sm border border-white/50">
                          <span className="font-medium px-4">{formatIDR(product.price)}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                            className="bg-text-dark text-white p-3 rounded-full hover:bg-pastel-sage-darker transition-colors shadow-md transform hover:scale-105 active:scale-95"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === "checkout" && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-5xl mx-auto px-6 py-8"
            >
              <button 
                onClick={() => setView("home")}
                className="flex items-center text-text-muted hover:text-text-dark mb-8 transition-colors font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to shopping
              </button>
              
              <h1 className="text-4xl font-serif font-semibold mb-8">Checkout</h1>
              
              <div className="grid lg:grid-cols-3 gap-12">
                <form onSubmit={handlePayment} className="lg:col-span-2 space-y-10">
                  {/* Shipping Info */}
                  <div className="bg-pastel-peach p-8 rounded-3xl shadow-3d-soft border border-white/50">
                    <h2 className="text-xl font-serif font-semibold mb-6 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-pastel-sage flex items-center justify-center text-sm mr-3 font-medium text-pastel-sage-darker">1</span>
                      Shipping Details
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="text" placeholder="First Name" className="p-4 rounded-2xl bg-white border border-transparent focus:border-pastel-sage-dark focus:ring-4 focus:ring-pastel-sage/30 outline-none transition-all shadow-inner-soft" />
                      <input required type="text" placeholder="Last Name" className="p-4 rounded-2xl bg-white border border-transparent focus:border-pastel-sage-dark focus:ring-4 focus:ring-pastel-sage/30 outline-none transition-all shadow-inner-soft" />
                      <input required type="email" placeholder="Email Address" className="col-span-2 p-4 rounded-2xl bg-white border border-transparent focus:border-pastel-sage-dark focus:ring-4 focus:ring-pastel-sage/30 outline-none transition-all shadow-inner-soft" />
                      <input required type="text" placeholder="Full Address" className="col-span-2 p-4 rounded-2xl bg-white border border-transparent focus:border-pastel-sage-dark focus:ring-4 focus:ring-pastel-sage/30 outline-none transition-all shadow-inner-soft" />
                      <input required type="text" placeholder="City" className="p-4 rounded-2xl bg-white border border-transparent focus:border-pastel-sage-dark focus:ring-4 focus:ring-pastel-sage/30 outline-none transition-all shadow-inner-soft" />
                      <input required type="text" placeholder="Postal Code" className="p-4 rounded-2xl bg-white border border-transparent focus:border-pastel-sage-dark focus:ring-4 focus:ring-pastel-sage/30 outline-none transition-all shadow-inner-soft" />
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="bg-pastel-peach p-8 rounded-3xl shadow-3d-soft border border-white/50">
                    <h2 className="text-xl font-serif font-semibold mb-6 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-pastel-sage flex items-center justify-center text-sm mr-3 font-medium text-pastel-sage-darker">2</span>
                      Delivery Method
                    </h2>
                    <div className="space-y-4">
                      {shippingOptions.map(option => (
                        <label 
                          key={option.id}
                          className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer border-2 transition-all shadow-sm ${selectedShipping === option.id ? 'border-pastel-sage-dark bg-white shadow-md transform scale-[1.02]' : 'border-transparent bg-white/50 hover:bg-white'}`}
                          onClick={() => setSelectedShipping(option.id)}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${selectedShipping === option.id ? 'border-pastel-sage-dark' : 'border-gray-300'}`}>
                              {selectedShipping === option.id && <motion.div layoutId="shipping-dot" className="w-2.5 h-2.5 rounded-full bg-pastel-sage-dark" />}
                            </div>
                            <div>
                              <div className="font-medium text-text-dark">{option.name}</div>
                              <div className="text-sm text-text-muted mt-0.5">Est. {option.est}</div>
                            </div>
                          </div>
                          <div className="font-medium">{formatIDR(option.price)}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-pastel-peach p-8 rounded-3xl shadow-3d-soft border border-white/50">
                    <h2 className="text-xl font-serif font-semibold mb-6 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-pastel-sage flex items-center justify-center text-sm mr-3 font-medium text-pastel-sage-darker">3</span>
                      Payment Method
                    </h2>
                    <div className="space-y-4">
                      {paymentOptions.map(option => (
                        <label 
                          key={option.id}
                          className={`flex items-center p-5 rounded-2xl cursor-pointer border-2 transition-all shadow-sm ${selectedPayment === option.id ? 'border-pastel-sage-dark bg-white shadow-md transform scale-[1.02]' : 'border-transparent bg-white/50 hover:bg-white'}`}
                          onClick={() => setSelectedPayment(option.id)}
                        >
                           <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${selectedPayment === option.id ? 'border-pastel-sage-dark' : 'border-gray-300'}`}>
                              {selectedPayment === option.id && <motion.div layoutId="payment-dot" className="w-2.5 h-2.5 rounded-full bg-pastel-sage-dark" />}
                            </div>
                            <div>
                              <div className="font-medium text-text-dark">{option.name}</div>
                              <div className="text-sm text-text-muted mt-0.5">{option.details}</div>
                            </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-text-dark text-white py-5 rounded-2xl font-medium text-lg hover:bg-pastel-sage-darker transition-colors shadow-3d-hover flex items-center justify-center transform hover:-translate-y-1">
                    Pay {formatIDR(finalTotal)} <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </form>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl sticky top-28 shadow-3d-soft border border-white">
                    <h3 className="font-serif text-xl font-semibold mb-6">Order Summary</h3>
                    <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex gap-4 group">
                          <div className={`w-16 h-16 rounded-2xl ${item.product.imageColor} flex-shrink-0 flex items-center justify-center shadow-inner-soft relative overflow-hidden`}>
                             <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent mix-blend-overlay"></div>
                            <Leaf className="w-6 h-6 text-white/60" />
                          </div>
                          <div className="flex-1 text-sm py-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                              <div className="text-text-muted mt-0.5">Qty: {item.quantity}</div>
                            </div>
                            <div className="font-medium text-pastel-sage-darker">{formatIDR(item.product.price * item.quantity)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-pastel-sage-dark/20 pt-5 space-y-4 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted">Subtotal</span>
                        <span className="font-medium">{formatIDR(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted">Shipping</span>
                        <span className="font-medium">{formatIDR(shippingCost)}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-serif font-semibold pt-5 border-t border-pastel-sage-dark/20 text-text-dark">
                        <span>Total</span>
                        <span>{formatIDR(finalTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="max-w-md mx-auto mt-20 text-center px-6 bg-white p-12 rounded-[3rem] shadow-3d-soft border border-white"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, delay: 0.2 }}
                className="w-24 h-24 bg-pastel-sage rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner-soft relative"
              >
                <div className="absolute inset-0 rounded-full border-4 border-white/50 scale-110"></div>
                <Check className="w-12 h-12 text-pastel-sage-darker" />
              </motion.div>
              <h1 className="text-4xl font-serif font-semibold mb-4 text-text-dark">Thank You!</h1>
              <p className="text-text-muted mb-8 font-light">Your order has been beautifully packed and is being processed. You will receive an email confirmation shortly.</p>
              <button 
                onClick={() => setView("home")}
                className="bg-pastel-peach text-text-dark border-2 border-white px-8 py-4 rounded-2xl hover:bg-white transition-colors shadow-sm font-medium w-full"
              >
                Continue Shopping
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-text-dark/20 backdrop-blur-sm z-50"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-pastel-peach/95 backdrop-blur-xl z-50 shadow-2xl flex flex-col rounded-l-[2.5rem] overflow-hidden border-l border-white/40"
            >
              <div className="p-8 flex items-center justify-between border-b border-pastel-sage-dark/10 bg-white/40">
                <h2 className="font-serif text-3xl font-semibold">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-3 bg-white hover:bg-pastel-sage/30 rounded-full transition-colors shadow-sm">
                  <X className="w-5 h-5 text-text-dark" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-text-muted">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                      <ShoppingBag className="w-10 h-10 opacity-30 text-text-dark" />
                    </div>
                    <p className="font-serif text-xl">Your cart is empty.</p>
                    <button onClick={() => setIsCartOpen(false)} className="mt-4 text-sm underline underline-offset-4 hover:text-text-dark">Start shopping</button>
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div layout key={item.product.id} className="flex gap-5 bg-white/60 backdrop-blur-md p-4 rounded-[2rem] shadow-sm border border-white">
                      <div className={`w-28 h-28 rounded-2xl ${item.product.imageColor} flex-shrink-0 flex items-center justify-center shadow-inner-soft relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent mix-blend-overlay"></div>
                        <Leaf className="w-10 h-10 text-white/70" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-medium text-lg leading-tight text-text-dark">{item.product.name}</h3>
                          <div className="text-text-muted text-sm mt-1">{formatIDR(item.product.price)}</div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center bg-white rounded-xl shadow-sm border border-pastel-sage-dark/10 p-1">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 rounded-lg hover:bg-pastel-sage/20 transition-colors flex items-center justify-center text-lg">-</button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 rounded-lg hover:bg-pastel-sage/20 transition-colors flex items-center justify-center text-lg">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.product.id)} className="text-xs text-text-muted hover:text-red-400 font-medium transition-colors">Remove</button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-white border-t border-pastel-sage-dark/10 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-text-muted font-medium">Subtotal</span>
                    <span className="font-serif font-semibold text-3xl text-text-dark">{formatIDR(cartTotal)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-text-dark text-white py-5 rounded-2xl font-medium text-lg hover:bg-pastel-sage-darker transition-colors shadow-3d-hover flex items-center justify-center transform hover:-translate-y-1"
                  >
                    Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

