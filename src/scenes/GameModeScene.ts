import Phaser from "phaser"
import { screenSize, audioConfig } from "../gameConfig.json"
import { LocalizationManager } from "../localization"

export default class GameModeScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image
  private titleText!: Phaser.GameObjects.Text
  private oneVsOneButton!: Phaser.GameObjects.Text
  private oneVsAIButton!: Phaser.GameObjects.Text
  private backButton!: Phaser.GameObjects.Text
  
  private buttonClickSound!: Phaser.Sound.BaseSound
  private gameStartSound!: Phaser.Sound.BaseSound
  private backgroundMusic!: Phaser.Sound.BaseSound

  constructor() {
    super({ key: "GameModeScene" })
  }

  create(): void {
    // Create background
    this.createBackground()
    
    // Create UI elements
    this.createTitle()
    this.createGameModeButtons()
    this.createBackButton()
    
    // Setup audio
    this.setupAudio()
    
    // Update all text with current language
    this.updateAllText()
  }

  private createBackground(): void {
    const centerX = screenSize.width.value / 2
    const centerY = screenSize.height.value / 2
    
    this.background = this.add.image(centerX, centerY, "clean_soccer_field_background")
    
    const scaleX = screenSize.width.value / this.background.width
    const scaleY = screenSize.height.value / this.background.height
    const scale = Math.max(scaleX, scaleY)
    
    this.background.setScale(scale)
    this.background.setDepth(-10)
    
    // Add overlay for better text readability
    const overlay = this.add.rectangle(centerX, centerY, screenSize.width.value, screenSize.height.value, 0x000000, 0.4)
    overlay.setDepth(-5)
  }

  private createTitle(): void {
    const centerX = screenSize.width.value / 2
    
    this.titleText = this.add.text(centerX, 150, "", {
      fontSize: "48px",
      fontFamily: "RetroPixel, Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
      align: "center"
    }).setOrigin(0.5, 0.5)
  }

  private createGameModeButtons(): void {
    const centerX = screenSize.width.value / 2
    const centerY = screenSize.height.value / 2
    
    // 1 vs 1 Button
    this.oneVsOneButton = this.add.text(centerX, centerY - 50, "", {
      fontSize: "36px",
      fontFamily: "RetroPixel, Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
      align: "center"
    }).setOrigin(0.5, 0.5)
    
    this.oneVsOneButton.setInteractive({ useHandCursor: true })
    this.oneVsOneButton.on('pointerdown', () => this.startGame("1v1"))
    this.oneVsOneButton.on('pointerover', () => {
      this.oneVsOneButton.setScale(1.1)
      this.oneVsOneButton.setColor("#ffff00")
      this.buttonClickSound.play()
    })
    this.oneVsOneButton.on('pointerout', () => {
      this.oneVsOneButton.setScale(1.0)
      this.oneVsOneButton.setColor("#ffffff")
    })
    
    // 1 vs AI Button
    this.oneVsAIButton = this.add.text(centerX, centerY + 50, "", {
      fontSize: "36px",
      fontFamily: "RetroPixel, Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
      align: "center"
    }).setOrigin(0.5, 0.5)
    
    this.oneVsAIButton.setInteractive({ useHandCursor: true })
    this.oneVsAIButton.on('pointerdown', () => this.startGame("1vAI"))
    this.oneVsAIButton.on('pointerover', () => {
      this.oneVsAIButton.setScale(1.1)
      this.oneVsAIButton.setColor("#ff8800")
      this.buttonClickSound.play()
    })
    this.oneVsAIButton.on('pointerout', () => {
      this.oneVsAIButton.setScale(1.0)
      this.oneVsAIButton.setColor("#ffffff")
    })
    
    // Add floating animations
    this.tweens.add({
      targets: [this.oneVsOneButton, this.oneVsAIButton],
      y: "+=10",
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  private createBackButton(): void {
    const centerX = screenSize.width.value / 2
    
    this.backButton = this.add.text(centerX, 580, "", {
      fontSize: "24px",
      fontFamily: "RetroPixel, Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2,
      align: "center"
    }).setOrigin(0.5, 0.5)
    
    this.backButton.setInteractive({ useHandCursor: true })
    this.backButton.on('pointerdown', this.goBack, this)
    this.backButton.on('pointerover', () => {
      this.backButton.setScale(1.1)
      this.buttonClickSound.play()
    })
    this.backButton.on('pointerout', () => {
      this.backButton.setScale(1.0)
    })
  }

  private setupAudio(): void {
    this.buttonClickSound = this.sound.add("button_click", {
      volume: audioConfig.sfxVolume.value
    })
    
    this.gameStartSound = this.sound.add("game_start", {
      volume: audioConfig.sfxVolume.value
    })
    
    this.backgroundMusic = this.sound.add("soccer_theme", {
      volume: audioConfig.musicVolume.value,
      loop: true
    })
    
    if (!this.sound.get("soccer_theme")?.isPlaying) {
      this.backgroundMusic.play()
    }
  }

  private updateAllText(): void {
    this.titleText.setText(LocalizationManager.getText('gameTitle'))
    this.oneVsOneButton.setText(LocalizationManager.getText('oneVsOne'))
    this.oneVsAIButton.setText(LocalizationManager.getText('oneVsAI'))
    this.backButton.setText(LocalizationManager.getText('backToMenu'))
  }

  private startGame(gameMode: "1v1" | "1vAI"): void {
    console.log(`🚀 Starting game in ${gameMode} mode`)
    
    this.gameStartSound.play()
    this.backgroundMusic.stop()
    
    // Get AI difficulty from settings
    const aiDifficulty = localStorage.getItem('ai_difficulty') || 'medium'
    
    // Add screen transition effect
    const transitionRect = this.add.rectangle(
      screenSize.width.value / 2, 
      screenSize.height.value / 2, 
      screenSize.width.value, 
      screenSize.height.value, 
      0x000000, 
      0
    )
    
    this.tweens.add({
      targets: transitionRect,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        // Pass game mode and AI difficulty to GameScene
        this.scene.start("GameScene", { 
          gameMode: gameMode,
          aiDifficulty: aiDifficulty
        })
      }
    })
  }

  private goBack(): void {
    this.buttonClickSound.play()
    this.backgroundMusic.stop()
    this.scene.start("StartScene")
  }
}
