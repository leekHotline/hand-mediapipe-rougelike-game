# Hand MediaPipe Roguelike Game - Architecture Documentation

This document provides visual flowcharts to help understand the game's architecture and data flow.

## Table of Contents
- [Game Flow](#game-flow)
- [Hand Gesture Processing](#hand-gesture-processing)
- [Game State Machine](#game-state-machine)
- [System Architecture](#system-architecture)
- [Combat System](#combat-system)
- [Player Progression](#player-progression)

---

## Game Flow

This flowchart shows the overall game execution flow from start to finish.

```mermaid
flowchart TD
    Start([Start Game]) --> Init[Initialize MediaPipe]
    Init --> CamCheck{Camera<br/>Available?}
    CamCheck -->|No| Error[Display Error]
    Error --> End([End])
    CamCheck -->|Yes| Menu[Main Menu]
    
    Menu --> MenuChoice{Player<br/>Choice}
    MenuChoice -->|New Game| NewGame[Create Character]
    MenuChoice -->|Continue| LoadGame[Load Save]
    MenuChoice -->|Settings| Settings[Game Settings]
    MenuChoice -->|Quit| End
    
    Settings --> Menu
    NewGame --> GameLoop[Game Loop]
    LoadGame --> GameLoop
    
    GameLoop --> CaptureFrame[Capture Camera Frame]
    CaptureFrame --> ProcessHands[Process Hand Detection]
    ProcessHands --> UpdateGame[Update Game State]
    UpdateGame --> Render[Render Game]
    Render --> CheckStatus{Game<br/>Status}
    
    CheckStatus -->|Playing| GameLoop
    CheckStatus -->|Paused| PauseMenu[Pause Menu]
    CheckStatus -->|Game Over| GameOver[Game Over Screen]
    CheckStatus -->|Victory| Victory[Victory Screen]
    
    PauseMenu --> PauseChoice{Player<br/>Choice}
    PauseChoice -->|Resume| GameLoop
    PauseChoice -->|Save| SaveGame[Save Progress]
    PauseChoice -->|Quit| Menu
    
    SaveGame --> PauseMenu
    GameOver --> GameOverChoice{Try<br/>Again?}
    GameOverChoice -->|Yes| NewGame
    GameOverChoice -->|No| Menu
    
    Victory --> Menu
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style GameLoop fill:#87CEEB
    style Error fill:#FF6B6B
```

---

## Hand Gesture Processing

This diagram illustrates how hand gestures are detected and converted into game actions.

```mermaid
flowchart LR
    subgraph Input
        Camera[Camera Feed] --> Frame[Video Frame]
    end
    
    subgraph MediaPipe Processing
        Frame --> Detect[Hand Detection]
        Detect --> Found{Hands<br/>Found?}
        Found -->|No| NoAction[No Action]
        Found -->|Yes| Landmarks[Extract Landmarks]
        Landmarks --> Normalize[Normalize Coordinates]
    end
    
    subgraph Gesture Recognition
        Normalize --> CalcFingers[Calculate Finger States]
        CalcFingers --> CalcAngles[Calculate Angles]
        CalcAngles --> CalcDistance[Calculate Distances]
        
        CalcFingers --> GestureMatch[Gesture Matching]
        CalcAngles --> GestureMatch
        CalcDistance --> GestureMatch
        
        GestureMatch --> Classify{Classify<br/>Gesture}
    end
    
    subgraph Game Actions
        Classify -->|Fist| Attack[Attack Action]
        Classify -->|Open Palm| Block[Block Action]
        Classify -->|Point| Move[Move Action]
        Classify -->|Peace Sign| Special[Special Ability]
        Classify -->|Thumbs Up| Confirm[Confirm/Select]
        Classify -->|Swipe Left| NavLeft[Navigate Left]
        Classify -->|Swipe Right| NavRight[Navigate Right]
        
        NoAction --> Queue[Action Queue]
        Attack --> Queue
        Block --> Queue
        Move --> Queue
        Special --> Queue
        Confirm --> Queue
        NavLeft --> Queue
        NavRight --> Queue
    end
    
    Queue --> Execute[Execute Actions]
    
    style Camera fill:#E6E6FA
    style GestureMatch fill:#FFD700
    style Execute fill:#90EE90
```

---

## Game State Machine

This state machine shows the different game states and their transitions.

```mermaid
stateDiagram-v2
    [*] --> Initialization
    
    Initialization --> MainMenu: Setup Complete
    
    MainMenu --> CharacterCreation: New Game
    MainMenu --> Loading: Continue
    MainMenu --> Settings: Settings
    MainMenu --> [*]: Quit
    
    CharacterCreation --> Exploration: Character Ready
    Loading --> Exploration: Save Loaded
    Settings --> MainMenu: Back
    
    Exploration --> Combat: Enemy Encountered
    Exploration --> Inventory: Open Inventory
    Exploration --> Shop: Enter Shop
    Exploration --> Pause: Pause
    Exploration --> GameOver: Player Death
    
    Combat --> CombatVictory: Enemy Defeated
    Combat --> GameOver: Player Defeated
    Combat --> Pause: Pause
    
    CombatVictory --> LootScreen: Collect Loot
    LootScreen --> Exploration: Continue
    
    Inventory --> Exploration: Close
    Shop --> Exploration: Leave Shop
    Pause --> Exploration: Resume
    Pause --> MainMenu: Save & Quit
    
    GameOver --> MainMenu: Return
    
    Exploration --> BossRoom: Enter Boss Room
    BossRoom --> BossCombat: Boss Appears
    BossCombat --> Victory: Boss Defeated
    BossCombat --> GameOver: Player Defeated
    
    Victory --> MainMenu: Credits
```

---

## System Architecture

This diagram shows the high-level system architecture and component interactions.

```mermaid
flowchart TB
    subgraph User Interface
        UI[UI Manager]
        HUD[HUD Display]
        Menu[Menu System]
        Inventory[Inventory UI]
    end
    
    subgraph Core Game
        GameMgr[Game Manager]
        StateCtrl[State Controller]
        EventSys[Event System]
        SaveMgr[Save Manager]
    end
    
    subgraph Game Logic
        Player[Player Controller]
        Enemy[Enemy AI]
        Combat[Combat System]
        Items[Item System]
        Skills[Skills System]
        Proc[Procedural Generation]
    end
    
    subgraph Input Processing
        Camera[Camera Input]
        MediaPipe[MediaPipe SDK]
        GestureRec[Gesture Recognition]
        InputMgr[Input Manager]
    end
    
    subgraph Rendering
        Renderer[Render Engine]
        Sprites[Sprite Manager]
        Effects[Particle Effects]
        Animations[Animation Controller]
    end
    
    subgraph Data Layer
        Config[Configuration]
        Assets[Asset Loader]
        DB[Save Database]
    end
    
    Camera --> MediaPipe
    MediaPipe --> GestureRec
    GestureRec --> InputMgr
    InputMgr --> GameMgr
    
    GameMgr --> StateCtrl
    StateCtrl --> EventSys
    GameMgr --> SaveMgr
    
    EventSys --> Player
    EventSys --> Enemy
    EventSys --> Combat
    
    Player --> Items
    Player --> Skills
    Combat --> Skills
    
    Enemy --> Combat
    
    StateCtrl --> UI
    UI --> HUD
    UI --> Menu
    UI --> Inventory
    
    GameMgr --> Renderer
    Renderer --> Sprites
    Renderer --> Effects
    Renderer --> Animations
    
    Config --> GameMgr
    Assets --> Sprites
    SaveMgr --> DB
    
    Proc --> Enemy
    Proc --> Items
    
    style GameMgr fill:#FFD700
    style MediaPipe fill:#87CEEB
    style Renderer fill:#98FB98
    style Combat fill:#FF6B6B
```

---

## Combat System

This flowchart details the combat mechanics and action resolution.

```mermaid
flowchart TD
    Start([Combat Start]) --> Init[Initialize Combat]
    Init --> Roll[Roll Initiative]
    Roll --> Turn{Current<br/>Turn?}
    
    Turn -->|Player| PlayerInput[Wait for Player Gesture]
    Turn -->|Enemy| EnemyAI[AI Decision]
    
    PlayerInput --> Gesture{Gesture<br/>Detected?}
    Gesture -->|Timeout| Skip[Skip Turn]
    Gesture -->|Attack| PlayerAtk[Player Attack]
    Gesture -->|Block| PlayerDef[Player Block]
    Gesture -->|Special| PlayerSpec[Special Move]
    
    EnemyAI --> EnemyAction{AI<br/>Choice}
    EnemyAction -->|Attack| EnemyAtk[Enemy Attack]
    EnemyAction -->|Defend| EnemyDef[Enemy Defend]
    EnemyAction -->|Special| EnemySpec[Enemy Special]
    
    PlayerAtk --> CalcDmg[Calculate Damage]
    PlayerDef --> ApplyBuff[Apply Defense Buff]
    PlayerSpec --> SpecialEffect[Apply Special Effect]
    
    EnemyAtk --> CalcDmg
    EnemyDef --> ApplyBuff
    EnemySpec --> SpecialEffect
    
    CalcDmg --> DmgRoll[Damage Roll]
    DmgRoll --> CheckDef{Defending?}
    CheckDef -->|Yes| ReduceDmg[Reduce Damage]
    CheckDef -->|No| ApplyDmg[Apply Full Damage]
    
    ReduceDmg --> ApplyDmg
    ApplyDmg --> UpdateHP[Update HP]
    ApplyBuff --> UpdateHP
    SpecialEffect --> UpdateHP
    Skip --> NextTurn
    
    UpdateHP --> CheckHP{Check HP}
    CheckHP -->|Both Alive| NextTurn[Next Turn]
    CheckHP -->|Player Dead| Defeat[Player Defeated]
    CheckHP -->|Enemy Dead| Victory[Victory!]
    
    NextTurn --> Turn
    
    Victory --> Rewards[Calculate Rewards]
    Rewards --> GainExp[Gain Experience]
    GainExp --> Loot[Generate Loot]
    Loot --> End([Combat End])
    
    Defeat --> End
    
    style Start fill:#90EE90
    style Victory fill:#FFD700
    style Defeat fill:#FF6B6B
    style End fill:#FFB6C1
```

---

## Player Progression

This diagram illustrates the player progression and character development system.

```mermaid
flowchart TB
    subgraph Character Creation
        Start([New Character]) --> ChooseClass[Choose Class]
        ChooseClass --> Warrior[Warrior]
        ChooseClass --> Mage[Mage]
        ChooseClass --> Rogue[Rogue]
        
        Warrior --> InitStats[Initialize Stats]
        Mage --> InitStats
        Rogue --> InitStats
    end
    
    subgraph Progression System
        InitStats --> Play[Play Game]
        Play --> GainXP[Gain Experience]
        GainXP --> CheckLevel{Enough XP<br/>for Level?}
        
        CheckLevel -->|No| Play
        CheckLevel -->|Yes| LevelUp[Level Up!]
        
        LevelUp --> IncStats[Increase Stats]
        LevelUp --> UnlockSkill{Unlock New<br/>Skills?}
        
        UnlockSkill -->|Yes| SkillTree[Access Skill Tree]
        UnlockSkill -->|No| Play
        
        SkillTree --> LearnSkill[Learn New Skill]
        LearnSkill --> Play
        IncStats --> Play
    end
    
    subgraph Equipment System
        Play --> FindLoot[Find Equipment]
        FindLoot --> Equip{Better<br/>Than Current?}
        
        Equip -->|Yes| EquipItem[Equip New Item]
        Equip -->|No| StoreItem[Store in Inventory]
        
        EquipItem --> UpdatePower[Update Power Level]
        StoreItem --> Play
        UpdatePower --> Play
    end
    
    subgraph Achievement System
        Play --> CheckAchieve{Achievement<br/>Unlocked?}
        CheckAchieve -->|Yes| Reward[Grant Reward]
        CheckAchieve -->|No| Play
        Reward --> Play
    end
    
    style LevelUp fill:#FFD700
    style EquipItem fill:#90EE90
    style Reward fill:#FF69B4
```

---

## Data Flow Architecture

This sequence diagram shows how data flows through the system during gameplay.

```mermaid
sequenceDiagram
    participant C as Camera
    participant MP as MediaPipe
    participant GM as Game Manager
    participant P as Player
    participant E as Enemy
    participant R as Renderer
    participant UI as UI System
    
    C->>MP: Video Frame
    MP->>MP: Detect Hands
    MP->>GM: Hand Landmarks
    GM->>GM: Recognize Gesture
    
    alt Attack Gesture
        GM->>P: Execute Attack
        P->>E: Deal Damage
        E->>E: Update HP
        E-->>P: Return Result
    else Block Gesture
        GM->>P: Activate Block
        P->>P: Set Defense State
    else Movement Gesture
        GM->>P: Move Command
        P->>P: Update Position
    end
    
    P->>GM: State Updated
    GM->>R: Render Request
    GM->>UI: Update HUD
    
    par Parallel Rendering
        R->>R: Draw Game World
        R->>R: Draw Characters
        R->>R: Draw Effects
    and UI Updates
        UI->>UI: Update HP Bar
        UI->>UI: Update Skills
        UI->>UI: Update Score
    end
    
    R-->>C: Display Frame
    UI-->>C: Overlay UI
    
    Note over C,UI: Process repeats 60 times per second
```

---

## Gesture Patterns

Visual reference for hand gesture patterns used in the game.

```mermaid
flowchart LR
    subgraph Basic Gestures
        Fist[👊 Fist<br/>Attack]
        Open[🖐️ Open Palm<br/>Block/Shield]
        Point[☝️ Pointing<br/>Move/Select]
        Peace[✌️ Peace Sign<br/>Special Ability]
        Thumb[👍 Thumbs Up<br/>Confirm]
    end
    
    subgraph Advanced Gestures
        Swipe[↔️ Swipe<br/>Navigate]
        Pinch[🤏 Pinch<br/>Grab Item]
        Circle[⭕ Circle<br/>Area Attack]
        Wave[👋 Wave<br/>Dodge]
    end
    
    subgraph Combo Gestures
        Double[Two Hands<br/>Power Attack]
        Cross[Crossed Arms<br/>Ultimate Defense]
        Rotate[Rotate Hand<br/>Cast Spell]
    end
    
    style Fist fill:#FF6B6B
    style Open fill:#87CEEB
    style Point fill:#FFD700
    style Peace fill:#98FB98
    style Thumb fill:#DDA0DD
```

