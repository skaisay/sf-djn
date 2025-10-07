  private createTitle(): void {
    const centerX = screenSize.width.value / 2
    
    // Game title text (localized)
    this.titleText = this.add.text(centerX, 120, "", {
      fontSize: "64px",
      fontFamily: "RetroPixel, Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 6,
      align: "center"
    }).setOrigin(0.5, 0.5)
    
    this.titleText.setDepth(10)
    
    // Add pulsing animation to title with larger pulse effect
    this.tweens.add({
      targets: this.titleText,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  private createClanName(): void {
    const centerX = screenSize.width.value / 2
    
    // Clan name text with Discord icon effect
    this.clanNameText = this.add.text(centerX, 180, "", {
      fontSize: "24px",
      fontFamily: "RetroPixel, Arial",
      color: "#7289da", // Discord blue color
      stroke: "#000000",
      strokeThickness: 2,
      align: "center"
    }).setOrigin(0.5, 0.5)
    
    this.clanNameText.setDepth(10)
    
    // Add subtle glow animation
    this.tweens.add({
      targets: this.clanNameText,
      alpha: 0.7,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }
