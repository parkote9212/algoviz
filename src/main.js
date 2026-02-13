import './style.css'


console.log('AlgoViz 시작!')

// Canvas 테스트
const canvas = document.getElementById('visualizer')
const ctx = canvas.getContext('2d')

// 간단한 테스트 렌더링
ctx.fillStyle = '#3b82f6'
ctx.fillRect(50, 50, 100, 150)
ctx.fillStyle = '#10b981'
ctx.fillRect(200, 100, 100, 100)
ctx.fillStyle = '#ef4444'
ctx.fillRect(350, 150, 100, 50)

// 텍스트 추가
ctx.fillStyle = '#0f172a'
ctx.font = '20px sans-serif'
ctx.fillText('Canvas 준비 완료!', 50, 30)
