# Study Guide

## Difficulty Modes

Difficulty is controlled by the backend.

The frontend only lets the player choose:

```txt
Facil
Normal
Dificil
```

When the player changes difficulty, React calls:

```txt
POST /api/game/difficulty
```

The backend stores that difficulty in `GameState`:

```ts
difficulty: "easy" | "normal" | "hard"
```

The settings live in:

```txt
server/src/game/constants.ts
```

Each difficulty changes only three simple ideas:

- how often the computer reacts
- how fast the ball starts
- how big the paddles are

In easy mode:

```txt
computer reacts less
computer paddle is smaller
player paddle is bigger
ball is slower
```

In normal mode:

```txt
standard values
```

In hard mode:

```txt
computer reacts more
computer paddle is bigger
player paddle is smaller
ball is faster
```

The important presentation explanation:

```txt
The frontend does not decide difficulty rules.
It only sends the selected difficulty to the server.
The server owns the settings and uses them when creating the game and moving the computer.
```
