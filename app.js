const platformOf=url=>url.includes("tiktok")?"TikTok":url.includes("instagram")?"Instagram":url.includes("x.com")?"X":url.includes("facebook")?"Marketplace":url.includes("spotify")?"Spotify":"Link";
const slug=url=>{try{let u=new URL(url);return u.pathname.split("/").filter(Boolean).pop()||"saved";}catch{return"saved"}};
const previewText=(platform,i)=>({TikTok:["something I wanted you to see","for you, obviously","saved this for us","this felt very you","a little thought"],Instagram:["a little mood","saved for you ♡","this one","you'll get it","love this"],X:["internet found treasure","you need to see this","this made me think of you"],Marketplace:["maybe this one?","for our place?","look at this","found this"],Spotify:["listen to this","this song ♡","for the drive home","made me cry","press play"]}[platform]||["saved for you"])[i%5];

const sections=[
 {id:"tiktoks",title:"TikToks",items:COLLECTION.tiktoks,kind:"rail"},
 {id:"whenMissed",title:"When I Missed You",items:COLLECTION.whenMissed,kind:"rail"},
 {id:"moodBoard",title:"Mood Board",items:COLLECTION.moodBoard,kind:"masonry"},
 {id:"marketplace",title:"Marketplace",items:COLLECTION.marketplace,kind:"rail market"},
 {id:"music",title:"Music",items:COLLECTION.music,kind:"rail music"}
];
const sectionsEl=document.querySelector("#sections");
let seen=new Set(JSON.parse(localStorage.getItem("seenLinks")||"[]"));
function card(item,i,section){
 const p=platformOf(item.url), note=item.note||"";
 const el=document.createElement("article"); el.className="card"; el.dataset.url=item.url;
 const isMusic=p==="Spotify";
 el.innerHTML=`<div class="preview ${isMusic?"spotify-art":""}">
   <span class="platform">${p}</span><span class="number">${i+1}</span>
   <div class="preview-word">${previewText(p,i)}</div>
 </div>
 <div class="card-body">${note?`<div class="note">“${note}”</div>`:`<div class="note">${section.id==="moodBoard"?"saved image / post":section.id==="marketplace"?"saved marketplace find":isMusic?"saved song":"saved for you"}</div>`}
 <a class="open" href="${item.url}" target="_blank" rel="noopener">Open on ${p} ↗</a></div>`;
 el.querySelector(".open").addEventListener("click",()=>{seen.add(item.url);localStorage.setItem("seenLinks",JSON.stringify([...seen]));updateProgress()});
 return el;
}
sections.forEach(s=>{
 const sec=document.createElement("section");sec.id=s.id;sec.className="section "+(s.kind.includes("masonry")?"":"");
 sec.innerHTML=`<div class="section-head"><div><h2>${s.title}<span class="count">${s.items.length} saved</span></h2></div><button class="view-all">View all</button></div><div class="${s.kind}"></div>`;
 const rail=sec.querySelector(".rail,.masonry");s.items.forEach((it,i)=>rail.appendChild(card(it,i,s)));
 sec.querySelector(".view-all").onclick=()=>{rail.classList.toggle("expanded");if(rail.classList.contains("expanded")){rail.style.gridAutoFlow="row";rail.style.gridTemplateColumns="repeat(auto-fit,minmax(190px,1fr))";rail.style.overflow="visible";}};
 sectionsEl.appendChild(sec);
});
document.querySelector("#laterLink").href=COLLECTION.sendLater.url;
function updateProgress(){let all=sections.flatMap(s=>s.items);let pct=Math.round(seen.size/all.length*100);document.querySelector("#progressBar").style.width=pct+"%";document.querySelector("#progressText").textContent=`${pct}% explored`;}
document.querySelectorAll(".nav button").forEach(b=>b.onclick=()=>{document.getElementById(b.dataset.target).scrollIntoView({behavior:"smooth"});document.querySelectorAll(".nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.target===e.target.id))}}),{rootMargin:"-30% 0px -60% 0px"});
sections.forEach(s=>obs.observe(document.getElementById(s.id)));
updateProgress();