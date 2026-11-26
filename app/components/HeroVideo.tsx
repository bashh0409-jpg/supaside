"use client";

import MuxPlayer, { type MuxPlayerRefAttributes } from "@mux/mux-player-react";
import { useEffect, useRef, useState } from "react";

function getHighestVideoRendition(manifest: string, manifestUrl: string) {
  const lines = manifest.split(/\r?\n/);
  const renditions: { url: string; height: number }[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const streamInfo = lines[index];
    if (!streamInfo.startsWith("#EXT-X-STREAM-INF:")) {
      continue;
    }

    const uri = lines[index + 1]?.trim();
    if (!uri || uri.startsWith("#")) {
      continue;
    }

    renditions.push({
      url: new URL(uri, manifestUrl).toString(),
      height: Number(streamInfo.match(/RESOLUTION=\d+x(\d+)/)?.[1] ?? 0),
    });
  }

  const highestRendition = renditions.reduce<
    { url: string; height: number } | undefined
  >((highest, rendition) => {
    if (!highest || rendition.height > highest.height) {
      return rendition;
    }
    return highest;
  }, undefined);

  if (!highestRendition) {
    throw new Error("Mux master playlist contains no video renditions.");
  }

  return highestRendition.url;
}

export default function HeroVideo({ playbackId }: { playbackId?: string }) {
  const id = playbackId?.trim();
  const playerRef = useRef<MuxPlayerRefAttributes>(null);
  const [videoSource, setVideoSource] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const abortController = new AbortController();
    const manifestUrl = `https://stream.mux.com/${encodeURIComponent(id)}.m3u8`;

    fetch(manifestUrl, { signal: abortController.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Mux master playlist request failed (${response.status}).`,
          );
        }

        const manifest = await response.text();
        return getHighestVideoRendition(manifest, response.url || manifestUrl);
      })
      .then((source) => {
        if (!abortController.signal.aborted) {
          setVideoSource(source);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Unable to load the Mux video rendition:", error);
      });

    return () => abortController.abort();
  }, [id]);

  if (id && videoSource) {
    return (
      <MuxPlayer
        ref={playerRef}
        src={videoSource}
        streamType="on-demand"
        autoPlay="muted"
        muted
        loop
        playsInline
        metadataVideoTitle="Supaside hero"
        onCanPlay={() => {
          const player = playerRef.current;
          if (!player) {
            return;
          }

          player.muted = true;
          void player.play().catch((error: unknown) => {
            console.error("Mux hero autoplay failed:", error);
          });
        }}
        className="absolute inset-0 h-full w-full"
        style={{
          width: "100%",
          height: "100%",
          "--media-object-fit": "cover",
        }}
      />
    );
  }

  return (
    <video
      aria-hidden="true"
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
    >
      {!id && <source src="/hero.mp4" type="video/mp4" />}
    </video>
  );
}
