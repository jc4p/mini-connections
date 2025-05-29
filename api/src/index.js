import { Hono } from 'hono'
import { cors } from 'hono/cors'
import puzzleRoutes from './routes/puzzles.js'
import userRoutes from './routes/user.js'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.route('/api/puzzles', puzzleRoutes)
app.route('/api/user', userRoutes)

app.get('/', (c) => {
  return c.json({ message: 'Mini Connections API', version: '1.0.0' })
})

export default app