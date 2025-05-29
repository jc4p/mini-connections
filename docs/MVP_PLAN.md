# 5-Day Prototype Requirements Timeline

## Day 1: Foundation & Data
**Backend Requirements:**
- Serve static puzzle data (3-5 hardcoded puzzles minimum)
- Each puzzle: 16 items, 4 groups of 4, category names, theme clues
- Basic API endpoint to fetch puzzle data
- Deployed and accessible

**Frontend Requirements:**
- 4x4 grid displaying 16 items
- Click to select/deselect items
- Visual feedback for selected state
- Deployed and functional

**End of Day 1**: Can display items and select them, backend serves puzzle data

---

## Day 2: Core Game Loop
**Backend Requirements:**
- Validate group submissions (correct/incorrect)
- Track mistake count per session
- Return appropriate feedback for submissions
- Handle game state (in progress, won, lost)

**Frontend Requirements:**
- Submit groups of 4 items
- Display mistake counter (max 4 mistakes)
- Show correct groups when found (with category reveal)
- Basic win/lose screens
- Clear visual feedback for correct/incorrect submissions

**End of Day 2**: Complete playable game loop - can win or lose

---

## Day 3: Progressive Theme Clue (Key Differentiator)
**Backend Requirements:**
- Detect when 2 correct items from same group are selected
- Serve vague category hints for each group
- Track which hints have been revealed per session

**Frontend Requirements:**
- Display progressive theme clues when triggered
- Smooth reveal animation for hints
- Clear visual connection between hint and current selection
- Polish group reveal animations

**End of Day 3**: Core USP working - progressive hints reduce frustration

---

## Day 4: Polish & Multiple Puzzles
**Backend Requirements:**
- 10-15 diverse, high-quality static puzzles
- Puzzle navigation (next/previous puzzle)
- Basic session statistics (games played, won, perfect games)
- "Perfect Game" detection (no mistakes)

**Frontend Requirements:**
- Navigate between different puzzles
- Display basic stats
- "Perfect Game" celebration animation
- Visual polish pass (smooth animations, proper spacing, colors)
- Mobile-friendly responsive design

**End of Day 4**: Feels polished, multiple puzzles to demonstrate variety

---

## Day 5: Demo Polish & Edge Cases
**Backend Requirements:**
- Handle all edge cases gracefully
- Performance optimization
- Showcase puzzles demonstrating different theme categories
- Error handling for malformed requests

**Frontend Requirements:**
- Final animation polish (satisfying group reveals)
- Loading states and error handling
- Puzzle completion celebration sequence
- Overall UX refinement (hover states, transitions)
- Demo-ready presentation mode

**End of Day 5**: Production-quality prototype ready for stakeholder demo

---

## Core Requirements Summary
**Must Have:**
- 16-item grid with 4 groups of 4
- Progressive Theme Clue mechanic (2 correct items → vague hint)
- 4 mistake limit
- Win/lose states with proper feedback
- Multiple static puzzles showcasing theme variety
- Mobile-responsive design
- Smooth, satisfying animations

**Success Criteria:**
- Stakeholder can play multiple complete games
- Progressive clue mechanic demonstrates clear value
- Feels polished and engaging, not like a prototype
- Showcases cultural relevance through diverse puzzle themes
- Zero critical bugs during demo
