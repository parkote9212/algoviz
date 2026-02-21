/**
 * @file AlgoViz 진입점
 */
import './styles/canvas.css'
import './styles/controls.css'
import './styles/main.css'

import animationEngine from './core/AnimationEngine.js'
import eventBus from './core/EventBus.js'
import { KeyboardController } from './core/KeyboardController.js'
import stateManager from './core/StateManager.js'
import storageManager from './core/StorageManager.js'

import { BubbleSort } from './algorithms/sorting/BubbleSort.js'
import { MergeSort } from './algorithms/sorting/MergeSort.js'
import { QuickSort } from './algorithms/sorting/QuickSort.js'

import { CodeViewer } from './components/CodeViewer.js'
import { ControlPanel } from './components/ControlPanel.js'
import { StatsPanel } from './components/StatsPanel.js'
import { ArrayVisualizer } from './visualizers/ArrayVisualizer.js'

import { ALGORITHM_TYPES } from './utils/constants.js'
import { generateRandomArray } from './utils/helpers.js'

console.log('=== AlgoViz 시작 ===')

new ArrayVisualizer('visualizer')
const controlPanel = new ControlPanel('controls')
new StatsPanel('stats')
new CodeViewer('code-viewer')
const keyboardController = new KeyboardController()

const bubbleSort = new BubbleSort()
const quickSort = new QuickSort()
const mergeSort = new MergeSort()

controlPanel.registerAlgorithm(ALGORITHM_TYPES.BUBBLE_SORT, bubbleSort)
controlPanel.registerAlgorithm(ALGORITHM_TYPES.QUICK_SORT, quickSort)
controlPanel.registerAlgorithm(ALGORITHM_TYPES.MERGE_SORT, mergeSort)

console.log('등록된 알고리즘:')
console.log('- Bubble Sort:', bubbleSort.getInfo())
console.log('- Quick Sort:', quickSort.getInfo())
console.log('- Merge Sort:', mergeSort.getInfo())

eventBus.on('keyboard.generate', () => {
  document.getElementById('btn-generate').click()
})

eventBus.on('speed.changed', ({ speed }) => {
  document.getElementById('speed-slider').value = speed
  document.getElementById('speed-value').textContent = `${speed}x`
})

const savedArray = storageManager.getLastArray()
if (savedArray && savedArray.length > 0) {
  controlPanel.restoreLastArray()
} else {
  const settings = storageManager.loadSettings()
  const initialArray = generateRandomArray(settings.arraySize)
  stateManager.setArray(initialArray)
  const algorithm = controlPanel.getCurrentAlgorithm()
  if (algorithm) {
    const steps = algorithm.sort(initialArray)
    animationEngine.loadSteps(steps)
    storageManager.saveLastArray(initialArray)
  }
}

console.log('\n✅ 초기화 완료!')
console.log('💡 UI에서 다양한 알고리즘을 선택하고 비교해보세요!')
keyboardController.showShortcuts()

window.stateManager = stateManager
window.animationEngine = animationEngine
window.eventBus = eventBus
window.storageManager = storageManager
