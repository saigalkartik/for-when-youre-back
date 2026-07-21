const sections=[
{id:"tiktoks",label:"TikToks",items:COLLECTION.tiktoks},
{id:"whenMissed",label:"When I Missed You",items:COLLECTION.whenMissed},
{id:"moodBoard",label:"Mood Board",items:COLLECTION.moodBoard},
{id:"marketplace",label:"Marketplace",items:COLLECTION.marketplace},
{id:"music",label:"Music",items:COLLECTION.music}
];
const allItems=sections.flatMap(s=>s.items.map((x,i)=>({...x,section:s.id,label:s.label,index:i})));
let active="all", query="";
let seen=new Set(JSON.parse(localStorage.getItem("seenLinks")||"[]"));
const feed=document.getElementById("feed");
const platform=url=>url.includes("tiktok")?"TikTok":url.includes("instagram")?"Instagram":url.includes("x.com")?"X":url.includes("facebook")?"Marketplace":url.includes("spotify")?"Spotify":"Link";
const previewWords={
TikTok:["saved this for you","you'll get it","this felt very you","needed to send you this","for when you're back"],
Instagram:["a little mood","saved for you","this one","thought you'd like this","love this"],
X:["internet treasure","you need to see this","this made me think of you","saved this","had to send this"],
Marketplace:["maybe this one?","look at this","found this","for our place?","potentially ours"],
Spotify:["listen to this","for the drive home","this song ♡","press play","one for you"]
};
const backgrounds={
TikTok:["#d9d1ca","#b8b0a8","#8f8179","#c4b7aa","#a7968d"],
Instagram:["#cbb7aa","#9c8e87","#d2c3b7","#a99c95","#c4aaa2"],
X:["#b6b5b1","#8e918f","#c3c0b9","#9c9b96","#b4aaa2"],
Marketplace:["#d3c6b7","#b6a897","#c9b9a6","#a99b8c","#c4b7a7"],
Spotify:["#b9a99f","#8f7d76","#c7b8ae","#a39088","#b5a19a"]
};
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function card(item,globalIndex){
 const p=platform(item.url), word=previewWords[p][item.index%5], bg=backgrounds[p][item.index%5];
 const el=document.createElement("article");el.className="card";
 const note=item.note?`“${esc(item.note)}”`:`${item.section==="moodBoard"?"Saved image / post":item.section==="marketplace"?"Saved marketplace find":item.section==="music"?"Saved song":"Saved for you"}`;
 el.innerHTML=`<div class="preview" style="background:${bg}">
   <div class="preview-bg"></div><div class="preview-shade"></div>
   <span class="platform">${p}</span><span class="card-number">${String(globalIndex+1).padStart(2,"0")}</span>
   <div class="preview-center">${p==="Spotify"?'<span class="music-note">♫</span>':esc(word)}</div>
 </div>
 <div class="card-content">
   <div class="meta"><span>${esc(item.label)}</span><span>${p}</span></div>
   <div class="note ${item.note?"":"empty"}">${note}</div>
   <div class="card-actions">
     <a class="open" href="${esc(item.url)}" target="_blank" rel="noopener">Open original ↗</a>
     <button class="seen ${seen.has(item.url)?"is-seen":""}" aria-label="Mark as seen">${seen.has(item.url)?"✓":"○"}</button>
   </div>
 </div>`;
 el.querySelector(".open").addEventListener("click",()=>markSeen(item.url));
 el.querySelector(".seen").addEventListener("click",()=>{markSeen(item.url);render()});
 return el;
}
function markSeen(url){seen.add(url);localStorage.setItem("seenLinks",JSON.stringify([...seen]));updateStats();showToast("Marked as explored")}
function updateStats(){document.getElementById("total").textContent=allItems.length;document.getElementById("explored").textContent=Math.round(seen.size/allItems.length*100)+"%"}
function render(){
 feed.innerHTML="";
 let list=allItems.filter(x=>(active==="all"||x.section===active)&&(!query||JSON.stringify(x).toLowerCase().includes(query.toLowerCase())));
 if(!list.length){feed.innerHTML='<div class="empty-state">Nothing saved here yet.</div>';return}
 list.forEach((x,i)=>feed.appendChild(card(x,i)));
}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");active=btn.dataset.filter;render()}));
document.getElementById("search").addEventListener("input",e=>{query=e.target.value;render()});
const theme=document.getElementById("theme");
theme.addEventListener("click",()=>{const dark=document.documentElement.dataset.theme==="dark";document.documentElement.dataset.theme=dark?"":"dark";localStorage.setItem("theme",dark?"light":"dark")});
if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark";
document.getElementById("laterLink").href=COLLECTION.sendLater.url;
function showToast(t){const el=document.getElementById("toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1200)}
updateStats();render();
