import './style.css'
import * as frame from '@farcaster/frame-sdk'

const API_BASE = import.meta.env.DEV ? 'http://localhost:8787' : 'https://your-api-domain.com'

class ConnectionsGame {
  constructor() {
    this.selectedItems = new Set()
    this.mistakes = 0
    this.maxMistakes = 4
    this.solvedGroups = []
    this.puzzle = null
    this.gameState = 'loading' // loading, playing, won, lost
    this.user = null
    this.authToken = null
    this.puzzleId = 1 // Start with first puzzle
    
    this.init()
  }

  async init() {
    try {
      // Initialize Frame SDK
      const context = await frame.sdk.context
      if (context && context.user) {
        console.log('Frame context loaded:', context.user)
        this.user = context.user
        
        // Try to get Quick Auth token
        try {
          const authResult = await frame.sdk.experimental.quickAuth()
          this.authToken = authResult.token
          console.log('Quick Auth successful')
        } catch (authError) {
          console.log('Quick Auth failed:', authError)
        }
      }
      
      // Signal that the frame is ready
      await frame.sdk.actions.ready()
    } catch (error) {
      console.log('Not in frame context or error:', error)
    }

    // Load puzzle data
    await this.loadPuzzle()
    this.render()
    this.setupEventListeners()
  }

