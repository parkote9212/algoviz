import eventBus from '../core/EventBus.js'
import stateManager from '../core/StateManager.js'
import {
  ALGORITHM_COLORS,
  ALGORITHM_TYPES,
  CANVAS_CONFIG,
} from '../utils/constants.js'

/**
 * 배열 막대 그래프 시각화 (state.changed 구독)
 */
export class ArrayVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    if (!this.canvas) {
      throw new Error(`Canvas with id "${canvasId}" not found`)
    }

    this.ctx = this.canvas.getContext('2d')
    this.config = CANVAS_CONFIG
    eventBus.on('state.changed', () => this.render())
  }

  getColors() {
    const algorithm = stateManager.getState('currentAlgorithm') || ALGORITHM_TYPES.BUBBLE_SORT
    return ALGORITHM_COLORS[algorithm] || ALGORITHM_COLORS.bubbleSort
  }

  /** @param {number} index @param {number[]} array @param {number[]} highlightIndices @param {number[]} sortedIndices @param {number|null} pivotIndex @returns {string} */
  getBarColor(index, array, highlightIndices, sortedIndices, pivotIndex) {
    const colors = this.getColors()

    if (sortedIndices.includes(index)) return colors.SORTED
    if (pivotIndex === index) return colors.PIVOT
    if (highlightIndices.includes(index)) return colors.COMPARING

    return colors.DEFAULT
  }

  render() {
    const { array, highlightIndices = [], sortedIndices = [], pivotIndex } =
      stateManager.getState()

    if (!array || array.length === 0) return

    const { WIDTH, HEIGHT, PADDING, BAR_GAP } = this.config
    const barWidth = (WIDTH - PADDING * 2 - BAR_GAP * (array.length - 1)) / array.length
    const maxValue = Math.max(...array)

    this.ctx.clearRect(0, 0, WIDTH, HEIGHT)

    array.forEach((value, index) => {
      const barHeight = ((value / maxValue) * (HEIGHT - PADDING * 2)) || 2
      const x = PADDING + index * (barWidth + BAR_GAP)
      const y = HEIGHT - PADDING - barHeight

      this.ctx.fillStyle = this.getBarColor(
        index,
        array,
        highlightIndices,
        sortedIndices,
        pivotIndex
      )
      this.ctx.fillRect(x, y, barWidth, barHeight)
    })
  }
}
