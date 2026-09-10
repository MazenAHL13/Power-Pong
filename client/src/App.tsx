import { useEffect, useState } from "react";
import { getGameState, movePlayer, startGame } from "./api";
import type { GameState } from "../../shared/types";
import "./styles/app.css";

const COURT_WIDTH = 900;
const COURT_HEIGHT = 520;

function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    let shouldIgnoreResponse = false;

    async function loadGameState() {
      try {
        const response = await getGameState();

        if (!shouldIgnoreResponse) {
          setGame(response.game);
        }
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "No se pudo cargar la partida.";

        if (!shouldIgnoreResponse) {
          setError(message);
        }
      }
    }

    void loadGameState();

    return () => {
      shouldIgnoreResponse = true;
    };
  }, []);

  useEffect(() => {
    async function handleKeyDown(event: KeyboardEvent) {
      if (game?.status !== "playing") {
        return;
      }

      const direction =
        event.key.toLowerCase() === "w"
          ? "up"
          : event.key.toLowerCase() === "s"
            ? "down"
            : null;

      if (direction === null) {
        return;
      }

      event.preventDefault();
      setError(null);

      try {
        const response = await movePlayer(direction);
        setGame(response.game);
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "No se pudo mover la paleta.";

        setError(message);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [game?.status]);

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

  const resultText =
    game?.winner === "player"
      ? "Gano el jugador"
      : game?.winner === "computer"
        ? "Gano la computadora"
        : null;

  return (
    <main className="app-shell">
      <section className="game-screen" aria-label="Power Pong Arena">
        <div
          className="court"
          aria-label="Cancha de Power Pong Arena"
          style={{
            aspectRatio: `${COURT_WIDTH} / ${COURT_HEIGHT}`
          }}
        >
          <div className="center-line" />
          {game !== null && (
            <>
              <div
                className="paddle player-paddle"
                style={{
                  left: `${(game.player.paddle.position.x / COURT_WIDTH) * 100}%`,
                  top: `${(game.player.paddle.position.y / COURT_HEIGHT) * 100}%`,
                  width: `${(game.player.paddle.width / COURT_WIDTH) * 100}%`,
                  height: `${(game.player.paddle.height / COURT_HEIGHT) * 100}%`
                }}
              />
              <div
                className="paddle computer-paddle"
                style={{
                  left: `${(game.computer.paddle.position.x / COURT_WIDTH) * 100}%`,
                  top: `${(game.computer.paddle.position.y / COURT_HEIGHT) * 100}%`,
                  width: `${(game.computer.paddle.width / COURT_WIDTH) * 100}%`,
                  height: `${(game.computer.paddle.height / COURT_HEIGHT) * 100}%`
                }}
              />
              <div
                className="ball"
                style={{
                  left: `${(game.ball.position.x / COURT_WIDTH) * 100}%`,
                  top: `${(game.ball.position.y / COURT_HEIGHT) * 100}%`,
                  width: `${((game.ball.radius * 2) / COURT_WIDTH) * 100}%`
                }}
              />
              {game.capsule !== null && (
                <div
                  className={`capsule capsule-${game.capsule.type}`}
                  style={{
                    left: `${(game.capsule.position.x / COURT_WIDTH) * 100}%`,
                    top: `${(game.capsule.position.y / COURT_HEIGHT) * 100}%`,
                    width: `${((game.capsule.radius * 2) / COURT_WIDTH) * 100}%`
                  }}
                />
              )}
            </>
          )}
        </div>

        <div className="scoreboard" aria-live="polite">
          <span>{game?.player.label ?? "Jugador"}</span>
          <strong>{game === null ? "0 - 0" : `${game.player.score} - ${game.computer.score}`}</strong>
          <span>{game?.computer.label ?? "Computadora"}</span>
        </div>

        {game?.status !== "playing" && (
          <button
            className="start-button"
            type="button"
            onClick={handleStartGame}
            disabled={isStarting}
          >
            {isStarting ? "Iniciando..." : "Iniciar partida"}
          </button>
        )}

        {resultText !== null && <p className="result-line">{resultText}</p>}
        {error !== null && <p className="error-message">{error}</p>}
      </section>
    </main>
  );
}

export default App;
