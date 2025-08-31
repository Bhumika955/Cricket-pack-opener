import React from "react";
import { motion } from "framer-motion";

export default function Card({ isFlipped, card }) {
  return (
    <div
      style={{ perspective: 1000 }}
      className="w-48 h-64 cursor-pointer select-none"
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Front Face */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            backgroundColor: "#444",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <img
            src={card.photo}
            alt={card.name}
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid white",
              marginBottom: 10,
            }}
            loading="lazy"
          />
          <div style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            {card.name}
          </div>
          <div style={{ color: "#aaa" }}>{card.team}</div>
        </div>

        {/* Back Face */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            backgroundColor: "#222",
            color: "yellow",
            padding: 10,
            borderRadius: 12,
            transform: "rotateY(180deg)",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>
            {card.role}
          </div>
          <div>Rating: {card.rating}</div>
          <div>Stats:</div>
          <ul>
            {Object.entries(card.stats).map(([key, val]) => (
              <li key={key}>
                {key}: {val}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}