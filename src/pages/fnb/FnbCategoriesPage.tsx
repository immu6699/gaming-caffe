import React from 'react';
import { useApp } from '../../context/AppContext';
import { FnbCategory } from '../../types';
import { formatINR } from '../../utils/formatters';
import { Layers, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FnbCategoriesPage: React.FC = () => {
  const { menuItems } = useApp();

  const categories: { name: FnbCategory; desc: string; iconBg: string }[] = [
    {
      name: 'Fast Food',
      desc: 'Burgers, loaded wraps, wings, and sandwiches for quick gamer fuel.',
      iconBg: 'bg-rose-500/20 text-rose-400',
    },
    {
      name: 'Energy Drinks',
      desc: 'Monster Energy, Red Bull, Taurine blends, and focus enhancers.',
      iconBg: 'bg-amber-500/20 text-amber-400',
    },
    {
      name: 'Snacks',
      desc: 'Loaded nachos, cajun fries, wedges, crisps, and finger food.',
      iconBg: 'bg-yellow-500/20 text-yellow-400',
    },
    {
      name: 'Hot Beverages',
      desc: 'Double espresso, cappuccinos, artisan tea, and warm cocoa.',
      iconBg: 'bg-amber-700/20 text-amber-300',
    },
    {
      name: 'Cold Beverages',
      desc: 'Iced macchiatos, sodas, cold brews, and mocktails.',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
    },
    {
      name: 'Meals',
      desc: 'Hearty rice bowls, butter chicken, paneer platters, and noodles.',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      name: 'Desserts',
      desc: 'Warm fudge brownies, waffles, gelatos, and pastries.',
      iconBg: 'bg-purple-500/20 text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white font-gaming tracking-wide">
          CAFÉ MENU CATEGORIES
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Menu sections, product counts, and active catalog allocations.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const itemsInCat = menuItems.filter((m) => m.category === cat.name);
          const availableCount = itemsInCat.filter((m) => m.availability === 'Available').length;
          const avgPrice = itemsInCat.length
            ? Math.round(itemsInCat.reduce((sum, m) => sum + m.sellingPrice, 0) / itemsInCat.length)
            : 0;

          return (
            <div
              key={cat.name}
              className="gaming-card p-5 flex flex-col justify-between border-dark-750 hover:border-dark-600"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border border-white/5 ${cat.iconBg}`}>
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-dark-850 px-2 py-0.5 rounded border border-dark-750">
                    {itemsInCat.length} Items
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-gaming">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{cat.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-dark-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Available on Counter:</span>
                  <span className="text-emerald-400 font-bold">{availableCount} in stock</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Avg Item Price:</span>
                  <span className="text-white font-mono font-bold">{formatINR(avgPrice)}</span>
                </div>

                <Link
                  to="/fnb/menu"
                  className="btn-secondary w-full py-1.5 mt-2 text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Browse Items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
