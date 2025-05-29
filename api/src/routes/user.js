import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'
import { SessionManager } from '../utils/sessions.js'

const app = new Hono()

// Protected route that requires authentication
app.get('/me', requireAuth, (c) => {
  const user = c.get('user')
  
  return c.json({
    fid: user.fid,
    address: user.address,
    authenticated: true
  })
})

// Get user statistics
app.get('/stats', requireAuth, async (c) => {
  const user = c.get('user')
  const sessionManager = new SessionManager(c.env.DB)
  
  try {
    const stats = await sessionManager.getUserStats(user.fid)
    
    if (!stats) {
      return c.json({
        gamesPlayed: 0,
        gamesWon: 0,
        perfectGames: 0,
        totalMistakes: 0,
        winRate: 0
      })
    }
    
    const winRate = stats.games_played > 0 ? (stats.games_won / stats.games_played * 100).toFixed(1) : 0
    
    return c.json({
      gamesPlayed: stats.games_played,
      gamesWon: stats.games_won,
      perfectGames: stats.perfect_games,
      totalMistakes: stats.total_mistakes,
      winRate: parseFloat(winRate)
    })
  } catch (error) {
    console.error('Error getting user stats:', error)
    return c.json({ error: 'Failed to get stats' }, 500)
  }
})

export default app