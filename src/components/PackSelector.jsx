// src/components/PackSelector.jsx
import React from "react";
import { PACKS } from "../data/packs";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function PackSelector({ selectedPack, onSelect }) {
  return (
    <div className="flex gap-4 justify-center my-6 flex-wrap">
      {Object.entries(PACKS).map(([name, pack]) => {
        const oddsText = Object.entries(pack.odds)
          .map(([tier, pct]) => `${tier}: ${pct}%`)
          .join(", ");

        return (
          <Tippy key={name} content={<span className="text-sm">{oddsText}</span>}>
            <button
              onClick={() => onSelect(name)}
              className={`px-6 py-3 rounded-lg font-bold text-white transition-colors whitespace-nowrap ${
                selectedPack === name
                  ? "bg-gradient-to-r from-yellow-400 to-red-500 shadow-lg"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              aria-pressed={selectedPack === name}
              aria-label={`${name} pack, price ${pack.price} coins, odds: ${oddsText}`}
            >
              {name} - {pack.price} Coins
            </button>
          </Tippy>
        );
      })}
    </div>
  );
}