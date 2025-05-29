import { createClient, Errors } from '@farcaster/quick-auth'

const client = createClient()

export const requireAuth = async (c, next) => {
  const authorization = c.req.header('Authorization')
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return c.json({ error: 'Authorization required' }, 401)
  }
  
  const token = authorization.split(' ')[1]
  const domain = c.env?.DOMAIN || 'localhost:8787'
  
  try {
    const payload = await client.verifyJwt({
      token,
      domain,
    })
    
    // Add user info to context
    c.set('user', {
      fid: payload.sub,
      address: payload.address
    })
    
    await next()
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      return c.json({ error: 'Invalid token' }, 401)
    }
    
    console.error('Auth error:', e)
    return c.json({ error: 'Authentication failed' }, 500)
  }
}

export const optionalAuth = async (c, next) => {
  const authorization = c.req.header('Authorization')
  
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.split(' ')[1]
    const domain = c.env?.DOMAIN || 'localhost:8787'
    
    try {
      const payload = await client.verifyJwt({
        token,
        domain,
      })
      
      c.set('user', {
        fid: payload.sub,
        address: payload.address
      })
    } catch (e) {
      // Ignore auth errors for optional auth
      console.warn('Optional auth failed:', e.message)
    }
  }
  
  await next()
}