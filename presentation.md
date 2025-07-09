---
marp: true
theme: gaia
_class: invert

---

# CardFrenzy  
### A Modular Browser-Based Card Game Engine

**Avi Rathod** • **Gabriel Mingle** • **Sivaji Alla** • **Imtiaz Shaik**

---
<!-- footer: CardFrenzy : Sivaji -->
<!-- paginate: true -->

## Presentation Contents

```
- Overview
- Project Structure
- Modularity
- Sample Games
- Extending the App
- Testing
- Assets
- Reflection
- Summary
- Attributions
- Demonstration
```

---
<!-- footer: CardFrenzy : Avi -->

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
│   └── hand.js      # Hand management
├── games/
│   ├── blackjack.js # Blackjack game logic
│   ├── war.js       # War game logic
│   └── game.js      # Game Engine Base Class
├── assets/          # Card images (ranks & suits)
├── tests/           # Automated tests & scripts
├── index.html       # Main entry point
├── sketch.js        # Main script
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
<!-- footer: CardFrenzy : Gabriel -->


## Included Sample Games

- **Blackjack**  
  - Standard rules, with hit/stand buttons and dealer logic.
- **War**  
  - Classic two-player war with automatic or manual play.

---

## Extending the App

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
<!-- footer: CardFrenzy : Sivaji -->

## Asset Showcase

<style>
img.color-adjust {
  filter: brightness(0);
}
</style>


<table width="100%">
  <tr>
    <th align="center">Ranks</th>
    <th align="center">Low LOD Suits</th>
    <th align="center">High LOD Suits</th>
  </tr>
  <tr>
    <td align="center" width="30%">
      <img src="p5-cards/assets/rank/jack.png" width="60" class="color-adjust"/><br/>
      <img src="p5-cards/assets/rank/joker.png" width="60" class="color-adjust"/><br/>
      <img src="p5-cards/assets/rank/king.png" width="60" class="color-adjust"/><br/>
      <img src="p5-cards/assets/rank/queen.png" width="60" class="color-adjust"/>
    </td>
    <td align="center" width="30%">
      <img src="p5-cards/assets/suits/club.png" width="60" class="color-adjust"/><br/>
      <img src="p5-cards/assets/suits/diamond.png" width="60" class="color-adjust"/><br/>
      <img src="p5-cards/assets/suits/heart.png" width="60" class="color-adjust"/><br/>
      <img src="p5-cards/assets/suits/spade.png" width="60" class="color-adjust"/>
    </td>
    <td align="center" width="30%">
      <img src="p5-cards/assets/suits/club_detail.png" width="60" class="color-adjust"/><br/>
      <img src="p5-cards/assets/suits/diamond_detail.png" width="60" class="color-adjust"/><br/>
      <img src="p5-cards/assets/suits/heart_detail.png" width="60" class="color-adjust"/><br/>
      <img src="p5-cards/assets/suits/spade_detail.png" width="60" class="color-adjust"/>
    </td>
  </tr>
</table>

---

**Reflection: Engineering Process:**  
- Followed modular design principles for maintainability and extensibility.
- Used JavaScript and p5.js for interactive graphics and logic.
- Iterative development: started with core components (Card, Deck, Hand), then added sample games and UI features.
- Used GitHub as version control, development tracking, and to run automated testing.

---

**Reflection: Reasonable Project:**  
- Scope limited to a static, client-side web app—no backend or server dependencies.
- Focused on reusability, clear structure, and browser compatibility.
- Achievable within a semester by a small team.

---
<!-- footer: CardFrenzy : Imtiaz -->


**Reflection: Is it Completed?**  
- Core engine and two sample games (Blackjack, War) are fully functional.
- Modular architecture allows for easy extension.
- Future work could include more games, improved notifications, theming, and mobile support.

---
## Summary

CardFrenzy is a robust, modular platform for building and playing card games in the browser.  
Its architecture makes it easy to add new games, customize assets, and ensure code quality through automated testing.

---
## Attributions
Special Thanks to: 
- I Am Vector: low level of detail suits [https://iamvector.com/all-icons/card-game-rules]

- amid999: high level of detail suits [https://www.freepik.com/author/amid999]

- ICONS8: the Ranks 
  - License[https://icons8.com/license]
  - images[https://icons8.com/icons/set/deck]

---
<!-- footer: CardFrenzy : Gabriel : Avi -->

## Demonstration
- **Live Testing and Deployment**
  - GitHub Workflows
- **Live App Demo**
  - [http://cardfrenzy.webtoys.dev/]
  - [https://ozpyn.github.io/SWE-Beta-Summer-2025/]