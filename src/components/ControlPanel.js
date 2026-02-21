import animationEngine from '../core/AnimationEngine.js'
import eventBus from '../core/EventBus.js'
import stateManager from '../core/StateManager.js'
import storageManager from '../core/StorageManager.js'
import { ALGORITHM_TYPES, ANIMATION_SPEED, ARRAY_SIZES } from '../utils/constants.js'
import { generateRandomArray } from '../utils/helpers.js'

/**
 * 컨트롤 패널 (알고리즘 선택, 배열 생성, 재생 컨트롤)
 */
export class ControlPanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`)
    }

    this.algorithms = {}
    this.currentAlgorithmType = ALGORITHM_TYPES.BUBBLE_SORT

    this.render()
    this.attachEventListeners()
    this.subscribeToEvents()
    this.loadSavedSettings()
  }

  loadSavedSettings() {
    const settings = storageManager.loadSettings()
    this.currentAlgorithmType = settings.algorithm
    const algorithmSelect = document.getElementById('algorithm-select')
    if (algorithmSelect) {
      algorithmSelect.value = settings.algorithm
      this.updateAlgorithmInfo()
    }
    const arraySizeSelect = document.getElementById('array-size')
    if (arraySizeSelect) arraySizeSelect.value = settings.arraySize
    const speedSlider = document.getElementById('speed-slider')
    if (speedSlider) {
      speedSlider.value = settings.speed
      this.setSpeed(settings.speed)
    }
  }

  restoreLastArray() {
    const lastArray = storageManager.getLastArray()
    if (lastArray?.length) this.loadArray(lastArray)
  }

  /** @param {string} type @param {Object} algorithm */
  registerAlgorithm(type, algorithm) {
    this.algorithms[type] = algorithm
    console.log(`알고리즘 등록: ${algorithm.name}`)
  }

  /** @returns {Object|undefined} */
  getCurrentAlgorithm() {
    return this.algorithms[this.currentAlgorithmType]
  }

  render() {
    this.container.innerHTML = `
      <div class="control-panel">
        <div class="control-section">
          <h3>🔧 알고리즘 선택</h3>
          <div class="control-row">
            <select id="algorithm-select" class="algorithm-select">
              <option value="${ALGORITHM_TYPES.BUBBLE_SORT}">Bubble Sort</option>
              <option value="${ALGORITHM_TYPES.QUICK_SORT}">Quick Sort</option>
              <option value="${ALGORITHM_TYPES.MERGE_SORT}">Merge Sort</option>
            </select>
          </div>
          <div class="algorithm-info" id="algorithm-info">
            <p class="info-description"></p>
            <div class="info-complexity">
              <span class="complexity-label">시간 복잡도:</span>
              <span class="complexity-value"></span>
            </div>
          </div>
        </div>

        <div class="control-section">
          <h3>🎲 배열 생성</h3>
          <div class="control-row">
            <label for="array-size">크기:</label>
            <select id="array-size">
              <option value="${ARRAY_SIZES.SMALL}">작음 (10)</option>
              <option value="${ARRAY_SIZES.MEDIUM}" selected>중간 (20)</option>
              <option value="${ARRAY_SIZES.LARGE}">큼 (50)</option>
            </select>
            <button class="btn btn-primary" id="btn-generate">
              새 배열 생성
            </button>
          </div>
          <div class="control-row">
            <label for="custom-array">또는 직접 입력 (쉼표로 구분):</label>
            <input
              type="text"
              id="custom-array"
              placeholder="예: 5,2,8,1,9"
            />
            <button class="btn btn-primary" id="btn-custom">
              적용
            </button>
          </div>
        </div>

        <div class="control-section">
          <h3>⏯️ 재생 컨트롤</h3>
          <div class="control-row">
            <button class="btn btn-success" id="btn-start">
              ▶️ 시작
            </button>
            <button class="btn btn-primary" id="btn-pause" disabled>
              ⏸️ 일시정지
            </button>
            <button class="btn btn-danger" id="btn-stop" disabled>
              ⏹️ 정지
            </button>
          </div>
          <div class="control-row">
            <button class="btn btn-primary" id="btn-prev" disabled>
              ⏮️ 이전
            </button>
            <button class="btn btn-primary" id="btn-next" disabled>
              ⏭️ 다음
            </button>
          </div>
        </div>

        <div class="control-section">
          <h3>⚡ 속도 조절</h3>
          <div class="control-row">
            <label for="speed-slider">속도: <span id="speed-value">1x</span></label>
            <input
              type="range"
              id="speed-slider"
              min="0.5"
              max="4"
              step="0.5"
              value="1"
            />
          </div>
          <div class="speed-buttons">
            <button class="btn btn-small" data-speed="${ANIMATION_SPEED.SLOW}">0.5x</button>
            <button class="btn btn-small" data-speed="${ANIMATION_SPEED.NORMAL}">1x</button>
            <button class="btn btn-small" data-speed="${ANIMATION_SPEED.FAST}">2x</button>
            <button class="btn btn-small" data-speed="${ANIMATION_SPEED.VERY_FAST}">4x</button>
          </div>
        </div>
      </div>
    `

    this.updateAlgorithmInfo()
  }

  attachEventListeners() {
    document.getElementById('algorithm-select').addEventListener('change', e => {
      this.selectAlgorithm(e.target.value)
    })

    document.getElementById('btn-generate').addEventListener('click', () => {
      this.generateArray()
    })

    document.getElementById('btn-custom').addEventListener('click', () => {
      this.applyCustomArray()
    })

    document.getElementById('btn-start').addEventListener('click', () => {
      this.start()
    })

    document.getElementById('btn-pause').addEventListener('click', () => {
      this.pause()
    })

    document.getElementById('btn-stop').addEventListener('click', () => {
      this.stop()
    })

    document.getElementById('btn-prev').addEventListener('click', () => {
      animationEngine.prev()
    })

    document.getElementById('btn-next').addEventListener('click', () => {
      animationEngine.next()
    })

    document.getElementById('speed-slider').addEventListener('input', e => {
      const speed = parseFloat(e.target.value)
      this.setSpeed(speed)
    })

    document.querySelectorAll('.speed-buttons .btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const speed = parseFloat(e.target.dataset.speed)
        document.getElementById('speed-slider').value = speed
        this.setSpeed(speed)
      })
    })
  }

  /** @param {string} algorithmType */
  selectAlgorithm(algorithmType) {
    this.currentAlgorithmType = algorithmType
    this.updateAlgorithmInfo()
    storageManager.saveSettings({ algorithm: algorithmType })

    const currentArray = stateManager.getState('array')
    if (currentArray && currentArray.length > 0) {
      this.loadArray(currentArray)
    }

    eventBus.emit('algorithm.changed', { algorithmType })
  }

  updateAlgorithmInfo() {
    const algorithm = this.getCurrentAlgorithm()
    if (!algorithm) return

    const info = algorithm.getInfo()
    const infoContainer = document.getElementById('algorithm-info')

    infoContainer.querySelector('.info-description').textContent = info.description
    infoContainer.querySelector('.complexity-value').textContent =
      `평균 ${info.timeComplexity.average}, 최악 ${info.timeComplexity.worst}`
  }

  subscribeToEvents() {
    eventBus.on('animation.started', () => {
      this.updateButtonStates(true, false)
    })

    eventBus.on('animation.paused', () => {
      this.updateButtonStates(false, true)
    })

    eventBus.on('animation.stopped', () => {
      this.updateButtonStates(false, false)
    })

    eventBus.on('animation.completed', () => {
      this.updateButtonStates(false, false)
    })
  }

  generateArray() {
    const size = parseInt(document.getElementById('array-size').value)
    storageManager.saveSettings({ arraySize: size })
    const array = generateRandomArray(size)
    this.loadArray(array)
  }

  applyCustomArray() {
    const input = document.getElementById('custom-array').value.trim()
    if (!input) {
      alert('배열을 입력해주세요!')
      return
    }

    try {
      const array = input
        .split(',')
        .map(v => parseInt(v.trim()))
        .filter(v => !isNaN(v))

      if (array.length === 0) {
        alert('유효한 숫자를 입력해주세요!')
        return
      }

      this.loadArray(array)
      document.getElementById('custom-array').value = ''
    } catch {
      alert('배열 형식이 올바르지 않습니다!')
    }
  }

  /** @param {number[]} array */
  loadArray(array) {
    const algorithm = this.getCurrentAlgorithm()
    if (!algorithm) {
      console.error('알고리즘이 설정되지 않았습니다!')
      return
    }

    stateManager.setArray(array)
    const steps = algorithm.sort(array)
    animationEngine.loadSteps(steps)
    storageManager.saveLastArray(array)

    console.log(`배열 로드: [${array.join(', ')}]`)
    console.log(`알고리즘: ${algorithm.name}`)
    console.log(`생성된 스텝: ${steps.length}개`)
  }

  start() {
    const state = stateManager.getState()
    if (state.totalSteps === 0) {
      this.generateArray()
    }

    animationEngine.play()
  }

  pause() {
    animationEngine.pause()
  }

  stop() {
    animationEngine.stop()
  }

  /** @param {number} speed */
  setSpeed(speed) {
    animationEngine.setSpeed(speed)
    document.getElementById('speed-value').textContent = `${speed}x`
    storageManager.saveSettings({ speed })
  }

  /** @param {boolean} isPlaying @param {boolean} isPaused */
  updateButtonStates(isPlaying, isPaused) {
    const btnStart = document.getElementById('btn-start')
    const btnPause = document.getElementById('btn-pause')
    const btnStop = document.getElementById('btn-stop')
    const btnPrev = document.getElementById('btn-prev')
    const btnNext = document.getElementById('btn-next')

    if (isPlaying) {
      btnStart.disabled = true
      btnPause.disabled = false
      btnStop.disabled = false
      btnPrev.disabled = true
      btnNext.disabled = true
    } else if (isPaused) {
      btnStart.disabled = false
      btnStart.textContent = '▶️ 재개'
      btnPause.disabled = true
      btnStop.disabled = false
      btnPrev.disabled = false
      btnNext.disabled = false
    } else {
      btnStart.disabled = false
      btnStart.textContent = '▶️ 시작'
      btnPause.disabled = true
      btnStop.disabled = true
      btnPrev.disabled = false
      btnNext.disabled = false
    }
  }
}
