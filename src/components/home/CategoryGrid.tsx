import React from 'react';
import { Scissors, Sparkles, Smile, HandMetal, HeartHandshake, Eye } from 'lucide-react';
import { ServiceCategory } from '../../types';

interface CategoryGridProps {
  onSelectCategory: (category: ServiceCategory | 'all') => void;
  selectedCategory: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory, selectedCategory }) => {
  const categories: { id: ServiceCategory; name: string; icon: any; count: string; image: string; description: string }[] = [
    {
      id: 'hair',
      name: 'Hair Design & Spa',
      icon: Scissors,
      count: '15+ Styles',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=400&q=80',
      description: 'Haircuts, Keratin, Balayage & Champi'
    },
    {
      id: 'skin',
      name: 'Facials & Skin Glow',
      icon: Smile,
      count: '12+ Treatments',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
      description: 'Hydra, 24K Gold & Fruit Cleanups'
    },
    {
      id: 'makeup',
      name: 'Bridal & HD Glam',
      icon: Sparkles,
      count: '20+ Makeovers',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
      description: 'Royal Airbrush, Cocktail & Sangeet'
    },
    {
      id: 'nails',
      name: 'Nails & Pedicure',
      icon: HandMetal,
      count: '10+ Arts',
      image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=400&q=80',
      description: 'Russian Gel, Extensions & Rose Spa'
    },
    {
      id: 'spa',
      name: 'Aroma & Body Spa',
      icon: HeartHandshake,
      count: '8+ Massages',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80',
      description: 'Swedish, Saffron Polish & Steam'
    },
    {
      id: 'threading',
      name: 'Brows & Threading',
      icon: Eye,
      count: '6+ Arch Styles',
      image: 'https://images.unsplash.com/photo-1583241800698-e8ab01c85b27?auto=format&fit=crop&w=400&q=80',
      description: 'Mapping, Lamination & Tinting'
    }
  ];

  return (
    <section className="py-12 bg-white border-y border-[#EAE2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B4B4B]">
              Curated Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-[#1A1A1A] mt-1">
              Explore by Beauty Category
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs uppercase tracking-wider font-bold text-[#4A0E0E] hover:text-[#380A0A] mt-2 md:mt-0 cursor-pointer flex items-center space-x-1"
          >
            <span>View All 25+ Services</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group text-left p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#4A0E0E] bg-[#F2E8E8] shadow-md ring-2 ring-[#4A0E0E]/20'
                    : 'border-[#EAE2D8] bg-[#FAF7F2] hover:border-[#4A0E0E] hover:shadow-md hover:bg-white'
                }`}
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-[#EAE2D8]/40">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#4A0E0E] shadow-xs">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#4A0E0E] transition leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-[#5C5C5C] mt-0.5">{cat.count}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
