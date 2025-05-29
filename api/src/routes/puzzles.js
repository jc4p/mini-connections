import { Hono } from 'hono'
import { SessionManager } from '../utils/sessions.js'
import { optionalAuth } from '../middleware/auth.js'

const app = new Hono()

const puzzles = [
  {
    id: 1,
    title: "Tech Giants",
    items: [
      "Apple", "Microsoft", "Google", "Amazon",
      "Netflix", "Spotify", "Hulu", "Disney+",
      "iPhone", "Pixel", "Galaxy", "OnePlus",
      "Safari", "Chrome", "Firefox", "Edge"
    ],
    groups: [
      {
        category: "Tech Companies",
        items: ["Apple", "Microsoft", "Google", "Amazon"]
      },
      {
        category: "Streaming Services", 
        items: ["Netflix", "Spotify", "Hulu", "Disney+"]
      },
      {
        category: "Phone Brands",
        items: ["iPhone", "Pixel", "Galaxy", "OnePlus"]
      },
      {
        category: "Web Browsers",
        items: ["Safari", "Chrome", "Firefox", "Edge"]
      }
    ]
  },
  {
    id: 2,
    title: "Coffee Culture",
    items: [
      "Espresso", "Cappuccino", "Latte", "Americano",
      "French Press", "Pour Over", "Aeropress", "Cold Brew",
      "Arabica", "Robusta", "Liberica", "Excelsa",
      "Colombia", "Ethiopia", "Jamaica", "Hawaii"
    ],
    groups: [
      {
        category: "Coffee Drinks",
        items: ["Espresso", "Cappuccino", "Latte", "Americano"]
      },
      {
        category: "Brewing Methods",
        items: ["French Press", "Pour Over", "Aeropress", "Cold Brew"]
      },
      {
        category: "Coffee Species",
        items: ["Arabica", "Robusta", "Liberica", "Excelsa"]
      },
      {
        category: "Coffee Regions",
        items: ["Colombia", "Ethiopia", "Jamaica", "Hawaii"]
      }
    ]
  },
  {
    id: 3,
    title: "Movie Magic",
    items: [
      "Director", "Producer", "Actor", "Cinematographer",
      "Comedy", "Drama", "Action", "Horror",
      "Oscar", "Emmy", "Golden Globe", "BAFTA",
      "Netflix", "HBO", "Disney", "Warner Bros"
    ],
    groups: [
      {
        category: "Film Crew Roles",
        items: ["Director", "Producer", "Actor", "Cinematographer"]
      },
      {
        category: "Movie Genres",
        items: ["Comedy", "Drama", "Action", "Horror"]
      },
      {
        category: "Awards",
        items: ["Oscar", "Emmy", "Golden Globe", "BAFTA"]
      },
      {
        category: "Studios",
        items: ["Netflix", "HBO", "Disney", "Warner Bros"]
      }
    ]
  },
  {
    id: 4,
    title: "Fitness & Health",
    items: [
      "Yoga", "Pilates", "CrossFit", "Zumba",
      "Protein", "Carbs", "Fats", "Vitamins",
      "Treadmill", "Dumbbells", "Kettlebell", "Resistance Band",
      "Heart Rate", "Calories", "Steps", "Sleep"
    ],
    groups: [
      {
        category: "Workout Types",
        items: ["Yoga", "Pilates", "CrossFit", "Zumba"]
      },
      {
        category: "Nutrients",
        items: ["Protein", "Carbs", "Fats", "Vitamins"]
      },
      {
        category: "Gym Equipment",
        items: ["Treadmill", "Dumbbells", "Kettlebell", "Resistance Band"]
      },
      {
        category: "Health Metrics",
        items: ["Heart Rate", "Calories", "Steps", "Sleep"]
      }
    ]
  },
  {
    id: 5,
    title: "Social Media",
    items: [
      "Instagram", "TikTok", "Twitter", "Facebook",
      "Like", "Share", "Comment", "Follow",
      "Story", "Reel", "Post", "Live",
      "Influencer", "Creator", "Brand", "Sponsor"
    ],
    groups: [
      {
        category: "Social Platforms",
        items: ["Instagram", "TikTok", "Twitter", "Facebook"]
      },
      {
        category: "User Actions",
        items: ["Like", "Share", "Comment", "Follow"]
      },
      {
        category: "Content Types",
        items: ["Story", "Reel", "Post", "Live"]
      },
      {
        category: "Social Roles",
        items: ["Influencer", "Creator", "Brand", "Sponsor"]
      }
    ]
  },
  {
    id: 6,
    title: "Gaming World",
    items: [
      "Mario", "Link", "Master Chief", "Kratos",
      "Xbox", "PlayStation", "Nintendo Switch", "Steam Deck",
      "RPG", "FPS", "Strategy", "Puzzle",
      "Twitch", "YouTube Gaming", "Discord", "Steam"
    ],
    groups: [
      {
        category: "Video Game Characters",
        items: ["Mario", "Link", "Master Chief", "Kratos"]
      },
      {
        category: "Gaming Consoles",
        items: ["Xbox", "PlayStation", "Nintendo Switch", "Steam Deck"]
      },
      {
        category: "Game Genres",
        items: ["RPG", "FPS", "Strategy", "Puzzle"]
      },
      {
        category: "Gaming Platforms",
        items: ["Twitch", "YouTube Gaming", "Discord", "Steam"]
      }
    ]
  },
  {
    id: 7,
    title: "Food & Cuisine",
    items: [
      "Sushi", "Tacos", "Pizza", "Pasta",
      "Salt", "Pepper", "Garlic", "Basil",
      "Whisk", "Spatula", "Tongs", "Ladle",
      "Bake", "Grill", "Sauté", "Steam"
    ],
    groups: [
      {
        category: "Popular Dishes",
        items: ["Sushi", "Tacos", "Pizza", "Pasta"]
      },
      {
        category: "Common Seasonings",
        items: ["Salt", "Pepper", "Garlic", "Basil"]
      },
      {
        category: "Kitchen Utensils",
        items: ["Whisk", "Spatula", "Tongs", "Ladle"]
      },
      {
        category: "Cooking Methods",
        items: ["Bake", "Grill", "Sauté", "Steam"]
      }
    ]
  },
  {
    id: 8,
    title: "Travel & Transport",
    items: [
      "Car", "Train", "Plane", "Bus",
      "Paris", "Tokyo", "New York", "London",
      "Hotel", "Hostel", "Airbnb", "Resort",
      "Passport", "Visa", "Ticket", "Luggage"
    ],
    groups: [
      {
        category: "Transportation",
        items: ["Car", "Train", "Plane", "Bus"]
      },
      {
        category: "Major Cities",
        items: ["Paris", "Tokyo", "New York", "London"]
      },
      {
        category: "Accommodation",
        items: ["Hotel", "Hostel", "Airbnb", "Resort"]
      },
      {
        category: "Travel Documents",
        items: ["Passport", "Visa", "Ticket", "Luggage"]
      }
    ]
  },
  {
    id: 9,
    title: "Music & Arts",
    items: [
      "Guitar", "Piano", "Drums", "Violin",
      "Rock", "Jazz", "Pop", "Classical",
      "Painting", "Sculpture", "Photography", "Drawing",
      "Spotify", "Apple Music", "YouTube Music", "SoundCloud"
    ],
    groups: [
      {
        category: "Musical Instruments",
        items: ["Guitar", "Piano", "Drums", "Violin"]
      },
      {
        category: "Music Genres",
        items: ["Rock", "Jazz", "Pop", "Classical"]
      },
      {
        category: "Art Forms",
        items: ["Painting", "Sculpture", "Photography", "Drawing"]
      },
      {
        category: "Music Streaming",
        items: ["Spotify", "Apple Music", "YouTube Music", "SoundCloud"]
      }
    ]
  },
  {
    id: 10,
    title: "Nature & Weather",
    items: [
      "Oak", "Pine", "Maple", "Birch",
      "Lion", "Eagle", "Dolphin", "Butterfly",
      "Sunny", "Rainy", "Snowy", "Cloudy",
      "Mountain", "Ocean", "Desert", "Forest"
    ],
    groups: [
      {
        category: "Tree Types",
        items: ["Oak", "Pine", "Maple", "Birch"]
      },
      {
        category: "Animals",
        items: ["Lion", "Eagle", "Dolphin", "Butterfly"]
      },
      {
        category: "Weather Conditions",
        items: ["Sunny", "Rainy", "Snowy", "Cloudy"]
      },
      {
        category: "Natural Landscapes",
        items: ["Mountain", "Ocean", "Desert", "Forest"]
      }
    ]
  },
  {
    id: 11,
    title: "Sports & Athletics",
    items: [
      "Soccer", "Basketball", "Tennis", "Baseball",
      "Gold", "Silver", "Bronze", "Platinum",
      "Stadium", "Court", "Field", "Arena",
      "Nike", "Adidas", "Under Armour", "Puma"
    ],
    groups: [
      {
        category: "Popular Sports",
        items: ["Soccer", "Basketball", "Tennis", "Baseball"]
      },
      {
        category: "Medal Types",
        items: ["Gold", "Silver", "Bronze", "Platinum"]
      },
      {
        category: "Sports Venues",
        items: ["Stadium", "Court", "Field", "Arena"]
      },
      {
        category: "Athletic Brands",
        items: ["Nike", "Adidas", "Under Armour", "Puma"]
      }
    ]
  },
  {
    id: 12,
    title: "Space & Science",
    items: [
      "Mars", "Jupiter", "Saturn", "Venus",
      "Telescope", "Microscope", "Beaker", "Bunsen Burner",
      "Einstein", "Newton", "Curie", "Darwin",
      "NASA", "SpaceX", "ESA", "Blue Origin"
    ],
    groups: [
      {
        category: "Planets",
        items: ["Mars", "Jupiter", "Saturn", "Venus"]
      },
      {
        category: "Scientific Instruments",
        items: ["Telescope", "Microscope", "Beaker", "Bunsen Burner"]
      },
      {
        category: "Famous Scientists",
        items: ["Einstein", "Newton", "Curie", "Darwin"]
      },
      {
        category: "Space Organizations",
        items: ["NASA", "SpaceX", "ESA", "Blue Origin"]
      }
    ]
  },
  {
    id: 13,
    title: "Fashion & Style",
    items: [
      "Jeans", "Dress", "Shirt", "Jacket",
      "Red", "Blue", "Black", "White",
      "Cotton", "Silk", "Wool", "Leather",
      "Gucci", "Prada", "Nike", "Zara"
    ],
    groups: [
      {
        category: "Clothing Items",
        items: ["Jeans", "Dress", "Shirt", "Jacket"]
      },
      {
        category: "Basic Colors",
        items: ["Red", "Blue", "Black", "White"]
      },
      {
        category: "Fabric Types",
        items: ["Cotton", "Silk", "Wool", "Leather"]
      },
      {
        category: "Fashion Brands",
        items: ["Gucci", "Prada", "Nike", "Zara"]
      }
    ]
  },
  {
    id: 14,
    title: "Home & Garden",
    items: [
      "Rose", "Tulip", "Daisy", "Sunflower",
      "Sofa", "Table", "Chair", "Bed",
      "Kitchen", "Bedroom", "Bathroom", "Living Room",
      "Hammer", "Screwdriver", "Wrench", "Drill"
    ],
    groups: [
      {
        category: "Flowers",
        items: ["Rose", "Tulip", "Daisy", "Sunflower"]
      },
      {
        category: "Furniture",
        items: ["Sofa", "Table", "Chair", "Bed"]
      },
      {
        category: "Rooms",
        items: ["Kitchen", "Bedroom", "Bathroom", "Living Room"]
      },
      {
        category: "Tools",
        items: ["Hammer", "Screwdriver", "Wrench", "Drill"]
      }
    ]
  },
  {
    id: 15,
    title: "Education & Learning",
    items: [
      "Math", "Science", "History", "English",
      "Pencil", "Pen", "Eraser", "Ruler",
      "Elementary", "Middle School", "High School", "College",
      "Teacher", "Student", "Principal", "Librarian"
    ],
    groups: [
      {
        category: "School Subjects",
        items: ["Math", "Science", "History", "English"]
      },
      {
        category: "School Supplies",
        items: ["Pencil", "Pen", "Eraser", "Ruler"]
      },
      {
        category: "Education Levels",
        items: ["Elementary", "Middle School", "High School", "College"]
      },
      {
        category: "School Roles",
        items: ["Teacher", "Student", "Principal", "Librarian"]
      }
    ]
  }
]

