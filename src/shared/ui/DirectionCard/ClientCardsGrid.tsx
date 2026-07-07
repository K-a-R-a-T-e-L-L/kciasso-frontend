"use client";

import { useEffect, useState } from "react";
import DirectionCard from "@/shared/ui/DirectionCard/DirectionCard";
import type { CardItem } from "@/shared/content/content.types";

function getHash() {
  return window.location.hash.replace("#", "");
}

type Props = {
  cards: CardItem[];
};

export default function ClientCardsGrid({ cards }: Props) {
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const syncHash = () => setActiveHash(getHash());

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => {
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 items-stretch">
      {cards.map((item, index) => {
        const anchorId = item.href.includes("#") ? item.href.split("#")[1] : "";
        const isActive = anchorId !== "" && anchorId === activeHash;

        return (
          <div
            key={item.href}
            id={anchorId || undefined}
            className="scroll-mt-32 h-full flex"
          >
            <DirectionCard {...item} index={index} isActive={isActive} />
          </div>
        );
      })}
    </div>
  );
}
