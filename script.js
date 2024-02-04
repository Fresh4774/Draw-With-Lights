import { spline, pointsInPath } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.0"
const colors = ['58a65b','f9ed70','8cdaf9','df5644','e8b433','4074e4','73da84']
const lights = document.querySelector('#lights')
const p1 = document.querySelector('#p1')
const p2 = document.querySelector('#p2')
let mX, mY, oldX, oldY, nPts

function setM(e){
  mX = e.x
  mY = e.y
}

function addPt(loop){
  if (mX!=oldX&&mY!=oldY){
    const pts = p1.getAttribute('d')+' '+mX+','+mY+' '
    gsap.set(p1, {attr:{d:pts}})
    
    const d = spline(pointsInPath(p1,nPts), 1, false)
    if (d.length>3) gsap.set(p2, {attr:{d:d}})

    nPts++
    oldX = mX
    oldY = mY
  }
  
  if (loop) gsap.delayedCall(0.1, addPt, [true])  
}

window.onpointerdown=(e)=>{
  while (lights.firstChild) lights.removeChild(lights.lastChild) 
  setM(e)
  nPts = 1
  window.addEventListener('pointermove', setM)
  gsap.set('#cord path', {attr:{d:'M'+mX+','+mY}})
  addPt(true)
}

window.onpointerup=()=>{
  gsap.killTweensOf(addPt)
  window.removeEventListener('pointermove', setM)
  const pts = pointsInPath(p1,nPts)
  for (let i=1; i<nPts-1; i+=2){
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    const pt1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const pt2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    gsap.set(pt1, {attr:{d:'M2.5-1.9c-.6-.1-4.8 4-4.7 4.6l5.9 7.7L10.2 4 2.5-1.9z'}})
    gsap.fromTo(pt2, {attr:{d:'M22.3 9.8c-1.8-1.8-5.5-4.2-7.8-4.3-1.4-.1-1.9.1-3.7-.9L4.3 11c.9 1.7.8 2.2.9 3.7.2 2.3 2.5 6 4.3 7.8 3.9 3.9 12.4 4.5 14.9 2.1s1.6-11-2.1-14.8z', fill:'#333'}},{fill:'#'+colors[gsap.utils.random(0,colors.length-1,1)], ease:'back', delay:i/nPts})
    
    gsap.set(g, {x:pts[i].x, y:pts[i].y, rotate:'random(0,360)'})
    g.append(pt1)
    g.append(pt2)
    lights.append(g)
  }
}