// Get all puzzles
app.get('/', (c) => {
  return c.json({
    puzzles: puzzles.map(p => ({
      id: p.id,
      title: p.title
    })),
    total: puzzles.length
  })
})

// Get next/previous puzzle
app.get('/:id/navigation', (c) => {
  const id = parseInt(c.req.param('id'))
  const currentIndex = puzzles.findIndex(p => p.id === id)
  
  if (currentIndex === -1) {
    return c.json({ error: 'Puzzle not found' }, 404)
  }
  
  const previousPuzzle = currentIndex > 0 ? puzzles[currentIndex - 1] : null
  const nextPuzzle = currentIndex < puzzles.length - 1 ? puzzles[currentIndex + 1] : null
  
  return c.json({
    current: { id: puzzles[currentIndex].id, title: puzzles[currentIndex].title },
    previous: previousPuzzle ? { id: previousPuzzle.id, title: previousPuzzle.title } : null,
    next: nextPuzzle ? { id: nextPuzzle.id, title: nextPuzzle.title } : null,
    position: currentIndex + 1,
    total: puzzles.length
  })
})

// Get specific puzzle
app.get('/:id', optionalAuth, (c) => {
  const id = parseInt(c.req.param('id'))
  const puzzle = puzzles.find(p => p.id === id)
  
  if (!puzzle) {
    return c.json({ error: 'Puzzle not found' }, 404)
  }
  
  // Return puzzle without revealing the groups (items only)
  return c.json({
    id: puzzle.id,
    title: puzzle.title,
    items: puzzle.items
  })
})

