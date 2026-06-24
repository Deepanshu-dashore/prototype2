"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  LogOut, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  Loader2, 
  Calendar, 
  Package, 
  Truck, 
  CheckCircle,
  Mail,
  Phone,
  Heart,
  Settings,
  CreditCard,
  LayoutDashboard,
  Shield,
  Award,
  ArrowRight,
  TrendingUp,
  Inbox,
  Users,
  Home,
  Shirt
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import { useGetApi, useMutationApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import API_ENDPOINTS from "@/app/constants/apiConfig";
import { setUser } from "@/app/store/userSlice";
import ProductCard from "@/components/shared/ProductCard";

// ── Types ────────────────────────────────────────────────
interface Address {
  _id: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface OrderItem {
  _id?: string;
  productId?: string;
  productName: string;
  productImage: string;
  productDiscountPrice: number;
  productActualPrice?: number;
  quantity: number;
  selectedVariant?: {
    size: string;
    color: string;
    price: number;
  };
}

interface Order {
  _id: string;
  orderId?: string;
  createdAt: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  totalAmount?: number;
  totalPrice?: number;
  finalAmount?: number;
  paymentMethod?: string;
  shippingAddress?: string | Address;
  products?: OrderItem[];
}

interface TeamwearInquiry {
  id: string;
  teamName: string;
  sportType: string;
  quantity: string;
  contactName: string;
  phone: string;
  details: string;
  status: "Received" | "Under Review" | "Proposal Sent" | "Approved";
  createdAt: string;
}

const RECOMMENDED_PRODUCTS = [
  { 
    id: "rec_1", 
    name: "AEROPULSE™ TRAINING T-SHIRT", 
    category: "TRAINING T-SHIRT", 
    price: 1299, 
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    id: "rec_2", 
    name: "VELOCITYLITE™ PERFORMANCE TEE", 
    category: "PERFORMANCE TEE", 
    price: 1199, 
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    id: "rec_3", 
    name: "ELITEWEAVE™ TRACK PANTS", 
    category: "TRACK PANTS", 
    price: 1499, 
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    id: "rec_4", 
    name: "MOTIONFLEX™ COMPRESSION TOP", 
    category: "COMPRESSION TOP", 
    price: 1599, 
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    id: "rec_5", 
    name: "AEROMESH™ RUNNING SHORTS", 
    category: "RUNNING SHORTS", 
    price: 899, 
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=400&auto=format&fit=crop" 
  }
];

// WreathBadge Helper Component for Achievements
interface WreathBadgeProps {
  isUnlocked: boolean;
  icon: React.ComponentType<any>;
}

const WreathBadge: React.FC<WreathBadgeProps> = ({ isUnlocked, icon: Icon }) => {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center shrink-0 select-none">
      {/* Wreath SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className={`absolute inset-0 w-full h-full transition-all duration-500 ${
          isUnlocked ? "text-[#ec7700] drop-shadow-[0_0_8px_rgba(236,119,0,0.15)]" : "text-zinc-800"
        }`}
        fill="currentColor"
      >
        {/* Left Laurel Branch Stem */}
        <path 
          d="M 47,85 C 32,83 18,70 18,48 C 18,29 28,16 45,12" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          opacity="0.3"
        />
        {/* Right Laurel Branch Stem */}
        <path 
          d="M 53,85 C 68,83 82,70 82,48 C 82,29 72,16 55,12" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          opacity="0.3"
        />

        {/* Leaves - Left Side */}
        <path d="M 40,78 C 30,76 26,71 27,66 C 30,67 34,70 38,74 Z" />
        <path d="M 27,68 C 19,64 16,58 18,53 C 21,55 24,59 26,64 Z" />
        <path d="M 20,55 C 13,50 12,43 15,39 C 17,41 20,46 21,51 Z" />
        <path d="M 19,41 C 14,35 15,28 19,25 C 21,28 22,33 22,38 Z" />
        <path d="M 23,28 C 21,21 24,15 29,13 C 30,16 29,21 28,26 Z" />
        <path d="M 33,18 C 33,11 38,7 43,7 C 42,10 39,14 36,18 Z" />

        {/* Leaves - Right Side */}
        <path d="M 60,78 C 70,76 74,71 73,66 C 70,67 66,70 62,74 Z" />
        <path d="M 73,68 C 81,64 84,58 82,53 C 79,55 76,59 74,64 Z" />
        <path d="M 80,55 C 87,50 88,43 85,39 C 83,41 80,46 79,51 Z" />
        <path d="M 81,41 C 86,35 85,28 81,25 C 79,28 78,33 78,38 Z" />
        <path d="M 77,28 C 79,21 76,15 71,13 C 70,16 71,21 72,26 Z" />
        <path d="M 67,18 C 67,11 62,7 57,7 C 58,10 61,14 64,18 Z" />
      </svg>

      {/* Inner circular badge */}
      <div 
        className={`w-9 h-9 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${
          isUnlocked 
            ? "bg-[#ec7700]/10 text-[#ec7700] border border-[#ec7700]/30 shadow-[inset_0_1px_3px_rgba(236,119,0,0.15)]" 
            : "bg-white/5 text-white/20 border border-white/5"
        }`}
      >
        <Icon size={16} className={`stroke-[2] ${isUnlocked ? "drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]" : ""}`} />
      </div>
    </div>
  );
};

function AccountDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Auth Hook
  const { user, isAuthenticated, isLoading: authLoading, logout: authLogout, getInitials, getFullName } = useAuth();

  // Current active tab state
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Teamwear Inquiries state
  const [teamwearInquiries, setTeamwearInquiries] = useState<TeamwearInquiry[]>([]);
  const [teamwearForm, setTeamwearForm] = useState({
    teamName: "",
    sportType: "Cricket",
    quantity: "15-50",
    contactName: "",
    phone: "",
    details: ""
  });

  // Sync tab state with URL search parameters
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["dashboard", "profile", "orders", "addresses", "teamwear", "settings", "rewards"].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (tabParam === "profile") {
      setActiveTab("settings");
    } else {
      setActiveTab("dashboard");
    }
  }, [searchParams]);

  // Load teamwear inquiries from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("disport_teamwear_inquiries");
      if (saved) {
        try {
          setTeamwearInquiries(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleTabChange = (tab: string) => {
    router.push(`/account?tab=${tab}`);
  };

  // ── Queries ──────────────────────────────────────────
  
  // Addresses Query
  const { data: addressesData, isLoading: addressesLoading, refetch: refetchAddresses } = useGetApi<any>({
    key: "addresses",
    url: API_ENDPOINTS.ADDRESS.GET_ALL,
    requireAuth: true,
    options: { enabled: isAuthenticated }
  });

  const addresses = useMemo<Address[]>(() => addressesData?.data || [], [addressesData]);

  // Orders Query
  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useGetApi<any>({
    key: "orders",
    url: API_ENDPOINTS.ORDER.GET_ORDERS,
    requireAuth: true,
    options: { enabled: isAuthenticated }
  });

  const orders = useMemo<Order[]>(() => ordersData?.data || [], [ordersData]);

  // Wishlist Query for count
  const { data: wishlistData } = useGetApi<any>({
    key: "wishlistCount",
    url: API_ENDPOINTS.WISHLIST.GET_WISHLIST,
    requireAuth: true,
    options: { enabled: isAuthenticated }
  });

  const wishlistCount = useMemo(() => {
    const items = wishlistData?.data?.products || wishlistData?.data || [];
    return items.length;
  }, [wishlistData]);

  // ── Profile Form Mutation ────────────────────────────
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: ""
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        mobileNumber: user.mobileNumber ? user.mobileNumber.toString() : "",
        email: user.email || ""
      });
    }
  }, [user]);

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutationApi({
    key: "currentUser",
    url: API_ENDPOINTS.USER.UPDATE_USER,
    method: "PATCH",
    requireAuth: true,
    options: {
      onSuccess: (res: any) => {
        const updatedUser = res?.data || res;
        dispatch(setUser(updatedUser));
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast.success("Profile updated successfully!");
        handleTabChange("dashboard");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to update profile");
      }
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      toast.error("First Name and Last Name are required.");
      return;
    }
    const cleanMobile = profileForm.mobileNumber.toString().trim();
    updateProfile({
      payload: {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        mobileNumber: cleanMobile ? (isNaN(Number(cleanMobile)) ? cleanMobile : Number(cleanMobile)) : ""
      }
    });
  };

  // ── Address Form Mutations ───────────────────────────
  const [addressForm, setAddressForm] = useState({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const { mutate: createAddress, isPending: isCreatingAddress } = useMutationApi({
    key: "addAddress",
    url: API_ENDPOINTS.ADDRESS.CREATE,
    method: "POST",
    requireAuth: true,
    options: {
      onSuccess: () => {
        resetAddressForm();
        refetchAddresses();
        toast.success("Address added successfully!");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to add address");
      }
    }
  });

  const { mutate: updateAddress, isPending: isUpdatingAddress } = useMutationApi({
    key: "updateAddress",
    url: editingAddressId ? API_ENDPOINTS.ADDRESS.UPDATE(editingAddressId) : "",
    method: "PATCH",
    requireAuth: true,
    options: {
      onSuccess: () => {
        resetAddressForm();
        refetchAddresses();
        toast.success("Address updated successfully!");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to update address");
      }
    }
  });

  const { mutate: deleteAddress } = useMutationApi({
    key: "deleteAddress",
    url: "",
    method: "DELETE",
    requireAuth: true,
    options: {
      onSuccess: () => {
        refetchAddresses();
        toast.success("Address deleted successfully!");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to delete address");
      }
    }
  });

  const resetAddressForm = () => {
    setAddressForm({
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India"
    });
    setEditingAddressId(null);
    setIsAddingAddress(false);
  };

  const handleAddressEdit = (addr: Address) => {
    setAddressForm({
      streetAddress: addr.streetAddress,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country
    });
    setEditingAddressId(addr._id);
    setIsAddingAddress(true);
  };

  const handleAddressDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      deleteAddress({
        id: null,
        url: API_ENDPOINTS.ADDRESS.DELETE(id)
      } as any);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.streetAddress.trim() || !addressForm.city.trim() || !addressForm.state.trim() || !addressForm.zipCode.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (editingAddressId) {
      updateAddress({
        payload: addressForm
      });
    } else {
      createAddress({
        payload: addressForm
      });
    }
  };

  // ── Teamwear Inquiry Submit ──────────────────────────
  const handleTeamwearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamwearForm.teamName.trim() || !teamwearForm.contactName.trim() || !teamwearForm.phone.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newInquiry: TeamwearInquiry = {
      id: "TW-" + Math.floor(100000 + Math.random() * 900000),
      teamName: teamwearForm.teamName,
      sportType: teamwearForm.sportType,
      quantity: teamwearForm.quantity,
      contactName: teamwearForm.contactName,
      phone: teamwearForm.phone,
      details: teamwearForm.details,
      status: "Received",
      createdAt: new Date().toISOString()
    };

    const updated = [newInquiry, ...teamwearInquiries];
    setTeamwearInquiries(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("disport_teamwear_inquiries", JSON.stringify(updated));
    }

    toast.success("Teamwear Inquiry submitted successfully!");
    setTeamwearForm({
      teamName: "",
      sportType: "Cricket",
      quantity: "15-50",
      contactName: "",
      phone: "",
      details: ""
    });
  };

  // ── Orders Expanded State ──────────────────────────
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // ── Logout ───────────────────────────────────────────
  const { mutateAsync: logoutMutation, isPending: loggingOut } = useMutationApi({
    key: "logout",
    url: API_ENDPOINTS.USER.LOGOUT,
    method: "POST",
    options: {
      onSuccess: () => {
        authLogout();
        toast.success("Signed out successfully!");
        router.push("/login");
      },
      onError: () => {
        toast.error("Sign out failed. Try again.");
      }
    }
  });

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center py-40">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <span className="text-xs uppercase tracking-widest text-gray-400 font-heading">Loading Athlete Profile...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const formatMonthYear = (dateStr?: string) => {
    if (!dateStr) return "June 2026";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
    } catch {
      return "June 2026";
    }
  };

  const formatActivityDate = (dateStr?: string | Date) => {
    if (!dateStr) return "12 Jun 2026, 09:41 PM";
    try {
      const date = new Date(dateStr);
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
      return `${formattedDate}, ${formattedTime}`;
    } catch {
      return "12 Jun 2026, 09:41 PM";
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Pending": return "text-yellow-700 bg-yellow-50 border-yellow-250";
      case "Processing": return "text-[#ec7700] bg-orange-50 border-orange-250";
      case "Shipped": return "text-blue-700 bg-blue-50 border-blue-250";
      case "Delivered": return "text-emerald-700 bg-emerald-50 border-emerald-250";
      case "Cancelled": return "text-rose-700 bg-rose-50 border-rose-250";
      default: return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  // Dynamic Level Calculation
  const orderCount = orders.length;
  const athleteLevel = orderCount >= 5 ? "CHAMPION" : orderCount >= 3 ? "ELITE" : orderCount >= 1 ? "PRO" : "ROOKIE";
  const rewardPoints = orderCount * 50;

  // Fallback Dummy Orders
  const DUMMY_ORDERS: Order[] = [
    {
      _id: "DSP-2026-90412",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Shipped",
      totalAmount: 3597,
      paymentMethod: "Online Payment",
      shippingAddress: "45 Tech Park, HSR Layout, Bengaluru, Karnataka, 560102",
      products: [
        {
          productName: "Disport Pro Hybrid Jersey",
          productImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
          productDiscountPrice: 1799,
          quantity: 1,
          selectedVariant: { size: "L", color: "Tech Orange", price: 1799 }
        },
        {
          productName: "Aero-Swift Compression Shorts",
          productImage: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop",
          productDiscountPrice: 1798,
          quantity: 1,
          selectedVariant: { size: "M", color: "Stealth Black", price: 1798 }
        }
      ]
    },
    {
      _id: "DSP-2026-88371",
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Delivered",
      totalAmount: 2499,
      paymentMethod: "Cash on Delivery",
      shippingAddress: "45 Tech Park, HSR Layout, Bengaluru, Karnataka, 560102",
      products: [
        {
          productName: "Elite Performance Training Pants",
          productImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop",
          productDiscountPrice: 2499,
          quantity: 1,
          selectedVariant: { size: "XL", color: "Graphite", price: 2499 }
        }
      ]
    }
  ];

  const displayedOrders = orders.length > 0 ? orders : DUMMY_ORDERS;

  return (
    <main className="bg-[#F8F8F8] min-h-screen text-text-primary antialiased font-lexend pt-6 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* ── BREADCRUMB ── */}
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
          <span className="hover:text-black cursor-pointer transition-colors" onClick={() => router.push("/")}>HOME</span>
          <ChevronRight size={10} />
          <span className="text-black">ATHLETE HUB</span>
        </div>

        {/* ── MAIN WORKSPACE GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── SIDEBAR PANEL (Left 3 Columns) ── */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Sidebar Hub Navigation */}
            <div className="bg-white  p-0 shadow-xs rounded-xl overflow-hidden">
              
              {/* Header Badge */}
              <div className="bg-white px-6 py-5 flex items-center gap-3">
                <div className="relative w-[18px] h-[18px] shrink-0">
                  <Image 
                    src="/DISPORT LOGOS/logo-Small.webp" 
                    alt="Disport Logo" 
                    fill
                    sizes="18px"
                    className="object-contain" 
                  />
                </div>
                <span className="text-xs font-black tracking-widest uppercase font-heading text-black">
                  ATHLETE HUB
                </span>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="p-4 space-y-1">
                {[
                  { id: "dashboard", label: "Overview", icon: Home },
                  { id: "orders", label: "Orders", icon: ShoppingBag },
                  { id: "wishlist", label: "Wishlist", icon: Heart, link: "/wishlist" },
                  { id: "addresses", label: "Addresses", icon: MapPin },
                  { id: "teamwear", label: "Teamwear Requests", icon: Shirt },
                  { id: "rewards", label: "Rewards", icon: Award },
                  { id: "settings", label: "Account Info", icon: User },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  
                  if (item.link) {
                     return (
                      <Link
                        key={item.id}
                        href={item.link}
                        className="flex items-center gap-3.5 px-4 py-2.5 text-xs font-semibold tracking-wide text-zinc-600 hover:text-black hover:bg-surface-soft/40 transition-all rounded-lg"
                      >
                        <IconComp size={16} className="text-zinc-400" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`flex items-center gap-3.5 w-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-all rounded-lg cursor-pointer ${
                        isActive 
                           ? "text-[#ec7700] bg-[#f8f8f8] font-bold" 
                           : "text-zinc-650 hover:text-black hover:bg-surface-soft/40"
                      }`}
                    >
                      <IconComp size={16} className={isActive ? "text-[#ec7700]" : "text-zinc-400"} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <div className="h-[1px] bg-border my-3" />

                {/* Logout Button */}
                <button
                  onClick={() => logoutMutation({} as any)}
                  disabled={loggingOut}
                  className="flex items-center gap-3.5 w-full px-4 py-2.5 text-xs font-semibold tracking-wide text-zinc-600 hover:text-black hover:bg-surface-soft/40 transition-all rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {loggingOut ? (
                    <Loader2 size={16} className="animate-spin text-zinc-450" />
                  ) : (
                    <>
                      <LogOut size={16} className="text-zinc-400" />
                      <span>Sign Out</span>
                    </>
                  )}
                </button>
              </nav>
            </div>

            {/* Sidebar Visual Promotion Card */}
            <div className="relative overflow-hidden group aspect-[3/4] border border-border-accent bg-black text-white shadow-sm rounded-2xl">
              <Image 
                src="/accounts/BUILT FOR ATHLETES. DESIGNED TO PERFORM Banner.png" 
                alt="Disport Athlete Promo" 
                fill 
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-black/20 to-transparent flex flex-col justify-start p-6">
                <h4 className="font-heading font-black text-4xl tracking-tight uppercase leading-[1.05]">
                  BUILT FOR<br />
                  ATHLETES.<br />
                  DESIGNED TO<br />
                  <span className="text-[#ec7700]">PERFORM.</span>
                </h4>
                <Link 
                  href="/products" 
                  className="mt-6 border border-white/50 bg-transparent text-white text-xs font-bold uppercase py-3 px-6 rounded-none hover:bg-white hover:text-black hover:border-white transition-all duration-300 inline-flex items-center justify-center gap-2 w-max"
                >
                  <span>EXPLORE NOW</span> 
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </aside>

          {/* ── CONTENT PANEL (Right 9 Columns) ── */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Athlete Hero Card */}
            <div className="border border-white/5 p-6 md:p-8 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row justify-between items-center gap-8 bg-black rounded-2xl">
              {/* Background Image Overlay */}
              <Image 
                src="/athlete_hub_hero_bg.png" 
                alt="Athlete Hub Hero Background" 
                fill 
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover opacity-10 pointer-events-none select-none z-0 mix-blend-overlay"
                priority 
              />
              
              {/* Absolute Watermark & Slanted Rays SVG */}
              <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 pointer-events-none z-0 select-none">
                <svg viewBox="0 0 400 160" className="w-full h-full opacity-70 float-right">
                  <defs>
                    <linearGradient id="rayGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ec7700" stopOpacity="0" />
                      <stop offset="50%" stopColor="#ec7700" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ec7700" stopOpacity="0.75" />
                    </linearGradient>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3a3a3c" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#1c1c1e" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  
                  {/* Slanted Glow Rays */}
                  <line x1="220" y1="160" x2="380" y2="0" stroke="url(#rayGradient)" strokeWidth="1.5" />
                  <line x1="240" y1="160" x2="400" y2="0" stroke="url(#rayGradient)" strokeWidth="3" />
                  <line x1="260" y1="160" x2="420" y2="0" stroke="url(#rayGradient)" strokeWidth="1.5" />
                  <line x1="290" y1="160" x2="450" y2="0" stroke="url(#rayGradient)" strokeWidth="4" />
                  <line x1="320" y1="160" x2="480" y2="0" stroke="url(#rayGradient)" strokeWidth="2" />
                  
                  {/* Stylized D// Watermark Logo */}
                  <text 
                    x="230" 
                    y="108" 
                    fill="url(#logoGradient)" 
                    fontSize="106" 
                    fontWeight="900" 
                    fontStyle="italic"
                    fontFamily="Space Grotesk, system-ui, sans-serif" 
                    letterSpacing="-5"
                    className="select-none font-black"
                  >
                    D//
                  </text>
                </svg>
              </div>

              {/* Left & Middle Side Layout */}
              <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center flex-1 relative z-10 w-full text-center sm:text-left">
                
                {/* Circular Avatar */}
                <div className="relative w-28 h-28 rounded-full border border-white/10 overflow-hidden bg-zinc-900 shadow-xl shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop" 
                    alt={getFullName()} 
                    fill
                    sizes="112px"
                    className="object-cover" 
                  />
                </div>

                {/* Details Column */}
                <div className="flex flex-col justify-start gap-3.5 text-center sm:text-left flex-1 min-w-0">
                  
                  {/* Badge: DISPORT ATHLETE & checkmark seal */}
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">
                      DISPORT ATHLETE
                    </span>
                    <div className="w-3.5 h-3.5 bg-[#ec7700] rounded-full flex items-center justify-center text-[8px] font-black text-black select-none">
                      ✓
                    </div>
                  </div>

                  {/* Large Heading Name */}
                  <h1 className="text-3xl md:text-[38px] font-black uppercase tracking-tight font-heading leading-none text-white">
                    {getFullName()?.toUpperCase()}
                  </h1>

                  {/* Account Info Details Row (Email | Calendar) */}
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs text-zinc-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-zinc-500 shrink-0" />
                      <span>{user?.email}</span>
                    </div>
                    
                    <span className="hidden sm:inline text-zinc-700">|</span>
                    
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-zinc-500 shrink-0" />
                      <span>Member since {formatMonthYear(user?.createdAt)}</span>
                    </div>
                  </div>

                  {/* Edit Profile Button under contact info */}
                  <div className="pt-1 flex justify-center sm:justify-start">
                    <button
                      onClick={() => handleTabChange("settings")}
                      className="border border-[#ec7700] hover:bg-[#ec7700]/5 bg-transparent text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest py-3 px-6 rounded-xs font-heading cursor-pointer inline-flex items-center gap-2.5"
                    >
                      <span>EDIT PROFILE</span>
                      <Edit2 size={11} className="text-[#ec7700] stroke-[2.5]" />
                    </button>
                  </div>

                </div>

              </div>

            </div>

            {/* Metric Cards Row (Taller, Tighter layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "ORDERS PLACED", value: displayedOrders.length, action: "orders", icon: Package },
                { label: "WISHLIST ITEMS", value: wishlistCount, link: "/wishlist", icon: Heart },
                { label: "SAVED ADDRESSES", value: addresses.length, action: "addresses", icon: MapPin },
                { label: "REWARD POINTS", value: rewardPoints, action: "rewards", icon: Award }
              ].map((stat, idx) => {
                const formattedValue = stat.label === "REWARD POINTS" 
                  ? stat.value 
                  : stat.value < 10 
                    ? `0${stat.value}` 
                    : stat.value;

                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      if (stat.action === "rewards") {
                        handleTabChange(stat.action);
                      } else if (stat.action) {
                        handleTabChange(stat.action);
                      } else if (stat.link) {
                        router.push(stat.link);
                      }
                    }}
                    className="bg-white border border-border-accent py-7 px-6 min-h-[116px] flex flex-row items-center gap-5 rounded-xl hover:border-[#ec7700]/40 hover:shadow-[0_4px_20px_rgba(236,119,0,0.05)] transition-all duration-300 group cursor-pointer"
                  >
                    {/* Left: Icon in a circular/rounded badge */}
                    <div className="w-14 h-14 rounded-lg bg-surface-soft flex items-center justify-center text-black group-hover:text-[#ec7700] group-hover:bg-[#ec7700]/5 transition-all duration-300 shrink-0">
                      <stat.icon size={26} className="stroke-[1.5]" />
                    </div>
                    {/* Right: Text and Number */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none block">{stat.label}</span>
                      <span className="text-2xl font-black text-black mt-2 font-heading tracking-tight leading-none">{formattedValue}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                
                {/* ── TAB: OVERVIEW (ATHLETE HUB) ── */}
                {activeTab === "dashboard" && (
                  <div className="space-y-8 animate-fade-in">
                    
                    {/* ── 4-QUADRANT WORKSPACE GRID ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left Top: Recent Orders (col-span-5) */}
                      <div className="lg:col-span-5 h-full">
                        <div className="bg-white border border-border-accent p-6 rounded-2xl flex flex-col h-full justify-between">
                          <div>
                            <div className="flex justify-between items-center pb-4 border-b border-surface-soft mb-4">
                              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-black">
                                RECENT ORDERS
                              </h3>
                              <button
                                onClick={() => handleTabChange("orders")}
                                className="text-[10px] font-bold text-[#ec7700] hover:text-[#ec7700]/85 uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>View All Orders</span>
                                <ArrowRight size={11} className="stroke-[2.5]" />
                              </button>
                            </div>

                            {displayedOrders.length > 0 ? (
                              <div className="space-y-4">
                                {displayedOrders.slice(0, 3).map((order) => {
                                  const firstProduct = order.products?.[0];
                                  const totalAmt = order.totalAmount || order.totalPrice || order.finalAmount || 0;
                                  
                                  const orderDate = new Date(order.createdAt);
                                  const formattedDate = orderDate.toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }) + ", " + orderDate.toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  });

                                  const displayOrderId = order._id.startsWith("DSP-") 
                                    ? order._id.replace("DSP-2026-", "DSP") 
                                    : `DSP${order._id.substring(0, 5).toUpperCase()}`;

                                  return (
                                    <div 
                                      key={order._id}
                                      onClick={() => {
                                        handleTabChange("orders");
                                        setExpandedOrderId(order._id);
                                      }}
                                      className="flex items-center justify-between p-3 border border-border-accent rounded-xl hover:border-[#ec7700]/40 transition-all duration-300 group cursor-pointer"
                                    >
                                      <div className="flex items-center gap-4 min-w-0">
                                        {/* Product Thumbnail */}
                                        <div className="relative w-12 h-14 bg-surface-soft border border-border-accent rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                                          <Image 
                                            src={firstProduct?.productImage || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop"} 
                                            alt={firstProduct?.productName || "Product Thumbnail"}
                                            fill 
                                            sizes="48px"
                                            className="object-cover"
                                          />
                                        </div>

                                        {/* Order Meta Info */}
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className="font-heading font-black text-xs text-black uppercase tracking-tight">
                                              Order #{displayOrderId}
                                            </span>
                                            <span className={`text-[8px] font-black uppercase tracking-widest ${
                                              order.status === "Delivered" 
                                                ? "text-green-600" 
                                                : order.status === "Shipped" 
                                                  ? "text-blue-600" 
                                                  : "text-[#ec7700]"
                                            }`}>
                                              {order.status}
                                            </span>
                                          </div>
                                          <span className="text-[10px] text-zinc-400 block font-semibold mt-1">
                                            {formattedDate}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-xs font-black text-black font-mono">
                                          ₹{totalAmt.toLocaleString()}
                                        </span>
                                        <ChevronRight size={14} className="text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="py-8 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest">
                                No recent orders found
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Top: Custom Teamwear (col-span-7) */}
                      <div className="lg:col-span-7 h-full">
                        <div className="bg-black border border-white/10 rounded-2xl relative overflow-hidden flex flex-col md:flex-row h-full min-h-[320px]">
                          {/* Left Side Content: Text and icons */}
                          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between z-10 relative">
                            <div className="space-y-4">
                              <div>
                                <span className="text-[10px] font-black text-[#ec7700] uppercase tracking-widest block mb-1">
                                  CUSTOM TEAMWEAR
                                </span>
                                <h3 className="font-heading font-black text-2xl md:text-3xl text-white tracking-tight uppercase leading-none">
                                  BUILD YOUR<br />TEAM IDENTITY
                                </h3>
                              </div>
                              
                              <p className="text-xs text-zinc-400 font-medium max-w-[240px]">
                                Premium jerseys for winning teams.
                              </p>

                              {/* 4 Sport/Industry Icons */}
                              <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
                                <div className="flex items-center gap-2 text-white">
                                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ec7700]">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="17.5" cy="6.5" r="1.5" />
                                      <path d="M4 20l10-10 2 2-10 10H4zM11 9l4-4 2 2-4 4" />
                                    </svg>
                                  </div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider">Cricket</span>
                                </div>

                                <div className="flex items-center gap-2 text-white">
                                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ec7700]">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="12" r="10" />
                                      <path d="M12 2v20M2 12h20M12 12l7-7M12 12l-7 7M12 12l-7-7M12 12l7 7" />
                                    </svg>
                                  </div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider">Football</span>
                                </div>

                                <div className="flex items-center gap-2 text-white">
                                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ec7700]">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                                    </svg>
                                  </div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider">Schools</span>
                                </div>

                                <div className="flex items-center gap-2 text-white">
                                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-[#ec7700]">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16M12 12v.01M12 16v.01" />
                                    </svg>
                                  </div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider">Corporate</span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-6">
                              <button
                                onClick={() => handleTabChange("teamwear")}
                                className="bg-[#ec7700] hover:bg-[#ec7700]/90 text-white font-heading font-black text-[10px] uppercase tracking-widest py-3.5 px-6 rounded-xs transition-colors inline-flex items-center gap-2 cursor-pointer w-max"
                              >
                                <span>START TEAM INQUIRY</span>
                                <ArrowRight size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Right Side Image */}
                          <div className="relative w-full md:w-[45%] h-64 md:h-auto shrink-0 select-none pointer-events-none">
                            <Image 
                              src="/accounts/BUILD YOUR TEAM IDENTITY Banner.png" 
                              alt="Build Your Team Identity"
                              fill
                              sizes="(max-width: 768px) 100vw, 400px"
                              className="object-cover object-right"
                              priority
                            />
                          </div>
                        </div>
                      </div>

                      {/* Left Bottom: Personal Details (col-span-5) */}
                      <div className="lg:col-span-5 h-full mt-6">
                        <div className="bg-white border border-border-accent p-6 rounded-2xl flex flex-col h-full justify-between">
                          <div>
                            <div className="flex items-center gap-2.5 pb-4 border-b border-surface-soft mb-6">
                              <User size={16} className="text-black stroke-[2.5]" />
                              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-black">
                                PERSONAL DETAILS
                              </h3>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                              <div className="space-y-4 flex-1">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32 shrink-0">
                                    Full Name
                                  </span>
                                  <span className="text-xs font-black text-black uppercase mt-1 font-heading">
                                    {getFullName() || "Deepanshu Dashore"}
                                  </span>
                                </div>

                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32 shrink-0">
                                    Email Address
                                  </span>
                                  <span className="text-xs font-bold text-zinc-650 mt-1 font-medium break-all">
                                    {user?.email || "deepanshu.dashore@gmail.com"}
                                  </span>
                                </div>

                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-32 shrink-0">
                                    Phone Number
                                  </span>
                                  <span className="text-xs font-bold text-zinc-650 mt-1 font-medium">
                                    {user?.mobileNumber || profileForm.mobileNumber || "+91 12345 67890"}
                                  </span>
                                </div>
                              </div>

                              <div className="shrink-0 pt-2 sm:pt-0">
                                <button
                                  onClick={() => handleTabChange("settings")}
                                  className="border border-[#ec7700] text-[#ec7700] hover:bg-[#ec7700] hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest py-3 px-6 rounded-xs font-heading cursor-pointer"
                                >
                                  EDIT DETAILS
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Bottom: Saved Addresses (col-span-7) */}
                      <div className="lg:col-span-7 h-full mt-6">
                        <div className="bg-white border border-border-accent p-6 rounded-2xl flex flex-col h-full justify-between">
                          <div>
                            <div className="flex justify-between items-center pb-4 border-b border-surface-soft mb-6">
                              <div className="flex items-center gap-2.5">
                                <MapPin size={16} className="text-black stroke-[2.5]" />
                                <h3 className="font-heading font-black text-xs uppercase tracking-wider text-black">
                                  SAVED ADDRESSES
                                </h3>
                              </div>
                              <button
                                onClick={() => handleTabChange("addresses")}
                                className="text-[10px] font-bold text-[#ec7700] hover:text-[#ec7700]/85 uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>View All Addresses</span>
                                <ArrowRight size={11} className="stroke-[2.5]" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {addresses.length > 0 ? (
                                (() => {
                                  const primaryAddress = addresses[0];
                                  return (
                                    <div className="border border-border-accent bg-white p-4 rounded-xl flex flex-col justify-between hover:border-[#ec7700]/20 transition-all duration-300 min-h-[145px]">
                                      <div className="space-y-2.5">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[8px] font-black border border-[#ec7700] text-[#ec7700] bg-orange-50/50 px-2.5 py-0.5 tracking-wider uppercase rounded-xs">
                                            HOME
                                          </span>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="font-heading font-black text-xs text-black uppercase tracking-tight">
                                            {getFullName() || "Deepanshu Dashore"}
                                          </p>
                                          <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-tight leading-normal">
                                            {primaryAddress.streetAddress},
                                          </p>
                                          <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-tight leading-normal">
                                            {primaryAddress.city}, {primaryAddress.state} - {primaryAddress.zipCode}
                                          </p>
                                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide mt-1">
                                            {primaryAddress.country} | {user?.mobileNumber || profileForm.mobileNumber || "+91 12345 67890"}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-4 pt-3.5 mt-3 border-t border-surface-soft">
                                        <button
                                          onClick={() => {
                                            handleTabChange("addresses");
                                            handleAddressEdit(primaryAddress);
                                          }}
                                          className="text-[10px] font-black text-zinc-650 hover:text-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                                        >
                                          <Edit2 size={11} className="text-[#ec7700]" />
                                          <span>Edit</span>
                                        </button>
                                        <button
                                          onClick={() => handleAddressDelete(primaryAddress._id)}
                                          className="text-[10px] font-black text-zinc-650 hover:text-red-600 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                                        >
                                          <Trash2 size={11} className="text-zinc-400" />
                                          <span>Delete</span>
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })()
                              ) : (
                                <div className="border border-border-accent bg-white p-4 rounded-xl flex flex-col justify-between hover:border-[#ec7700]/20 transition-all duration-300 min-h-[145px]">
                                  <div className="space-y-2.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[8px] font-black border border-[#ec7700] text-[#ec7700] bg-orange-50/50 px-2.5 py-0.5 tracking-wider uppercase rounded-xs">
                                        HOME
                                      </span>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="font-heading font-black text-xs text-black uppercase tracking-tight">
                                        {getFullName() || "Deepanshu Dashore"}
                                      </p>
                                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-tight leading-normal">
                                        123, Ward No. 10, Station Road,
                                      </p>
                                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-tight leading-normal">
                                        Khandwa, Madhya Pradesh - 450001
                                      </p>
                                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide mt-1">
                                        India | {user?.mobileNumber || profileForm.mobileNumber || "+91 12345 67890"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 pt-3.5 mt-3 border-t border-surface-soft">
                                    <button
                                      onClick={() => {
                                        handleTabChange("addresses");
                                        setIsAddingAddress(true);
                                      }}
                                      className="text-[10px] font-black text-zinc-650 hover:text-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <Edit2 size={11} className="text-[#ec7700]" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        toast.error("Mock address cannot be deleted. Add a new address first!");
                                      }}
                                      className="text-[10px] font-black text-zinc-650 hover:text-red-600 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <Trash2 size={11} className="text-zinc-400" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              <div 
                                onClick={() => {
                                  handleTabChange("addresses");
                                  setIsAddingAddress(true);
                                }}
                                className="border border-dashed border-zinc-300 hover:border-black bg-zinc-50/20 hover:bg-zinc-50/40 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-300 min-h-[145px]"
                              >
                                <div className="w-9 h-9 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 mb-2">
                                  <Plus size={16} />
                                </div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                                  Add New Address
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* ── TAB: ACCOUNT INFO ── */}
                {activeTab === "settings" && (
                  <div className="bg-white border border-border-accent p-8 space-y-8 shadow-sm rounded-2xl">
                    <div className="border-b border-surface-soft pb-4">
                      <h2 className="text-lg font-black uppercase tracking-wider font-heading text-black leading-none">
                        Account Information
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">Update your personal profile and mobile details.</p>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div className="relative group">
                          <label className="text-[9px] font-bold text-gray-450 uppercase tracking-widest block mb-2 group-focus-within:text-black transition-colors">
                            FIRST NAME <span className="text-[#ec7700]">*</span>
                          </label>
                          <input
                            type="text"
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                            className="w-full border border-border-accent focus:border-black rounded-lg px-4 py-3.5 text-xs focus:outline-none font-bold uppercase tracking-wider bg-white text-black transition-colors"
                            required
                          />
                        </div>

                        {/* Last Name */}
                        <div className="relative group">
                          <label className="text-[9px] font-bold text-gray-450 uppercase tracking-widest block mb-2 group-focus-within:text-black transition-colors">
                            LAST NAME <span className="text-[#ec7700]">*</span>
                          </label>
                          <input
                            type="text"
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                            className="w-full border border-border-accent focus:border-black rounded-lg px-4 py-3.5 text-xs focus:outline-none font-bold uppercase tracking-wider bg-white text-black transition-colors"
                            required
                          />
                        </div>
                      </div>

                      {/* Mobile Number */}
                      <div className="relative group">
                        <label className="text-[9px] font-bold text-gray-450 uppercase tracking-widest block mb-2 group-focus-within:text-black transition-colors">
                          MOBILE NUMBER
                        </label>
                        <input
                          type="tel"
                          value={profileForm.mobileNumber}
                          onChange={(e) => setProfileForm({ ...profileForm, mobileNumber: e.target.value })}
                          className="w-full border border-border-accent focus:border-black rounded-lg px-4 py-3.5 text-xs focus:outline-none font-bold bg-white text-black transition-colors"
                          placeholder="Enter mobile number"
                        />
                      </div>

                      {/* Email Address */}
                      <div className="relative">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                            EMAIL ADDRESS
                          </label>
                          <span className="text-[8px] font-bold text-gray-400 bg-surface-soft uppercase tracking-wider px-2.5 py-1 leading-none">
                            LOCKED FOR SECURITY
                          </span>
                        </div>
                        <input
                          type="email"
                          value={profileForm.email}
                          disabled
                          className="w-full border border-border-accent rounded-none px-4 py-3.5 text-xs bg-surface-soft text-gray-400 focus:outline-none font-semibold cursor-not-allowed"
                        />
                        <span className="text-[9px] text-gray-400 mt-2 block leading-relaxed">
                          To update your registered email address, please contact Disport Athlete Hub customer support directly.
                        </span>
                      </div>

                      <div className="flex gap-4 pt-2 font-heading">
                        <button
                          type="submit"
                          disabled={isUpdatingProfile}
                          className="bg-[#ec7700] text-white hover:bg-black transition-all duration-300 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 cursor-pointer w-full sm:w-auto disabled:opacity-60 rounded-lg"
                        >
                          {isUpdatingProfile ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>UPDATING DETAILS...</span>
                            </>
                          ) : (
                            <span>SAVE SETTINGS</span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTabChange("dashboard")}
                          className="border border-black bg-transparent text-black hover:bg-black hover:text-white transition-all duration-300 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] cursor-pointer rounded-lg w-full sm:w-auto"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── TAB: TEAMWEAR REQUESTS ── */}
                {activeTab === "teamwear" && (
                  <div className="space-y-8">
                    
                    {/* Inquiry Submission Form */}
                    <div className="bg-white border border-border-accent p-8 space-y-8 shadow-sm rounded-2xl">
                      <div className="border-b border-surface-soft pb-4">
                        <h2 className="text-lg font-black uppercase tracking-wider font-heading text-black leading-none">
                          Teamwear Consultation Inquiry
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">Design and engineer custom jerseys and gear for your team.</p>
                      </div>

                      <form onSubmit={handleTeamwearSubmit} className="space-y-6 max-w-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Team Name */}
                          <div className="relative group">
                            <label className="text-[9px] font-bold text-gray-450 uppercase tracking-widest block mb-2 group-focus-within:text-black transition-colors">
                              CLUB / TEAM NAME <span className="text-[#ec7700]">*</span>
                            </label>
                            <input
                              type="text"
                              value={teamwearForm.teamName}
                              onChange={(e) => setTeamwearForm({ ...teamwearForm, teamName: e.target.value })}
                              placeholder="e.g. Thunder Football Club"
                              className="w-full border border-border-accent focus:border-black rounded-lg px-4 py-3.5 text-xs focus:outline-none font-bold uppercase bg-white text-black transition-colors"
                              required
                            />
                          </div>

                          {/* Sport Type */}
                          <div className="relative group">
                            <label className="text-[9px] font-bold text-gray-450 uppercase tracking-widest block mb-2">
                              SPORT TYPE
                            </label>
                            <select
                              value={teamwearForm.sportType}
                              onChange={(e) => setTeamwearForm({ ...teamwearForm, sportType: e.target.value })}
                              className="w-full border border-border-accent focus:border-black rounded-lg px-4 py-3.5 text-xs focus:outline-none font-bold uppercase bg-white text-black transition-colors"
                            >
                              <option value="Cricket">Cricket</option>
                              <option value="Football">Football</option>
                              <option value="Basketball">Basketball</option>
                              <option value="Athletics">Athletics</option>
                              <option value="School/Academy">School / Academy</option>
                              <option value="Corporate">Corporate Event</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Quantity */}
                          <div className="relative group">
                            <label className="text-[9px] font-bold text-gray-450 uppercase tracking-widest block mb-2">
                              ESTIMATED QUANTITY
                            </label>
                            <select
                              value={teamwearForm.quantity}
                              onChange={(e) => setTeamwearForm({ ...teamwearForm, quantity: e.target.value })}
                              className="w-full border border-border-accent focus:border-black rounded-lg px-4 py-3.5 text-xs focus:outline-none font-bold uppercase bg-white text-black transition-colors"
                            >
                              <option value="15-50">15 - 50 units</option>
                              <option value="50-100">50 - 100 units</option>
                              <option value="100-250">100 - 250 units</option>
                              <option value="250+">250+ units (Bulk)</option>
                            </select>
                          </div>

                          {/* Phone Contact */}
                          <div className="relative group">
                            <label className="text-[9px] font-bold text-gray-450 uppercase tracking-widest block mb-2 group-focus-within:text-black transition-colors">
                              CONTACT PHONE NUMBER <span className="text-[#ec7700]">*</span>
                            </label>
                            <input
                              type="tel"
                              value={teamwearForm.phone}
                              onChange={(e) => setTeamwearForm({ ...teamwearForm, phone: e.target.value })}
                              placeholder="e.g. +91 99999 88888"
                              className="w-full border border-border-accent focus:border-black rounded-lg px-4 py-3.5 text-xs focus:outline-none font-bold bg-white text-black transition-colors"
                              required
                            />
                          </div>
                        </div>

                        {/* Contact Name */}
                        <div className="relative group">
                          <label className="text-[9px] font-bold text-gray-450 uppercase tracking-widest block mb-2 group-focus-within:text-black transition-colors">
                            CONTACT PERSON NAME <span className="text-[#ec7700]">*</span>
                          </label>
                          <input
                            type="text"
                            value={teamwearForm.contactName}
                            onChange={(e) => setTeamwearForm({ ...teamwearForm, contactName: e.target.value })}
                            placeholder="e.g. Deepanshu Dashore"
                            className="w-full border border-border-accent focus:border-black rounded-lg px-4 py-3.5 text-xs focus:outline-none font-bold uppercase bg-white text-black transition-colors"
                            required
                          />
                        </div>

                        {/* Details */}
                        <div className="relative group">
                          <label className="text-[9px] font-bold text-gray-450 uppercase tracking-widest block mb-2 group-focus-within:text-black transition-colors">
                            DESIGN REQUIREMENTS / ADDITIONAL DETAILS
                          </label>
                          <textarea
                            value={teamwearForm.details}
                            onChange={(e) => setTeamwearForm({ ...teamwearForm, details: e.target.value })}
                            placeholder="Describe colors, logos, sizing, fabric properties, or key details..."
                            rows={4}
                            className="w-full border border-border-accent focus:border-black rounded-lg px-4 py-3.5 text-xs focus:outline-none font-medium bg-white text-black transition-colors"
                          />
                        </div>

                        <button
                          type="submit"
                          className="bg-[#ec7700] text-white hover:bg-black transition-all duration-300 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 cursor-pointer w-full sm:w-auto rounded-lg font-heading"
                        >
                          <span>SUBMIT TEAM REQUEST</span>
                          <ArrowRight size={13} />
                        </button>
                      </form>
                    </div>

                    {/* Inquiries Log */}
                    <div className="bg-white border border-border-accent p-8 space-y-6 shadow-sm rounded-2xl">
                      <div className="border-b border-surface-soft pb-3">
                        <h3 className="text-xs font-black uppercase tracking-wider text-black font-heading">
                          YOUR ACTIVE REQUESTS
                        </h3>
                      </div>

                      {teamwearInquiries.length > 0 ? (
                        <div className="space-y-4">
                          {teamwearInquiries.map((inq) => (
                            <div 
                              key={inq.id}
                              className="border border-border-accent p-5 hover:border-black transition-all duration-300 rounded-none bg-[#F8F8F8] flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-mono bg-black text-white px-2 py-0.5 font-bold tracking-widest uppercase">
                                    {inq.id}
                                  </span>
                                  <span className="font-bold text-black uppercase">{inq.teamName}</span>
                                </div>
                                <p className="text-gray-500 font-medium pt-1 uppercase tracking-tight">
                                  {inq.sportType} &bull; Qty: {inq.quantity} &bull; Contact: {inq.contactName}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <span className="text-[9px] text-gray-400 block font-bold uppercase tracking-widest mb-0.5">STATUS</span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-orange-50 text-[#ec7700] border border-orange-200">
                                    {inq.status}
                                  </span>
                                </div>
                                <span className="text-[10px] text-gray-450 font-mono font-bold block sm:pl-4 sm:border-l sm:border-gray-200">
                                  {formatDate(inq.createdAt)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 flex flex-col items-center justify-center text-xs space-y-2">
                          <Inbox className="w-8 h-8 text-gray-300" />
                          <p className="text-gray-400 font-bold uppercase tracking-widest">No active team inquiries logged</p>
                          <p className="text-gray-400 max-w-xs leading-normal uppercase">
                            Submit a consultant request above to start your custom jersey design process.
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* ── TAB: ORDERS HISTORY ── */}
                {activeTab === "orders" && (
                  <div className="bg-white border border-border-accent p-8 space-y-8 shadow-sm rounded-2xl">
                    <div className="border-b border-surface-soft pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                      <div>
                        <h2 className="text-lg font-black uppercase tracking-wider font-heading text-black leading-none">
                          Order History
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">Track shipping details and invoice records.</p>
                      </div>
                      <Link 
                        href="/products"
                        className="bg-black hover:bg-[#ec7700] text-white transition-colors duration-300 px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest font-heading rounded-lg flex items-center gap-1.5"
                      >
                        <span>NEW ORDER Inquiry</span>
                        <ArrowRight size={11} />
                      </Link>
                    </div>

                    {ordersLoading ? (
                      <div className="py-20 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-[#ec7700]" />
                        <span className="text-xs text-gray-400 uppercase tracking-widest font-bold font-heading">RETRIEVING ORDERS...</span>
                      </div>
                    ) : displayedOrders.length > 0 ? (
                      <div className="space-y-6">
                        {displayedOrders.map((order) => {
                          const isExpanded = expandedOrderId === order._id;
                          const products = order.products || [];
                          const dateLabel = formatDate(order.createdAt);
                          const totalAmt = order.totalAmount || order.totalPrice || order.finalAmount || 0;
                          
                          return (
                            <div 
                              key={order._id} 
                              className={`border transition-all duration-300 rounded-2xl bg-white ${
                                isExpanded ? "border-black shadow-sm" : "border-border-accent hover:border-black"
                              }`}
                            >
                              {/* Order Header Summary Row */}
                              <div 
                                onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-5 cursor-pointer select-none font-heading"
                              >
                                <div className="space-y-1">
                                  <span className="text-[9px] font-mono font-bold text-gray-405 block uppercase tracking-widest">
                                    ORDER ID: #{order._id.toUpperCase()}
                                  </span>
                                  <div className="flex flex-wrap items-center gap-3.5">
                                    <span className="text-xs font-black text-black block uppercase tracking-wider">
                                      Placed: {dateLabel}
                                    </span>
                                    <span className="text-gray-200 text-xs hidden sm:inline">|</span>
                                    <span className="text-[10px] text-gray-450 font-bold tracking-widest uppercase block">
                                      {products.length} {products.length === 1 ? "Item" : "Items"}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                  <div className="text-right sm:mr-3">
                                    <span className="text-[9px] text-gray-405 font-bold block uppercase tracking-widest leading-none mb-1">TOTAL PRICE</span>
                                    <span className="text-sm font-black text-black font-mono">
                                      ₹{totalAmt.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3.5 shrink-0">
                                    <span className={`inline-flex items-center px-3 py-1 text-[9px] font-bold uppercase tracking-wider border rounded-full ${getStatusColor(order.status)}`}>
                                      {order.status}
                                    </span>
                                    <div className="w-8 h-8 rounded-md border border-border-accent flex items-center justify-center bg-white hover:border-black transition-colors">
                                      <ChevronDown size={14} className={`transition-transform duration-350 ${isExpanded ? "rotate-180" : ""}`} />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Expandable Order Details */}
                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden bg-[#F8F8F8] border-t border-border-accent"
                                  >
                                    <div className="p-8 space-y-8">
                                      
                                      {/* Tracking Progress Timeline */}
                                      <div className="pt-2 pb-8 px-2 border-b border-border-accent/80 relative z-10">
                                        <div className="flex justify-between items-center mb-6">
                                          <h4 className="text-[9px] font-bold text-gray-450 uppercase tracking-widest">DELIVERY STATUS PIPELINE</h4>
                                        </div>
                                        
                                        <div className="grid grid-cols-4 text-center relative max-w-lg mx-auto">
                                          {/* Background connecting bar */}
                                          <div className="absolute top-[15px] left-[12.5%] right-[12.5%] h-[2px] bg-gray-200 -z-0">
                                            <div 
                                              className="h-full bg-black transition-all duration-700 ease-out" 
                                              style={{ 
                                                width: order.status === "Pending" ? "0%" 
                                                      : order.status === "Processing" ? "33%" 
                                                      : order.status === "Shipped" ? "66%" 
                                                      : order.status === "Delivered" ? "100%" : "0%"
                                              }} 
                                            />
                                          </div>

                                          {[
                                            { label: "ORDERED", status: "Pending", icon: Package },
                                            { label: "PROCESSED", status: "Processing", icon: Settings },
                                            { label: "SHIPPED", status: "Shipped", icon: Truck },
                                            { label: "DELIVERED", status: "Delivered", icon: CheckCircle }
                                          ].map((step, sIdx) => {
                                            const stepStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
                                            const currentStatusIdx = stepStatuses.indexOf(order.status);
                                            const stepIdx = stepStatuses.indexOf(step.status);
                                            const isDone = currentStatusIdx >= stepIdx && order.status !== "Cancelled";
                                            const isActive = order.status === step.status;
                                            const StepIcon = step.icon;

                                            return (
                                              <div key={sIdx} className="flex flex-col items-center relative z-10">
                                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${
                                                  isActive
                                                    ? "bg-[#ec7700] text-white border-[#ec7700]"
                                                    : isDone 
                                                      ? "bg-black text-white border-black" 
                                                      : "bg-white text-gray-300 border-gray-200 shadow-sm"
                                                }`}>
                                                  <StepIcon size={12} />
                                                </div>
                                                <span className={`text-[8px] font-bold tracking-widest mt-2.5 block ${
                                                  isDone ? "text-black font-black" : "text-gray-400"
                                                }`}>
                                                  {step.label}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Order Products List */}
                                      <div className="space-y-4">
                                        <h4 className="text-[9px] font-bold text-gray-405 uppercase tracking-widest">ORDERED PRODUCTS</h4>
                                        <div className="space-y-3">
                                          {products.map((item, pIdx) => (
                                            <div key={pIdx} className="flex items-center gap-5 p-4 border border-border-accent bg-white hover:border-black transition-colors duration-300">
                                              <div className="relative w-16 h-20 bg-[#F8F8F8] border border-border-accent shrink-0 rounded-lg overflow-hidden">
                                                <Image 
                                                  src={item.productImage || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop"} 
                                                  alt={item.productName} 
                                                  fill 
                                                  className="object-cover p-0.5" 
                                                />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <h5 className="text-xs font-bold text-black uppercase tracking-tight truncate">
                                                  {item.productName}
                                                </h5>
                                                <div className="flex gap-4 text-[9px] text-gray-400 font-bold uppercase mt-1">
                                                  <span>QTY: {item.quantity}</span>
                                                  {item.selectedVariant && (
                                                    <>
                                                      <span className="text-gray-200">/</span>
                                                      <span>SIZE: {item.selectedVariant.size}</span>
                                                      <span className="text-gray-200">/</span>
                                                      <span>COLOR: {item.selectedVariant.color}</span>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                              <div className="text-right font-mono text-xs text-black font-bold">
                                                <span>₹{((item.productDiscountPrice || 0) * item.quantity).toLocaleString()}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Order Specs details info block */}
                                      <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-border-accent text-xs">
                                        <div>
                                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">SHIPPING DESTINATION</span>
                                          <p className="font-bold text-black uppercase tracking-tight leading-relaxed">
                                            {typeof order.shippingAddress === "string" 
                                              ? order.shippingAddress 
                                              : `${order.shippingAddress?.streetAddress || ""}, ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""} ${order.shippingAddress?.zipCode || ""}`}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">PAYMENT DETAILS</span>
                                          <p className="font-bold text-black uppercase tracking-wider">
                                            {order.paymentMethod || "Online Transaction"}
                                          </p>
                                          <div className="mt-2.5 flex items-center gap-1.5 text-[9px] text-[#ec7700] font-bold uppercase tracking-wider leading-none">
                                            <CheckCircle size={10} />
                                            <span>PAYMENT RECEIVED & CONFIRMED</span>
                                          </div>
                                        </div>
                                      </div>

                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-20 border border-border-accent space-y-4 rounded-2xl bg-white">
                        <Package className="w-8 h-8 text-gray-300 mx-auto" />
                        <p className="text-xs text-gray-450 font-bold uppercase tracking-wider">No Orders Logged</p>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto leading-normal uppercase">
                          No order records could be found. Customize or shop to start history telemetry.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── TAB: ADDRESS MANAGEMENT ── */}
                {activeTab === "addresses" && (
                  <div className="bg-white border border-border-accent p-8 space-y-8 shadow-sm rounded-2xl">
                    <div className="border-b border-surface-soft pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                      <div>
                        <h2 className="text-lg font-black uppercase tracking-wider font-heading text-black leading-none">
                          Saved Shipping Destinations
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">Manage delivery locations and primary settings.</p>
                      </div>
                      {!isAddingAddress && (
                        <button
                          onClick={() => setIsAddingAddress(true)}
                          className="flex items-center gap-2 bg-[#ec7700] text-white hover:bg-black transition-all duration-300 px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest cursor-pointer font-heading rounded-none"
                        >
                          <Plus size={12} />
                          <span>ADD NEW ADDRESS</span>
                        </button>
                      )}
                    </div>

                    {/* Address Form block */}
                    {isAddingAddress && (
                      <div className="border border-border-accent rounded-2xl p-6 sm:p-8 bg-[#F8F8F8] space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-wider text-black font-heading">
                          {editingAddressId ? "MODIFY ADDRESS RECORDS" : "NEW SHIPPING ADDRESS"}
                        </h3>

                        <form onSubmit={handleAddressSubmit} className="space-y-6">
                          <div className="relative group">
                            <label className="text-[9px] font-bold text-gray-455 uppercase tracking-widest block mb-2 group-focus-within:text-black transition-colors">
                              STREET ADDRESS <span className="text-[#ec7700]">*</span>
                            </label>
                            <input
                              type="text"
                              value={addressForm.streetAddress}
                              onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                              placeholder="House no., Building, Street name"
                              className="w-full border border-border-accent focus:border-black rounded-lg bg-white px-4 py-3.5 text-xs focus:outline-none font-bold uppercase text-black transition-colors"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="relative group">
                              <label className="text-[9px] font-bold text-gray-455 uppercase tracking-widest block mb-2 group-focus-within:text-black transition-colors">
                                CITY <span className="text-[#ec7700]">*</span>
                              </label>
                              <input
                                type="text"
                                value={addressForm.city}
                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                placeholder="City"
                                className="w-full border border-border-accent focus:border-black rounded-lg bg-white px-4 py-3.5 text-xs focus:outline-none font-bold uppercase text-black transition-colors"
                                required
                              />
                            </div>
                            <div className="relative group">
                              <label className="text-[9px] font-bold text-gray-455 uppercase tracking-widest block mb-2 group-focus-within:text-black transition-colors">
                                STATE <span className="text-[#ec7700]">*</span>
                              </label>
                              <input
                                type="text"
                                value={addressForm.state}
                                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                placeholder="State"
                                className="w-full border border-border-accent focus:border-black rounded-lg bg-white px-4 py-3.5 text-xs focus:outline-none font-bold uppercase text-black transition-colors"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="relative group">
                              <label className="text-[9px] font-bold text-gray-455 uppercase tracking-widest block mb-2 group-focus-within:text-black transition-colors">
                                PINCODE / ZIP CODE <span className="text-[#ec7700]">*</span>
                              </label>
                              <input
                                type="text"
                                value={addressForm.zipCode}
                                onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                                placeholder="Pincode"
                                className="w-full border border-border-accent focus:border-black rounded-lg bg-white px-4 py-3.5 text-xs focus:outline-none font-mono font-bold text-black transition-colors"
                                required
                              />
                            </div>
                            <div className="relative group">
                              <label className="text-[9px] font-bold text-gray-450 uppercase tracking-widest block mb-2">
                                COUNTRY / REGION
                              </label>
                              <select
                                value={addressForm.country}
                                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                className="w-full border border-border-accent rounded-none bg-white px-4 py-3.5 text-xs focus:outline-none focus:border-black font-bold uppercase text-black transition-colors"
                              >
                                <option value="India">India</option>
                                <option value="United States">United States</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex gap-4 pt-4 font-heading">
                            <button
                              type="submit"
                              disabled={isCreatingAddress || isUpdatingAddress}
                              className="bg-[#ec7700] text-white hover:bg-black transition-all duration-300 px-8 py-4 text-xs font-bold uppercase tracking-widest cursor-pointer disabled:opacity-60 rounded-lg flex-1 sm:flex-none"
                            >
                              {isCreatingAddress || isUpdatingAddress ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <span>SAVE DETAILS</span>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={resetAddressForm}
                              className="border border-black bg-transparent text-black hover:bg-black hover:text-white transition-colors duration-300 px-8 py-4 text-xs font-bold uppercase tracking-widest cursor-pointer rounded-lg flex-1 sm:flex-none"
                            >
                              CANCEL
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Addresses List Grid */}
                    {addressesLoading ? (
                      <div className="py-10 flex justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[#ec7700]" />
                      </div>
                    ) : addresses.length > 0 ? (
                      <div className="space-y-4">
                        {addresses.map((addr, idx) => (
                          <div 
                            key={addr._id}
                            className="border border-border-accent bg-white p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-6 hover:border-black transition-all duration-300 rounded-xl relative shadow-sm"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
                              {/* Left Info: Address tag & Primary indicator */}
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="text-[10px] font-black font-heading text-black bg-surface-soft px-3 py-1.5 tracking-wider">
                                  ADDRESS #{idx + 1}
                                </span>
                                {idx === 0 && (
                                  <span className="text-[8px] bg-black text-[#ec7700] font-mono font-bold uppercase tracking-widest px-2.5 py-1">
                                    PRIMARY
                                  </span>
                                )}
                              </div>

                              {/* Middle Info: Address Text Details */}
                              <div className="text-xs text-text-primary min-w-0 flex-1">
                                <p className="font-bold text-black uppercase tracking-tight truncate leading-tight">
                                  {addr.streetAddress}
                                </p>
                                <p className="text-text-secondary font-semibold uppercase mt-1 tracking-tight truncate">
                                  {addr.city}, {addr.state} {addr.zipCode} &bull; <span className="font-black text-black">{addr.country}</span>
                                </p>
                              </div>
                            </div>

                            {/* Right Info: Action Buttons */}
                            <div className="flex items-center gap-3 shrink-0 sm:border-l sm:border-surface-soft sm:pl-6">
                              <button
                                onClick={() => handleAddressEdit(addr)}
                                className="border border-black bg-transparent text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-1.5 rounded-none cursor-pointer"
                              >
                                <Edit2 size={11} />
                                <span>MODIFY</span>
                              </button>
                              <button
                                onClick={() => handleAddressDelete(addr._id)}
                                className="border border-black bg-transparent text-[#ba1a1a] hover:border-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 rounded-none cursor-pointer"
                              >
                                <Trash2 size={11} />
                                <span>DELETE</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      !isAddingAddress && (
                        <div className="text-center py-20 border border-border-accent space-y-4 rounded-2xl bg-white shadow-sm">
                          <MapPin className="w-8 h-8 text-gray-300 mx-auto" />
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">No Addresses Logged</p>
                          <button 
                            onClick={() => setIsAddingAddress(true)}
                            className="text-[10px] font-bold uppercase bg-[#ec7700] text-white hover:bg-black transition-all duration-300 px-8 py-4 cursor-pointer font-heading rounded-none"
                          >
                            REGISTER NEW ADDRESS
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* ── RECOMMENDED FOR YOU (Full Width) ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 pt-12 border-t border-border-accent">
            <div className="flex justify-between items-end pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-black font-heading">
                RECOMMENDED FOR YOU
              </h3>
              <Link 
                href="/products" 
                className="text-[10px] font-bold text-[#ec7700] hover:text-black uppercase tracking-widest transition-colors flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {RECOMMENDED_PRODUCTS.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={{
                    id: prod.id,
                    name: prod.name,
                    category: prod.category,
                    price: `₹${prod.price}`,
                    image: prod.image,
                    imageAlt: prod.name,
                    rating: 5
                  }}
                  disableVariants={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── ACHIEVEMENTS (Full Width) ── */}
        {activeTab === "dashboard" && (
          <div className="w-full bg-[#0c0c0d] border border-white/10 rounded-2xl py-4 px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden select-none mt-12">
            {/* Achievements Label */}
            <div className="font-heading font-black text-[13px] tracking-[0.2em] text-white uppercase shrink-0">
              ACHIEVEMENTS
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-[1px] h-10 bg-white/15 shrink-0" />

            {/* Achievements List */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-1 gap-6 md:gap-4 w-full">
              {/* Badge 1 */}
              <div className="flex items-center gap-3.5 flex-1">
                <WreathBadge isUnlocked={orderCount >= 1} icon={ShoppingBag} />
                <div className="space-y-0.5 leading-none">
                  <span className="text-[10px] font-black tracking-wider text-white block">FIRST PURCHASE</span>
                  <span className="text-[9px] text-[#ec7700] font-bold block uppercase tracking-wide">Unlocked</span>
                </div>
              </div>

              <div className="hidden sm:block w-[1px] h-10 bg-white/10 shrink-0" />

              {/* Badge 2 */}
              <div className="flex items-center gap-3.5 flex-1">
                <WreathBadge isUnlocked={teamwearInquiries.length >= 1} icon={Users} />
                <div className="space-y-0.5 leading-none">
                  <span className="text-[10px] font-black tracking-wider text-white block">TEAM PLAYER</span>
                  <span className={`text-[9px] font-bold block uppercase tracking-wide ${teamwearInquiries.length >= 1 ? "text-[#ec7700]" : "text-white/30"}`}>
                    {teamwearInquiries.length >= 1 ? "Unlocked" : "Locked"}
                  </span>
                </div>
              </div>

              <div className="hidden sm:block w-[1px] h-10 bg-white/10 shrink-0" />

              {/* Badge 3 */}
              <div className="flex items-center gap-3.5 flex-1">
                <WreathBadge isUnlocked={orderCount >= 3} icon={Award} />
                <div className="space-y-0.5 leading-none">
                  <span className="text-[10px] font-black tracking-wider text-white block">ELITE ATHLETE</span>
                  <span className={`text-[9px] font-bold block uppercase tracking-wide ${orderCount >= 3 ? "text-[#ec7700]" : "text-white/30"}`}>
                    {orderCount >= 3 ? "Unlocked" : "Locked"}
                  </span>
                </div>
              </div>

              <div className="hidden sm:block w-[1px] h-10 bg-white/10 shrink-0" />

              {/* Badge 4 */}
              <div className="flex items-center gap-3.5 flex-1">
                <WreathBadge isUnlocked={true} icon={Shield} />
                <div className="space-y-0.5 leading-none">
                  <span className="text-[10px] font-black tracking-wider text-white block">LOYAL CUSTOMER</span>
                  <span className="text-[9px] text-[#ec7700] font-bold block uppercase tracking-wide">Unlocked</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default function AccountDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center py-40">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <span className="text-xs uppercase tracking-widest text-gray-400">Loading Account Details...</span>
        </div>
      </div>
    }>
      <AccountDashboardContent />
    </Suspense>
  );
}
