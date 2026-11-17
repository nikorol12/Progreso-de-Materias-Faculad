const M={},R={},K='ucp-isi-173-19',LB={p:'Pendiente',c:'Cursando',r:'Regular',a:'Aprobada',x:'A recursar'};
RAW.split('\n').forEach((r,i)=>{const[n,y,c,k,h]=r.split('|');M[i+1]={id:i+1,n,y:+y,c:+c,k:k?k.split(',').map(Number):[],h:+h}});
const ids=Object.keys(M).map(Number);ids.forEach(i=>M[i].k.forEach(k=>(R[k]=R[k]||[]).push(i)));
let S={},T='plan';try{S=JSON.parse(localStorage.getItem(K))||{}}catch(e){}
ids.forEach(i=>{S[i]=S[i]||{s:'p',e:[]}});
const sv=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const $=i=>document.getElementById(i),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nm=i=>i+' · '+M[i].n,cc=i=>M[i].k.every(k=>'ra'.includes(S[k].s)),ds=i=>S[i].s=='p'&&!cc(i)?'l':S[i].s;
const falta=i=>M[i].k.filter(k=>S[k].s!='a');
function deps(id){const sn=new Set,q=[id];while(q.length)(R[q.pop()]||[]).forEach(x=>{if(!sn.has(x)){sn.add(x);q.push(x)}});return[...sn].sort((a,b)=>a-b)}
const TH=ids.reduce((a,i)=>a+M[i].h,0),today=new Date(new Date().toDateString());
const dl=d=>Math.round((new Date(d+'T00:00')-today)/864e5);
const fd=d=>{const n=dl(d);return n<0?`<span class="late">venció hace ${-n} d</span>`:n==0?'<b>hoy</b>':n==1?'mañana':`en ${n} días`};
function rd(){
 const a=ids.filter(i=>S[i].s=='a'),pc=Math.round(a.length/ids.length*100),ha=a.reduce((t,i)=>t+M[i].h,0);
 $('ring').style.background=`conic-gradient(#fde047 ${pc*3.6}deg,rgba(255,255,255,.25) 0)`;$('pc').textContent=pc+'%';
 const n=s=>ids.filter(i=>S[i].s==s).length;
 $('st').innerHTML=`<span><b>${a.length}</b> / ${ids.length} aprobadas</span><span><b>${n('r')}</b> regulares</span><span><b>${n('c')}</b> cursando</span><span><b>${n('x')}</b> a recursar</span><span><b>${ha}</b> / ${TH} h</span>`;
 $('tabs').innerHTML=[['plan','Plan de estudios'],['fin','Qué hacer ahora'],['fec','Mis finales']].map(t=>`<button class="${T==t[0]?'on':''}" onclick="T='${t[0]}';rd()">${t[1]}</button>`).join('');
 $('main').innerHTML=T=='plan'?plan():T=='fin'?fin():fec();
}
const card=i=>{const s=ds(i),nx=S[i].e.filter(e=>e.d&&!e.k).sort((x,y)=>x.d>y.d?1:-1)[0];
 return `<div class="m s-${s}" tabindex="0" role="button" onclick="op(${i})" onkeydown="if(event.key=='Enter')op(${i})"><em class="n">${i}</em><b>${esc(M[i].n)}</b><small><span>${s=='l'?'🔒 Bloqueada':IC[s]+' '+LB[s]}</span><span>${nx?esc(nx.t)+' '+nx.d.slice(5).split('-').reverse().join('/'):M[i].h+' h'}</span></small></div>`};
function plan(){let h='';for(let y=1;y<=5;y++){
 if(y==4){const b=ids.filter(i=>M[i].y<=3),d=b.filter(i=>S[i].s=='a').length;h+=`<div class="an"><b>Título intermedio: Analista Universitario en Sistemas de Información</b><div class="mu">Materias de 1.º a 3.º año: ${d} de ${b.length}</div><div class="bar"><i style="width:${d/b.length*100}%"></i></div></div>`}
 const yb=ids.filter(i=>M[i].y==y),yd=yb.filter(i=>S[i].s=='a').length;h+=`<div class="yh" style="--h:${[200,160,265,330,25][y-1]}"><span class="yn">${y}</span><div><h2>${y}.º año</h2><div class="bar"><i style="width:${yd/yb.length*100}%"></i></div></div><b>${yd}/${yb.length}</b></div>`;
 [1,2].forEach(c=>{h+=`<div class="cu">${c==1?'Primer':'Segundo'} cuatrimestre</div><div class="g" style="--h:${[200,160,265,330,25][y-1]}">${ids.filter(i=>M[i].y==y&&M[i].c==c).map(card).join('')}</div>`})}
 return h+`<p class="mu" style="margin-top:16px;font-size:13px">Verde: aprobada · Azul: regular (cursada aprobada, final pendiente) · Amarillo: cursando · Rojo: a recursar · Gris: bloqueada por correlativas.</p>`}