// Start new game session
app.post('/:id/start', optionalAuth, async (c) => {
  const id = parseInt(c.req.param('id'))
  const puzzle = puzzles.find(p => p.id === id)
  
  if (!puzzle) {
    return c.json({ error: 'Puzzle not found' }, 404)
  }
  
  const user = c.get('user')
  const sessionManager = new SessionManager(c.env.DB)
  
  try {
    const sessionId = await sessionManager.createSession(id, user?.fid)
    
    return c.json({
      sessionId,
      puzzle: {
        id: puzzle.id,
        title: puzzle.title,
        items: puzzle.items
      },
      gameState: {
        mistakes: 0,
        status: 'in_progress',
        completedGroups: [],
        revealedHints: []
      }
    })
  } catch (error) {
    console.error('Error creating session:', error)
    return c.json({ error: 'Failed to create session' }, 500)
  }
})

// Get game session state
app.get('/session/:sessionId', async (c) => {
  const sessionId = c.req.param('sessionId')
  const sessionManager = new SessionManager(c.env.DB)
  
  try {
    const session = await sessionManager.getSession(sessionId)
    
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
    }
    
    const puzzle = puzzles.find(p => p.id === session.puzzle_id)
    
    return c.json({
      sessionId: session.id,
      puzzle: {
        id: puzzle.id,
        title: puzzle.title,
        items: puzzle.items
      },
      gameState: {
        mistakes: session.mistakes,
        status: session.status,
        completedGroups: session.completed_groups,
        revealedHints: session.revealed_hints
      }
    })
  } catch (error) {
    console.error('Error getting session:', error)
    return c.json({ error: 'Failed to get session' }, 500)
  }
})

