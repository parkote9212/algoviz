/**
 * 랜덤 배열 생성
 * @param {number} size - 배열 크기
 * @param {number} min - 최소값
 * @param {number} max - 최대값
 * @returns {number[]} 랜덤 배열
 */

export function generateRandomArray(size, min = 5, max = 100){
  return Array.from({ length: size}, () =>
  Math.floor(Math.random() * (max - min + 1) + min)
  )
}

/**
 * 지연 함수 (async/await용)
 * @param {number} ms - 밀리초
 * @returns {Promise}
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 배열 복사
 * @param {Array} arr - 원본 배열
 * @returns {Array} 복사된 배열
 */

export function cloneArray(arr) {
  return [...arr]
}

/**
 * 두 값 교환
 * @param {Array} arr - 배열
 * @param {number} i - 첫 번째 인덱스
 * @param {number} j - 두 번째 인덱스
 */
export function swap(arr, i, j) {
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

/**
 * 디바운스 함수
 * @param {Function} func - 실행할 함수
 * @param {number} wait - 대기 시간 (ms)
 * @returns {Function}
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
