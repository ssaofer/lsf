import { projects } from './data/projects.js'

const app = document.querySelector('#app')
let active = 'universe'
let detail = null
const navs = ['VIDEO', 'GRAPHIC', 'ABOUT', 'CONTACT']

const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const projectCard = (p, i) => `<button class="project-card ${p.tone}" data-project="${p.id}" style="--i:${i}"><span class="card-no">PROJECT ${p.number}</span><span class="project-art"><i></i><b>${p.type === 'VIDEO' ? '▶' : 'F'}</b></span><span class="card-bottom"><strong>${esc(p.title)}</strong><em>${p.category}</em></span></button>`
const page = () => {
 const items = active === 'video' ? projects.filter(p=>p.type==='VIDEO') : active === 'graphic' ? projects.filter(p=>p.type==='GRAPHIC') : []
 const content = detail ? detailView(projects.find(p=>p.id===detail)) : active === 'universe' ? universe() : active === 'about' ? about() : active === 'contact' ? contact() : gallery(items)
 app.innerHTML = `<div class="aurora"></div><div class="grid"></div><div class="noise"></div><header><button class="wordmark" data-nav="universe">FANGYU<span>.EXE</span></button><div class="head-tools"><span class="system-status">DIGITAL UNIVERSE / 01</span><button class="menu-dot" aria-label="Open menu">✦</button></div></header>${content}<footer><span>© 2026 LIU FANGYU</span><span>SCROLL / EXPLORE</span></footer>`
 bind()
}
const universe = () => `<main class="universe">
 <section class="hero-copy"><p class="eyebrow">VIDEO / GRAPHIC / CREATIVE</p><h1>LIU<br/>FANGYU</h1><p class="tagline">A LITTLE UNIVERSE<br/>OF MY IDEAS.</p><button class="explore" data-nav="video">EXPLORE <span>↗</span></button></section>
 <section class="orbital" aria-label="Interactive digital universe"><div class="halo h1"></div><div class="halo h2"></div><div class="ring ring-a"></div><div class="ring ring-b"></div><div class="ring ring-c"></div><div class="pearl"><div></div></div><span class="spark s1"></span><span class="spark s2"></span><span class="spark s3"></span>
 ${navs.map((n,i)=>`<button class="node n${i+1}" data-nav="${n.toLowerCase()}"><small>0${i+1}</small>${n}<i>↗</i></button>`).join('')}
 <p class="drag-note">DRAG TO DRIFT <b>✦</b></p></section></main>`
const gallery = (items) => `<main class="gallery"><div class="gallery-intro"><button class="back" data-nav="universe">← BACK TO UNIVERSE</button><p class="eyebrow">ORBIT / ${active.toUpperCase()}</p><h2>${active === 'video' ? 'MOVING<br/><i>IMAGES.</i>' : 'DIGITAL<br/><i>EDITORIAL.</i>'}</h2><p>${active === 'video' ? 'Floating screens for stories in motion.' : 'A collection of image-led visual worlds.'}</p></div><div class="gallery-track">${items.map(projectCard).join('')}</div></main>`
const about = () => `<main class="about page-simple"><button class="back" data-nav="universe">← BACK TO UNIVERSE</button><p class="eyebrow">04 / ABOUT</p><h2>THE PERSON<br/><i>BEHIND THE SCREEN.</i></h2><div class="about-grid"><div class="bio">LIU FANGYU<br/><span>VIDEO · GRAPHIC · CREATIVE · AI</span></div><p>[ADD BIO]<br/><br/>[ADD EXPERIENCE]<br/><br/>[ADD EDUCATION]</p><ul><li>STORYTELLING</li><li>VISUAL THINKING</li><li>BRAND SENSIBILITY</li><li>AI EXPLORATION</li><li>CREATIVE CURIOSITY</li></ul></div></main>`
const contact = () => `<main class="contact page-simple"><button class="back" data-nav="universe">← BACK TO UNIVERSE</button><p class="eyebrow">05 / CONTACT</p><h2>LET'S CREATE<br/><i>SOMETHING.</i></h2><div class="contact-links"><a href="mailto:[ADD_EMAIL]">[ADD EMAIL] <b>↗</b></a><a href="#contact">XIAOHONGSHU / INSTAGRAM / BEHANCE / LINKEDIN <b>↗</b></a></div></main>`
const detailView = (p) => `<main class="detail"><button class="back" data-nav="${p.type.toLowerCase()}">← BACK TO ${p.type} ORBIT</button><div class="detail-heading"><p class="eyebrow">PROJECT ${p.number} / ${p.type} / ${p.year}</p><h2>${esc(p.title)}</h2></div><div class="detail-art ${p.tone}"><i></i><span>${p.type === 'VIDEO' ? 'VIDEO PLACEHOLDER' : 'IMAGE PLACEHOLDER'}</span><b>${p.type === 'VIDEO' ? '▶' : 'F'}</b></div><section class="project-info"><p>${p.description}</p><dl><div><dt>ROLE</dt><dd>${p.role}</dd></div><div><dt>TOOLS</dt><dd>${p.tools}</dd></div><div><dt>CATEGORY</dt><dd>${p.category}</dd></div></dl></section><button class="next" data-nav="${p.type.toLowerCase()}">MORE ${p.type} WORK <span>→</span></button></main>`
function bind(){
 document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>{active=el.dataset.nav;detail=null; page()}))
 document.querySelectorAll('[data-project]').forEach(el=>el.addEventListener('click',()=>{detail=el.dataset.project;page()}))
 const orbital=document.querySelector('.orbital'); if(orbital) orbital.addEventListener('pointermove',e=>{const r=orbital.getBoundingClientRect(); orbital.style.setProperty('--x',`${(e.clientX-r.left)/r.width-.5}`); orbital.style.setProperty('--y',`${(e.clientY-r.top)/r.height-.5}`)})
}
setTimeout(()=>document.body.classList.add('loaded'), 450)
page()
