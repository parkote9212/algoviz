/** @type {{ SLOW: number, NORMAL: number, FAST: number, VERY_FAST: number }} */
export const ANIMATION_SPEED = {
  SLOW: 0.5,
  NORMAL: 1,
  FAST: 2,
  VERY_FAST: 4,
}

/** @type {Record<string, { DEFAULT: string, COMPARING: string, SWAPPING: string, SORTED: string, PIVOT: string }>} */
export const ALGORITHM_COLORS = {
  bubbleSort: {
    DEFAULT: '#3b82f6',
    COMPARING: '#f59e0b',
    SWAPPING: '#ef4444',
    SORTED: '#10b981',
    PIVOT: '#8b5cf6',
  },
  quickSort: {
    DEFAULT: '#06b6d4',
    COMPARING: '#f59e0b',
    SWAPPING: '#ef4444',
    SORTED: '#10b981',
    PIVOT: '#ec4899',
  },
  mergeSort: {
    DEFAULT: '#8b5cf6',
    COMPARING: '#f59e0b',
    SWAPPING: '#06b6d4',
    SORTED: '#10b981',
    PIVOT: '#ec4899',
  },
}

export const COLORS = ALGORITHM_COLORS.bubbleSort

/** @type {{ WIDTH: number, HEIGHT: number, PADDING: number, BAR_GAP: number }} */
export const CANVAS_CONFIG = {
  WIDTH: 800,
  HEIGHT: 400,
  PADDING: 20,
  BAR_GAP: 2,
}

/** @type {{ BUBBLE_SORT: string, QUICK_SORT: string, MERGE_SORT: string }} */
export const ALGORITHM_TYPES = {
  BUBBLE_SORT: 'bubbleSort',
  QUICK_SORT: 'quickSort',
  MERGE_SORT: 'mergeSort',
}

/** @type {{ SMALL: number, MEDIUM: number, LARGE: number }} */
export const ARRAY_SIZES = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 50,
}
