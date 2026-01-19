"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Game } from "@/components";
import { createStaticProvider, type Album } from "@/lib/providers";
import { createBlurGridStrategy } from "@/lib/obscure";

const provider = createStaticProvider();
const strategy = createBlurGridStrategy({ gridSize: 3, blurAmount: 20 });

const DEMO_ALBUM_ID = "31706566-95ac-4383-8787-7dce9c8531a9"; // Crazy Frog

export default function Home() {
  const searchParams = useSearchParams();
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    const isDemo = searchParams.get("demo") === "true";
    if (isDemo) {
      provider.getAlbum(DEMO_ALBUM_ID).then(setAlbum);
    } else {
      provider.getDailyAlbum(new Date()).then(setAlbum);
    }
  }, [searchParams]);

  if (!album) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-8 text-4xl font-bold">Vinydle</h1>
      <Game album={album} provider={provider} strategy={strategy} />
    </main>
  );
}
