// src/components/PackOpening.jsx
import React, { useState, useEffect, useRef } from "react";
import { PACKS } from "../data/packs";
import { PLAYERS } from "../data/players";
import Card from "./Card";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInventory } from "../context/InventoryContext";

const shakeAnimation = {
  animate: {
    rotate: [0, 5, -5, 5, -5, 0],
    transition: { repeat: 3, duration: 0.8 },
  },
};

function weightedRandomTier(odds) {
  const tiers = Object.keys(odds);
  const sum = Object.values(odds).reduce((a, b) => a + b, 0);
  let rand = Math.random() * sum;
  for (const tier of tiers) {
    if (rand < odds[tier]) return tier;
    rand -= odds[tier];
  }
  return tiers[0];
}

function pickRandomPlayer(tier) {
  const players = PLAYERS.filter((p) => p.tier === tier);
  if (players.length === 0) return null;
  return players[Math.floor(Math.random() * players.length)];
}

export default function PackOpening({ packName, coins, setCoins, onSummary }) {
  const pack = PACKS[packName];
  const { addCards } = useInventory();
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [isConfetti, setIsConfetti] = useState(false);
  const controls = useAnimation();

  // Audio refs
  const packShakeSound = useRef(null);
  const cardFlipSound = useRef(null);
  const confettiSound = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setOpen(false);
    setCards([]);
    setRevealed([]);
    setIsConfetti(false);
  }, [packName]);

  const playSound = (soundRef) => {
    if (!muted && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play();
    }
  };
  
  const openPack = async () => {
    if (open) return;
    if (coins < pack.price) {
      alert("Not enough coins to buy this pack!");
      return;
    }
    setCoins(coins - pack.price);
    setOpen(true);
    //playSound(packShakeSound);
    if (packShakeSound.current) {
    packShakeSound.current.loop = true;
    packShakeSound.current.currentTime = 0;
    packShakeSound.current.play().catch(() => {});
  }
    await controls.start("animate");
  if (packShakeSound.current) {
    packShakeSound.current.pause();
    packShakeSound.current.currentTime = 0;
  }
    // RNG cards
    const pulledCards = [];
    for (let i = 0; i < pack.cardCount; i++) {
      const tier = weightedRandomTier(pack.odds);
      const player = pickRandomPlayer(tier);
      if (player) pulledCards.push(player);
    }
    setCards(pulledCards);
    setRevealed(Array(pack.cardCount).fill(false));

    // Reveal cards with staggered delay and flip sound
    for (let i = 0; i < pulledCards.length; i++) {
      await new Promise((res) => setTimeout(res, 1000));
      playSound(cardFlipSound);
      setRevealed((r) => {
        const copy = [...r];
        copy[i] = true;
        return copy;
      });

      // If Legend card, trigger confetti and slow-mo effect
      if (pulledCards[i].tier === "Legend") {
        setIsConfetti(true);
        playSound(confettiSound);
        await new Promise((res) => setTimeout(res, 3000));
        setIsConfetti(false);
      }
    }
    await new Promise((res) => setTimeout(res, 800));
    if (cardFlipSound.current) {
  cardFlipSound.current.pause();
  cardFlipSound.current.currentTime = 0;
}
    addCards(pulledCards);
    onSummary(pulledCards); // Show summary modal
  };

  return (
    <>
      {/* Audio elements */}
      <audio ref={packShakeSound} src="/assets/pack_shake_sound.mp3" loop />
      <audio ref={cardFlipSound} src="/assets/card_flip_sound.mp3" preload="auto" loop />
      <audio ref={confettiSound} src="/assets/confetti_sound.mp3" />
       
      <motion.div
        className="flex flex-col items-center"
        variants={shakeAnimation}
        initial="initial"
        animate={controls}
      >
        <button
          disabled={open}
          onClick={openPack}
          className={`px-8 py-3 mt-4 rounded-lg font-bold text-white shadow-lg bg-gradient-to-r from-green-400 to-blue-500 ${
            open ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Open {packName} Pack ({pack.price} coins)
        </button>
      </motion.div>
      <div className="mt-6 flex gap-4 flex-wrap justify-center relative">
        {cards.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            isFlipped={revealed[i]}
            glow={card.tier === "Legend" && revealed[i]}
            slowMo={isConfetti && card.tier === "Legend"}
          />
        ))}
        {isConfetti && (
          <ConfettiOverlay />
        )}
      </div>
    </>
  );
}

// ConfettiOverlay component (simplified)
function ConfettiOverlay() {
  const colors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-pink-400",
    "bg-purple-400",
    "bg-orange-400",
  ];
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ zIndex: 1000 }}
    >
      {/* Simple confetti effect using absolute divs */}
      {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full absolute ${colors[Math.floor(Math.random() * colors.length)]
    }`}
          initial={{ y: 0, opacity: 1, x: 0}}
          animate={{ y: 600, opacity: 0, x: Math.random() * 400 - 200 }}
          transition={{ duration: 2, delay: i * 0.05 }}
          style={{
            left: Math.random() * window.innerWidth,
            top: Math.random() * window.innerHeight / 2,
          }}
          />
        ))}
    </motion.div>
  );
}