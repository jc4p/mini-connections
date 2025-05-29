import { nanoid } from 'nanoid'

export class SessionManager {
  constructor(db) {
    this.db = db
  }

  async createSession(puzzleId, userFid = null) {
    const sessionId = nanoid()
    
    await this.db.prepare(`
      INSERT INTO game_sessions (id, puzzle_id, user_fid, mistakes, status, completed_groups, revealed_hints)
      VALUES (?, ?, ?, 0, 'in_progress', '[]', '[]')
    `).bind(sessionId, puzzleId, userFid).run()
    
    return sessionId
  }

  async getSession(sessionId) {
    const result = await this.db.prepare(`
      SELECT * FROM game_sessions WHERE id = ?
    `).bind(sessionId).first()
    
    if (!result) return null
    
    return {
      ...result,
      completed_groups: JSON.parse(result.completed_groups),
      revealed_hints: JSON.parse(result.revealed_hints)
    }
  }

  async updateSession(sessionId, updates) {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ')
    const values = Object.values(updates)
    
    await this.db.prepare(`
      UPDATE game_sessions 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(...values, sessionId).run()
  }

  async incrementMistakes(sessionId) {
    const session = await this.getSession(sessionId)
    if (!session) throw new Error('Session not found')
    
    const newMistakes = session.mistakes + 1
    const newStatus = newMistakes >= 4 ? 'lost' : session.status
    
    await this.updateSession(sessionId, {
      mistakes: newMistakes,
      status: newStatus
    })
    
    // Update user stats if game lost
    if (newStatus === 'lost' && session.user_fid) {
      await this.updateUserStats(session.user_fid, 'loss', newMistakes, false)
    }
    
    return { mistakes: newMistakes, status: newStatus }
  }

  async addCompletedGroup(sessionId, category) {
    const session = await this.getSession(sessionId)
    if (!session) throw new Error('Session not found')
    
    const completedGroups = [...session.completed_groups, category]
    const status = completedGroups.length === 4 ? 'won' : session.status
    const isPerfect = status === 'won' && session.mistakes === 0
    
    const updates = {
      completed_groups: JSON.stringify(completedGroups),
      status
    }
    
    if (isPerfect) {
      updates.is_perfect = true
    }
    
    await this.updateSession(sessionId, updates)
    
    // Update user stats if game completed
    if (status === 'won' && session.user_fid) {
      await this.updateUserStats(session.user_fid, 'win', session.mistakes, isPerfect)
    }
    
    return { completed_groups: completedGroups, status, isPerfect }
  }

  async addRevealedHint(sessionId, hint) {
    const session = await this.getSession(sessionId)
    if (!session) throw new Error('Session not found')
    
    const revealedHints = [...session.revealed_hints]
    if (!revealedHints.includes(hint)) {
      revealedHints.push(hint)
      await this.updateSession(sessionId, {
        revealed_hints: JSON.stringify(revealedHints)
      })
    }
    
    return revealedHints
  }

  async updateUserStats(userFid, gameResult, mistakes, isPerfect) {
    // Get or create user stats
    let stats = await this.db.prepare(`
      SELECT * FROM user_stats WHERE user_fid = ?
    `).bind(userFid).first()

    if (!stats) {
      await this.db.prepare(`
        INSERT INTO user_stats (user_fid, games_played, games_won, perfect_games, total_mistakes)
        VALUES (?, 0, 0, 0, 0)
      `).bind(userFid).run()
      
      stats = { games_played: 0, games_won: 0, perfect_games: 0, total_mistakes: 0 }
    }

    const updates = {
      games_played: stats.games_played + 1,
      games_won: gameResult === 'win' ? stats.games_won + 1 : stats.games_won,
      perfect_games: isPerfect ? stats.perfect_games + 1 : stats.perfect_games,
      total_mistakes: stats.total_mistakes + mistakes
    }

    await this.db.prepare(`
      UPDATE user_stats 
      SET games_played = ?, games_won = ?, perfect_games = ?, total_mistakes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_fid = ?
    `).bind(updates.games_played, updates.games_won, updates.perfect_games, updates.total_mistakes, userFid).run()
  }

  async getUserStats(userFid) {
    return await this.db.prepare(`
      SELECT * FROM user_stats WHERE user_fid = ?
    `).bind(userFid).first()
  }
}