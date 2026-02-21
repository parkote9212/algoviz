/** 로컬 스토리지 기반 설정 관리 */
class StorageManager {
  constructor() {
    this.storageKey = 'algoviz_settings'
    this.defaultSettings = {
      algorithm: 'bubbleSort',
      arraySize: 20,
      speed: 1,
      colorTheme: 'bubbleSort',
    }
  }

  /** @param {Object} settings */
  saveSettings(settings) {
    try {
      const currentSettings = this.loadSettings()
      const updatedSettings = {
        ...currentSettings,
        ...settings,
      }
      localStorage.setItem(this.storageKey, JSON.stringify(updatedSettings))
      console.log('💾 설정 저장:', settings)
    } catch (error) {
      console.error('설정 저장 실패:', error)
    }
  }

  /** @returns {Object} */
  loadSettings() {
    try {
      const saved = localStorage.getItem(this.storageKey)
      if (saved) {
        const settings = JSON.parse(saved)
        console.log('📂 설정 불러오기:', settings)
        return { ...this.defaultSettings, ...settings }
      }
    } catch (error) {
      console.error('설정 불러오기 실패:', error)
    }
    return { ...this.defaultSettings }
  }

  /** @param {string} key @returns {*} */
  getSetting(key) {
    const settings = this.loadSettings()
    return settings[key]
  }

  resetSettings() {
    try {
      localStorage.removeItem(this.storageKey)
      console.log('🔄 설정 초기화')
    } catch (error) {
      console.error('설정 초기화 실패:', error)
    }
  }

  /** @param {number[]} array */
  saveLastArray(array) {
    try {
      const settings = this.loadSettings()
      settings.lastArray = array
      localStorage.setItem(this.storageKey, JSON.stringify(settings))
    } catch (error) {
      console.error('배열 저장 실패:', error)
    }
  }

  /** @returns {number[]|null} */
  getLastArray() {
    const settings = this.loadSettings()
    return settings.lastArray || null
  }
}

export default new StorageManager()
