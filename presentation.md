---
marp: true
theme: uncover
_class: invert
---

# CardFrenzy: Card Game Engine

Gabriel Mingle, Avi Rathod, Sivaji Alla, 

---

## Overview

**CardFrenzy** is a modular, browser-based card game engine built with JavaScript and [p5.js](https://p5js.org/).  
It provides a flexible foundation for developing and playing card games, with a few sample games included out-of-the-box.

---

## Project Structure

```
p5-cards/
├── components/
│   ├── card.js      # Card rendering & logic
│   ├── deck.js      # Deck management
│   ├── hand.js      # Hand management
│   └── winLose.js   # Win/Lose overlays
├── games/
│   ├── blackjack.js # Blackjack game logic
│   └── war.js       # War game logic
├── assets/          # Card images (ranks & suits)
├── tests/           # Automated tests & scripts
├── index.html       # Main entry point
└── style.css        # Stylesheet
```

---

## Modularity

- **Component-Based Design**  
  - Each card, deck, and hand is an independent object.
  - New games can be added by extending the `Game` class and using the core components.
- **Separation of Duties**  
  - Game rules and UI logic are kept separate.
  - Assets, styles, and scripts are organized by function.

---

## Included Sample Games

- **Blackjack**  
  - Standard rules, with hit/stand buttons and dealer logic.
- **War**  
  - Classic two-player war with automatic or manual play.

---

## Extending the Engine

- **Add New Games**  
  - Create a new file in `games/`, extend the `Game` class, and implement your rules.
- **Reuse Components**  
  - Use `Card`, `Deck`, and `Hand` for any standard card game.
- **Custom Assets**  
  - Swap in your own card images or add new suits/ranks.

---

## Testing & Quality

- **Unit Tests**  
  - Test deck/card logic, hand values, and game outcomes.
- **Browser Automation**  
  - Scripts for running tests in Chrome and Firefox using Selenium.

---
## Asset Showcase:
**Ranks:**

<p align="left">
  <img src="p5-cards/assets/rank/jack.png" alt="Jack" width="80" height="80" style="margin-right: 8px;" />
  <img src="p5-cards/assets/rank/joker.png" alt="Joker" width="80" height="80" style="margin-right: 8px;" />
  <img src="p5-cards/assets/rank/king.png" alt="King" width="80" height="80" style="margin-right: 8px;" />
  <img src="p5-cards/assets/rank/queen.png" alt="Queen" width="80" height="80" style="margin-right: 8px;" />
</p>

**Low LOD Suits:**

<p align="left">
  <img src="p5-cards/assets/suits/club.png" alt="Club" width="80" height="80" style="margin-right: 8px;" />
  <img src="p5-cards/assets/suits/diamond.png" alt="Diamond" width="80" height="80" style="margin-right: 8px;" />
  <img src="p5-cards/assets/suits/heart.png" alt="Heart" width="80" height="80" style="margin-right: 8px;" />
  <img src="p5-cards/assets/suits/spade.png" alt="Spade" width="80" height="80" style="margin-right: 8px;" />
</p>

**High LOD Suits:**

<p align="left">
  <img src="p5-cards/assets/suits/club_detail.png" alt="Detailed Club" width="80" height="80" style="margin-right: 8px;" />
  <img src="p5-cards/assets/suits/diamond_detail.png" alt="Detailed Diamond" width="80" height="80" style="margin-right: 8px;" />
  <img src="p5-cards/assets/suits/heart_detail.png" alt="Detailed Heart" width="80" height="80" style="margin-right: 8px;" />
  <img src="p5-cards/assets/suits/spade_detail.png" alt="Detailed Spade" width="80" height="80" style="margin-right: 8px;" />
</p>

---

## Summary

CardFrenzy is a robust, modular platform for building and playing card games in the browser.  
Its architecture makes it easy to add new games, customize assets, and ensure code quality through automated testing.