import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Item } from '@/domain/entities/Item';

interface InventoryProps {
  items: Item[];
  onItemUse: (item: Item) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function Inventory({ items, onItemUse, onClose, isOpen }: InventoryProps) {
  // Grouper les items par ID pour gérer les doublons
  const groupedItems = items.reduce((acc, item) => {
    const existing = acc.find(i => i.item.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ item, quantity: 1 });
    }
    return acc;
  }, [] as Array<{ item: Item; quantity: number }>);

  const getItemIcon = (type: string) => {
    const icons: Record<string, string> = {
      potion: '??',
      pokeball: '??',
      berry: '??',
      stone: '??',
      tm: '??',
      key: '???',
      other: '??',
    };
    return icons[type] || '??';
  };

  const getItemRarityColor = (type: string) => {
    const colors: Record<string, string> = {
      potion: 'border-green-400',
      pokeball: 'border-red-400',
      berry: 'border-pink-400',
      stone: 'border-purple-400',
      tm: 'border-blue-400',
      key: 'border-yellow-400',
      other: 'border-gray-400',
    };
    return colors[type] || 'border-gray-400';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-slate-900 border-4 border-yellow-400 rounded-lg shadow-[0_0_40px_rgba(250,204,21,0.3)] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-yellow-600 to-yellow-500 p-4 border-b-4 border-yellow-400">
              <div className="flex justify-between items-center">
                <h2 className="pixel-text text-slate-900 text-xl md:text-2xl">INVENTAIRE</h2>
                <button
                  onClick={onClose}
                  className="pixel-border border-2 border-slate-900 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                >
                  <span className="pixel-text text-sm">X</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {groupedItems.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">??</span>
                  <p className="pixel-text text-slate-400 text-lg">Votre inventaire est vide</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedItems.map((groupedItem, index) => (
                    <motion.div
                      key={groupedItem.item.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`pixel-border border-2 rounded-lg p-4 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer ${getItemRarityColor(groupedItem.item.type)}`}
                      onClick={() => onItemUse(groupedItem.item)}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        {groupedItem.item.image ? (
                          <Image
                            src={groupedItem.item.image}
                            alt={groupedItem.item.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-3xl">{getItemIcon(groupedItem.item.type)}</span>
                        )}
                        <div className="flex-1">
                          <h3 className="pixel-text text-white text-sm font-bold">{groupedItem.item.name}</h3>
                          <span className={`pixel-text text-xs px-2 py-1 rounded ${getItemRarityColor(groupedItem.item.type)} bg-slate-900`}>
                            {groupedItem.item.type.toUpperCase()}
                          </span>
                        </div>
                        {groupedItem.quantity > 1 && (
                          <div className="pixel-text text-yellow-400 text-lg font-bold bg-slate-900 px-2 py-1 rounded border border-yellow-400">
                            x{groupedItem.quantity}
                          </div>
                        )}
                      </div>

                      {groupedItem.item.description && (
                        <p className="pixel-text text-slate-400 text-xs leading-tight">
                          {groupedItem.item.description}
                        </p>
                      )}

                      <div className="mt-3 text-center">
                        <span className="pixel-text text-yellow-400 text-xs bg-slate-900 px-3 py-1 rounded border border-yellow-400">
                          UTILISER
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
