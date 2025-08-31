// src/components/SoundToggle.jsx
import React from "react";

export default function SoundToggle({ muted, setMuted }) {
  return (
    <button
      onClick={() => setMuted(!muted)}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 text-white"
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      title={muted ? "Unmute sounds" : "Mute sounds"}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}