# Velo — Modern Calculator

A fullstack calculator web app built with Next.js, TypeScript, TypeORM, and SQLite.

## Features

- Fully functional calculator (digits, operators, decimal, backspace, clear, equals)
- Basic arithmetic: addition, subtraction, multiplication, division
- Division by zero error handling
- Persistent calculation history stored in SQLite
- History panel with past calculations
- Clean, dark-themed responsive UI

## Getting Started

### Development

```bash
cd velo
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker

```bash
cd velo
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./data/velo.sqlite` | Path to the SQLite database file |
| `NEXT_PUBLIC_APP_NAME` | `Velo` | App display name |

## API Endpoints

### `GET /api/calculations`
Returns the last 50 calculations in descending order.

### `POST /api/calculations`
Saves a new calculation.

**Body:**
```json
{
  "expression": "2 + 3 =",
  "result": "5"
}
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TypeORM** (ORM)
- **better-sqlite3** (SQLite driver)
- **CSS Modules** (styling)
