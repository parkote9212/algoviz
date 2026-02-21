/**
 * 퀵 정렬 (평균 O(n log n), 최악 O(n²), 공간 O(log n))
 */
export class QuickSort {
  constructor() {
    this.name = 'Quick Sort'
    this.timeComplexity = {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    }
    this.steps = []
  }

  /**
   * @param {number[]} array
   * @returns {Object[]}
   */
  sort(array) {
    this.steps = []
    const arr = [...array]
    this.quickSortHelper(arr, 0, arr.length - 1)

    this.steps.push({
      type: 'complete',
      array: [...arr],
      description: '정렬 완료!',
    })

    return this.steps
  }

  /** @param {number[]} arr @param {number} low @param {number} high */
  quickSortHelper(arr, low, high) {
    if (low < high) {
      const pivotIndex = this.partition(arr, low, high)

      this.steps.push({
        type: 'sorted',
        index: pivotIndex,
        array: [...arr],
        description: `피벗 ${arr[pivotIndex]} 위치 확정`,
      })

      this.quickSortHelper(arr, low, pivotIndex - 1)
      this.quickSortHelper(arr, pivotIndex + 1, high)
    } else if (low === high) {
      this.steps.push({
        type: 'sorted',
        index: low,
        array: [...arr],
        description: `위치 ${low} 정렬 완료`,
      })
    }
  }

  /**
   * @param {number[]} arr
   * @param {number} low
   * @param {number} high
   * @returns {number}
   */
  partition(arr, low, high) {
    const pivot = arr[high]

    this.steps.push({
      type: 'pivot',
      index: high,
      array: [...arr],
      description: `피벗 선택: ${pivot}`,
    })

    let i = low - 1

    for (let j = low; j < high; j++) {
      this.steps.push({
        type: 'compare',
        indices: [j, high],
        array: [...arr],
        description: `${arr[j]}와 피벗 ${pivot} 비교`,
      })

      if (arr[j] < pivot) {
        i++
        if (i !== j) {
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          this.steps.push({
            type: 'swap',
            indices: [i, j],
            array: [...arr],
            description: `${arr[i]}와 ${arr[j]} 교환`,
          })
        }
      }
    }

    i++
    if (i !== high) {
      ;[arr[i], arr[high]] = [arr[high], arr[i]]
      this.steps.push({
        type: 'swap',
        indices: [i, high],
        array: [...arr],
        description: `피벗 ${pivot}을 위치 ${i}로 이동`,
      })
    }

    return i
  }

  /** @returns {Object} */
  getInfo() {
    return {
      name: this.name,
      description: '피벗을 기준으로 분할 정복하는 알고리즘',
      timeComplexity: this.timeComplexity,
      spaceComplexity: 'O(log n)',
      stable: false,
    }
  }
}
