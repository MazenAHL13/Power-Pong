import { useEffect, useState } from "react";
import { getGameState, startGame } from "./api";
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

  return (
    <main className="app-shell">
      <section className="game-screen" aria-labelledby="game-title">
        <div className="game-header">
          <div>
            <p className="eyebrow">Proyecto final</p>
            <h1 id="game-title">Power Pong Arena</h1>
          </div>
          <div className="score-panel">
            <p className="score-line">
              {game === null ? "0 - 0" : `${game.player.score} - ${game.computer.score}`}
            </p>
            <button type="button" onClick={handleStartGame} disabled={isStarting}>
              {isStarting ? "Iniciando..." : "Iniciar partida"}
            </button>
          </div>
        </div>

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
                  className="capsule"
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

        <div className="game-info">
          <p>Jugador: W / S</p>
          <p>Computadora: backend</p>
          <p>Estado: {game?.status ?? "cargando"}</p>
        </div>

        {error !== null && <p className="error-message">{error}</p>}
        {game?.message !== null && game?.message !== undefined && (
          <p className="message-line">{game.message}</p>
        )}
      </section>
    </main>
  );
}

export default App;