// Validate group submission with session
app.post('/session/:sessionId/guess', async (c) => {
  const sessionId = c.req.param('sessionId')
  const sessionManager = new SessionManager(c.env.DB)
  
  try {
    const session = await sessionManager.getSession(sessionId)
    
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
    }
    
    if (session.status !== 'in_progress') {
      return c.json({ error: 'Game already finished' }, 400)
    }
    
    const puzzle = puzzles.find(p => p.id === session.puzzle_id)
    const { items } = await c.req.json()
    
    if (!items || !Array.isArray(items) || items.length !== 4) {
      return c.json({ error: 'Must submit exactly 4 items' }, 400)
    }
    
    // Find matching group
    const matchingGroup = puzzle.groups.find(group => {
      const sortedGroupItems = [...group.items].sort()
      const sortedSubmittedItems = [...items].sort()
      return JSON.stringify(sortedGroupItems) === JSON.stringify(sortedSubmittedItems)
    })
    
    if (matchingGroup) {
      // Check if this group was already completed
      if (session.completed_groups.includes(matchingGroup.category)) {
        return c.json({
          correct: true,
          message: 'Group already completed',
          group: {
            category: matchingGroup.category,
            items: matchingGroup.items
          }
        })
      }
      
      // Add completed group
      const { completed_groups, status, isPerfect } = await sessionManager.addCompletedGroup(sessionId, matchingGroup.category)
      
      return c.json({
        correct: true,
        group: {
          category: matchingGroup.category,
          items: matchingGroup.items
        },
        gameState: {
          mistakes: session.mistakes,
          status,
          completedGroups: completed_groups,
          revealedHints: session.revealed_hints,
          isPerfect: isPerfect || false
        }
      })
    } else {
      // Incorrect guess - increment mistakes
      const { mistakes, status } = await sessionManager.incrementMistakes(sessionId)
      
      return c.json({
        correct: false,
        message: status === 'lost' ? 'Game over - too many mistakes!' : 'Incorrect grouping',
        gameState: {
          mistakes,
          status,
          completedGroups: session.completed_groups,
          revealedHints: session.revealed_hints
        }
      })
    }
  } catch (error) {
    console.error('Error processing guess:', error)
    return c.json({ error: 'Failed to process guess' }, 500)
  }
})

