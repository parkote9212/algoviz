import eventBus from '../core/EventBus.js'

/**
 * 알고리즘 코드 표시 및 스텝 하이라이트
 */
export class CodeViewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`)
    }

    this.codeExamples = {
      bubbleSort: `function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      // 비교
      if (arr[j] > arr[j + 1]) {
        // 교환
        [arr[j], arr[j + 1]] =
          [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // 최적화: 교환이 없으면 종료
    if (!swapped) break;
  }

  return arr;
}`,
      quickSort: `function quickSort(arr, low, high) {
  if (low < high) {
    // 파티션 분할
    const pi = partition(arr, low, high);

    // 왼쪽 부분 정렬
    quickSort(arr, low, pi - 1);

    // 오른쪽 부분 정렬
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] =
    [arr[high], arr[i + 1]];
  return i + 1;
}`,
      mergeSort: `function mergeSort(arr, left, right) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);

    // 왼쪽 부분 정렬
    mergeSort(arr, left, mid);

    // 오른쪽 부분 정렬
    mergeSort(arr, mid + 1, right);

    // 병합
    merge(arr, left, mid, right);
  }
}

function merge(arr, left, mid, right) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);

  let i = 0, j = 0, k = left;

  while (i < leftArr.length &&
         j < rightArr.length) {
    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;
    }
    k++;
  }

  // 남은 요소 복사
  while (i < leftArr.length) {
    arr[k++] = leftArr[i++];
  }
  while (j < rightArr.length) {
    arr[k++] = rightArr[j++];
  }
}`,
    }

    this.currentAlgorithm = 'bubbleSort'
    this.currentLine = -1

    this.render()
    this.subscribeToEvents()
  }

  subscribeToEvents() {
    eventBus.on('algorithm.changed', ({ algorithmType }) => {
      this.setAlgorithm(algorithmType)
    })

    eventBus.on('step.executed', step => {
      this.highlightStep(step)
    })

    eventBus.on('animation.stopped', () => {
      this.clearHighlight()
    })

    eventBus.on('animation.completed', () => {
      this.clearHighlight()
    })
  }

  /** @param {string} algorithmType */
  setAlgorithm(algorithmType) {
    this.currentAlgorithm = algorithmType
    this.render()
  }

  /** @param {Object} step */
  highlightStep(step) {
    let lineNumber = -1

    switch (step.type) {
      case 'compare':
        lineNumber =
          this.currentAlgorithm === 'bubbleSort'
            ? 7
            : this.currentAlgorithm === 'quickSort'
              ? 17
              : 15
        break
      case 'swap':
        lineNumber =
          this.currentAlgorithm === 'bubbleSort'
            ? 9
            : this.currentAlgorithm === 'quickSort'
              ? 19
              : -1
        break
      case 'pivot':
        lineNumber = 13
        break
      case 'merge_start':
        lineNumber = 11
        break
    }

    if (lineNumber !== -1) {
      this.currentLine = lineNumber
      this.updateHighlight()
    }
  }

  clearHighlight() {
    this.currentLine = -1
    this.updateHighlight()
  }

  updateHighlight() {
    const lines = this.container.querySelectorAll('.code-line')
    lines.forEach((line, index) => {
      if (index === this.currentLine - 1) {
        line.classList.add('highlight')
      } else {
        line.classList.remove('highlight')
      }
    })
  }

  render() {
    const code = this.codeExamples[this.currentAlgorithm] || ''
    const lines = code.split('\n')

    const codeHtml = lines
      .map((line, index) => {
        const escaped = line
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        return `<div class="code-line" data-line="${index + 1}">
          <span class="line-number">${index + 1}</span>
          <span class="line-content">${escaped || ' '}</span>
        </div>`
      })
      .join('')

    this.container.innerHTML = `
      <div class="code-viewer">
        <div class="code-header">
          <h3>💻 코드</h3>
        </div>
        <div class="code-content">
          ${codeHtml}
        </div>
      </div>
    `
  }
}
