// src/context/InventoryContext.jsx
import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useLocalStorage("cricket-inventory", {});

  // Add cards with duplicate handling and upgrade logic
  const addCards = (cards) => {
    setInventory((inv) => {
      const copy = { ...inv };
      cards.forEach((card) => {
        if (copy[card.id]) {
          // Example logic: upgrade tier if duplicate
          const tiers = ["Common", "Rare", "Epic", "Legend"];
          const currentTierIndex = tiers.indexOf(copy[card.id].tier);
          const newTierIndex = Math.min(currentTierIndex + 1, tiers.length - 1);
          copy[card.id] = { ...card, tier: tiers[newTierIndex] };
        } else {
          copy[card.id] = card;
        }
      });
      return copy;
    });
  };

  return (
    <InventoryContext.Provider value={{ inventory, addCards }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => useContext(InventoryContext);