// Get hint for partial selection with session
app.post('/session/:sessionId/hint', async (c) => {
  const sessionId = c.req.param('sessionId')
  const sessionManager = new SessionManager(c.env.DB)
  
  try {
    const session = await sessionManager.getSession(sessionId)
    
    if (!session) {
      return c.json({ error: 'Session not found' }, 404)
    }
    
    if (session.status !== 'in_progress') {
      return c.json({ error: 'Game already finished' }, 400)
    }
    
    const puzzle = puzzles.find(p => p.id === session.puzzle_id)
    const { items } = await c.req.json()
    
    if (!items || !Array.isArray(items) || items.length < 2) {
      return c.json({ error: 'Need at least 2 items for hint' }, 400)
    }
    
    // Check if any incomplete group has at least 2 of the selected items
    for (const group of puzzle.groups) {
      // Skip if group already completed
      if (session.completed_groups.includes(group.category)) {
        continue
      }
      
      const matches = items.filter(item => group.items.includes(item))
      if (matches.length >= 2) {
        // Add hint to revealed hints if not already there
        await sessionManager.addRevealedHint(sessionId, group.hint)
        
        return c.json({
          hint: group.hint,
          category: group.category,
          matches: matches.length
        })
      }
    }
    
    return c.json({
      hint: null,
      message: 'No hint available for current selection'
    })
  } catch (error) {
    console.error('Error getting hint:', error)
    return c.json({ error: 'Failed to get hint' }, 500)
  }
})

export default app