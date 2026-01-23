"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Game } from "@/components";
import { createStaticProvider, type Album } from "@/lib/providers";
import { createBlurGridStrategy } from "@/lib/obscure";

const provider = createStaticProvider();
const strategy = createBlurGridStrategy({ gridSize: 3, blurAmount: 20 });

const DEMO_ALBUM_ID = "31706566-95ac-4383-8787-7dce9c8531a9"; // Crazy Frog

function HomeContent() {
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

  const handleNewAlbum = useCallback(() => {
    provider.getRandomAlbum().then(setAlbum);
  }, []);

  if (!album) {
    return <div className="text-neutral-400">Loading...</div>;
  }

  return <Game key={album.id} album={album} provider={provider} strategy={strategy} onNewAlbum={handleNewAlbum} />;
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-8 text-4xl font-bold">Vinydle</h1>
      <Suspense fallback={<div className="text-neutral-400">Loading...</div>}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
