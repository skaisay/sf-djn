import Phaser from "phaser"
import { screenSize, audioConfig } from "../gameConfig.json"
import { LocalizationManager, Language } from "../localization"

export default class SettingsScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image
  private titleText!: Phaser.GameObjects.Text
  private languageLabel!: Phaser.GameObjects.Text
  private languageButton!: Phaser.GameObjects.Text
  private aiDifficultyLabel!: Phaser.GameObjects.Text
  private aiDifficultyButton!: Phaser.GameObjects.Text
  private musicVolumeLabel!: Phaser.GameObjects.Text
  private musicVolumeSlider!: Phaser.GameObjects.Graphics
  private sfxVolumeLabel!: Phaser.GameObjects.Text
  private sfxVolumeSlider!: Phaser.GameObjects.Graphics
  private backButton!: Phaser.GameObjects.Text
  
  private buttonClickSound!: Phaser.Sound.BaseSound
  private backgroundMusic!: Phaser.Sound.BaseSound
  
  // Settings values
  private currentLanguage: Language = LocalizationManager.getCurrentLanguage()
  private currentAIDifficulty: "easy" | "medium" | "hard" = "medium"
  private currentMusicVolume = audioConfig.musicVolume.value
  private currentSfxVolume = audioConfig.sfxVolume.value

  constructor() {
    super({ key: "SettingsScene" })
  }

  create(): void {
    // Load saved settings from localStorage
    this.loadSettings()
    
    // Create background
    this.createBackground()
    
    // Create UI elements
    this.createTitle()
    this.createLanguageSettings()
    this.createAIDifficultySettings()
    this.createVolumeSettings()
    this.createBackButton()
    
    // Setup audio
    this.setupAudio()
    
    // Update all text with current language
    this.updateAllText()
  }

  private loadSettings(): void {
    // Load language
    const savedLanguage = localStorage.getItem('game_language') as Language
    if (savedLanguage) {
      this.currentLanguage = savedLanguage
      LocalizationManager.setLanguage(savedLanguage)
    }
    
    // Load AI difficulty
    const savedDifficulty = localStorage.getItem('ai_difficulty') as "easy" | "medium" | "hard"
    if (savedDifficulty) {
      this.currentAIDifficulty = savedDifficulty
    }
    
    // Load volumes
    const savedMusicVolume = localStorage.getItem('music_volume')
    if (savedMusicVolume) {
      this.currentMusicVolume = parseFloat(savedMusicVolume)
    }
    
    const savedSfxVolume = localStorage.getItem('sfx_volume')
    if (savedSfxVolume) {
      this.currentSfxVolume = parseFloat(savedSfxVolume)
    }
  }

  private saveSettings(): void {
    localStorage.setItem('game_language', this.currentLanguage)
    localStorage.setItem('ai_difficulty', this.currentAIDifficulty)
    localStorage.setItem('music_volume', this.currentMusicVolume.toString())
    localStorage.setItem('sfx_volume', this.currentSfxVolume.toString())
    
    // Update global audio config
    audioConfig.musicVolume.value = this.currentMusicVolume
    audioConfig.sfxVolume.value = this.currentSfxVolume
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
    
    // Add dark overlay for better text readability
    const overlay = this.add.rectangle(centerX, centerY, screenSize.width.value, screenSize.height.value, 0x000000, 0.6)
    overlay.setDepth(-5)
  }

  private createTitle(): void {
    const centerX = screenSize.width.value / 2
    
    this.titleText = this.add.text(centerX, 100, "", {
      fontSize: "48px",
      fontFamily: "RetroPixel, Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
      align: "center"
    }).setOrigin(0.5, 0.5)
  }

  private createLanguageSettings(): void {
    const centerX = screenSize.width.value / 2
    const startY = 200
    
    this.languageLabel = this.add.text(centerX - 150, startY, "", {
      fontSize: "24px",
      fontFamily: "RetroPixel, Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2
    }).setOrigin(0, 0.5)
    
    this.languageButton = this.add.text(centerX + 150, startY, "", {
      fontSize: "24px",
      fontFamily: "RetroPixel, Arial",
      color: "#ffff00",
      stroke: "#000000",
      strokeThickness: 2
    }).setOrigin(1, 0.5)
    
    this.languageButton.setInteractive({ useHandCursor: true })
    this.languageButton.on('pointerdown', this.cycleLanguage, this)
    this.languageButton.on('pointerover', () => {
      this.languageButton.setScale(1.1)
      this.buttonClickSound.play()
    })
    this.languageButton.on('pointerout', () => {
      this.languageButton.setScale(1.0)
    })
  }

  private createAIDifficultySettings(): void {
    const centerX = screenSize.width.value / 2
    const startY = 280
    
    this.aiDifficultyLabel = this.add.text(centerX - 150, startY, "", {
      fontSize: "24px",
      fontFamily: "RetroPixel, Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2
    }).setOrigin(0, 0.5)
    
    this.aiDifficultyButton = this.add.text(centerX + 150, startY, "", {
      fontSize: "24px",
      fontFamily: "RetroPixel, Arial",
      color: "#ff8800",
      stroke: "#000000",
      strokeThickness: 2
    }).setOrigin(1, 0.5)
    
    this.aiDifficultyButton.setInteractive({ useHandCursor: true })
    this.aiDifficultyButton.on('pointerdown', this.cycleAIDifficulty, this)
    this.aiDifficultyButton.on('pointerover', () => {
      this.aiDifficultyButton.setScale(1.1)
      this.buttonClickSound.play()
    })
    this.aiDifficultyButton.on('pointerout', () => {
      this.aiDifficultyButton.setScale(1.0)
    })
  }

  private createVolumeSettings(): void {
    const centerX = screenSize.width.value / 2
    let currentY = 360
    
    // Music volume
    this.musicVolumeLabel = this.add.text(centerX - 150, currentY, "", {
      fontSize: "24px",
      fontFamily: "RetroPixel, Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2
    }).setOrigin(0, 0.5)
    
    this.musicVolumeSlider = this.add.graphics()
    this.updateVolumeSlider(this.musicVolumeSlider, centerX + 150, currentY, this.currentMusicVolume)
    
    currentY += 80
    
    // SFX volume
    this.sfxVolumeLabel = this.add.text(centerX - 150, currentY, "", {
      fontSize: "24px",
      fontFamily: "RetroPixel, Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2
    }).setOrigin(0, 0.5)
    
    this.sfxVolumeSlider = this.add.graphics()
    this.updateVolumeSlider(this.sfxVolumeSlider, centerX + 150, currentY, this.currentSfxVolume)
    
    // Make sliders interactive
    this.setupVolumeInteraction()
  }

  private updateVolumeSlider(slider: Phaser.GameObjects.Graphics, x: number, y: number, volume: number): void {
    slider.clear()
    
    const sliderWidth = 200
    const sliderHeight = 20
    const knobWidth = 15
    
    // Background
    slider.fillStyle(0x333333)
    slider.fillRect(x - sliderWidth, y - sliderHeight/2, sliderWidth, sliderHeight)
    
    // Fill
    slider.fillStyle(0x00ff00)
    slider.fillRect(x - sliderWidth, y - sliderHeight/2, sliderWidth * volume, sliderHeight)
    
    // Knob
    const knobX = x - sliderWidth + (sliderWidth * volume)
    slider.fillStyle(0xffffff)
    slider.fillRect(knobX - knobWidth/2, y - sliderHeight/2 - 5, knobWidth, sliderHeight + 10)
  }

  private setupVolumeInteraction(): void {
    const centerX = screenSize.width.value / 2
    const musicY = 360
    const sfxY = 440
    const sliderWidth = 200
    
    // Music volume interaction
    const musicZone = this.add.zone(centerX + 50, musicY, sliderWidth, 30)
    musicZone.setInteractive()
    musicZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const relativeX = pointer.x - (centerX - sliderWidth + 50)
      const newVolume = Phaser.Math.Clamp(relativeX / sliderWidth, 0, 1)
      this.currentMusicVolume = newVolume
      this.updateVolumeSlider(this.musicVolumeSlider, centerX + 150, musicY, newVolume)
      this.backgroundMusic.setVolume(newVolume)
    })
    
    // SFX volume interaction
    const sfxZone = this.add.zone(centerX + 50, sfxY, sliderWidth, 30)
    sfxZone.setInteractive()
    sfxZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const relativeX = pointer.x - (centerX - sliderWidth + 50)
      const newVolume = Phaser.Math.Clamp(relativeX / sliderWidth, 0, 1)
      this.currentSfxVolume = newVolume
      this.updateVolumeSlider(this.sfxVolumeSlider, centerX + 150, sfxY, newVolume)
      this.buttonClickSound.setVolume(newVolume)
      this.buttonClickSound.play()
    })
  }

  private createBackButton(): void {
    const centerX = screenSize.width.value / 2
    
    this.backButton = this.add.text(centerX, 580, "", {
      fontSize: "32px",
      fontFamily: "RetroPixel, Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
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
      volume: this.currentSfxVolume
    })
    
    this.backgroundMusic = this.sound.add("soccer_theme", {
      volume: this.currentMusicVolume,
      loop: true
    })
    
    if (!this.sound.get("soccer_theme")?.isPlaying) {
      this.backgroundMusic.play()
    }
  }

  private cycleLanguage(): void {
    this.buttonClickSound.play()
    
    if (this.currentLanguage === 'en') {
      this.currentLanguage = 'ru'
    } else {
      this.currentLanguage = 'en'
    }
    
    LocalizationManager.setLanguage(this.currentLanguage)
    this.updateAllText()
  }

  private cycleAIDifficulty(): void {
    this.buttonClickSound.play()
    
    switch (this.currentAIDifficulty) {
      case "easy":
        this.currentAIDifficulty = "medium"
        break
      case "medium":
        this.currentAIDifficulty = "hard"
        break
      case "hard":
        this.currentAIDifficulty = "easy"
        break
    }
    
    this.updateAIDifficultyText()
  }

  private updateAllText(): void {
    this.titleText.setText(LocalizationManager.getText('settingsButton'))
    this.languageLabel.setText(LocalizationManager.getText('language') + ':')
    this.languageButton.setText(this.currentLanguage === 'en' ? 'English' : 'Русский')
    this.aiDifficultyLabel.setText(LocalizationManager.getText('aiDifficulty') + ':')
    this.updateAIDifficultyText()
    this.musicVolumeLabel.setText(LocalizationManager.getText('musicVolume') + ':')
    this.sfxVolumeLabel.setText(LocalizationManager.getText('sfxVolume') + ':')
    this.backButton.setText(LocalizationManager.getText('backToMenu'))
  }

  private updateAIDifficultyText(): void {
    this.aiDifficultyButton.setText(LocalizationManager.getText(this.currentAIDifficulty))
  }

  private goBack(): void {
    this.buttonClickSound.play()
    this.saveSettings()
    
    this.backgroundMusic.stop()
    this.scene.start("StartScene")
  }

  public getCurrentAIDifficulty(): "easy" | "medium" | "hard" {
    return this.currentAIDifficulty
  }
}
