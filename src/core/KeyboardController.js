import animationEngine from './AnimationEngine.js'
import eventBus from './EventBus.js'

/** 키보드 단축키 컨트롤러 */
export class KeyboardController {
  constructor() {
    this.shortcuts = {
      Space: this.togglePlayPause.bind(this),
      ArrowRight: this.nextStep.bind(this),
      ArrowLeft: this.prevStep.bind(this),
      KeyR: this.reset.bind(this),
      Digit1: () => this.setSpeed(0.5),
      Digit2: () => this.setSpeed(1),
      Digit3: () => this.setSpeed(2),
      Digit4: () => this.setSpeed(4),
      KeyG: this.generateNewArray.bind(this),
    }

    this.enabled = true
    this.init()
  }

  init() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    console.log('⌨️ 키보드 단축키 활성화')
    this.showShortcuts()
  }

  /** @param {KeyboardEvent} e */
  handleKeyDown(e) {
    if (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.tagName === 'SELECT'
    ) {
      return
    }

    if (!this.enabled) return

    const handler = this.shortcuts[e.code]
    if (handler) {
      e.preventDefault()
      handler()
    }
  }

  togglePlayPause() {
    const state = animationEngine.isRunning
    if (state) {
      animationEngine.pause()
      console.log('⏸️ 일시정지 (Space)')
    } else {
      animationEngine.play()
      console.log('▶️ 재생 (Space)')
    }
  }

  nextStep() {
    if (!animationEngine.isRunning) {
      animationEngine.next()
      console.log('⏭️ 다음 스텝 (→)')
    }
  }

  prevStep() {
    if (!animationEngine.isRunning) {
      animationEngine.prev()
      console.log('⏮️ 이전 스텝 (←)')
    }
  }

  reset() {
    animationEngine.stop()
    console.log('⏹️ 정지 (R)')
  }

  /** @param {number} speed */
  setSpeed(speed) {
    animationEngine.setSpeed(speed)
    eventBus.emit('speed.changed', { speed })
    console.log(
      `⚡ 속도 ${speed}x (${speed === 0.5 ? '1' : speed === 1 ? '2' : speed === 2 ? '3' : '4'})`
    )
  }

  generateNewArray() {
    eventBus.emit('keyboard.generate')
    console.log('🎲 새 배열 생성 (G)')
  }

  showShortcuts() {
    console.log('\n⌨️ 키보드 단축키:')
    console.log('  Space    - 재생/일시정지')
    console.log('  →        - 다음 스텝')
    console.log('  ←        - 이전 스텝')
    console.log('  R        - 정지/리셋')
    console.log('  1-4      - 속도 조절 (0.5x, 1x, 2x, 4x)')
    console.log('  G        - 새 배열 생성\n')
  }

  /** @param {boolean} enabled */
  setEnabled(enabled) {
    this.enabled = enabled
  }
}
