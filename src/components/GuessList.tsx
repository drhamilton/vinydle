import type { Guess } from "@/lib/game";

interface GuessListProps {
  guesses: Guess[];
}

export function GuessList({ guesses }: GuessListProps) {
  if (guesses.length === 0) return null;

  return (
    <div className="w-full max-w-md space-y-2">
      {guesses.map((guess, index) => (
        <div
          key={index}
          className={`rounded-lg px-4 py-2 ${
            guess.correct
              ? "bg-green-900/50 border border-green-700"
              : "bg-red-900/30 border border-red-900"
          }`}
        >
          <div className="font-medium">{guess.albumTitle}</div>
          <div className="text-sm text-neutral-400">{guess.artist}</div>
        </div>
      ))}
    </div>
  );
}
