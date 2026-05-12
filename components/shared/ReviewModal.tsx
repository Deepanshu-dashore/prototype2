'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Camera, Trash2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

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
      // Mock API Submission logic as per the user's template
      console.log("Submitting review for:", product.id);
      console.log("Data:", {
        rating,
        comment: description.trim(),
        sizeRating,
        qualityRating,
        comfortRating,
        imagesCount: images.length
      });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

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
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-white rounded-sm shadow-2xl overflow-hidden my-auto"
          >
            {/* Header / Product Info */}
            <div className="flex flex-col md:flex-row bg-gray-50 border-b border-gray-100">
              <div className="relative w-full md:w-64 aspect-square bg-gray-200">
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill 
                  className="object-cover grayscale"
                />
              </div>
              <div className="flex-1 p-8 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-bright">Athlete Assessment</span>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter text-gray-900 mt-1">{product.name}</h2>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-200 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Current Rating</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={14} className="fill-black text-black" />
                      <span className="text-sm font-bold">{product.rating}</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Status</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 mt-1 flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified Purchase
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Left Side: Ratings */}
                <div className="space-y-10">
                  <section className="space-y-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 border-l-4 border-black pl-3">
                      Overall Performance
                    </h3>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="transition-transform active:scale-90"
                        >
                          <Star 
                            size={32} 
                            className={`transition-colors ${
                              (hoverRating || rating) >= star 
                                ? "fill-primary-bright text-primary-bright" 
                                : "text-gray-200"
                            }`}
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">
                          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                        </span>
                      )}
                    </div>
                  </section>

                  <section className="space-y-8 pt-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 border-l-4 border-black pl-3">
                      Technical Attributes
                    </h3>
                    
                    {[
                      { label: "Size & Fit", state: sizeRating, setter: setSizeRating, min: "Small", max: "Large" },
                      { label: "Material Quality", state: qualityRating, setter: setQualityRating, min: "Standard", max: "Premium" },
                      { label: "Comfort Level", state: comfortRating, setter: setComfortRating, min: "Firm", max: "Plush" }
                    ].map((attr, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{attr.label}</span>
                          <span className="text-[10px] font-bold text-black">{attr.state}/5</span>
                        </div>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              onClick={() => attr.setter(val)}
                              className={`flex-1 h-2 transition-all ${
                                attr.state >= val ? "bg-black" : "bg-gray-100 hover:bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-gray-400">
                          <span>{attr.min}</span>
                          <span>{attr.max}</span>
                        </div>
                      </div>
                    ))}
                  </section>
                </div>

                {/* Right Side: Text & Images */}
                <div className="space-y-10">
                  <section className="space-y-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 border-l-4 border-black pl-3">
                      Technical Feedback
                    </h3>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Share your detailed assessment of the gear's performance, breathability, and durability..."
                      className="w-full h-40 bg-gray-50 border border-gray-100 p-6 text-sm focus:outline-none focus:border-black transition-all resize-none font-medium placeholder:text-gray-300"
                    />
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                      <span className={description.length < 10 ? "text-primary-bright" : "text-green-600"}>
                        {description.length < 10 ? "Min. 10 Characters Required" : "Assessment Length Valid"}
                      </span>
                      <span className="text-gray-400">{description.length} Characters</span>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 border-l-4 border-black pl-3">
                      Visual Proof
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square bg-gray-100 border border-gray-200 group overflow-hidden">
                          <Image 
                            src={URL.createObjectURL(img)} 
                            alt="Review" 
                            fill 
                            className="object-cover grayscale hover:grayscale-0 transition-all"
                          />
                          <button 
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-black text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      {images.length < 5 && (
                        <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all cursor-pointer group">
                          <Camera size={20} className="text-gray-300 group-hover:text-black transition-colors" />
                          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mt-2 group-hover:text-black">
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
            <div className="p-8 bg-gray-50 flex items-center justify-between border-t border-gray-100">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 max-w-sm">
                By submitting, you confirm that your assessment is honest and reflects your personal experience with the gear.
              </p>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !rating || description.length < 10}
                className="bg-black text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-primary-bright disabled:bg-gray-200 disabled:text-gray-400 transition-all flex items-center gap-3 shadow-xl hover:shadow-primary-bright/20"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : null}
                {isSubmitting ? "Processing..." : "Submit Performance Review"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
