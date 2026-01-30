# Hand MediaPipe Roguelike Game

A roguelike game controlled by hand gestures using MediaPipe for real-time hand tracking.

## 📚 Documentation

For detailed system architecture and flowcharts, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🎮 Game Features

- **Gesture-Based Controls**: Control your character using hand gestures detected by your camera
- **Roguelike Gameplay**: Procedurally generated levels with permadeath mechanics
- **Combat System**: Engage in tactical combat using various hand gestures
- **Character Progression**: Level up and unlock new abilities
- **Multiple Classes**: Choose from Warrior, Mage, or Rogue

## 🤚 Hand Gestures

- 👊 **Fist** - Attack
- 🖐️ **Open Palm** - Block/Shield
- ☝️ **Pointing** - Move/Select
- ✌️ **Peace Sign** - Special Ability
- 👍 **Thumbs Up** - Confirm
- 🤏 **Pinch** - Grab Item
- 👋 **Wave** - Dodge

## 🏗️ Architecture Overview

The game consists of several key components:

1. **Input Processing** - MediaPipe hand tracking and gesture recognition
2. **Game Logic** - Player controller, enemy AI, combat system
3. **Rendering** - Game world, sprites, effects, and animations
4. **UI System** - HUD, menus, and inventory management

For detailed flowcharts and diagrams, please refer to the [Architecture Documentation](./ARCHITECTURE.md).

## 🚀 Getting Started

(Installation and setup instructions to be added)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

(License information to be added)
# 🎮 Hand MediaPipe Roguelike Game

A revolutionary roguelike game controlled entirely through hand gestures using Google's MediaPipe technology. Experience classic roguelike gameplay with an innovative twist - your hands become the controller!

## 📖 Overview

Hand MediaPipe Roguelike Game combines the addictive gameplay of traditional roguelike games with cutting-edge computer vision technology. Using your webcam and MediaPipe's hand tracking capabilities, you can control your character, cast spells, and battle enemies with intuitive hand gestures.

## ✨ Features

- **🤚 Gesture-Based Controls**: Navigate and interact using natural hand movements
- **🎲 Procedurally Generated Dungeons**: Every playthrough offers a unique experience
- **⚔️ Strategic Combat**: Use different hand gestures to perform various attacks and abilities
- **📊 Real-Time Hand Tracking**: Powered by Google MediaPipe for accurate and responsive gesture recognition
- **🏆 Roguelike Mechanics**: Permadeath, randomized items, and increasing difficulty
- **🎨 Immersive Graphics**: Engaging visual experience with smooth animations

## 🎯 Game Controls

Control your character using these intuitive hand gestures:

| Gesture | Action |
|---------|--------|
| ✊ Closed Fist | Move/Attack |
| ✋ Open Palm | Shield/Block |
| ☝️ Point Up | Cast Magic |
| 👆 Two Fingers | Select Item |
| 👌 OK Sign | Interact/Use |
| ✌️ Peace Sign | Quick Action |

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.7+** or **Node.js 14+** (depending on implementation)
- **Webcam** for hand gesture detection
- **Modern Browser** (Chrome, Firefox, or Edge recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/leekHotline/hand-mediapipe-rougelike-game.git
   cd hand-mediapipe-rougelike-game
   ```

2. **Install dependencies**
   
   For Python implementation:
   ```bash
   pip install -r requirements.txt
   ```
   
   For JavaScript implementation:
   ```bash
   npm install
   ```

3. **Run the game**
   
   For Python:
   ```bash
   python main.py
   ```
   
   For JavaScript:
   ```bash
   npm start
   ```

4. **Grant camera permissions** when prompted by your browser or system

## 🎮 How to Play

1. **Position yourself** in front of your webcam with good lighting
2. **Raise your hand** within the camera's view
3. **Make gestures** to control your character through the dungeon
4. **Defeat enemies** using strategic hand movements
5. **Collect items** and power-ups to strengthen your character
6. **Survive** as long as possible - remember, death is permanent!

### Tips for Best Experience

- 🌞 Ensure adequate lighting for better hand detection
- 📏 Keep your hand at a comfortable distance from the camera (30-60 cm)
- 🖐️ Make clear, deliberate gestures for accurate recognition
- 🎯 Practice gestures before starting your adventure

## 🛠️ Technical Stack

- **Hand Tracking**: [Google MediaPipe](https://mediapipe.dev/)
- **Computer Vision**: OpenCV / TensorFlow.js
- **Game Engine**: Pygame / Phaser.js / Canvas API
- **Graphics**: WebGL / HTML5 Canvas
- **Languages**: Python / JavaScript / TypeScript

## 👨‍💻 Development

### Project Structure

```
hand-mediapipe-rougelike-game/
├── src/              # Source code
├── assets/           # Game assets (sprites, sounds, etc.)
├── docs/             # Documentation
├── tests/            # Test files
└── README.md         # This file
```

### Running in Development Mode

```bash
# Enable debug mode for gesture visualization
DEBUG=true python main.py

# Or for JavaScript
npm run dev
```

### Running Tests

```bash
# Run test suite
pytest tests/

# Or for JavaScript
npm test
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Ideas

- 🎨 New character designs or enemy types
- 🤚 Additional gesture recognition patterns
- 🎵 Sound effects and music
- 🗺️ New dungeon generation algorithms
- 📚 Documentation improvements
- 🐛 Bug fixes and performance optimizations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google MediaPipe Team** for the amazing hand tracking technology
- **Roguelike Development Community** for inspiration and game design principles
- All contributors who have helped shape this project

## 📧 Contact

- **Project Link**: [https://github.com/leekHotline/hand-mediapipe-rougelike-game](https://github.com/leekHotline/hand-mediapipe-rougelike-game)
- **Issues**: [Report a bug or request a feature](https://github.com/leekHotline/hand-mediapipe-rougelike-game/issues)

## 🎯 Roadmap

- [ ] Multiplayer gesture-based battles
- [ ] Custom gesture training
- [ ] Mobile device support
- [ ] VR integration
- [ ] Leaderboard system
- [ ] Achievement system
- [ ] More enemy types and bosses
- [ ] Expanded spell system

---

**Enjoy the game and may your gestures be swift!** 🎮✨
