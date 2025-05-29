# Backend Day 2 - Core Game Loop Complete

## What We Built
- ✅ D1 database integration for persistent sessions
- ✅ Complete game state tracking (in_progress, won, lost) 
- ✅ Mistake counter with 4-mistake limit
- ✅ Session-based gameplay with nanoid session IDs
- ✅ Enhanced validation with detailed feedback
- ✅ Win/lose detection and game completion

## New API Routes

### Session Management

#### `POST /api/puzzles/:id/start`
Start new game session
```json
// Response
{
  "sessionId": "V1StGXR8_Z5jdHi6B-myT",
  "puzzle": { "id": 1, "title": "Tech Giants", "items": [...] },
  "gameState": {
    "mistakes": 0,
    "status": "in_progress", 
    "completedGroups": [],
    "revealedHints": []
  }
}
```

#### `GET /api/puzzles/session/:sessionId`
Get current session state
```json
{
  "sessionId": "V1StGXR8_Z5jdHi6B-myT",
  "puzzle": { "id": 1, "title": "Tech Giants", "items": [...] },
  "gameState": {
    "mistakes": 2,
    "status": "in_progress",
    "completedGroups": ["Tech Companies"],
    "revealedHints": ["Silicon Valley giants"]
  }
}
```

### Enhanced Game Actions

#### `POST /api/puzzles/session/:sessionId/guess`
Submit guess with session tracking
```json
// Request
{ "items": ["Apple", "Microsoft", "Google", "Amazon"] }

// Response (correct)
{
  "correct": true,
  "group": { "category": "Tech Companies", "items": [...] },
  "gameState": {
    "mistakes": 2,
    "status": "won", // or "in_progress"
    "completedGroups": ["Tech Companies", "Streaming Services"], 
    "revealedHints": [...]
  }
}

// Response (incorrect)
{
  "correct": false,
  "message": "Game over - too many mistakes!", // or "Incorrect grouping"
  "gameState": {
    "mistakes": 4,
    "status": "lost", // or "in_progress"
    "completedGroups": [...],
    "revealedHints": [...]
  }
}
```

#### `POST /api/puzzles/session/:sessionId/hint`
Get progressive hint with session
```json
// Request  
{ "items": ["Apple", "Microsoft"] }

// Response
{
  "hint": "Silicon Valley giants",
  "category": "Tech Companies",
  "matches": 2
}
```

## Database Schema
```sql
CREATE TABLE game_sessions (
    id TEXT PRIMARY KEY,
    puzzle_id INTEGER NOT NULL,
    user_fid INTEGER,
    mistakes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'in_progress',
    completed_groups TEXT DEFAULT '[]',
    revealed_hints TEXT DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Game State Logic
- **Mistakes**: Increment on wrong guess, game ends at 4 mistakes
- **Win Condition**: All 4 groups completed (status → "won")
- **Lose Condition**: 4 mistakes reached (status → "lost") 
- **Progressive Hints**: Triggered when 2+ items from same group selected
- **Session Persistence**: All game state stored in D1 database

## Frontend Integration Notes
- Use `/start` endpoint to begin new games
- Session ID required for all game actions
- Game state returned with every action for UI updates
- Check `status` field for win/lose conditions
- Optionally authenticate for user tracking via `user_fid`