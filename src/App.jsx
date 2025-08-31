import React, { useState } from "react";
import PackSelector from "./components/PackSelector";
import PackOpening from "./components/PackOpening";
import Collection from "./components/Collection";
import SoundToggle from "./components/SoundToggle";
import SummaryModal from "./components/SummaryModal";
import { InventoryProvider } from "./context/InventoryContext";

export default function App() {
  const [selectedPack, setSelectedPack] = useState("Bronze");
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem("user-coins");
    const parsed = saved ? parseInt(saved, 10) : 5000;
  return parsed && parsed > 0 ? parsed : 5000;
  });

  const [summaryCards, setSummaryCards] = useState(null);
  const [muted, setMuted] = useState(false);

  React.useEffect(() => {
    localStorage.setItem("user-coins", coins);
  }, [coins]);

  return (
    <InventoryProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 relative">
        <SoundToggle muted={muted} setMuted={setMuted} />
        <h1 className="text-4xl font-extrabold text-yellow-400 text-center mb-6">
          Cricket Card Pack Opener
        </h1>
        <div className="text-white text-center mb-4">Coins: {coins}</div>
        <PackSelector selectedPack={selectedPack} onSelect={setSelectedPack} />
        <PackOpening
          packName={selectedPack}
          coins={coins}
          setCoins={setCoins}
          onSummary={setSummaryCards}
          muted={muted}
        />
        <Collection />
        {summaryCards && (
          <SummaryModal
            cards={summaryCards}
            onClose={() => setSummaryCards(null)}
          />
        )}
      </div>
    </InventoryProvider>
  );
}