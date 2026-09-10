import "./styles/app.css";

function App() {
  return (
    <main className="app-shell">
      <section className="start-panel" aria-labelledby="game-title">
        <p className="eyebrow">Proyecto final</p>
        <h1 id="game-title">Power Pong Arena</h1>
        <p>
          Juego Pong con React, TypeScript y Express. El jugador usara W y S
          contra una computadora controlada por el backend.
        </p>
        <button type="button">Iniciar partida</button>
      </section>
    </main>
  );
}

export default App;
