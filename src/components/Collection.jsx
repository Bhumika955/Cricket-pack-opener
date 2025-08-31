// src/components/Collection.jsx
import React, { useState, useMemo } from "react";
import { useInventory } from "../context/InventoryContext";
import Card from "./Card";

const tiers = ["All", "Common", "Rare", "Epic", "Legend"];
const sortOptions = ["Name", "Rating"];

export default function Collection() {
  const { inventory } = useInventory();
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Name");

  const filteredCards = useMemo(() => {
    let cards = Object.values(inventory);
    if (filter !== "All") {
      cards = cards.filter((card) => card.tier === filter);
    }
    if (sortBy === "Name") {
      cards.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Rating") {
      cards.sort((b, a) => a.rating - b.rating);
    }
    return cards;
  }, [inventory, filter, sortBy]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">My Collection</h2>
      <div className="flex gap-3 mb-4 flex-wrap">
        {tiers.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded ${
              filter === t ? "bg-yellow-400 text-black" : "bg-gray-700 text-white"
            }`}
          >
            {t}
          </button>
        ))}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="ml-auto bg-gray-700 text-white rounded px-2 py-1"
        >
          {sortOptions.map((opt) => (
            <option key={opt} value={opt}>
              Sort by {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => <Card key={card.id} card={card} />)
        ) : (
          <p className="text-gray-400 col-span-full">No cards found.</p>
        )}
      </div>
    </div>
  );
}