import { useState } from "react";
import { startGame } from "./api";
import type { GameState } from "../../shared/types";
import "./styles/app.css";

function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  async function handleStartGame() {
    setIsStarting(true);
    setError(null);

    try {
      const response = await startGame();
      setGame(response.game);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo iniciar la partida.";

      setError(message);
    } finally {
      setIsStarting(false);
    }
  }

  if (game !== null) {
    return (
      <main className="app-shell">
        <section className="game-summary" aria-labelledby="game-status">
          <p className="eyebrow">Partida activa</p>
          <h1 id="game-status">Power Pong Arena</h1>
          <p className="score-line">
            {game.player.label} {game.player.score} - {game.computer.score}{" "}
            {game.computer.label}
          </p>
          <p className="state-line">Estado: {game.status}</p>
          {game.message !== null && <p className="message-line">{game.message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="start-panel" aria-labelledby="game-title">
        <p className="eyebrow">Proyecto final</p>
        <h1 id="game-title">Power Pong Arena</h1>
        <p>
          Juego Pong con React, TypeScript y Express. El jugador usara W y S
          contra una computadora controlada por el backend.
        </p>
        {error !== null && <p className="error-message">{error}</p>}
        <button type="button" onClick={handleStartGame} disabled={isStarting}>
          {isStarting ? "Iniciando..." : "Iniciar partida"}
        </button>
      </section>
    </main>
  );
}

export default App;
