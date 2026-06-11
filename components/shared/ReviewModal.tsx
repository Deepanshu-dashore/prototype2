'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Camera, Trash2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useMutationApi } from '@/hooks/useApi';
import API_ENDPOINTS from '@/app/constants/apiConfig';

const resolveImageUrl = (imgUrl: string) => {
  if (!imgUrl) return '';
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('/')) {
    return imgUrl;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2500';
  return `${baseUrl}/uploads/product/${imgUrl}`;
};

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  product: any;
  onReviewAdded?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, product, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);

  // Product Experience States
  const [sizeRating, setSizeRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [comfortRating, setComfortRating] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 5 - images.length);
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const productId = product?._id || product?.id || "";

  const addReviewMutation = useMutationApi({
    key: `reviews-${productId}`,
    url: API_ENDPOINTS.REVIEW.CREATE(productId),
    method: "POST",
    requireAuth: true,
    multiPart: true,
    options: {
      onSuccess: (data) => {
        console.log("review added", data);
        toast.success("Review submitted successfully!");
        onClose();
        
        // Reset form
        setRating(0);
        setDescription("");
        setImages([]);
        setSizeRating(0);
        setQualityRating(0);
        setComfortRating(0);
        
        if (onReviewAdded) onReviewAdded();
      },
      onError: (err: any) => {
        console.error("Error adding review", err);
        toast.error(err.message || "Failed to add review");
      },
    },
  });

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!description || description.trim().length < 10) {
      toast.error("Please provide a detailed review (at least 10 characters)");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("rating", String(rating));
      formData.append("comment", description.trim());
      formData.append("sizeRating", String(sizeRating || 5));
      formData.append("qualityRating", String(qualityRating || 5));
      formData.append("comfortRating", String(comfortRating || 5));
      images.forEach((img) => {
        formData.append("media", img);
      });

      await addReviewMutation.mutateAsync({
        payload: formData,
      });
    } catch (err) {
      console.log("Failed to submit review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || !rating || description.length < 10;

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="relative w-full max-w-4xl bg-white rounded-none shadow-2xl overflow-hidden my-auto border border-gray-100"
          >
            {/* Header / Product Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border-b border-gray-100 gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 bg-surface-soft border border-gray-100 flex-shrink-0">
                  <Image 
                    src={resolveImageUrl(product?.images?.[0] || product?.productImage?.[0] || product?.image || "") || "/disport_sneakers_product_1778407255046.png"} 
                    alt={product?.productName || product?.name || "Product"} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-primary-bright font-lexend">Athlete Assessment</span>
                  <h2 className="text-base font-bold uppercase tracking-tight text-text-primary font-heading mt-0.5 leading-none">{product?.productName || product?.name || "Product"}</h2>
                  <div className="flex items-center gap-3 mt-1.5 text-[9px] font-bold text-gray-400 font-lexend uppercase">
                    <span className="flex items-center gap-1">
                      <Star size={10} className="fill-gray-400 text-gray-400" /> {product?.averageRating || product?.rating || 0}
                    </span>
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                    <span className="text-green-600 flex items-center gap-1">
                      <ShieldCheck size={10} /> Verified Purchase
                    </span>
                  </div>
                </div>
              </div>

              {/* Overall Star Rating Selector in Header */}
              <div className="flex items-center gap-6 md:ml-auto justify-between md:justify-end">
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-text-secondary font-lexend">Rate Product</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-colors duration-150 cursor-pointer"
                      >
                        <Star 
                          size={24} 
                          className={`transition-colors duration-150 ${
                            (hoverRating || rating) >= star 
                              ? "fill-primary-bright text-primary-bright" 
                              : "text-gray-200 hover:text-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                {rating > 0 && (
                  <div className="hidden lg:block bg-surface-soft px-3 py-1.5 border border-gray-100 text-[9px] font-bold uppercase tracking-widest text-text-primary font-lexend">
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                  </div>
                )}
                
                <div className="w-px h-10 bg-gray-100 hidden md:block" />
                
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-surface-soft text-text-primary hover:text-primary-bright transition-colors rounded-none cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Left Side: Ratings */}
                <div className="space-y-8">

                  <section className="space-y-6 pt-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-primary border-l-2 border-black pl-2 font-heading">
                      Technical Performance
                    </h3>
                    
                    {[
                      { label: "Size & Fit", state: sizeRating, setter: setSizeRating, min: "Runs Small", max: "Runs Large", mid: "True to Size" },
                      { label: "Material Quality", state: qualityRating, setter: setQualityRating, min: "Standard", max: "Premium", mid: "Excellent" },
                      { label: "Comfort Level", state: comfortRating, setter: setComfortRating, min: "Firm / Responsive", max: "Plush / Max Cushion", mid: "Balanced" }
                    ].map((attr, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-secondary font-lexend">
                          <span>{attr.label}</span>
                          <span className="text-text-primary">{attr.state > 0 ? `${attr.state}/5` : "Not Selected"}</span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((val) => {
                            const isSelected = attr.state === val;
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => attr.setter(val)}
                                className={`flex-1 py-2 text-xs font-bold transition-all border duration-150 cursor-pointer text-center font-lexend
                                  ${isSelected 
                                    ? "bg-black text-white border-black" 
                                    : "bg-surface-soft text-text-secondary border-transparent hover:border-gray-300 hover:bg-gray-100"
                                  }`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-[8px] font-bold uppercase tracking-wider text-gray-400 font-lexend">
                          <span>{attr.min}</span>
                          <span>{attr.mid}</span>
                          <span>{attr.max}</span>
                        </div>
                      </div>
                    ))}
                  </section>
                </div>

                {/* Right Side: Text & Images */}
                <div className="space-y-8">
                  <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-primary border-l-2 border-black pl-2 font-heading">
                      Technical Feedback
                    </h3>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Share your detailed assessment of the gear's performance, breathability, and durability..."
                      className="w-full h-36 bg-surface-soft border border-transparent p-5 text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-all resize-none font-medium placeholder:text-gray-400 font-lexend rounded-none"
                    />
                    <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest font-lexend text-gray-400">
                      <span className={description.length < 10 ? "text-error" : "text-green-600"}>
                        {description.length < 10 ? "Min. 10 Characters Required" : "Assessment Length Valid"}
                      </span>
                      <span>{description.length} Characters</span>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-primary border-l-2 border-black pl-2 font-heading">
                      Visual Proof
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square bg-surface-soft border border-gray-100 group overflow-hidden">
                          <Image 
                            src={URL.createObjectURL(img)} 
                            alt="Review" 
                            fill 
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                          />
                          <button 
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {images.length < 5 && (
                        <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-black hover:bg-surface-soft transition-all duration-150 cursor-pointer group">
                          <Camera size={18} className="text-gray-400 group-hover:text-black transition-colors" />
                          <span className="text-[7px] font-bold uppercase tracking-wider text-gray-400 mt-1.5 group-hover:text-black font-lexend">
                            {images.length}/5 Photos
                          </span>
                          <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Footer / Submit */}
            <div className="p-6 bg-white flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 gap-4">
              <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 max-w-md font-lexend text-center sm:text-left leading-normal">
                By submitting, you confirm that your assessment is honest and reflects your personal experience with the gear.
              </p>
              <button
                onClick={handleSubmit}
                disabled={isDisabled}
                className={`w-full sm:w-auto px-10 py-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 rounded-none font-lexend
                  ${isDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-primary-bright text-white hover:bg-black cursor-pointer shadow-lg hover:shadow-black/10"
                  }`}
              >
                {isSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2 inline-block align-middle" />
                ) : null}
                <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
