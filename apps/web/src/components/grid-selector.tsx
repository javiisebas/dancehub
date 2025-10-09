'use client';

import { cn } from '@web/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { FC, useState } from 'react';
import { Button } from '@repo/ui/components';

const MotionButton = motion(Button);

interface GridSelectorProps {
    items: string[];
    maxSelected?: number;
    wrapperClassName?: string;
}

export const GridSelector: FC<GridSelectorProps> = ({ items, maxSelected, wrapperClassName }) => {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleItem = (item: string) => {
        if (maxSelected && selected.length >= maxSelected && !selected.includes(item)) {
            return;
        }

        setSelected((prev) =>
            prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item],
        );
    };

    return (
        <motion.div
            className={cn('flex flex-wrap gap-2', wrapperClassName)}
            layout
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                mass: 0.5,
            }}
        >
            {items.map((item) => {
                const isSelected = selected.includes(item);
                return (
                    <MotionButton
                        key={item}
                        onClick={() => toggleItem(item)}
                        layout
                        initial={false}
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                            mass: 0.5,
                            backgroundColor: { duration: 0.1 },
                        }}
                        className={cn(
                            `
                  inline-flex items-center px-4 py-2 rounded-full shadow-none
                  whitespace-nowrap overflow-hidden border font-normal`,
                            isSelected
                                ? 'border-primary bg-primary/5 text-primary hover:bg-primary/10'
                                : 'text-black bg-white hover:bg-secondary',
                            maxSelected &&
                                selected.length >= maxSelected &&
                                !isSelected &&
                                'cursor-not-allowed',
                        )}
                    >
                        <motion.div
                            className="relative flex items-center"
                            animate={{
                                width: isSelected ? 'auto' : '100%',
                                paddingRight: isSelected ? '1.5rem' : '0',
                            }}
                            transition={{
                                ease: [0.175, 0.885, 0.32, 1.275],
                                duration: 0.3,
                            }}
                        >
                            <span>{item}</span>
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 500,
                                            damping: 30,
                                            mass: 0.5,
                                        }}
                                        className="absolute right-0"
                                    >
                                        <div
                                            className={cn(
                                                'w-4 h-4 rounded-full flex items-center justify-center',
                                                isSelected ? 'bg-primary text-white' : 'bg-white',
                                            )}
                                        >
                                            <Check className="w-3 h-3" strokeWidth={2} />
                                        </div>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </MotionButton>
                );
            })}
        </motion.div>
    );
};
