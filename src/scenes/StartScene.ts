import Phaser from "phaser"
import { screenSize, audioConfig } from "../gameConfig.json"
import { LocalizationManager } from "../localization"

export default class StartScene extends Phaser.Scene {
  private backgroundMusic!: Phaser.Sound.BaseSound
  private buttonClickSound!: Phaser.Sound.BaseSound
  private gameStartSound!: Phaser.Sound.BaseSound
  private playButton!: Phaser.GameObjects.Text
  private settingsButton!: Phaser.GameObjects.Text
  private discordButton!: Phaser.GameObjects.Text
  private titleText!: Phaser.GameObjects.Text
  private clanNameText!: Phaser.GameObjects.Text
  private gameTitle!: Phaser.GameObjects.Image
  private background!: Phaser.GameObjects.Image
  private ball!: Phaser.GameObjects.Image
