// Panel de depuración: se activa agregando ?debug=1 a la dirección.
(function(){
if(!/[?&]debug=1/.test(location.search))return;
const log=[],t0=performance.now();
let box,frames=0,fps=0,last=performance.now();
function ts(){return((performance.now()-t0)/1000).toFixed(1)+'s'}
function add(msg,c){log.unshift('<span style="color:'+(c||'#E7EDF4')+'">'+ts()+' '+String(msg).replace(/</g,'&lt;')+'</span>');log.length=Math.min(log.length,14);render()}
window.addEventListener('error',e=>add('ERROR '+e.message+' ('+(e.filename||'').split('/').pop()+':'+e.lineno+')','#FF7A7A'));
window.addEventListener('unhandledrejection',e=>add('PROMESA '+(e.reason&&e.reason.message||e.reason),'#FF7A7A'));
window.addEventListener('camera-init',()=>add('camera-init: cámara abierta','#6FE3E8'));
window.addEventListener('camera-error',e=>add('camera-error: '+(e.detail&&e.detail.error&&(e.detail.error.name+' '+e.detail.error.message)||'sin detalle'),'#FF7A7A'));
function state(){
  const v=document.querySelector('video'),s=document.querySelector('a-scene');
  const ar=s&&s.systems&&s.systems.arjs;
  return [
    'https: '+window.isSecureContext+' · getUserMedia: '+!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia),
    'video: '+(v?(v.videoWidth+'x'+v.videoHeight+' · ready '+v.readyState+' · '+(v.paused?'pausado':'corriendo')):'no existe'),
    'pantalla: '+innerWidth+'x'+innerHeight+' · dpr '+devicePixelRatio+' · '+fps+' fps',
    'arjs: '+(ar?'sí':'no')+' · marcadores: '+[...document.querySelectorAll('a-marker')].map(m=>(m.dataset.k||'?')+(m.object3D&&m.object3D.visible?'●':'○')).join(' ')
  ].join('<br>');
}
function render(){if(box)box.innerHTML='<b style="color:#F3B44E">DEBUG</b><br>'+state()+'<hr style="border:0;border-top:1px solid #243245;margin:4px 0">'+log.join('<br>')}
function loop(now){frames++;if(now-last>1000){fps=frames;frames=0;last=now;render()}requestAnimationFrame(loop)}
window.addEventListener('load',()=>{
  box=document.createElement('div');
  box.style.cssText='position:fixed;left:8px;right:70px;top:calc(env(safe-area-inset-top,0px) + 44px);z-index:30;max-height:45vh;overflow:auto;padding:6px 8px;background:rgba(0,0,0,.78);border:1px solid #243245;border-radius:8px;font:11px/1.35 ui-monospace,Menlo,monospace;color:#E7EDF4;pointer-events:none';
  document.body.appendChild(box);
  add(navigator.userAgent.replace(/^Mozilla\/5\.0 /,''),'#95A3B5');
  document.querySelectorAll('a-marker').forEach(m=>{
    const u=m.getAttribute('url');
    if(u)fetch(u,{cache:'no-store'}).then(r=>r.text().then(x=>add(u+' → '+r.status+' · '+x.trim().split(/\s+/).length+' números',r.ok?'#95A3B5':'#FF7A7A'))).catch(e=>add(u+' → '+e.message,'#FF7A7A'));
    m.addEventListener('markerFound',()=>add('ENCONTRADO '+m.dataset.k,'#6FE3E8'));
    m.addEventListener('markerLost',()=>add('perdido '+m.dataset.k,'#F3B44E'));
  });
  requestAnimationFrame(loop);
});
})();
