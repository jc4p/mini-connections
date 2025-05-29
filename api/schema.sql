-- Game sessions table
CREATE TABLE game_sessions (
    id TEXT PRIMARY KEY,
    puzzle_id INTEGER NOT NULL,
    user_fid INTEGER,
    mistakes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'in_progress', -- 'in_progress', 'won', 'lost'
    completed_groups TEXT DEFAULT '[]', -- JSON array of completed group categories
    revealed_hints TEXT DEFAULT '[]', -- JSON array of revealed hints
    is_perfect BOOLEAN DEFAULT FALSE, -- TRUE if won with 0 mistakes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User statistics table
CREATE TABLE user_stats (
    user_fid INTEGER PRIMARY KEY,
    games_played INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0,
    perfect_games INTEGER DEFAULT 0,
    total_mistakes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX idx_sessions_user_puzzle ON game_sessions(user_fid, puzzle_id);
CREATE INDEX idx_sessions_status ON game_sessions(status);
CREATE INDEX idx_sessions_perfect ON game_sessions(is_perfect);