"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Minus, Plus, MapPin, ShoppingBag, Truck, Package, CheckCircle, ArrowRight, User, Trash2, ShieldCheck, CreditCard, BadgePercent, Lock, Zap, Award, Ticket, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import Navbar from "../layout/Navbar";

// Types
interface Variant {
  size: string;
  color: string;
  price: number;
}

interface CartItem {
  _id: string;
  productName: string;
  productDescription: string;
  productImage: string;
  productActualPrice: number;
  productDiscountPrice: number;
  quantity: number;
  type: string;
  selectedVariant: Variant;
  product: {
    variants: Variant[];
  };
}

interface Address {
  _id: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const DUMMY_CART_ITEMS: CartItem[] = [
  {
    _id: "cart_1",
    productName: "Disport Elite Performance Tee",
    productDescription: "Moisture-wicking technical fabric for high-intensity training.",
    productImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
    productActualPrice: 1999,
    productDiscountPrice: 1299,
    quantity: 1,
    type: "tshirt",
    selectedVariant: {
      size: "Large",
      color: "Stealth Black",
      price: 1299,
    },
    product: {
      variants: [
        { size: "Large", color: "Stealth Black", price: 1299 }
      ]
    }
  },
  {
    _id: "cart_2",
    productName: "Aero-Swift Running Shorts",
    productDescription: "Lightweight, breathable shorts with built-in compression liner.",
    productImage: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop",
    productActualPrice: 2499,
    productDiscountPrice: 1799,
    quantity: 1,
    type: "shorts",
    selectedVariant: {
      size: "Medium",
      color: "Electric Blue",
      price: 1799,
    },
    product: {
      variants: [
        { size: "Medium", color: "Electric Blue", price: 1799 }
      ]
    }
  }
];

const DUMMY_ADDRESSES: Address[] = [
  {
    _id: "addr_1",
    streetAddress: "45 Tech Park, 2nd Floor, HSR Layout",
    city: "Bengaluru",
    state: "Karnataka",
    zipCode: "560102",
    country: "India"
  },
  {
    _id: "addr_2",
    streetAddress: "123 Marine Drive, Flat 402",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    country: "India"
  }
];

export default function CartPage() {
  const router = useRouter();
  const [pinCode, setPinCode] = useState("400001");
  const [currentStep, setCurrentStep] = useState(1);
  const [isLogin, setIsLogin] = useState(true); // Default to true for dummy version

  // Local State for Cart and Addresses
  const [cartItems, setCartItems] = useState<CartItem[]>(DUMMY_CART_ITEMS);
  const [addresses, setAddresses] = useState<Address[]>(DUMMY_ADDRESSES);
  
  // Address form state
  const [addressForm, setAddressForm] = useState({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isSelectingAddress, setIsSelectingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  // Calculations
  const pricing = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.productActualPrice * item.quantity), 0);
    const itemTotal = cartItems.reduce((acc, item) => acc + ((item.selectedVariant?.price || item.productDiscountPrice) * item.quantity), 0);
    let discount = subtotal - itemTotal;
    
    // Apply Promo Discount (10% of itemTotal)
    const promoDiscount = isPromoApplied ? Math.round(itemTotal * 0.1) : 0;
    discount += promoDiscount;
    
    const shipping = itemTotal > 2000 || itemTotal === 0 ? 0 : 99;
    const total = itemTotal - promoDiscount + shipping;
    
    return { subtotal, itemTotal, discount, promoDiscount, shipping, total };
  }, [cartItems, isPromoApplied]);

  const selectedAddress = useMemo(() => 
    addresses.find(addr => addr._id === selectedAddressId), 
  [addresses, selectedAddressId]);

  // Handlers
  const handleRemove = (id: string) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
    toast.success("Item removed from cart");
  };

  const increaseQty = (id: string) => {
    setCartItems(prev => prev.map(item => 
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQty = (id: string, currentQty: number) => {
    if (currentQty <= 1) {
      handleRemove(id);
    } else {
      setCartItems(prev => prev.map(item => 
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
      ));
    }
  };

  const handleAddressFormChange = (field: string, value: string) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAddress = () => {
    if (!addressForm.streetAddress || !addressForm.city || !addressForm.state || !addressForm.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newAddress = { ...addressForm, _id: `addr_${Date.now()}` };
    setAddresses(prev => [...prev, newAddress]);
    setIsAddingAddress(false);
    setAddressForm({ streetAddress: "", city: "", state: "", zipCode: "", country: "India" });
    toast.success("Address added successfully");
  };

  const handleUpdateAddress = () => {
    if (!addressForm.streetAddress || !addressForm.city || !addressForm.state || !addressForm.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }
    setAddresses(prev => prev.map(addr => 
      addr._id === editingAddressId ? { ...addressForm, _id: editingAddressId } : addr
    ));
    setEditingAddressId(null);
    setIsAddingAddress(false);
    toast.success("Address updated successfully");
  };

  const handleEditAddress = (address: Address) => {
    setAddressForm({
      streetAddress: address.streetAddress || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "India"
    });
    setEditingAddressId(address._id);
    setIsAddingAddress(true);
  };

  const handleSelectAddress = (addressId: string) => {
    setIsSelectingAddress(true);
    setSelectedAddressId(addressId);
    setTimeout(() => setIsSelectingAddress(false), 500);
  };

  const handleBuyNow = () => {
    toast.success("Order placed successfully!");
    setCartItems([]);
    router.push("/");
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }
    // Dummy logic
    if (promoCode.toUpperCase() === "DISPORT10") {
      setIsPromoApplied(true);
      toast.success("Promo code applied! 10% discount added.");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const getDeliveryDays = (productType: string, pinCode: string) => {
    const deliveryDaysByType: Record<string, number> = { tshirt: 4, shoes: 6, default: 5 };
    return deliveryDaysByType[productType] || deliveryDaysByType.default;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="w-full lg:flex-1">
            <div className="bg-white border border-gray-200 p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Product Details</span>
                <span className="text-sm font-semibold text-gray-700">Price</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={item._id} className="bg-white border border-gray-200 p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 bg-gray-50 flex-shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {item.quantity}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-bold text-black uppercase tracking-tight">{item.productName}</h3>
                          <p className="text-xs text-gray-500 mt-1">{item.productDescription}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-600"><span className="font-semibold">Size:</span> {item.selectedVariant?.size}</p>
                            <p className="text-xs text-gray-600"><span className="font-semibold">Color:</span> {item.selectedVariant?.color}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-black">
                            ₹{((item.selectedVariant?.price || item.productDiscountPrice) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                        <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-600 font-medium">QTY:</span>
                          <div className="flex items-center border border-gray-200">
                            <button
                              onClick={() => decreaseQty(item._id, item.quantity)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              {item.quantity === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                            </button>
                            <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-gray-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQty(item._id)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-xs font-bold text-gray-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base font-bold uppercase tracking-widest">Delivery Address</h2>
              </div>
              <button onClick={() => setCurrentStep(1)} className="text-xs font-bold text-gray-400 hover:text-black uppercase flex items-center gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" /> Back
              </button>
            </div>

            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2 mb-8">
                {addresses.map((addr) => (
                  <div 
                    key={addr._id} 
                    onClick={() => handleSelectAddress(addr._id)}
                    className={`p-5 cursor-pointer border-2 transition-all relative ${
                      selectedAddressId === addr._id ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedAddressId === addr._id ? 'border-black' : 'border-gray-300'
                      }`}>
                        {selectedAddressId === addr._id && <div className="w-2 h-2 bg-black rounded-full" />}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }}
                        className="text-[10px] font-bold uppercase text-gray-400 hover:text-black"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-bold text-sm mb-1">{addr.streetAddress}</p>
                    <p className="text-xs text-gray-500 font-medium">{addr.city}, {addr.state} {addr.zipCode}</p>
                    <p className="text-[10px] uppercase text-gray-400 mt-2 tracking-widest">{addr.country}</p>
                  </div>
                ))}
              </div>

              {!isAddingAddress ? (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 hover:border-black hover:text-black transition-all font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Address
                </button>
              ) : (
                <div className="bg-gray-50 p-6 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4">
                    {editingAddressId ? 'Edit Address' : 'New Address'}
                  </h3>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={addressForm.streetAddress}
                    onChange={(e) => handleAddressFormChange('streetAddress', e.target.value)}
                    className="w-full p-3 border border-gray-200 bg-white text-sm focus:outline-none focus:border-black"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) => handleAddressFormChange('city', e.target.value)}
                      className="w-full p-3 border border-gray-200 bg-white text-sm focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={addressForm.state}
                      onChange={(e) => handleAddressFormChange('state', e.target.value)}
                      className="w-full p-3 border border-gray-200 bg-white text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={addressForm.zipCode}
                      onChange={(e) => handleAddressFormChange('zipCode', e.target.value)}
                      className="w-full p-3 border border-gray-200 bg-white text-sm focus:outline-none focus:border-black"
                    />
                    <select
                      value={addressForm.country}
                      onChange={(e) => handleAddressFormChange('country', e.target.value)}
                      className="w-full p-3 border border-gray-200 bg-white text-sm focus:outline-none focus:border-black"
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                    </select>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={editingAddressId ? handleUpdateAddress : handleAddAddress}
                      className="flex-1 bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-900"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => { setIsAddingAddress(false); setEditingAddressId(null); }}
                      className="flex-1 border border-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Select Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: "cod", label: "Cash on Delivery", sub: "Pay upon delivery of items" },
                { id: "online", label: "Online Payment", sub: "Secure card/UPI transaction" }
              ].map((opt) => (
                <label key={opt.id} className={`flex items-start p-4 border-2 cursor-pointer transition-all ${
                  paymentMethod === opt.id ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    className="mt-1 mr-4 accent-black"
                  />
                  <div>
                    <p className="font-bold text-sm text-black">{opt.label}</p>
                    <p className="text-[10px] uppercase text-gray-400 mt-1 font-medium tracking-wider">{opt.sub}</p>
                  </div>
                </label>
              ))}
            </div>
            <button onClick={() => setCurrentStep(2)} className="mt-8 text-xs font-bold uppercase text-gray-400 hover:text-black flex items-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Address
            </button>
          </div>
        );

      case 4:
        return (
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-6">Review Order</h2>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-4 p-4 bg-gray-50">
                  <div className="w-16 h-16 relative bg-white">
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover p-1" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[11px] font-bold uppercase tracking-tight">{item.productName}</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-medium">
                      {item.selectedVariant.size} / {item.selectedVariant.color} / QTY: {item.quantity}
                    </p>
                    <p className="text-sm font-bold mt-1">₹{(item.selectedVariant.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-2 border-black space-y-4">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Delivery To</h4>
                <p className="text-xs font-bold">{selectedAddress?.streetAddress}</p>
                <p className="text-[11px] text-gray-600 font-medium">{selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.zipCode}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Payment Mode</h4>
                <p className="text-xs font-bold uppercase">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Transaction'}</p>
              </div>
            </div>
            
            <button onClick={() => setCurrentStep(3)} className="mt-8 text-xs font-bold uppercase text-gray-400 hover:text-black flex items-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Payment
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-gray-50 mx-auto mb-8 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-200" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">Looks like you haven't added anything to your cart yet. Time to gear up.</p>
          <button 
            onClick={() => router.push("/")}
            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all"
          >
            Explore Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* <Toaster position="bottom-right" /> */}
      
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-32">
        {/* Progress Stepper (Sportswear Style) */}
        <div className="absolute left-0 right-0 bg-[#F6F6F6] border-y border-gray-100 py-6 mb-12">
          <div className="max-w-7xl mx-auto px-4 flex justify-center">
            <div className="flex items-center gap-4 md:gap-8">
              {["MY BAG", "ADDRESS", "PAYMENT", "REVIEW"].map((label, i) => (
                <React.Fragment key={label}>
                  <div 
                    className={`flex items-center cursor-pointer transition-all duration-300 ${
                      currentStep >= i + 1 ? 'text-black' : 'text-gray-400'
                    }`}
                    onClick={() => i + 1 < currentStep && setCurrentStep(i + 1)}
                  >
                    <span className={`text-[11px] font-bold uppercase ${currentStep === i + 1 ? 'relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-black' : ''}`}>
                      {label}
                    </span>
                  </div>
                  {i < 3 && (
                    <div className={`w-10 md:w-16 border-t border-dashed transition-colors duration-500 ${
                      currentStep > i + 1 ? 'border-black' : 'border-gray-300'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Spacer for Absolute Stepper */}
        <div className="h-24" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Content */}
          <div className="lg:col-span-8">
            {renderStepContent()}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 sticky top-24 shadow-[0_0_50px_rgba(0,0,0,0.02)] border border-gray-100">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Bag Total</span>
                  <span className="font-bold text-gray-800">₹{pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Sub Total</span>
                  <span className="font-bold text-gray-800">₹{(pricing.subtotal - pricing.discount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Shipping Charges</span>
                  <span className="font-bold text-green-600">{pricing.shipping === 0 ? "Free" : `₹${pricing.shipping.toLocaleString()}`}</span>
                </div>
                {pricing.promoDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm text-green-600">
                    <span className="font-medium">Promo Discount</span>
                    <span className="font-bold">-₹{pricing.promoDiscount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-base font-bold uppercase">You Pay</span>
                  <span className="text-xl font-bold">₹{pricing.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Promo Code Section (Styled like image) */}
              <div className="mb-8">
                {!isLogin ? (
                  <Link href="/login" className="flex items-center gap-4 py-4 border-y border-gray-100 group cursor-pointer transition-colors hover:bg-gray-50/50 px-1">
                    <div className="shrink-0">
                      <Ticket className="w-6 h-6 text-[#1A1C1C]" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[15px] font-semibold text-[#1A1C1C]">Log in to apply promo code</h4>
                      <p className="text-[12px] text-gray-400 mt-0.5">Get instant savings on your order</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#1A1C1C]" strokeWidth={2.5} />
                  </Link>
                ) : (
                  <div className="border-y border-gray-100">
                    <button 
                      onClick={() => setIsPromoOpen(!isPromoOpen)}
                      className="w-full cursor-pointer flex items-center gap-4 py-4 px-1 group transition-colors hover:bg-gray-50/50"
                    >
                      <div className="shrink-0">
                        <Ticket className="w-6 h-6 text-[#1A1C1C]" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="text-[15px] font-medium text-[#1A1C1C]">Apply Promo Code</h4>
                        <p className="text-[14px] text-gray-500 mt-0.5">{isPromoApplied ? 'Code Applied Successfully' : 'Check for available coupons'}</p>
                      </div>
                      {isPromoOpen ? <ChevronUp className="w-5 h-5 text-[#1A1C1C]" strokeWidth={2.5} /> : <ChevronRight className="w-5 h-5 text-[#1A1C1C]" strokeWidth={2.5} />}
                    </button>
                    
                    {isPromoOpen && (
                      <div className="pb-6 pt-0 px-1 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="ENTER CODE"
                            className="flex-1 bg-gray-50 border border-gray-200 px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                          />
                          <button 
                            onClick={handleApplyPromo}
                            className="shrink-0 cursor-pointer bg-black! text-white! px-6 py-3 text-[10px] font-semibold uppercase tracking-widest hover:bg-gray-800! transition-all active:scale-95"
                          >
                            Apply
                          </button>
                        </div>
                        {isPromoApplied && (
                          <div className="flex items-center gap-2 text-[10px] text-green-600 font-bold uppercase bg-green-50 p-2 border border-green-100">
                            <CheckCircle size={12} /> 
                            <span>Code DISPORT10 Applied!</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (currentStep < 4) {
                      if (currentStep === 2 && !selectedAddressId) {
                        toast.error("Please select a delivery address");
                        return;
                      }
                      setCurrentStep(currentStep + 1);
                    } else {
                      handleBuyNow();
                    }
                  }}
                  className={`w-full cursor-pointer py-5 text-sm font-semibold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${
                    currentStep === 4 ? '!bg-primary-bright !text-white hover:!bg-primary shadow-lg shadow-orange-500/20' : '!bg-black !text-white hover:!bg-gray-900'
                  }`}
                >
                  {currentStep < 4 ? `Proceed to ${["", "Address", "Payment", "Review"][currentStep]}` : "Proceed to Buy"}
                </button>
                
                <button 
                  onClick={() => router.push("/")}
                  className="w-full py-3.5 border cursor-pointer border-gray-200 rounded-sm text-xs font-semibold uppercase hover:border-black transition-all"
                >
                  Continue Shopping
                </button>
              </div>

              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
