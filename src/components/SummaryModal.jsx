// src/components/SummaryModal.jsx
import React from "react";
import { motion } from "framer-motion";

export default function SummaryModal({ cards, onClose }) {
  const countByTier = cards.reduce((acc, card) => {
    acc[card.tier] = (acc[card.tier] || 0) + 1;
    return acc;
  }, {});

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gray-900 rounded-lg p-6 w-full max-w-md text-white"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h3 className="text-xl font-bold mb-4">Pack Opening Summary</h3>
        <ul>
          {Object.entries(countByTier).map(([tier, count]) => (
            <li key={tier}>
              {tier}: {count}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-yellow-400 rounded font-bold text-black"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}