import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GuessInput } from "./GuessInput";
import type { Album } from "@/lib/providers";

const mockAlbums: Album[] = [
  { id: "1", title: "OK Computer", artist: "Radiohead", coverUrl: "" },
  { id: "2", title: "Kid A", artist: "Radiohead", coverUrl: "" },
];

describe("GuessInput", () => {
  it("calls onGuess when selecting from dropdown", async () => {
    const onGuess = vi.fn();
    const searchAlbums = vi.fn().mockResolvedValue(mockAlbums);
    const user = userEvent.setup();

    render(<GuessInput onGuess={onGuess} searchAlbums={searchAlbums} />);

    const input = screen.getByPlaceholderText("Guess the album...");
    await user.type(input, "radio");

    // Wait for dropdown
    const option = await screen.findByText("OK Computer");
    await user.click(option);

    expect(onGuess).toHaveBeenCalledTimes(1);
    expect(onGuess).toHaveBeenCalledWith(mockAlbums[0]);
  });

  it("calls onGuess when pressing Enter on selected item", async () => {
    const onGuess = vi.fn();
    const searchAlbums = vi.fn().mockResolvedValue(mockAlbums);
    const user = userEvent.setup();

    render(<GuessInput onGuess={onGuess} searchAlbums={searchAlbums} />);

    const input = screen.getByPlaceholderText("Guess the album...");
    await user.type(input, "radio");

    await screen.findByText("OK Computer");
    await user.keyboard("{Enter}");

    expect(onGuess).toHaveBeenCalledTimes(1);
    expect(onGuess).toHaveBeenCalledWith(mockAlbums[0]);
  });

  it("clears input after selection", async () => {
    const onGuess = vi.fn();
    const searchAlbums = vi.fn().mockResolvedValue(mockAlbums);
    const user = userEvent.setup();

    render(<GuessInput onGuess={onGuess} searchAlbums={searchAlbums} />);

    const input = screen.getByPlaceholderText("Guess the album...");
    await user.type(input, "radio");

    const option = await screen.findByText("OK Computer");
    await user.click(option);

    expect(input).toHaveValue("");
  });

  it("does not search with less than 2 characters", async () => {
    const onGuess = vi.fn();
    const searchAlbums = vi.fn().mockResolvedValue(mockAlbums);
    const user = userEvent.setup();

    render(<GuessInput onGuess={onGuess} searchAlbums={searchAlbums} />);

    const input = screen.getByPlaceholderText("Guess the album...");
    await user.type(input, "r");

    // Wait a bit for any potential search
    await new Promise((r) => setTimeout(r, 300));

    expect(searchAlbums).not.toHaveBeenCalled();
  });

  it("shows searching state while loading", async () => {
    const onGuess = vi.fn();
    // Create a promise that we control
    let resolveSearch!: (albums: Album[]) => void;
    const searchPromise = new Promise<Album[]>((resolve) => {
      resolveSearch = resolve;
    });
    const searchAlbums = vi.fn().mockReturnValue(searchPromise);
    const user = userEvent.setup();

    render(<GuessInput onGuess={onGuess} searchAlbums={searchAlbums} />);

    const input = screen.getByPlaceholderText("Guess the album...");
    await user.type(input, "radio");

    // Should show searching state
    expect(await screen.findByText("Searching...")).toBeInTheDocument();

    // Resolve the search
    resolveSearch(mockAlbums);

    // Should show results
    expect(await screen.findByText("OK Computer")).toBeInTheDocument();
  });

  it("shows no results message when search returns empty", async () => {
    const onGuess = vi.fn();
    const searchAlbums = vi.fn().mockResolvedValue([]);
    const user = userEvent.setup();

    render(<GuessInput onGuess={onGuess} searchAlbums={searchAlbums} />);

    const input = screen.getByPlaceholderText("Guess the album...");
    await user.type(input, "xyz");

    expect(await screen.findByText("No results found")).toBeInTheDocument();
  });
});
