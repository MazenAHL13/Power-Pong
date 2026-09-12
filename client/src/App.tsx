import { useEffect, useState } from "react";
import { movePlayer, resetGame, setGameDifficulty, startGame, tickGame } from "./api";
import type { GameDifficulty, GameState } from "../../shared/types";
import lightningBoltImage from "../../assets/lightning-bolt.png";
import shieldImage from "../../assets/shield.png";
import tennisBallImage from "../../assets/tennis-ball.png.webp";
import "./styles/app.css";

const COURT_WIDTH = 900;
const COURT_HEIGHT = 520;
const TICK_DELAY_MS = 50;
const BALL_VISUAL_SCALE = 1.25;
const CAPSULE_VISUAL_SCALE = 1.75;

function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    let shouldIgnoreResponse = false;

    async function loadGameState() {
      try {
        const response = await resetGame();

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

  useEffect(() => {
    if (game?.status !== "playing") {
      return;
    }

    const tickIntervalId = window.setInterval(() => {
      async function runTick() {
        try {
          const response = await tickGame();
          setGame(response.game);
        } catch (caughtError) {
          const message =
            caughtError instanceof Error
              ? caughtError.message
              : "No se pudo actualizar la partida.";

          setError(message);
        }
      }

      void runTick();
    }, TICK_DELAY_MS);

    return () => {
      window.clearInterval(tickIntervalId);
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

  async function handleDifficultyChange(difficulty: GameDifficulty) {
    setError(null);

    try {
      const response = await setGameDifficulty(difficulty);
      setGame(response.game);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo cambiar la dificultad.";

      setError(message);
    }
  }

  const resultText =
    game?.winner === "player"
      ? "Gano el jugador"
      : game?.winner === "computer"
        ? "Gano la computadora"
        : null;
  const startButtonText = game?.status === "finished" ? "Reiniciar partida" : "Iniciar partida";
  const statusText =
    game?.status === "ready"
      ? "Listo"
      : game?.status === "playing"
        ? "Jugando"
        : game?.status === "finished"
          ? "Terminado"
          : "Cargando";

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
              <img
                className="ball"
                src={tennisBallImage}
                alt=""
                draggable="false"
                style={{
                  left: `${(game.ball.position.x / COURT_WIDTH) * 100}%`,
                  top: `${(game.ball.position.y / COURT_HEIGHT) * 100}%`,
                  width: `${((game.ball.radius * 2 * BALL_VISUAL_SCALE) / COURT_WIDTH) * 100}%`
                }}
              />
              {game.capsule !== null && (
                <img
                  className={`capsule capsule-${game.capsule.type}`}
                  src={game.capsule.type === "shield" ? shieldImage : lightningBoltImage}
                  alt=""
                  draggable="false"
                  style={{
                    left: `${(game.capsule.position.x / COURT_WIDTH) * 100}%`,
                    top: `${(game.capsule.position.y / COURT_HEIGHT) * 100}%`,
                    width: `${((game.capsule.radius * 2 * CAPSULE_VISUAL_SCALE) / COURT_WIDTH) * 100}%`
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

        <div className="status-badge" aria-live="polite">
          Estado: {statusText}
        </div>

        {game?.status !== "playing" && (
          <div className="start-controls">
            {resultText !== null && <p className="result-line">{resultText}</p>}
            <div className="instructions-card">
              <p>Usa W y S para mover tu paleta.</p>
              <p>Recoge capsulas azules/amarillas.</p>
              <p>Azul = escudo, amarillo = turbo.</p>
              <p>Primero en llegar a 7 gana.</p>
            </div>
            <div className="start-actions">
              <select
                value={game?.difficulty ?? "normal"}
                onChange={(event) =>
                  void handleDifficultyChange(event.target.value as GameDifficulty)
                }
                disabled={isStarting}
              >
                <option value="easy">Facil</option>
                <option value="normal">Normal</option>
                <option value="hard">Dificil</option>
              </select>
              <button
                type="button"
                onClick={handleStartGame}
                disabled={isStarting}
              >
                {isStarting ? "Iniciando..." : startButtonText}
              </button>
            </div>
          </div>
        )}

        {error !== null && <p className="error-message">{error}</p>}
      </section>
    </main>
  );
}

export default App;
