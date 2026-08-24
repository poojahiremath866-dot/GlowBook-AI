import React, { useState } from 'react';
import { Palette, Upload, Sparkles, Loader2, Image as ImageIcon, CheckCircle, ArrowRight } from 'lucide-react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { StyleAnalysisResult } from '../../types';
import { useNotification } from '../../context/NotificationContext';

interface AiStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookServiceByName?: (serviceName: string) => void;
}

export const AiStyleModal: React.FC<AiStyleModalProps> = ({
  isOpen,
  onClose,
  onBookServiceByName,
}) => {
  const { showNotification } = useNotification();
  const [prompt, setPrompt] = useState('Emerald green lehenga with gold embroidery for a grand night sangeet');
  const [occasion, setOccasion] = useState('Evening Sangeet Ceremony');
  const [tone, setTone] = useState('Warm Indian Gold & Jewel Tones');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StyleAnalysisResult | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let base64 = undefined;
      let mimeType = undefined;
      if (imagePreview && imagePreview.includes(',')) {
        const parts = imagePreview.split(',');
        mimeType = parts[0].split(':')[1].split(';')[0];
        base64 = parts[1];
      }

      const res = await api.getAiStyleRecommendation({
        textPrompt: prompt,
        imageBase64: base64,
        imageMimeType: mimeType,
        occasion,
        preferredTone: tone
      });

      if (res.success && res.result) {
        setResult(res.result);
        showNotification('ai', 'Style Match Generated!', 'Gemini color analysis & hairstyle suggestions ready.');
      }
    } catch (err: any) {
      showNotification('error', 'Style AI Error', err.message || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-[#4A0E0E] flex items-center justify-center text-white">
            <Palette className="w-4 h-4 text-[#F2E8E8]" />
          </div>
          <div>
            <h3 className="text-lg font-serif-luxury font-bold text-[#1A1A1A] leading-tight">
              AI Style & Palette Matcher
            </h3>
            <p className="text-xs text-[#5C5C5C]">
              Upload outfit/inspiration images or describe your attire for bespoke styling
            </p>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6 bg-[#FDFBF7]">
        {!result ? (
          <form onSubmit={handleAnalyze} className="space-y-5">
            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">
                Upload Outfit / Inspiration Photo (Optional)
              </label>
              <div className="relative border-2 border-dashed border-[#EAE2D8] rounded-2xl p-4 text-center hover:border-[#8B4B4B] transition-colors bg-[#FAF7F2]">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Outfit preview"
                      className="h-36 rounded-xl object-cover shadow-sm mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-2 -right-2 bg-[#4A0E0E] text-white rounded-full p-1 text-xs shadow-md"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block py-4">
                    <Upload className="w-8 h-8 text-[#888888] mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#1A1A1A]">Click to upload outfit / fabric photo</p>
                    <p className="text-[10px] text-[#888888] mt-0.5">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Prompt & Details */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                Describe Your Outfit / Desired Look
              </label>
              <textarea
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Royal blue silk saree with antique gold border for my sister's evening reception..."
                className="w-full px-3.5 py-2.5 bg-white text-[#1A1A1A] text-xs rounded-xl border border-[#EAE2D8] focus:border-[#4A0E0E] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                  Occasion Type
                </label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white text-[#1A1A1A] text-xs rounded-xl border border-[#EAE2D8] focus:border-[#4A0E0E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                  Preferred Tone
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white text-[#1A1A1A] text-xs rounded-xl border border-[#EAE2D8] focus:border-[#4A0E0E] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#4A0E0E] hover:bg-[#380A0A] text-white font-semibold uppercase tracking-wider text-xs shadow-sm flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#F2E8E8]" />
                  <span>Gemini is Analyzing Color Harmonies...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F2E8E8]" />
                  <span>Analyze & Generate Style Direction</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Style Result */
          <div className="space-y-6">
            <div className="bg-[#4A0E0E] text-white p-6 rounded-3xl border border-[#EAE2D8]/20 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2E8E8]/90">
                AI Aesthetic Palette
              </span>
              <h4 className="text-xl font-serif-luxury font-bold text-white">
                {result.recommendedLookTitle}
              </h4>
              <p className="text-xs text-[#F2E8E8]/90 leading-relaxed">
                {result.overallConcept}
              </p>

              {/* Color Palette Swatches */}
              <div className="pt-3 border-t border-white/15">
                <p className="text-[11px] font-bold text-[#EAE2D8] uppercase tracking-wider mb-2">
                  Harmonious Makeup Color Palette:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.colorPalette.map((color, i) => (
                    <div
                      key={i}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white flex items-center space-x-2"
                    >
                      <span className="w-3 h-3 rounded-full bg-[#F2E8E8] inline-block" />
                      <span>{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D8] space-y-1.5">
                <span className="text-[11px] font-bold text-[#4A0E0E] uppercase tracking-wider">
                  💇‍♀️ Hairstyle
                </span>
                <p className="text-xs font-semibold text-[#1A1A1A]">{result.hairStyle}</p>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D8] space-y-1.5">
                <span className="text-[11px] font-bold text-[#4A0E0E] uppercase tracking-wider">
                  👁️ Eye Artistry
                </span>
                <p className="text-xs font-semibold text-[#1A1A1A]">{result.eyeMakeup}</p>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE2D8] space-y-1.5">
                <span className="text-[11px] font-bold text-[#4A0E0E] uppercase tracking-wider">
                  💄 Lip Finish
                </span>
                <p className="text-xs font-semibold text-[#1A1A1A]">{result.lipShade}</p>
              </div>
            </div>

            {/* Matched Services */}
            <div className="bg-[#F2E8E8] p-4 rounded-2xl border border-[#EAE2D8] space-y-2">
              <h5 className="text-xs font-bold text-[#4A0E0E] uppercase tracking-wider">
                Matching Parlor Services to Book:
              </h5>
              <div className="flex flex-wrap gap-2">
                {result.matchingServices.map((srv, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (onBookServiceByName) onBookServiceByName(srv);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 bg-white text-[#1A1A1A] text-xs font-semibold rounded-full border border-[#EAE2D8] hover:bg-[#4A0E0E] hover:text-white transition cursor-pointer shadow-xs"
                  >
                    Book {srv} →
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setResult(null)}
                className="py-3 px-5 rounded-full border border-[#EAE2D8] bg-white text-[#1A1A1A] text-xs font-semibold hover:bg-[#FAF7F2] transition cursor-pointer"
              >
                ← Try Another Outfit / Description
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 px-5 rounded-full bg-[#4A0E0E] hover:bg-[#380A0A] text-white text-xs uppercase tracking-wider font-semibold transition cursor-pointer text-center"
              >
                Close & Browse Parlors
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
