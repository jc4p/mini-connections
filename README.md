# Mini Connections

A modern, frame-native implementation of the popular word connections puzzle game built for the Farcaster ecosystem. Players group 16 items into 4 categories of 4, with a clean interface and satisfying animations.

## 🎮 Game Overview

Mini Connections challenges players to find hidden connections between 16 seemingly random items. Each puzzle contains exactly 4 groups of 4 related items. Players have 4 mistakes before the game ends.

**Key Features:**
- 15 diverse puzzle themes (Tech, Coffee, Movies, Gaming, Travel, etc.)
- Clean, hint-free gameplay that rewards skill over hand-holding
- Smooth animations for all interactions
- Mobile-responsive design
- Farcaster Frame integration with Quick Auth
- Session-based gameplay with statistics tracking

## 🏗️ Architecture

### Frontend (`/src/`)
- **Vanilla JavaScript** with Vite for fast development
- **Farcaster Frame SDK** integration
- Responsive 4x4 grid with touch-friendly controls
- State management with clean class-based architecture

### Backend (`/api/`)
- **Hono** web framework on **Cloudflare Workers**
- **D1 Database** for session persistence
- **Farcaster Quick Auth** for user authentication
- RESTful API with comprehensive game state tracking

## 📁 Project Structure

```
mini-connections/
├── src/                    # Frontend application
│   ├── main.js            # Main game logic and UI
│   └── style.css          # Responsive styles and animations
├── api/                   # Backend API
│   ├── src/
│   │   ├── index.js       # Main server and routing
│   │   ├── middleware/    # Authentication middleware
│   │   ├── routes/        # API route handlers
│   │   └── utils/         # Session management utilities
│   ├── schema.sql         # Database schema
│   └── wrangler.toml      # Cloudflare Workers config
├── docs/                  # Technical documentation
└── standups/              # Development progress logs
```

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) installed
- Cloudflare account for deployment

### Frontend Development
```bash
# Install dependencies
bun install

# Start development server
bun run dev
# Opens on http://localhost:5173
```

### Backend Development
```bash
cd api

# Install dependencies
bun install

# Start local development
bun run dev
# API runs on http://localhost:8787
```

## 🎯 Development Status

### ✅ Completed Features

**Core Gameplay (Days 1-2)**
- 4x4 grid with item selection
- Group validation and mistake tracking
- Win/lose states with proper feedback
- Backend API integration
- Session management with D1 database

**Polish & Enhancement (Day 3)**
- Smooth reveal animations for correct groups
- Visual feedback for correct/incorrect guesses
- Puzzle navigation (15 diverse puzzles)
- Mobile-responsive design
- Frame integration for Farcaster

**Production Ready**
- 15 high-quality static puzzles
- User authentication with Farcaster Quick Auth
- Session persistence and statistics tracking
- Perfect game detection and celebration
- Zero critical bugs

### 🎯 Planned Features

**Immediate Enhancements (Week 1)**
- Enhanced session-based gameplay
- User statistics dashboard
- Improved navigation with position indicators
- Perfect game celebration sequences

**Polish Features (Week 2)**
- Cross-device session synchronization
- Enhanced error recovery
- Theme variations per puzzle category
- Subtle audio feedback

**Social Features (Week 3)**
- Share wins to Farcaster
- Challenge friends functionality
- Achievement system
- Daily puzzle concept

## 🔧 API Reference

### Puzzle Management
```bash
GET /api/puzzles                    # List all puzzles
GET /api/puzzles/:id                # Get puzzle data  
GET /api/puzzles/:id/navigation     # Get navigation info
```

### Game Sessions
```bash
POST /api/puzzles/:id/start         # Start new game session
GET /api/puzzles/session/:sessionId # Get session state
POST /api/puzzles/session/:sessionId/guess # Submit guess
```

### User Features (Authenticated)
```bash
GET /api/user/me                    # Get user profile
GET /api/user/stats                 # Get user statistics
```

## 🎨 Game Design Philosophy

**No Hand-Holding**: Unlike other implementations, we deliberately removed progressive hints. Players must rely on skill and pattern recognition, making victories more satisfying.

**Smooth Interactions**: Every click, selection, and group reveal includes thoughtful animations that provide clear feedback without feeling sluggish.

**Cultural Relevance**: Puzzles span diverse themes to appeal to different communities and interests within the Farcaster ecosystem.

## 🔐 Farcaster Integration

### Frame Setup
The app includes proper Frame v2 meta tags for Farcaster client integration:

```html
<meta name="fc:frame" content='{"version":"next","imageUrl":"...","button":{"title":"Play Connections","action":{"type":"launch_frame","name":"Mini Connections","url":"..."}}}' />
```

### Authentication
Uses Farcaster Quick Auth for seamless user authentication:
- JWT-based session tokens  
- Automatic user profile integration
- Protected routes for statistics and personalization

## 📊 Game Statistics

Authenticated users can track:
- Games played and won
- Win rate percentage  
- Perfect games (zero mistakes)
- Category completion progress

## 🎮 Puzzle Themes

1. **Tech Giants** - Major technology companies
2. **Coffee Culture** - Coffee-related terms and brands
3. **Movie Magic** - Film industry and cinema
4. **Fitness & Health** - Exercise and wellness
5. **Social Media** - Platforms and digital culture
6. **Gaming World** - Video games and gaming culture
7. **Food & Cuisine** - Culinary terms and dishes
8. **Travel & Transport** - Transportation and travel
9. **Music & Arts** - Creative industries
10. **Nature & Weather** - Natural phenomena
11. **Sports & Athletics** - Sports and competition
12. **Space & Science** - Scientific concepts
13. **Fashion & Style** - Fashion and design
14. **Home & Garden** - Domestic and gardening
15. **Education & Learning** - Academic and learning

## 🛠️ Technical Details

**Performance**: Optimized for 60fps animations and fast loading
**Database**: Cloudflare D1 for edge performance  
**Deployment**: Cloudflare Workers for global distribution
**Mobile**: Touch-optimized with responsive breakpoints
**Accessibility**: Keyboard navigation and screen reader support

## 📈 Roadmap

**Phase 1: Enhanced UX** (Month 1)
- Advanced statistics and achievements
- Tutorial mode for new players
- Improved error handling and offline support

**Phase 2: Social Features** (Month 2)
- Real-time multiplayer solving
- Daily challenges with leaderboards
- Custom puzzle creation tools

**Phase 3: Community** (Month 3+)
- Puzzle creator community
- User-generated content
- Advanced social sharing features

### Initial Costs

Back-end dev days 1-3:
Total cost:            $1.56
Total duration (API):  16m 24.0s
Total duration (wall): 24m 7.5s
Total code changes:    1572 lines added, 217 lines removed
Token usage by model:
    claude-3-5-haiku:  106.2k input, 2.9k output, 0 cache read, 0 cache write
       claude-sonnet:  122 input, 31.4k output, 2.5m cache read, 60.3k cache write

Front-end dev days 1-2:
Total cost:            $1.81
Total duration (API):  15m 41.6s
Total duration (wall): 23m 5.7s
Total code changes:    1061 lines added, 241 lines removed
Token usage by model:
    claude-3-5-haiku:  79.1k input, 4.4k output, 0 cache read, 0 cache write
       claude-sonnet:  94 input, 26.2k output, 3.5m cache read, 78.4k cache write