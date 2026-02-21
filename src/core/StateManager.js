import eventBus from './EventBus.js'

/** 전역 상태 관리 (Observer 패턴) */
class StateManager {
  constructor() {
    this.state = {
      array: [],
      originalArray: [],
      isPlaying: false,
      isPaused: false,
      isCompleted: false,
      currentAlgorithm: null,
      currentStep: 0,
      totalSteps: 0,
      speed: 1,
      highlightIndices: [],
      sortedIndices: [],
      pivotIndex: null,
      comparisons: 0,
      swaps: 0,
      executionTime: 0,
    }
  }

  /** @param {string} [key] @returns {*} */
  getState(key) {
    if (key) {
      return this.state[key]
    }
    return { ...this.state }
  }

  /** @param {Object} updates */
  setState(updates) {
    const prevState = { ...this.state }

    this.state = {
      ...this.state,
      ...updates,
    }

    eventBus.emit('state.changed', {
      prevState,
      currentState: this.getState(),
      updates,
    })

    console.log('State updated:', updates)
  }

  /** @param {number[]} array */
  setArray(array) {
    this.setState({
      array: [...array],
      originalArray: [...array],
      highlightIndices: [],
      sortedIndices: [],
      pivotIndex: null,
      comparisons: 0,
      swaps: 0,
      currentStep: 0,
      isCompleted: false,
    })
  }

  /** @param {string} algorithmName */
  startAlgorithm(algorithmName) {
    this.setState({
      currentAlgorithm: algorithmName,
      isPlaying: true,
      isPaused: false,
      isCompleted: false,
    })
  }

  pause() {
    this.setState({
      isPlaying: false,
      isPaused: true,
    })
  }

  resume() {
    this.setState({
      isPlaying: true,
      isPaused: false,
    })
  }

  stop() {
    this.setState({
      array: [...this.state.originalArray],
      isPlaying: false,
      isPaused: false,
      isCompleted: false,
      currentStep: 0,
      highlightIndices: [],
      sortedIndices: [],
      pivotIndex: null,
      comparisons: 0,
      swaps: 0,
    })
  }

  complete() {
    this.setState({
      isPlaying: false,
      isPaused: false,
      isCompleted: true,
      highlightIndices: [],
      sortedIndices: Array.from(
        { length: this.state.array.length },
        (_, i) => i
      ),
    })
  }

  /** @param {number} speed */
  setSpeed(speed) {
    this.setState({ speed })
  }

  /** @param {'comparisons'|'swaps'} type */
  incrementStat(type) {
    this.setState({
      [type]: this.state[type] + 1,
    })
  }
}

export default new StateManager()
