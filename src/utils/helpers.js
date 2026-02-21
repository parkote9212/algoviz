/**
 * @param {number} size
 * @param {number} [min=5]
 * @param {number} [max=100]
 * @returns {number[]}
 */
export function generateRandomArray(size, min = 5, max = 100) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1) + min)
  )
}

/** @param {number} ms @returns {Promise<void>} */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** @param {Array} arr @returns {Array} */
export function cloneArray(arr) {
  return [...arr]
}

/** @param {Array} arr @param {number} i @param {number} j */
export function swap(arr, i, j) {
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

/**
 * @param {Function} func
 * @param {number} wait - ms
 * @returns {(...args: unknown[]) => void}
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
