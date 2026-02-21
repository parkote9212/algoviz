/**
 * 버블 정렬 (O(n²) 시간, O(1) 공간)
 */
export class BubbleSort {
  constructor() {
    this.name = 'Bubble Sort'
    this.timeComplexity = {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    }
  }

  /**
   * @param {number[]} array
   * @returns {Object[]} 애니메이션 스텝
   */
  sort(array) {
    const steps = []
    const arr = [...array]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      let swapped = false

      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          type: 'compare',
          indices: [j, j + 1],
          array: [...arr],
          description: `${arr[j]}과 ${arr[j + 1]} 비교`,
        })

        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          swapped = true

          steps.push({
            type: 'swap',
            indices: [j, j + 1],
            array: [...arr],
            description: `${arr[j + 1]}과 ${arr[j]} 교환`,
          })
        }
      }

      steps.push({
        type: 'sorted',
        index: n - i - 1,
        array: [...arr],
        description: `위치 ${n - i - 1} 정렬 완료`,
      })

      if (!swapped) {
        for (let k = 0; k < n - i - 1; k++) {
          steps.push({
            type: 'sorted',
            index: k,
            array: [...arr],
            description: `위치 ${k} 정렬 완료 (조기 종료)`,
          })
        }
        break
      }
    }

    steps.push({
      type: 'complete',
      array: [...arr],
      description: '정렬 완료!',
    })

    return steps
  }

  /** @returns {Object} */
  getInfo() {
    return {
      name: this.name,
      description: '인접한 두 요소를 비교하여 정렬하는 알고리즘',
      timeComplexity: this.timeComplexity,
      spaceComplexity: 'O(1)',
      stable: true,
    }
  }
}