  async loadPuzzle() {
    try {
      this.gameState = 'loading'
      const response = await fetch(`${API_BASE}/api/puzzles/${this.puzzleId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to load puzzle: ${response.status}`)
      }
      
      this.puzzle = await response.json()
      this.gameState = 'playing'
      console.log('Puzzle loaded:', this.puzzle.title)
    } catch (error) {
      console.error('Error loading puzzle:', error)
      this.gameState = 'error'
    }
  }

  async makeAPIRequest(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`
    }
    
    return fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    })
  }

  render() {
    const app = document.querySelector('#app')
    
    if (this.gameState === 'loading') {
      app.innerHTML = `
        <div class="game-container">
          <h1>Mini Connections</h1>
          <div class="loading">Loading puzzle...</div>
        </div>
      `
      return
    }
    
    if (this.gameState === 'error') {
      app.innerHTML = `
        <div class="game-container">
          <h1>Mini Connections</h1>
          <div class="error">Failed to load puzzle. Please try again.</div>
          <button onclick="location.reload()">Retry</button>
        </div>
      `
      return
    }
    
    if (!this.puzzle) return
    
    app.innerHTML = `
      <div class="game-container">
        <h1>Mini Connections</h1>
        <div class="puzzle-header">
          <button id="prev-puzzle" class="nav-btn">← Previous</button>
          <div class="puzzle-title">${this.puzzle.title} (#${this.puzzleId})</div>
          <button id="next-puzzle" class="nav-btn">Next →</button>
        </div>
        <div class="game-header">
          <div class="mistakes">Mistakes: ${this.mistakes}/${this.maxMistakes}</div>
        </div>
        <div class="grid" id="grid">
          ${this.renderGrid()}
        </div>
        <div class="controls">
          <button id="submit-btn" class="submit-btn" disabled>Submit</button>
          <button id="shuffle-btn" class="shuffle-btn">Shuffle</button>
        </div>
        <div class="solved-groups" id="solved-groups">
          ${this.renderSolvedGroups()}
        </div>
      </div>
    `
  }

  renderGrid() {
    if (!this.puzzle || !this.puzzle.items) return ''
    
    const availableItems = this.puzzle.items.filter(item => 
      !this.solvedGroups.some(group => group.items.includes(item))
    )
    
    return availableItems.map(item => `
      <div class="grid-item ${this.selectedItems.has(item) ? 'selected' : ''}" 
           data-item="${item}">
        ${item}
      </div>
    `).join('')
  }

  renderSolvedGroups() {
    return this.solvedGroups.map(group => `
      <div class="solved-group">
        <div class="group-category">${group.category}</div>
        <div class="group-items">${group.items.join(', ')}</div>
      </div>
    `).join('')
  }

  setupEventListeners() {
    const grid = document.getElementById('grid')
    const submitBtn = document.getElementById('submit-btn')
    const shuffleBtn = document.getElementById('shuffle-btn')
    const prevBtn = document.getElementById('prev-puzzle')
    const nextBtn = document.getElementById('next-puzzle')

    grid?.addEventListener('click', (e) => {
      if (e.target.classList.contains('grid-item')) {
        this.toggleSelection(e.target.dataset.item)
      }
    })

    submitBtn?.addEventListener('click', () => {
      this.submitGuess()
    })

    shuffleBtn?.addEventListener('click', () => {
      this.shuffleItems()
    })

    prevBtn?.addEventListener('click', () => {
      this.previousPuzzle()
    })

    nextBtn?.addEventListener('click', () => {
      this.nextPuzzle()
    })
  }

  toggleSelection(item) {
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item)
    } else if (this.selectedItems.size < 4) {
      this.selectedItems.add(item)
    }

    this.updateUI()
  }

  updateUI() {
    // Update grid item selection state
    document.querySelectorAll('.grid-item').forEach(element => {
      const item = element.dataset.item
      element.classList.toggle('selected', this.selectedItems.has(item))
    })

    // Update submit button state
    const submitBtn = document.getElementById('submit-btn')
    submitBtn.disabled = this.selectedItems.size !== 4
  }

  async submitGuess() {
    if (this.selectedItems.size !== 4) return

    try {
      const response = await this.makeAPIRequest(`/api/puzzles/${this.puzzleId}/guess`, {
        method: 'POST',
        body: JSON.stringify({
          items: Array.from(this.selectedItems)
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.correct) {
          // Correct guess - animate selected items
          this.animateSelectedItems('correct')
          
          setTimeout(() => {
            this.solvedGroups.push(data.group)
            this.selectedItems.clear()
            
            if (this.solvedGroups.length === 4) {
              this.gameState = 'won'
              this.showWinScreen()
            } else {
              this.render()
              this.setupEventListeners()
            }
          }, 600)
        } else {
          // Incorrect guess - animate shake
          this.animateSelectedItems('incorrect')
          
          setTimeout(() => {
            this.mistakes++
            this.selectedItems.clear()
            
            if (this.mistakes >= this.maxMistakes) {
              this.gameState = 'lost'
              this.showLoseScreen()
            } else {
              this.render()
              this.setupEventListeners()
            }
          }, 600)
        }
      }
    } catch (error) {
      console.error('Error submitting guess:', error)
    }
  }

  animateSelectedItems(type) {
    document.querySelectorAll('.grid-item.selected').forEach(element => {
      element.style.animation = `${type}Guess 0.6s ease`
      setTimeout(() => {
        element.style.animation = ''
      }, 600)
    })
  }

  async loadPuzzleList() {
    try {
      const response = await fetch(`${API_BASE}/api/puzzles`)
      if (response.ok) {
        const data = await response.json()
        return data.puzzles
      }
    } catch (error) {
      console.error('Error loading puzzle list:', error)
    }
    return []
  }

  async nextPuzzle() {
    const puzzles = await this.loadPuzzleList()
    const currentIndex = puzzles.findIndex(p => p.id === this.puzzleId)
    if (currentIndex < puzzles.length - 1) {
      this.puzzleId = puzzles[currentIndex + 1].id
      this.resetGame()
      await this.loadPuzzle()
      this.render()
      this.setupEventListeners()
    }
  }

  async previousPuzzle() {
    const puzzles = await this.loadPuzzleList()
    const currentIndex = puzzles.findIndex(p => p.id === this.puzzleId)
    if (currentIndex > 0) {
      this.puzzleId = puzzles[currentIndex - 1].id
      this.resetGame()
      await this.loadPuzzle()
      this.render()
      this.setupEventListeners()
    }
  }

  resetGame() {
    this.selectedItems.clear()
    this.mistakes = 0
    this.solvedGroups = []
    this.gameState = 'loading'
  }

  shuffleItems() {
    if (!this.puzzle || !this.puzzle.items) return
    
    // Get available items (not in solved groups)
    const availableItems = this.puzzle.items.filter(item => 
      !this.solvedGroups.some(group => group.items.includes(item))
    )
    
    // Fisher-Yates shuffle algorithm
    for (let i = availableItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableItems[i], availableItems[j]] = [availableItems[j], availableItems[i]]
    }
    
    // Update puzzle items order (keeping solved groups in place)
    const shuffledItems = []
    let availableIndex = 0
    
    for (const item of this.puzzle.items) {
      if (this.solvedGroups.some(group => group.items.includes(item))) {
        shuffledItems.push(item)
      } else {
        shuffledItems.push(availableItems[availableIndex++])
      }
    }
    
    this.puzzle.items = shuffledItems
    this.selectedItems.clear()
    
    // Add shuffle animation
    const grid = document.getElementById('grid')
    if (grid) {
      grid.style.animation = 'shuffle 0.3s ease'
      setTimeout(() => {
        grid.style.animation = ''
        this.render()
        this.setupEventListeners()
      }, 300)
    } else {
      this.render()
      this.setupEventListeners()
    }
  }

  showWinScreen() {
    const app = document.querySelector('#app')
    app.innerHTML = `
      <div class="game-container win-screen">
        <div class="celebration">🎉</div>
        <h1>Congratulations!</h1>
        <p>You solved "${this.puzzle.title}" with ${this.mistakes === 0 ? 'PERFECT SCORE!' : `${this.mistakes} mistake${this.mistakes === 1 ? '' : 's'}`}</p>
        <div class="solved-groups">
          ${this.renderSolvedGroups()}
        </div>
        <div class="win-controls">
          <button id="next-puzzle-win" class="submit-btn">Next Puzzle →</button>
          <button onclick="location.reload()" class="shuffle-btn">Play Again</button>
        </div>
      </div>
    `
    
    // Add event listener for next puzzle
    setTimeout(() => {
      document.getElementById('next-puzzle-win')?.addEventListener('click', () => {
        this.nextPuzzle()
      })
    }, 100)
  }

  showLoseScreen() {
    const app = document.querySelector('#app')
    app.innerHTML = `
      <div class="game-container">
        <h1>Game Over</h1>
        <p>You've made ${this.maxMistakes} mistakes.</p>
        <button onclick="location.reload()">Try Again</button>
      </div>
    `
  }
}

// Start the game
new ConnectionsGame()
