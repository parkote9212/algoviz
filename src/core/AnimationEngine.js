import eventBus from './EventBus.js'
import stateManager from './StateManager.js'

/** 애니메이션 스텝 실행 엔진 (requestAnimationFrame) */
class AnimationEngine {
  constructor() {
    this.steps = []
    this.currentStepIndex = 0
    this.isRunning = false
    this.frameId = null
    this.lastFrameTime = 0
  }

  /** @param {Object[]} steps */
  loadSteps(steps) {
    this.steps = steps
    this.currentStepIndex = 0
    stateManager.setState({
      totalSteps: steps.length,
      currentStep: 0,
    })
    console.log(`${steps.length}개의 스텝 로드 완료`)
  }

  play() {
    if (this.steps.length === 0) {
      console.warn('실행할 스텝이 없습니다')
      return
    }

    this.isRunning = true
    stateManager.resume()
    this.lastFrameTime = performance.now()
    this.animate()

    eventBus.emit('animation.started')
  }

  pause() {
    this.isRunning = false
    stateManager.pause()
    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
      this.frameId = null
    }

    eventBus.emit('animation.paused')
  }

  stop() {
    this.isRunning = false
    this.currentStepIndex = 0
    stateManager.stop()

    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
      this.frameId = null
    }

    eventBus.emit('animation.stopped')
  }

  next() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++
      this.executeStep(this.steps[this.currentStepIndex])
      eventBus.emit('animation.step', { direction: 'next' })
    }
  }

  prev() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--
      this.executeStep(this.steps[this.currentStepIndex])
      eventBus.emit('animation.step', { direction: 'prev' })
    }
  }

  animate() {
    if (!this.isRunning) return

    const currentTime = performance.now()
    const speed = stateManager.getState('speed')
    const frameDelay = 1000 / speed

    if (currentTime - this.lastFrameTime >= frameDelay) {
      if (this.currentStepIndex < this.steps.length) {
        this.executeStep(this.steps[this.currentStepIndex])
        this.currentStepIndex++
        this.lastFrameTime = currentTime
      } else {
        this.complete()
        return
      }
    }

    this.frameId = requestAnimationFrame(() => this.animate())
  }

  /** @param {Object} step */
  executeStep(step) {
    const { type, indices, array, index } = step

    if (array) {
      stateManager.setState({ array: [...array] })
    }

    switch (type) {
      case 'compare':
        stateManager.setState({
          highlightIndices: indices,
          currentStep: this.currentStepIndex,
        })
        stateManager.incrementStat('comparisons')
        break

      case 'swap':
        stateManager.setState({
          highlightIndices: indices,
          currentStep: this.currentStepIndex,
        })
        stateManager.incrementStat('swaps')
        break

      case 'sorted': {
        const sortedIndices = stateManager.getState('sortedIndices')
        stateManager.setState({
          sortedIndices: [...sortedIndices, index],
          highlightIndices: [],
          currentStep: this.currentStepIndex,
        })
        break
      }

      case 'pivot':
        stateManager.setState({
          pivotIndex: index,
          currentStep: this.currentStepIndex,
        })
        break

      case 'complete':
        break

      default:
        console.warn('알 수 없는 스텝 타입:', type)
    }

    eventBus.emit('step.executed', step)
  }

  complete() {
    this.isRunning = false
    stateManager.complete()

    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
      this.frameId = null
    }

    eventBus.emit('animation.completed')
    console.log('애니메이션 완료!')
  }

  /** @param {number} speed */
  setSpeed(speed) {
    stateManager.setSpeed(speed)
  }
}

export default new AnimationEngine()