function fin(){
 const L=(t,a,f,e)=>`<div class="box"><h3>${t}</h3>${a.length?`<ul>${a.map(f).join('')}</ul>`:`<span class="mu">${e}</span>`}</div>`,reg=ids.filter(i=>S[i].s=='r');
 return L('Listos para rendir el final',reg.filter(i=>!falta(i).length),i=>`<li>${esc(nm(i))}</li>`,'Ninguna por ahora.')
 +L('Regulares, pero antes tenés que aprobar otra',reg.filter(i=>falta(i).length),i=>`<li>${esc(nm(i))} <span class="mu">→ primero rendí: ${falta(i).map(k=>esc(nm(k))).join('; ')}</span></li>`,'Ninguna.')
 +L('Podés cursar ahora',ids.filter(i=>S[i].s=='p'&&cc(i)),i=>`<li>${esc(nm(i))}</li>`,'Nada disponible: revisá tus regulares.')
 +L('A recursar',ids.filter(i=>S[i].s=='x'),i=>{const d=deps(i).filter(x=>S[x].s=='p');return `<li>${esc(nm(i))}${d.length?` <span class="mu">· frena ${d.length} materias</span>`:''}</li>`},'Ninguna.')}
function fec(){const L=[];ids.forEach(i=>S[i].e.forEach(e=>{if(e.d&&!e.k)L.push({i,e})}));L.sort((a,b)=>a.e.d>b.e.d?1:-1);
 return `<div class="box"><h3>Próximas fechas</h3>${L.length?L.map(x=>`<div class="ev"><b>${esc(x.e.t)}</b><span>${x.e.d.split('-').reverse().join('/')}</span><span class="mu">${fd(x.e.d)}</span><span>${esc(M[x.i].n)}</span></div>`).join(''):'<span class="mu">Abrí una materia y agregá la fecha de tu final.</span>'}</div>`}
let cur=0;const IC={p:'⚪',c:'📖',r:'🔷',a:'✅',x:'🔁'};
function bu(){for(let j=0;j<26;j++){const e=document.createElement('i');e.className='cf';e.textContent=['🎉','✨','⭐','🎓'][j%4];e.style.cssText=`left:${Math.random()*100}vw;animation-delay:${Math.random()*.4}s`;document.body.appendChild(e);setTimeout(()=>e.remove(),2000)}}
function op(i){cur=i;$('ov').style.display='flex';rm()}
function cl(){$('ov').style.display='none';rd()}
function rm(){const i=cur,m=M[i],s=S[i],d=deps(i),f=falta(i);
 const mark=k=>S[k].s=='a'?'✅':S[k].s=='r'?'🟦':'⬜';
 $('md').innerHTML=`<div style="display:flex;justify-content:space-between;gap:10px"><div><h2>${esc(nm(i))}</h2><span class="mu">${m.y}.º año · ${m.c}.º cuatrimestre · ${m.h} h</span></div><button class="bt" onclick="cl()">Cerrar</button></div>
 <div class="sec"><h4>Estado</h4><div class="sb">${Object.keys(LB).map(k=>`<button class="${s.s==k?'on':''}" onclick="ss('${k}')">${LB[k]}</button>`).join('')}</div></div>
 <div class="sec"><h4>Correlativas</h4>${m.k.length?m.k.map(k=>`<div>${mark(k)} ${esc(nm(k))}</div>`).join('')+`<div class="mu" style="margin-top:5px">Para cursar: tener regulares o aprobadas todas. Para rendir el final: tener aprobadas todas${f.length&&s.s!='a'?`. Te falta aprobar: ${f.join(', ')}.`:'.'}</div>`:'<span class="mu">Sin correlativas.</span>'}</div>
 <div class="sec"><h4>Si la recursás o no la aprobás, se bloquea</h4>${d.length?`<div>${d.map(x=>`<span class="tag">${esc(nm(x))}</span> `).join('')}</div>`:'<span class="mu">No es correlativa de ninguna materia.</span>'}</div>
 <div class="sec"><h4>Fecha de final</h4>${s.e.map((e,j)=>`<div class="ev"><b>${esc(e.t)}</b><input type="date" value="${esc(e.d||'')}" onchange="ue(${j},'d',this.value)"><input type="text" placeholder="Nota" value="${esc(e.n)}" onchange="ue(${j},'n',this.value)"><label><input type="checkbox" ${e.k?'checked':''} onchange="ue(${j},'k',this.checked)"> hecho</label><button class="bt" onclick="de(${j})">✕</button></div>`).join('')}
 <div class="ev"><select id="nt">${['Final'].map(t=>`<option>${t}</option>`).join('')}</select><input type="date" id="nd"><button class="bt" onclick="ae()">Agregar fecha</button></div></div>`}
function ss(k){S[cur].s=k;sv();rm();if(k=='a')bu()}
function ae(){const d=$('nd').value;S[cur].e.push({t:$('nt').value,d,n:'',k:false});sv();rm()}
function ue(j,f,v){S[cur].e[j][f]=v;sv();rm()}
function de(j){S[cur].e.splice(j,1);sv();rm()}
function ex(){const b=new Blob([JSON.stringify(S)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='mi-progreso-isi.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function im(f){if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);ids.forEach(i=>{if(d[i]&&LB[d[i].s])S[i]={s:d[i].s,e:Array.isArray(d[i].e)?d[i].e.map(e=>({t:String(e.t||'Final'),d:String(e.d||''),n:String(e.n||''),k:!!e.k})):[]}});sv();rd()}catch(e){alert('Archivo no válido')}};r.readAsText(f)}
function rs(){if(confirm('¿Borrar todo tu progreso?')){ids.forEach(i=>S[i]={s:'p',e:[]});sv();rd()}}
rd();
