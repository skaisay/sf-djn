  create(): void {
    // Load saved language
    this.loadLanguageSettings()
    
    // Create background
    this.createBackground()
    
    // Create title and UI elements
    this.createTitle()
    this.createClanName()
    this.createButtons()
    this.createInstructions()
    this.createAnimatedElements()
    
    // Setup audio
    this.setupAudio()
    
    // Setup input
    this.setupInput()
    
    // Update all text with current language
    this.updateAllText()
    
    console.log("🎮 START SCENE: Created successfully")
  }

  private loadLanguageSettings(): void {
    const savedLanguage = localStorage.getItem('game_language') as 'en' | 'ru'
    if (savedLanguage) {
      LocalizationManager.setLanguage(savedLanguage)
    }
  }
