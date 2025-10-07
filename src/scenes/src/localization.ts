// Localization system for multiple languages
export type Language = 'en' | 'ru'

export interface LocalizedText {
  en: string
  ru: string
}

export const translations: { [key: string]: LocalizedText } = {
  // Main Menu
  gameTitle: {
    en: "LUMINARY SOCCER",
    ru: "ЛЮМИНАРИ ФУТБОЛ"
  },
  playButton: {
    en: "PLAY",
    ru: "ИГРАТЬ"
  },
  settingsButton: {
    en: "SETTINGS",
    ru: "НАСТРОЙКИ"
  },
  discordButton: {
    en: "JOIN DISCORD",
    ru: "DISCORD КЛАН"
  },
  clanName: {
    en: "Luminary Clan",
    ru: "Клан Люминари"
  },
  
  // Game Modes
  oneVsOne: {
    en: "1 vs 1",
    ru: "1 против 1"
  },
  oneVsAI: {
    en: "1 vs AI",
    ru: "1 против ИИ"
  },
  aiDifficulty: {
    en: "AI Difficulty",
    ru: "Сложность ИИ"
  },
  easy: {
    en: "Easy",
    ru: "Легко"
  },
  medium: {
    en: "Medium",
    ru: "Средне"
  },
  hard: {
    en: "Hard",
    ru: "Сложно"
  },
  
  // Game UI
  score: {
    en: "Score",
    ru: "Счёт"
  },
  time: {
    en: "Time",
    ru: "Время"
  },
  goal: {
    en: "GOAL!",
    ru: "ГОЛ!"
  },
  gamePaused: {
    en: "GAME PAUSED\nPress P to Continue",
    ru: "ИГРА НА ПАУЗЕ\nНажмите P для продолжения"
  },
  
  // Controls
  player1Controls: {
    en: "Player 1",
    ru: "Игрок 1"
  },
  player2Controls: {
    en: "Player 2",
    ru: "Игрок 2"
  },
  aiControls: {
    en: "AI Player",
    ru: "ИИ Игрок"
  },
  jump: {
    en: "Jump",
    ru: "Прыжок"
  },
  move: {
    en: "Move",
    ru: "Движение"
  },
  slide: {
    en: "Slide",
    ru: "Подкат"
  },
  kick: {
    en: "Kick",
    ru: "Удар"
  },
  
  // Victory Screen
  victory: {
    en: "VICTORY!",
    ru: "ПОБЕДА!"
  },
  defeat: {
    en: "DEFEAT!",
    ru: "ПОРАЖЕНИЕ!"
  },
  draw: {
    en: "DRAW!",
    ru: "НИЧЬЯ!"
  },
  playAgain: {
    en: "PLAY AGAIN",
    ru: "ИГРАТЬ СНОВА"
  },
  backToMenu: {
    en: "BACK TO MENU",
    ru: "В ГЛАВНОЕ МЕНЮ"
  },
  
  // Settings
  language: {
    en: "Language",
    ru: "Язык"
  },
  musicVolume: {
    en: "Music Volume",
    ru: "Громкость музыки"
  },
  sfxVolume: {
    en: "SFX Volume",
    ru: "Громкость звуков"
  },
  
  // Instructions
  instructions: {
    en: "Player 1: WASD + SPACE    Player 2: Arrow Keys + SHIFT\n\nMOVE: Arrow Keys / WASD    JUMP: Up / W    SLIDE: Down / S    KICK: Space / Shift\n\nFace the ball to kick properly - body contact will bounce the ball!",
    ru: "Игрок 1: WASD + ПРОБЕЛ    Игрок 2: Стрелки + SHIFT\n\nДВИЖЕНИЕ: Стрелки / WASD    ПРЫЖОК: Вверх / W    ПОДКАТ: Вниз / S    УДАР: Пробел / Shift\n\nПоворачивайтесь к мячу для точного удара - касание телом отбивает мяч!"
  }
}

export class LocalizationManager {
  private static currentLanguage: Language = 'en'
  
  static setLanguage(lang: Language): void {
    this.currentLanguage = lang
    console.log(`🌐 Language changed to: ${lang}`)
  }
  
  static getCurrentLanguage(): Language {
    return this.currentLanguage
  }
  
  static getText(key: string): string {
    const translation = translations[key]
    if (!translation) {
      console.warn(`⚠️ Missing translation for key: ${key}`)
      return key
    }
    return translation[this.currentLanguage] || translation.en || key
  }
  
  static getTextWithFallback(key: string, fallback: string): string {
    const translation = translations[key]
    if (!translation) {
      return fallback
    }
    return translation[this.currentLanguage] || translation.en || fallback
  }
}
