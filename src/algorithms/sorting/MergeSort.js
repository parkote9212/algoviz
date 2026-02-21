/**
 * 병합 정렬 (O(n log n) 시간, O(n) 공간)
 */
export class MergeSort {
  constructor() {
    this.name = 'Merge Sort'
    this.timeComplexity = {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
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
    this.mergeSortHelper(arr, 0, arr.length - 1)

    this.steps.push({
      type: 'complete',
      array: [...arr],
      description: '정렬 완료!',
    })

    return this.steps
  }

  /** @param {number[]} arr @param {number} left @param {number} right */
  mergeSortHelper(arr, left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)

      this.steps.push({
        type: 'divide',
        indices: [left, mid, right],
        array: [...arr],
        description: `범위 [${left}~${right}]를 [${left}~${mid}], [${mid + 1}~${right}]로 분할`,
      })

      this.mergeSortHelper(arr, left, mid)
      this.mergeSortHelper(arr, mid + 1, right)
      this.merge(arr, left, mid, right)
    }
  }

  /** @param {number[]} arr @param {number} left @param {number} mid @param {number} right */
  merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)

    let i = 0
    let j = 0
    let k = left

    this.steps.push({
      type: 'merge_start',
      indices: [left, mid, right],
      array: [...arr],
      description: `병합 시작: [${left}~${mid}]와 [${mid + 1}~${right}]`,
    })

    while (i < leftArr.length && j < rightArr.length) {
      this.steps.push({
        type: 'compare',
        indices: [left + i, mid + 1 + j],
        array: [...arr],
        description: `${leftArr[i]}와 ${rightArr[j]} 비교`,
      })

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        i++
      } else {
        arr[k] = rightArr[j]
        j++
      }

      this.steps.push({
        type: 'place',
        indices: [k],
        array: [...arr],
        description: `위치 ${k}에 ${arr[k]} 배치`,
      })

      k++
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      this.steps.push({
        type: 'place',
        indices: [k],
        array: [...arr],
        description: `위치 ${k}에 ${arr[k]} 배치`,
      })
      i++
      k++
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      this.steps.push({
        type: 'place',
        indices: [k],
        array: [...arr],
        description: `위치 ${k}에 ${arr[k]} 배치`,
      })
      j++
      k++
    }

    this.steps.push({
      type: 'merge_complete',
      indices: [left, right],
      array: [...arr],
      description: `범위 [${left}~${right}] 병합 완료`,
    })
  }

  /** @returns {Object} */
  getInfo() {
    return {
      name: this.name,
      description: '분할 정복으로 배열을 재귀적으로 정렬하는 알고리즘',
      timeComplexity: this.timeComplexity,
      spaceComplexity: 'O(n)',
      stable: true,
    }
  }
}
