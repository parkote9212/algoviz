import stateManager from '../core/StateManager.js'
import eventBus from '../core/EventBus.js'

/**
 * 비교/교환 횟수, 진행률 등 통계 표시
 */
export class StatsPanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`)
    }

    this.render()
    this.subscribeToEvents()
  }

  subscribeToEvents() {
    eventBus.on('state.changed', () => {
      this.update()
    })
  }

  render() {
    this.container.innerHTML = `
      <div class="stats-panel">
        <h3>📊 통계</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">비교 횟수</span>
            <span class="stat-value" id="stat-comparisons">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">교환 횟수</span>
            <span class="stat-value" id="stat-swaps">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">현재 스텝</span>
            <span class="stat-value" id="stat-current-step">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">전체 스텝</span>
            <span class="stat-value" id="stat-total-steps">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">속도</span>
            <span class="stat-value" id="stat-speed">1x</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">상태</span>
            <span class="stat-value" id="stat-status">대기 중</span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
        </div>
      </div>
    `
  }

  update() {
    const state = stateManager.getState()

    document.getElementById('stat-comparisons').textContent =
      state.comparisons.toLocaleString()

    document.getElementById('stat-swaps').textContent =
      state.swaps.toLocaleString()

    document.getElementById('stat-current-step').textContent =
      state.currentStep.toLocaleString()

    document.getElementById('stat-total-steps').textContent =
      state.totalSteps.toLocaleString()

    document.getElementById('stat-speed').textContent = `${state.speed}x`

    let status = '대기 중'
    if (state.isCompleted) {
      status = '✅ 완료'
    } else if (state.isPlaying) {
      status = '▶️ 실행 중'
    } else if (state.isPaused) {
      status = '⏸️ 일시정지'
    }
    document.getElementById('stat-status').textContent = status

    const progress =
      state.totalSteps > 0 ? (state.currentStep / state.totalSteps) * 100 : 0
    document.getElementById('progress-fill').style.width = `${progress}%`
  }
}
