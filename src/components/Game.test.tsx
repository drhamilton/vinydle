import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Game } from "./Game";
import { createBlurGridStrategy } from "@/lib/obscure";
import type { Album, AlbumProvider } from "@/lib/providers";

const testAlbum: Album = {
  id: "1",
  title: "OK Computer",
  artist: "Radiohead",
  coverUrl: "https://example.com/cover.jpg",
  releaseYear: 1997,
};

const wrongAlbum: Album = {
  id: "2",
  title: "Kid A",
  artist: "Radiohead",
  coverUrl: "https://example.com/cover2.jpg",
};

const createMockProvider = (): AlbumProvider => ({
  getAlbum: vi.fn(),
  searchAlbums: vi.fn().mockResolvedValue([testAlbum, wrongAlbum]),
  getDailyAlbum: vi.fn(),
});

describe("Game component", () => {
  const strategy = createBlurGridStrategy({ gridSize: 3 });

  it("renders the game with guess input", () => {
    render(<Game album={testAlbum} provider={createMockProvider()} strategy={strategy} />);

    expect(screen.getByPlaceholderText("Guess the album...")).toBeInTheDocument();
    expect(screen.getByText("9 guesses remaining")).toBeInTheDocument();
  });

  it("shows search results when typing", async () => {
    const user = userEvent.setup();
    render(<Game album={testAlbum} provider={createMockProvider()} strategy={strategy} />);

    const input = screen.getByPlaceholderText("Guess the album...");
    await user.type(input, "radio");

    expect(await screen.findByText("OK Computer")).toBeInTheDocument();
    expect(await screen.findByText("Kid A")).toBeInTheDocument();
  });

  it("shows win message on correct guess", async () => {
    const user = userEvent.setup();
    render(<Game album={testAlbum} provider={createMockProvider()} strategy={strategy} />);

    const input = screen.getByPlaceholderText("Guess the album...");
    await user.type(input, "ok");

    const option = await screen.findByText("OK Computer");
    await user.click(option);

    expect(screen.getByText("You got it!")).toBeInTheDocument();
    expect(screen.getByText("OK Computer by Radiohead")).toBeInTheDocument();
  });

  it("decrements remaining guesses on wrong guess", async () => {
    const user = userEvent.setup();
    render(<Game album={testAlbum} provider={createMockProvider()} strategy={strategy} />);

    const input = screen.getByPlaceholderText("Guess the album...");
    await user.type(input, "kid");

    const option = await screen.findByText("Kid A");
    await user.click(option);

    expect(screen.getByText("8 guesses remaining")).toBeInTheDocument();
  });
});
