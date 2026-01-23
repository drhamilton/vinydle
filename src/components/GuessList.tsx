import type { Guess } from "@/lib/game";

interface GuessListProps {
  guesses: Guess[];
}

export function GuessList({ guesses }: GuessListProps) {
  if (guesses.length === 0) return null;

  return (
    <div className="w-full max-w-md space-y-2">
      {guesses.map((guess, index) => {
        let className = "bg-red-900/30 border border-red-900";
        if (guess.correct) {
          className = "bg-green-900/50 border border-green-700";
        } else if (guess.sameArtist) {
          className = "bg-yellow-900/50 border border-yellow-700";
        }

        return (
          <div key={index} className={`rounded-lg px-4 py-2 ${className}`}>
            <div className="font-medium">{guess.albumTitle}</div>
            <div className="text-sm text-neutral-400">{guess.artist}</div>
          </div>
        );
      })}
    </div>
  );
}
