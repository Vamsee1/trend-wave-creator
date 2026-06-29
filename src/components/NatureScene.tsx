import { useMemo } from 'react';

interface NatureSceneProps {
  variant?: 'forest' | 'ocean' | 'aurora' | 'particles';
}

export const NatureScene = ({ variant = 'forest' }: NatureSceneProps) => {
  const fireflies = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 6,
        size: 2 + Math.random() * 4,
      })),
    []
  );

  const leaves = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 12 + Math.random() * 10,
        rotate: Math.random() * 360,
        emoji: ['🍃', '🌿', '🍂', '🌸'][Math.floor(Math.random() * 4)],
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Glowing orbs / fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full bg-yellow-200 firefly"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            boxShadow: '0 0 10px 2px rgba(255, 240, 150, 0.8), 0 0 20px 6px rgba(255,220,120,0.4)',
          }}
        />
      ))}

      {/* Floating leaves */}
      {leaves.map((l) => (
        <div
          key={l.id}
          className="absolute text-2xl leaf-fall opacity-80"
          style={{
            left: `${l.left}%`,
            top: `-5%`,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
            transform: `rotate(${l.rotate}deg)`,
          }}
        >
          {l.emoji}
        </div>
      ))}

      {/* Mist / aurora gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      <div className="absolute -bottom-10 left-0 right-0 h-40 bg-gradient-to-t from-emerald-900/40 to-transparent blur-2xl" />
    </div>
  );
};
