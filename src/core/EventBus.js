/** Publish-Subscribe 이벤트 버스 */
class EventBus {
  constructor() {
    this.events = {}
  }

  /** @param {string} eventName @param {Function} callback */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }

  /** @param {string} eventName @param {Function} callback */
  off(eventName, callback) {
    if (!this.events[eventName]) return

    this.events[eventName] = this.events[eventName].filter(
      cb => cb !== callback
    )
  }

  /** @param {string} eventName @param {*} [data] */
  emit(eventName, data) {
    if (!this.events[eventName]) return

    this.events[eventName].forEach(callback => {
      callback(data)
    })
  }

  /** @param {string} eventName @param {Function} callback */
  once(eventName, callback) {
    const onceCallback = data => {
      callback(data)
      this.off(eventName, onceCallback)
    }
    this.on(eventName, onceCallback)
  }
}

export default new EventBus()
