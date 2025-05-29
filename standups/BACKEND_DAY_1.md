# Backend Day 1 - Foundation Complete

## What We Built
- ✅ Converted `wrangler.jsonc` → `wrangler.toml`
- ✅ Hono server with Cloudflare Workers runtime
- ✅ 5 static puzzles with complete data structure
- ✅ Farcaster Quick Auth integration
- ✅ CORS enabled for frontend consumption

## API Routes

### Base URL
`http://localhost:8787` (dev) / `https://your-worker.your-subdomain.workers.dev` (prod)

### Puzzle Endpoints

#### `GET /api/puzzles`
List all available puzzles
```json
{
  "puzzles": [
    { "id": 1, "title": "Tech Giants" },
    { "id": 2, "title": "Coffee Culture" }
  ]
}
```

#### `GET /api/puzzles/:id`
Get puzzle data (items only, no solutions)
```json
{
  "id": 1,
  "title": "Tech Giants",
  "items": ["Apple", "Microsoft", "Google", "Amazon", ...]
}
```

#### `POST /api/puzzles/:id/guess`
Submit 4 items for validation
```json
// Request
{ "items": ["Apple", "Microsoft", "Google", "Amazon"] }

// Response (correct)
{
  "correct": true,
  "group": {
    "category": "Tech Companies",
    "items": ["Apple", "Microsoft", "Google", "Amazon"]
  }
}

// Response (incorrect)
{ "correct": false, "message": "Incorrect grouping" }
```

#### `POST /api/puzzles/:id/hint`
Get progressive hint (when 2+ correct items selected)
```json
// Request
{ "items": ["Apple", "Microsoft"] }

// Response
{
  "hint": "Silicon Valley giants",
  "category": "Tech Companies"
}
```

### Auth Endpoints

#### `GET /api/user/me` (Protected)
Get authenticated user info
```bash
# Headers: Authorization: Bearer <farcaster-jwt>
```
```json
{
  "fid": 6841,
  "address": "0xf9D3D372D0097BF26cbf2444B34F5B9522AfaA4b",
  "authenticated": true
}
```

## Frontend Integration Notes
- All endpoints return JSON
- Use `Authorization: Bearer <token>` for protected routes
- CORS configured for all origins (dev only)
- Progressive hints trigger at 2+ matching items from same group
- Each puzzle has exactly 16 items in 4 groups of 4