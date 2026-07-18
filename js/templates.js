/**
 * templates.js — 25 section type definitions
 */
const SectionRegistry = {};
function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function uid(p) { return (p||'id') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,7); }
function registerSection(def) { SectionRegistry[def.meta.type] = def; }

/* ── Hero ── */
registerSection({meta:{type:'hero',name:'Hero',icon:'🖼️',category:'Sections'},
defaultData:()=>({type:'hero',id:uid('sec'),visible:true,heading:'Build Beautiful Websites Without Code',subheading:'Drag, drop, and customize. Export to Blogger, Cloudflare Pages, GitHub Pages, or any host.',buttonText:'Get Started',buttonLink:'#contact',bgColor:'#0f172a',textColor:'#ffffff',align:'center',bgImage:'',padding:96,animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'textarea'},{key:'buttonText',label:'Button Text',type:'text'},{key:'buttonLink',label:'Button Link',type:'text'},{key:'bgImage',label:'Background Image',type:'image'},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'align',label:'Alignment',type:'select',options:['left','center','right']},{key:'padding',label:'Vertical Padding (px)',type:'number',min:24,max:240},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const bg=d.bgImage?`background-image:linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)),url('${escapeHtml(d.bgImage)}');background-size:cover;background-position:center;`:`background-color:${escapeHtml(d.bgColor)};`;return`<section id="${d.id}" class="wb-section wb-hero wb-align-${d.align}" style="${bg}color:${escapeHtml(d.textColor)};padding-top:${d.padding}px;padding-bottom:${d.padding}px;"><div class="wb-container wb-hero-inner"><h1 class="wb-hero-heading">${escapeHtml(d.heading)}</h1><p class="wb-hero-subheading">${escapeHtml(d.subheading)}</p><a href="${escapeHtml(d.buttonLink)}" class="wb-btn wb-btn-primary">${escapeHtml(d.buttonText)}</a></div></section>`.trim();}
});

/* ── About ── */
registerSection({meta:{type:'about',name:'About',icon:'📄',category:'Sections'},
defaultData:()=>({type:'about',id:uid('sec'),visible:true,eyebrow:'About Us',heading:'We Build Things That Matter',body:'Our team combines design and engineering to ship websites that load fast, look sharp, and convert visitors into customers.',image:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=60',imagePosition:'right',bgColor:'#ffffff',textColor:'#0f172a',animation:Animations.defaultData()}),
fields:[{key:'eyebrow',label:'Eyebrow Text',type:'text'},{key:'heading',label:'Heading',type:'text'},{key:'body',label:'Body Text',type:'textarea'},{key:'image',label:'Image',type:'image'},{key:'imagePosition',label:'Image Position',type:'select',options:['left','right']},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const rev=d.imagePosition==='left'?' wb-reverse':'';return`<section id="${d.id}" class="wb-section wb-about" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};"><div class="wb-container wb-about-grid${rev}"><div class="wb-about-image"><img src="${escapeHtml(d.image)}" alt="${escapeHtml(d.heading)}" loading="lazy"></div><div class="wb-about-text"><span class="wb-eyebrow">${escapeHtml(d.eyebrow)}</span><h2>${escapeHtml(d.heading)}</h2><p>${escapeHtml(d.body)}</p></div></div></section>`.trim();}
});

/* ── Services ── */
registerSection({meta:{type:'services',name:'Services',icon:'🛠️',category:'Sections'},
defaultData:()=>({type:'services',id:uid('sec'),visible:true,heading:'What We Offer',subheading:'Everything you need, nothing you don\u2019t.',bgColor:'#f8fafc',textColor:'#0f172a',cardColor:'#ffffff',items:[{id:uid('item'),icon:'\u26a1',title:'Fast Delivery',text:'Launch in days, not months.'},{id:uid('item'),icon:'\ud83c\udfa8',title:'Custom Design',text:'Tailored to your brand.'},{id:uid('item'),icon:'\ud83d\udd12',title:'Reliable & Secure',text:'Built on solid foundations.'}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'cardColor',label:'Card Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Service Cards',type:'list',itemFields:[{key:'icon',label:'Icon (emoji)',type:'text'},{key:'title',label:'Title',type:'text'},{key:'text',label:'Description',type:'textarea'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const cards=d.items.map(it=>`<div class="wb-card" style="background-color:${escapeHtml(d.cardColor)};"><div class="wb-card-icon">${escapeHtml(it.icon)}</div><h3>${escapeHtml(it.title)}</h3><p>${escapeHtml(it.text)}</p></div>`).join('');return`<section id="${d.id}" class="wb-section wb-services" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container"><div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2><p>${escapeHtml(d.subheading)}</p></div><div class="wb-grid wb-grid-3">${cards}</div></div></section>`.trim();}
});

/* ── Pricing ── */
registerSection({meta:{type:'pricing',name:'Pricing',icon:'💰',category:'Sections'},
defaultData:()=>({type:'pricing',id:uid('sec'),visible:true,heading:'Simple, Affordable Plans',subheading:'Choose the plan that fits your business.',bgColor:'#ffffff',textColor:'#0f172a',cardColor:'#f8fafc',accentColor:'#2563eb',items:[{id:uid('item'),name:'Starter',price:'\u20b933/day',period:'billed monthly',features:'Single page\nMobile responsive\nFree SSL',highlighted:false,buttonText:'Get Started'},{id:uid('item'),name:'Business',price:'\u20b999/day',period:'billed monthly',features:'Up to 5 pages\nCustom design\nContact form\nPriority support',highlighted:true,buttonText:'Most Popular'},{id:uid('item'),name:'Pro',price:'\u20b9199/day',period:'billed monthly',features:'Unlimited pages\nAdvanced SEO\nMonthly updates\nDedicated support',highlighted:false,buttonText:'Go Pro'}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'cardColor',label:'Card Color',type:'color'},{key:'accentColor',label:'Accent Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Pricing Plans',type:'list',itemFields:[{key:'name',label:'Plan Name',type:'text'},{key:'price',label:'Price',type:'text'},{key:'period',label:'Billing Period',type:'text'},{key:'features',label:'Features (one per line)',type:'textarea'},{key:'buttonText',label:'Button Text',type:'text'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const cards=d.items.map(it=>{const feats=String(it.features||'').split('\n').filter(Boolean).map(f=>`<li>${escapeHtml(f)}</li>`).join('');const hi=it.highlighted?` wb-pricing-highlight`:'';return`<div class="wb-pricing-card${hi}" style="background-color:${escapeHtml(d.cardColor)};${it.highlighted?`border-color:${escapeHtml(d.accentColor)};`:''}"><h3>${escapeHtml(it.name)}</h3><div class="wb-pricing-price" style="color:${escapeHtml(d.accentColor)};">${escapeHtml(it.price)}</div><div class="wb-pricing-period">${escapeHtml(it.period)}</div><ul class="wb-pricing-features">${feats}</ul><a href="#contact" class="wb-btn wb-btn-primary" style="background-color:${escapeHtml(d.accentColor)};width:100%;text-align:center;display:block;">${escapeHtml(it.buttonText)}</a></div>`;}).join('');return`<section id="${d.id}" class="wb-section wb-pricing" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container"><div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2><p>${escapeHtml(d.subheading)}</p></div><div class="wb-grid wb-grid-3 wb-pricing-grid">${cards}</div></div></section>`.trim();}
});

/* ── Team ── */
registerSection({meta:{type:'team',name:'Team',icon:'👥',category:'Sections'},
defaultData:()=>({type:'team',id:uid('sec'),visible:true,heading:'Meet The Team',subheading:'The people behind the work.',bgColor:'#f8fafc',textColor:'#0f172a',items:[{id:uid('item'),name:'Anjali Verma',role:'Founder & CEO',photo:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=60',linkedin:'',twitter:''},{id:uid('item'),name:'Karan Singh',role:'Lead Developer',photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=60',linkedin:'',twitter:''}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Team Members',type:'list',itemFields:[{key:'name',label:'Name',type:'text'},{key:'role',label:'Role',type:'text'},{key:'photo',label:'Photo',type:'image'},{key:'linkedin',label:'LinkedIn URL',type:'text'},{key:'twitter',label:'Twitter URL',type:'text'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const cards=d.items.map(it=>`<div class="wb-team-card"><img src="${escapeHtml(it.photo)}" alt="${escapeHtml(it.name)}" class="wb-team-photo" loading="lazy"><h3>${escapeHtml(it.name)}</h3><p class="wb-team-role">${escapeHtml(it.role)}</p></div>`).join('');return`<section id="${d.id}" class="wb-section wb-team" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container"><div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2><p>${escapeHtml(d.subheading)}</p></div><div class="wb-grid wb-grid-3">${cards}</div></div></section>`.trim();}
});

/* ── Testimonials ── */
registerSection({meta:{type:'testimonials',name:'Testimonials',icon:'💬',category:'Sections'},
defaultData:()=>({type:'testimonials',id:uid('sec'),visible:true,heading:'What Clients Say',bgColor:'#0f172a',textColor:'#ffffff',cardColor:'#1e293b',items:[{id:uid('item'),name:'Priya Sharma',role:'Owner, Sharma Boutique',quote:'Our new site paid for itself in the first week.',avatar:''},{id:uid('item'),name:'Rohit Mehta',role:'Founder, Mehta Foods',quote:'Fast, professional, and exactly what a small business needs.',avatar:''}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'cardColor',label:'Card Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Testimonials',type:'list',itemFields:[{key:'name',label:'Name',type:'text'},{key:'role',label:'Role / Company',type:'text'},{key:'quote',label:'Quote',type:'textarea'},{key:'avatar',label:'Avatar Image',type:'image'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const cards=d.items.map(it=>`<div class="wb-testimonial" style="background-color:${escapeHtml(d.cardColor)};"><p class="wb-quote">\u201C${escapeHtml(it.quote)}\u201D</p><div class="wb-testimonial-author">${it.avatar?`<img src="${escapeHtml(it.avatar)}" alt="${escapeHtml(it.name)}" class="wb-avatar">`:`<div class="wb-avatar wb-avatar-placeholder">${escapeHtml((it.name||'?').charAt(0))}</div>`}<div><strong>${escapeHtml(it.name)}</strong><span>${escapeHtml(it.role)}</span></div></div></div>`).join('');return`<section id="${d.id}" class="wb-section wb-testimonials" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container"><div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2></div><div class="wb-grid wb-grid-2">${cards}</div></div></section>`.trim();}
});

/* ── FAQ ── */
registerSection({meta:{type:'faq',name:'FAQ',icon:'❓',category:'Sections'},
defaultData:()=>({type:'faq',id:uid('sec'),visible:true,heading:'Frequently Asked Questions',bgColor:'#ffffff',textColor:'#0f172a',items:[{id:uid('item'),question:'How long does it take to launch?',answer:'Most sites are live within 3-5 business days.'},{id:uid('item'),question:'Do I need to know how to code?',answer:'No. We handle the build entirely.'}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Questions',type:'list',itemFields:[{key:'question',label:'Question',type:'text'},{key:'answer',label:'Answer',type:'textarea'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const items=d.items.map((it,i)=>`<details class="wb-faq-item"${i===0?' open':''}><summary class="wb-faq-question">${escapeHtml(it.question)}</summary><div class="wb-faq-answer">${escapeHtml(it.answer)}</div></details>`).join('');return`<section id="${d.id}" class="wb-section wb-faq" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container wb-faq-container"><div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2></div><div class="wb-faq-list">${items}</div></div></section>`.trim();}
});

/* ── Gallery ── */
registerSection({meta:{type:'gallery',name:'Gallery',icon:'🖼️',category:'Sections'},
defaultData:()=>({type:'gallery',id:uid('sec'),visible:true,heading:'Our Work',bgColor:'#f8fafc',textColor:'#0f172a',layout:'grid',items:[{id:uid('item'),image:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=60',caption:'Project One'},{id:uid('item'),image:'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=60',caption:'Project Two'},{id:uid('item'),image:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=60',caption:'Project Three'},{id:uid('item'),image:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=60',caption:'Project Four'}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'layout',label:'Layout',type:'select',options:['grid','masonry']},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Images',type:'list',itemFields:[{key:'image',label:'Image',type:'image'},{key:'caption',label:'Caption',type:'text'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const items=d.items.map((it,idx)=>{const lid=`${d.id}_lb${idx}`;return`<a href="#${lid}" class="wb-gallery-item"><img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.caption)}" loading="lazy">${it.caption?`<span class="wb-gallery-caption">${escapeHtml(it.caption)}</span>`:''}</a><div id="${lid}" class="wb-lightbox"><a href="#" class="wb-lightbox-close">&times;</a><img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.caption)}"></div>`;}).join('');return`<section id="${d.id}" class="wb-section wb-gallery" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container"><div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2></div><div class="wb-gallery-grid wb-gallery-${d.layout}">${items}</div></div></section>`.trim();}
});

/* ── Slider ── */
registerSection({meta:{type:'slider',name:'Slider',icon:'🎠',category:'Sections'},
defaultData:()=>({type:'slider',id:uid('sec'),visible:true,autoplay:true,autoplaySpeed:5000,showArrows:true,showDots:true,height:480,items:[{id:uid('item'),image:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=70',heading:'Grow Your Business Online',text:'Affordable, professional websites built for you.',buttonText:'Get Started',buttonLink:'#contact'},{id:uid('item'),image:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=70',heading:'Designed To Convert',text:'Every page built to turn visitors into customers.',buttonText:'See Our Work',buttonLink:'#gallery'}],animation:Animations.defaultData()}),
fields:[{key:'autoplay',label:'Autoplay',type:'toggle'},{key:'autoplaySpeed',label:'Autoplay Speed (ms)',type:'number',min:1500,max:15000},{key:'showArrows',label:'Show Arrows',type:'toggle'},{key:'showDots',label:'Show Dots',type:'toggle'},{key:'height',label:'Height (px)',type:'number',min:240,max:800},{key:'items',label:'Slides',type:'list',itemFields:[{key:'image',label:'Background Image',type:'image'},{key:'heading',label:'Heading',type:'text'},{key:'text',label:'Text',type:'textarea'},{key:'buttonText',label:'Button Text',type:'text'},{key:'buttonLink',label:'Button Link',type:'text'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const slides=d.items.map(it=>`<div class="wb-slide" style="background-image:linear-gradient(rgba(0,0,0,.4),rgba(0,0,0,.4)),url('${escapeHtml(it.image)}');"><div class="wb-slide-inner"><h2>${escapeHtml(it.heading)}</h2><p>${escapeHtml(it.text)}</p>${it.buttonText?`<a href="${escapeHtml(it.buttonLink)}" class="wb-btn wb-btn-primary">${escapeHtml(it.buttonText)}</a>`:''}</div></div>`).join('');const dots=d.items.map((it,i)=>`<button class="wb-slider-dot${i===0?' active':''}" data-slide-index="${i}" aria-label="Slide ${i+1}"></button>`).join('');return`<section id="${d.id}" class="wb-section wb-slider-section"><div class="wb-slider" id="${d.id}_slider" style="height:${d.height}px;" data-autoplay="${d.autoplay}" data-autoplay-speed="${d.autoplaySpeed}"><div class="wb-slider-track">${slides}</div>${d.showArrows?`<button class="wb-slider-arrow wb-slider-prev" aria-label="Previous">&#8249;</button><button class="wb-slider-arrow wb-slider-next" aria-label="Next">&#8250;</button>`:''} ${d.showDots?`<div class="wb-slider-dots">${dots}</div>`:''}</div><script>(function(){var r=document.getElementById('${d.id}_slider');if(!r)return;var track=r.querySelector('.wb-slider-track'),slides=r.querySelectorAll('.wb-slide'),dotsEls=r.querySelectorAll('.wb-slider-dot'),total=slides.length,current=0,timer=null;function goTo(i){current=(i+total)%total;track.style.transform='translateX(-'+(current*100)+'%)';dotsEls.forEach(function(d,j){d.classList.toggle('active',j===current);});}function next(){goTo(current+1);}function prev(){goTo(current-1);}function startAuto(){if(r.dataset.autoplay!=='true')return;stopAuto();timer=setInterval(next,parseInt(r.dataset.autoplaySpeed,10)||5000);}function stopAuto(){if(timer)clearInterval(timer);timer=null;}var nb=r.querySelector('.wb-slider-next'),pb=r.querySelector('.wb-slider-prev');if(nb)nb.addEventListener('click',function(){next();startAuto();});if(pb)pb.addEventListener('click',function(){prev();startAuto();});dotsEls.forEach(function(dot){dot.addEventListener('click',function(){goTo(parseInt(dot.dataset.slideIndex,10));startAuto();});});r.addEventListener('mouseenter',stopAuto);r.addEventListener('mouseleave',startAuto);var tsx=0,tdx=0;r.addEventListener('touchstart',function(e){tsx=e.touches[0].clientX;tdx=0;stopAuto();},{passive:true});r.addEventListener('touchmove',function(e){tdx=e.touches[0].clientX-tsx;},{passive:true});r.addEventListener('touchend',function(){if(tdx>50)prev();else if(tdx<-50)next();startAuto();});goTo(0);startAuto();})();<\/script></section>`.trim();}
});

/* ── Video ── */
registerSection({meta:{type:'video',name:'Video',icon:'🎬',category:'Sections'},
defaultData:()=>({type:'video',id:uid('sec'),visible:true,heading:'Watch Our Story',subheading:'',bgColor:'#0f172a',textColor:'#ffffff',source:'youtube',videoId:'dQw4w9WgXcQ',mp4Url:'',animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'text'},{key:'source',label:'Video Source',type:'select',options:['youtube','vimeo','mp4']},{key:'videoId',label:'YouTube/Vimeo ID',type:'text'},{key:'mp4Url',label:'Local MP4 URL',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'}],
render(d){let embed;if(d.source==='youtube')embed=`<iframe src="https://www.youtube.com/embed/${escapeHtml(d.videoId)}" loading="lazy" allowfullscreen></iframe>`;else if(d.source==='vimeo')embed=`<iframe src="https://player.vimeo.com/video/${escapeHtml(d.videoId)}" loading="lazy" allowfullscreen></iframe>`;else embed=`<video controls src="${escapeHtml(d.mp4Url)}"></video>`;return`<section id="${d.id}" class="wb-section wb-video" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container"><div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2>${d.subheading?`<p>${escapeHtml(d.subheading)}</p>`:''}</div><div class="wb-video-frame">${embed}</div></div></section>`.trim();}
});

/* ── Blog ── */
registerSection({meta:{type:'blog',name:'Blog',icon:'📰',category:'Sections'},
defaultData:()=>({type:'blog',id:uid('sec'),visible:true,heading:'Latest Updates',subheading:'',bgColor:'#ffffff',textColor:'#0f172a',items:[{id:uid('item'),title:'5 Tips to Get More Customers Online',excerpt:'Simple steps every small business can take this month.',image:'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=500&q=60',date:'Jan 12, 2026',link:'#'},{id:uid('item'),title:'Why Your Business Needs a Website',excerpt:'The numbers behind why customers expect to find you online first.',image:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=60',date:'Jan 5, 2026',link:'#'}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Posts',type:'list',itemFields:[{key:'title',label:'Title',type:'text'},{key:'excerpt',label:'Excerpt',type:'textarea'},{key:'image',label:'Image',type:'image'},{key:'date',label:'Date',type:'text'},{key:'link',label:'Link',type:'text'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const cards=d.items.map(it=>`<a href="${escapeHtml(it.link)}" class="wb-blog-card"><img src="${escapeHtml(it.image)}" alt="${escapeHtml(it.title)}" loading="lazy"><div class="wb-blog-body"><span class="wb-blog-date">${escapeHtml(it.date)}</span><h3>${escapeHtml(it.title)}</h3><p>${escapeHtml(it.excerpt)}</p></div></a>`).join('');return`<section id="${d.id}" class="wb-section wb-blog" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container"><div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2>${d.subheading?`<p>${escapeHtml(d.subheading)}</p>`:''}</div><div class="wb-grid wb-grid-3">${cards}</div></div></section>`.trim();}
});

/* ── Statistics ── */
registerSection({meta:{type:'statistics',name:'Statistics',icon:'📈',category:'Sections'},
defaultData:()=>({type:'statistics',id:uid('sec'),visible:true,heading:'By The Numbers',bgColor:'#f8fafc',textColor:'#0f172a',accentColor:'#2563eb',items:[{id:uid('item'),number:'500+',label:'Projects Delivered'},{id:uid('item'),number:'98%',label:'Client Satisfaction'},{id:uid('item'),number:'\u20b933/day',label:'Starting Price'},{id:uid('item'),number:'48hrs',label:'Average Launch'}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'accentColor',label:'Number Color',type:'color'},{key:'textColor',label:'Label Color',type:'color'},{key:'items',label:'Statistics',type:'list',itemFields:[{key:'number',label:'Number / Value',type:'text'},{key:'label',label:'Label',type:'text'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const stats=d.items.map(it=>`<div class="wb-stat-item"><div class="wb-stat-number" style="color:${escapeHtml(d.accentColor)};">${escapeHtml(it.number)}</div><div class="wb-stat-label">${escapeHtml(it.label)}</div></div>`).join('');return`<section id="${d.id}" class="wb-section wb-statistics" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:72px 0;"><div class="wb-container">${d.heading?`<div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2></div>`:''}<div class="wb-stats-grid">${stats}</div></div></section>`.trim();}
});

/* ── Clients ── */
registerSection({meta:{type:'clients',name:'Clients / Logos',icon:'🏢',category:'Sections'},
defaultData:()=>({type:'clients',id:uid('sec'),visible:true,heading:'Trusted By',bgColor:'#ffffff',textColor:'#0f172a',autoplay:true,items:[{id:uid('item'),logo:'',name:'Sharma Boutique'},{id:uid('item'),logo:'',name:'Mehta Foods'},{id:uid('item'),logo:'',name:'Patel Motors'},{id:uid('item'),logo:'',name:'Verma Designs'}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'autoplay',label:'Auto-scroll',type:'toggle'},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Logos',type:'list',itemFields:[{key:'logo',label:'Logo Image',type:'image'},{key:'name',label:'Name (fallback)',type:'text'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const logos=d.items.map(it=>`<div class="wb-client-logo">${it.logo?`<img src="${escapeHtml(it.logo)}" alt="${escapeHtml(it.name)}" loading="lazy">`:`<span>${escapeHtml(it.name)}</span>`}</div>`).join('');const tc=d.autoplay?' wb-clients-autoplay':'';return`<section id="${d.id}" class="wb-section wb-clients" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:60px 0;"><div class="wb-container"><div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2></div><div class="wb-clients-track${tc}">${logos}${d.autoplay?logos:''}</div></div></section>`.trim();}
});

/* ── Google Map ── */
registerSection({meta:{type:'map',name:'Google Map',icon:'📍',category:'Sections'},
defaultData:()=>({type:'map',id:uid('sec'),visible:true,heading:'Find Us',subheading:'',embedUrl:'https://www.google.com/maps?q=Mumbai,India&output=embed',height:420,bgColor:'#ffffff',textColor:'#0f172a',animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'text'},{key:'embedUrl',label:'Google Maps Embed URL',type:'text'},{key:'height',label:'Map Height (px)',type:'number',min:200,max:800},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'}],
render(d){return`<section id="${d.id}" class="wb-section wb-map-section" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:64px 0 0;">${d.heading?`<div class="wb-container"><div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2>${d.subheading?`<p>${escapeHtml(d.subheading)}</p>`:''}</div></div>`:''}<div class="wb-map-embed" style="height:${d.height}px;"><iframe src="${escapeHtml(d.embedUrl)}" width="100%" height="100%" style="border:0;display:block;" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div></section>`.trim();}
});

/* ── CTA ── */
registerSection({meta:{type:'cta',name:'Call to Action',icon:'📣',category:'Sections'},
defaultData:()=>({type:'cta',id:uid('sec'),visible:true,heading:'Ready to Get Your Website Online?',subheading:'Affordable plans starting at just \u20b933/day.',buttonText:'Contact Us Today',buttonLink:'#contact',bgColor:'#2563eb',textColor:'#ffffff',animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'text'},{key:'buttonText',label:'Button Text',type:'text'},{key:'buttonLink',label:'Button Link',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'}],
render(d){return`<section id="${d.id}" class="wb-section wb-cta" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container wb-cta-inner"><h2>${escapeHtml(d.heading)}</h2><p>${escapeHtml(d.subheading)}</p><a href="${escapeHtml(d.buttonLink)}" class="wb-btn wb-btn-light">${escapeHtml(d.buttonText)}</a></div></section>`.trim();}
});

/* ── Contact ── */
registerSection({meta:{type:'contact',name:'Contact',icon:'✉️',category:'Sections'},
defaultData:()=>({type:'contact',id:uid('sec'),visible:true,heading:'Get In Touch',subheading:'We usually reply within a few hours.',bgColor:'#f8fafc',textColor:'#0f172a',accentColor:'#2563eb',phone:'+91 98765 43210',email:'hello@yourcompany.com',address:'Mumbai, Maharashtra, India',whatsapp:'919876543210',formAction:'',showMap:false,mapEmbedUrl:'https://www.google.com/maps?q=Mumbai,India&output=embed',animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'text'},{key:'phone',label:'Phone',type:'text'},{key:'email',label:'Email',type:'text'},{key:'address',label:'Address',type:'text'},{key:'whatsapp',label:'WhatsApp Number (digits only)',type:'text'},{key:'formAction',label:'Form Submit URL (Formspree etc.)',type:'text'},{key:'showMap',label:'Show Google Map',type:'toggle'},{key:'mapEmbedUrl',label:'Google Maps Embed URL',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'accentColor',label:'Accent Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const fa=d.formAction?` action="${escapeHtml(d.formAction)}" method="POST"`:'';return`<section id="${d.id}" class="wb-section wb-contact" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container wb-contact-grid"><div class="wb-contact-info"><h2>${escapeHtml(d.heading)}</h2><p>${escapeHtml(d.subheading)}</p><ul class="wb-contact-list"><li>&#9990; ${escapeHtml(d.phone)}</li><li>&#9993; ${escapeHtml(d.email)}</li><li>&#8962; ${escapeHtml(d.address)}</li></ul>${d.whatsapp?`<a href="https://wa.me/${escapeHtml(d.whatsapp.replace(/[^0-9]/g,''))}" class="wb-btn wb-btn-primary" style="background-color:${escapeHtml(d.accentColor)};" target="_blank" rel="noopener">Chat on WhatsApp</a>`:''} ${d.showMap&&d.mapEmbedUrl?`<div class="wb-map-frame"><iframe src="${escapeHtml(d.mapEmbedUrl)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`:''}</div><form class="wb-contact-form"${fa}><input type="text" name="name" placeholder="Your Name" required><input type="email" name="email" placeholder="Your Email" required><input type="tel" name="phone" placeholder="Your Phone"><textarea name="message" placeholder="Your Message" rows="5" required></textarea><button type="submit" class="wb-btn wb-btn-primary" style="background-color:${escapeHtml(d.accentColor)};">Send Message</button></form></div></section>`.trim();}
});

/* ── Newsletter ── */
registerSection({meta:{type:'newsletter',name:'Newsletter',icon:'📧',category:'Sections'},
defaultData:()=>({type:'newsletter',id:uid('sec'),visible:true,heading:'Stay In The Loop',subheading:'No spam, ever.',buttonText:'Subscribe',bgColor:'#2563eb',textColor:'#ffffff',formAction:'',animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'text'},{key:'buttonText',label:'Button Text',type:'text'},{key:'formAction',label:'Form Submit URL',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const fa=d.formAction?` action="${escapeHtml(d.formAction)}" method="POST"`:'';return`<section id="${d.id}" class="wb-section wb-newsletter" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:64px 0;"><div class="wb-container wb-newsletter-inner"><h2>${escapeHtml(d.heading)}</h2><p>${escapeHtml(d.subheading)}</p><form class="wb-newsletter-form"${fa}><input type="email" name="email" placeholder="Enter your email" required><button type="submit" class="wb-btn wb-btn-light">${escapeHtml(d.buttonText)}</button></form></div></section>`.trim();}
});

/* ── Footer ── */
registerSection({meta:{type:'footer',name:'Footer',icon:'⬛',category:'Sections'},
defaultData:()=>({type:'footer',id:uid('sec'),visible:true,companyName:'Your Company',tagline:'Affordable websites for small businesses across India.',phone:'+91 98765 43210',email:'hello@yourcompany.com',address:'Mumbai, Maharashtra, India',facebook:'',instagram:'',twitter:'',linkedin:'',youtube:'',whatsapp:'',bgColor:'#0f172a',textColor:'#cbd5e1',year:new Date().getFullYear(),animation:Animations.defaultData()}),
fields:[{key:'companyName',label:'Company Name',type:'text'},{key:'tagline',label:'Tagline',type:'text'},{key:'phone',label:'Phone',type:'text'},{key:'email',label:'Email',type:'text'},{key:'address',label:'Address',type:'text'},{key:'facebook',label:'Facebook URL',type:'text'},{key:'instagram',label:'Instagram URL',type:'text'},{key:'twitter',label:'Twitter/X URL',type:'text'},{key:'linkedin',label:'LinkedIn URL',type:'text'},{key:'youtube',label:'YouTube URL',type:'text'},{key:'whatsapp',label:'WhatsApp Number',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const socials=[['facebook',d.facebook,'F'],['instagram',d.instagram,'I'],['twitter',d.twitter,'X'],['linkedin',d.linkedin,'in'],['youtube',d.youtube,'Y']].filter(s=>s[1]).map(s=>`<a href="${escapeHtml(s[1])}" class="wb-social-link" target="_blank" rel="noopener" aria-label="${s[2]}">${s[2]}</a>`).join('');const wa=d.whatsapp?`<a href="https://wa.me/${escapeHtml(d.whatsapp.replace(/[^0-9]/g,''))}" class="wb-social-link" target="_blank" rel="noopener" aria-label="WhatsApp">W</a>`:'';return`<footer id="${d.id}" class="wb-section wb-footer" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:64px 0 0;"><div class="wb-container wb-footer-grid"><div><h3 class="wb-footer-brand">${escapeHtml(d.companyName)}</h3><p>${escapeHtml(d.tagline)}</p><div class="wb-social-row">${socials}${wa}</div></div><div class="wb-footer-contact"><p>${escapeHtml(d.phone)}</p><p>${escapeHtml(d.email)}</p><p>${escapeHtml(d.address)}</p></div></div><div class="wb-footer-bottom">&copy; ${d.year} ${escapeHtml(d.companyName)}. All rights reserved.</div></footer>`.trim();}
});

/* ── Accordion ── */
registerSection({meta:{type:'accordion',name:'Accordion',icon:'📁',category:'Components'},
defaultData:()=>({type:'accordion',id:uid('sec'),visible:true,heading:'More Information',bgColor:'#ffffff',textColor:'#0f172a',items:[{id:uid('item'),title:'What areas do you serve?',content:'We work with small businesses across India, fully remote.'},{id:uid('item'),title:'What is included in the price?',content:'Design, build, hosting setup, and one round of revisions.'}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Accordion Items',type:'list',itemFields:[{key:'title',label:'Title',type:'text'},{key:'content',label:'Content',type:'textarea'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const items=d.items.map((it,i)=>`<details class="wb-faq-item"${i===0?' open':''}><summary class="wb-faq-question">${escapeHtml(it.title)}</summary><div class="wb-faq-answer">${escapeHtml(it.content)}</div></details>`).join('');return`<section id="${d.id}" class="wb-section wb-faq" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container wb-faq-container">${d.heading?`<div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2></div>`:''}<div class="wb-faq-list">${items}</div></div></section>`.trim();}
});

/* ── Tabs ── */
registerSection({meta:{type:'tabs',name:'Tabs',icon:'📑',category:'Components'},
defaultData:()=>({type:'tabs',id:uid('sec'),visible:true,heading:'Why Choose Us',bgColor:'#f8fafc',textColor:'#0f172a',items:[{id:uid('item'),label:'Speed',content:'Most projects launch within a week of approval.'},{id:uid('item'),label:'Design',content:'Every site is custom-designed for your brand.'},{id:uid('item'),label:'Support',content:'Direct access to your developer, not a ticket queue.'}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Tabs',type:'list',itemFields:[{key:'label',label:'Tab Label',type:'text'},{key:'content',label:'Tab Content',type:'textarea'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const radios=d.items.map((it,i)=>`<input type="radio" name="${d.id}_tabs" id="${d.id}_tab${i}" class="wb-tabs-radio"${i===0?' checked':''}>`).join('');const labels=d.items.map((it,i)=>`<label for="${d.id}_tab${i}" class="wb-tabs-label">${escapeHtml(it.label)}</label>`).join('');const panels=d.items.map((it,i)=>`<div class="wb-tabs-panel" data-panel-index="${i}">${escapeHtml(it.content)}</div>`).join('');return`<section id="${d.id}" class="wb-section wb-tabs-section" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container">${d.heading?`<div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2></div>`:''}<div class="wb-tabs">${radios}<div class="wb-tabs-labels">${labels}</div><div class="wb-tabs-panels">${panels}</div></div></div></section>`.trim();}
});

/* ── Timeline ── */
registerSection({meta:{type:'timeline',name:'Timeline',icon:'📅',category:'Components'},
defaultData:()=>({type:'timeline',id:uid('sec'),visible:true,heading:'Our Journey',bgColor:'#ffffff',textColor:'#0f172a',accentColor:'#2563eb',items:[{id:uid('item'),date:'2022',title:'Founded',text:'Started with a simple promise: clean, fast websites.'},{id:uid('item'),date:'2023',title:'50 Clients',text:'Reached 50 small businesses online.'},{id:uid('item'),date:'2025',title:'Pan-India',text:'Now serving businesses nationwide.'}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'accentColor',label:'Accent Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Milestones',type:'list',itemFields:[{key:'date',label:'Date / Year',type:'text'},{key:'title',label:'Title',type:'text'},{key:'text',label:'Description',type:'textarea'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const items=d.items.map(it=>`<div class="wb-timeline-item"><div class="wb-timeline-dot" style="background-color:${escapeHtml(d.accentColor)};"></div><div class="wb-timeline-content"><span class="wb-timeline-date" style="color:${escapeHtml(d.accentColor)};">${escapeHtml(it.date)}</span><h3>${escapeHtml(it.title)}</h3><p>${escapeHtml(it.text)}</p></div></div>`).join('');return`<section id="${d.id}" class="wb-section wb-timeline-section" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container">${d.heading?`<div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2></div>`:''}<div class="wb-timeline">${items}</div></div></section>`.trim();}
});

/* ── Counters ── */
registerSection({meta:{type:'counters',name:'Counters',icon:'🔢',category:'Components'},
defaultData:()=>({type:'counters',id:uid('sec'),visible:true,bgColor:'#0f172a',textColor:'#ffffff',items:[{id:uid('item'),value:250,suffix:'+',label:'Websites Launched'},{id:uid('item'),value:98,suffix:'%',label:'Client Satisfaction'},{id:uid('item'),value:4,suffix:' days',label:'Average Launch Time'}],animation:Animations.defaultData()}),
fields:[{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Counters',type:'list',itemFields:[{key:'value',label:'Number',type:'text'},{key:'suffix',label:'Suffix',type:'text'},{key:'label',label:'Label',type:'text'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const items=d.items.map(it=>`<div class="wb-counter-item"><div class="wb-counter-number">${escapeHtml(String(it.value))}${escapeHtml(it.suffix)}</div><div class="wb-counter-label">${escapeHtml(it.label)}</div></div>`).join('');return`<section id="${d.id}" class="wb-section wb-counters-section" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:64px 0;"><div class="wb-container"><div class="wb-counters-grid">${items}</div></div></section>`.trim();}
});

/* ── Progress Bars ── */
registerSection({meta:{type:'progress',name:'Progress Bars',icon:'📊',category:'Components'},
defaultData:()=>({type:'progress',id:uid('sec'),visible:true,heading:'Our Skills',bgColor:'#ffffff',textColor:'#0f172a',barColor:'#2563eb',items:[{id:uid('item'),label:'Web Design',percent:95},{id:uid('item'),label:'Development',percent:90},{id:uid('item'),label:'SEO',percent:80}],animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'bgColor',label:'Background Color',type:'color'},{key:'barColor',label:'Bar Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Bars',type:'list',itemFields:[{key:'label',label:'Label',type:'text'},{key:'percent',label:'Percent (0-100)',type:'text'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const bars=d.items.map(it=>{const p=Math.max(0,Math.min(100,Number(it.percent)||0));return`<div class="wb-progress-item"><div class="wb-progress-label"><span>${escapeHtml(it.label)}</span><span>${p}%</span></div><div class="wb-progress-track"><div class="wb-progress-fill" style="width:${p}%;background-color:${escapeHtml(d.barColor)};"></div></div></div>`;}).join('');return`<section id="${d.id}" class="wb-section wb-progress-section" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:72px 0;"><div class="wb-container wb-progress-container">${d.heading?`<div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2></div>`:''} ${bars}</div></section>`.trim();}
});

/* ── Badges ── */
registerSection({meta:{type:'badges',name:'Badges',icon:'🏷️',category:'Components'},
defaultData:()=>({type:'badges',id:uid('sec'),visible:true,bgColor:'#ffffff',textColor:'#0f172a',items:[{id:uid('item'),text:'Mobile Friendly',color:'#2563eb'},{id:uid('item'),text:'SEO Ready',color:'#16a34a'},{id:uid('item'),text:'Fast Loading',color:'#f59e0b'},{id:uid('item'),text:'Secure (SSL)',color:'#7c3aed'}],animation:Animations.defaultData()}),
fields:[{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'items',label:'Badges',type:'list',itemFields:[{key:'text',label:'Text',type:'text'},{key:'color',label:'Badge Color',type:'color'}]},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const badges=d.items.map(it=>`<span class="wb-badge" style="background-color:${escapeHtml(it.color)}1a;color:${escapeHtml(it.color)};border-color:${escapeHtml(it.color)}40;">${escapeHtml(it.text)}</span>`).join('');return`<section id="${d.id}" class="wb-section wb-badges-section" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:40px 0;"><div class="wb-container wb-badges-row">${badges}</div></section>`.trim();}
});

/* ── Alert ── */
registerSection({meta:{type:'alert',name:'Alert Banner',icon:'⚠️',category:'Components'},
defaultData:()=>({type:'alert',id:uid('sec'),visible:true,style:'info',text:'Limited-time offer: get your website online this month at our launch price.',linkText:'Learn more',linkUrl:'#contact',dismissible:true,animation:Animations.defaultData()}),
fields:[{key:'style',label:'Style',type:'select',options:['info','success','warning','error']},{key:'text',label:'Message',type:'textarea'},{key:'linkText',label:'Link Text',type:'text'},{key:'linkUrl',label:'Link URL',type:'text'},{key:'dismissible',label:'Dismissible',type:'toggle'},{key:'visible',label:'Visible',type:'toggle'}],
render(d){const link=d.linkText?`<a href="${escapeHtml(d.linkUrl)}" class="wb-alert-link">${escapeHtml(d.linkText)} &#8594;</a>`:'';const dismiss=d.dismissible?`<input type="checkbox" id="${d.id}_dismiss" class="wb-alert-dismiss-toggle"><label for="${d.id}_dismiss" class="wb-alert-close" aria-label="Dismiss">&times;</label>`:'';return`<section id="${d.id}" class="wb-section wb-alert wb-alert-${d.style}">${dismiss}<div class="wb-container wb-alert-inner"><span class="wb-alert-text">${escapeHtml(d.text)}</span>${link}</div></section>`.trim();}
});

/* ── Collection Grid (renders items from a Collections-mode collection) ── */
registerSection({meta:{type:'collection-grid',name:'Collection Grid',icon:'🗂️',category:'Sections'},
defaultData:()=>({type:'collection-grid',id:uid('sec'),visible:true,heading:'Our Products',subheading:'',collectionId:'',columns:3,bgColor:'#ffffff',textColor:'#0f172a',animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'textarea'},{key:'collectionId',label:'Collection',type:'dynamic-select',source:'collections'},{key:'columns',label:'Columns',type:'number',min:1,max:4},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'}],
render(d,project){
  const proj=project||(typeof Builder!=='undefined'?Builder.project:null);
  const col=proj&&proj.collections?proj.collections.find(c=>c.id===d.collectionId):null;
  const head=`<div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2>${d.subheading?`<p>${escapeHtml(d.subheading)}</p>`:''}</div>`;
  if(!col) return `<section id="${d.id}" class="wb-section" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container">${head}<div class="wb-cgrid-empty">No collection selected yet — pick one in the Inspector, or create one in Collections mode.</div></div></section>`.trim();
  const items=(proj.collectionItems&&proj.collectionItems[col.id])||[];
  const titleField=col.fields.find(f=>/title|name/i.test(f.name))||col.fields[0];
  const descField=col.fields.find(f=>/desc/i.test(f.name))||col.fields[1];
  const imgField=col.fields.find(f=>f.type==='image');
  const cards=items.map(it=>{
    const title=titleField?it.data[titleField.id]:'';
    const desc=descField?it.data[descField.id]:'';
    const img=imgField?it.data[imgField.id]:'';
    return `<div class="wb-citem">${img?`<img src="${escapeHtml(img)}" alt="${escapeHtml(title||'')}" loading="lazy">`:''}<div class="wb-cbody">${title?`<h4>${escapeHtml(title)}</h4>`:''}${desc?`<p>${escapeHtml(desc)}</p>`:''}</div></div>`;
  }).join('');
  const body=items.length?`<div class="wb-cgrid" style="grid-template-columns:repeat(${Math.max(1,Math.min(4,d.columns||3))},1fr);">${cards}</div>`:`<div class="wb-cgrid-empty">This collection has no items yet — add some in Collections mode.</div>`;
  return `<section id="${d.id}" class="wb-section" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container">${head}${body}</div></section>`.trim();
}
});

/* ── Custom Form (renders fields from a Forms-mode form) ── */
registerSection({meta:{type:'custom-form',name:'Custom Form',icon:'📝',category:'Sections'},
defaultData:()=>({type:'custom-form',id:uid('sec'),visible:true,heading:'Get In Touch',subheading:'',formId:'',bgColor:'#ffffff',textColor:'#0f172a',animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'textarea'},{key:'formId',label:'Form',type:'dynamic-select',source:'forms'},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'}],
render(d,project){
  const proj=project||(typeof Builder!=='undefined'?Builder.project:null);
  const form=proj&&proj.forms?proj.forms.find(f=>f.id===d.formId):null;
  const head=`<div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2>${d.subheading?`<p>${escapeHtml(d.subheading)}</p>`:''}</div>`;
  if(!form) return `<section id="${d.id}" class="wb-section" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container">${head}<div class="wb-form-empty">No form selected yet — pick one in the Inspector, or create one in Forms mode.</div></div></section>`.trim();
  const rows=form.fields.map(f=>{
    const nameAttr=`field_${f.id}`;
    let inputEl='';
    if(f.type==='textarea') inputEl=`<textarea name="${nameAttr}" rows="4" ${f.required?'required':''}></textarea>`;
    else if(f.type==='dropdown') inputEl=`<select name="${nameAttr}" ${f.required?'required':''}><option value="">Select…</option>${(f.options||'').split(',').map(o=>o.trim()).filter(Boolean).map(o=>`<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('')}</select>`;
    else if(f.type==='radio') inputEl=(f.options||'').split(',').map(o=>o.trim()).filter(Boolean).map((o,i)=>`<label class="radio-opt"><input type="radio" name="${nameAttr}" value="${escapeHtml(o)}" ${f.required&&i===0?'required':''}> ${escapeHtml(o)}</label>`).join('');
    else if(f.type==='checkbox') inputEl=`<label class="check-opt"><input type="checkbox" name="${nameAttr}"> ${escapeHtml(f.label)}</label>`;
    else inputEl=`<input type="${f.type}" name="${nameAttr}" ${f.required?'required':''}>`;
    const showLabel=f.type!=='checkbox';
    return `<div class="wb-frow">${showLabel?`<label>${escapeHtml(f.label)}${f.required?' *':''}</label>`:''}${inputEl}</div>`;
  }).join('');
  const action=form.action==='custom'&&form.actionTarget?` action="${escapeHtml(form.actionTarget)}" method="POST"`:'';
  const mailtoNote=form.action==='mailto'?` data-wb-mailto="1"`:'';
  return `<section id="${d.id}" class="wb-section" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container"><div style="max-width:560px;margin:0 auto;">${head}<form class="wbform"${action}${mailtoNote}>${rows}<button type="submit" class="wb-submit-btn">Submit</button></form></div></div></section>`.trim();
}
});

/* ── Blog List (renders published posts from Blog mode) ── */
registerSection({meta:{type:'blog-list',name:'Blog List',icon:'📚',category:'Sections'},
defaultData:()=>({type:'blog-list',id:uid('sec'),visible:true,heading:'From the Blog',subheading:'',postsPerRow:3,bgColor:'#ffffff',textColor:'#0f172a',animation:Animations.defaultData()}),
fields:[{key:'heading',label:'Heading',type:'text'},{key:'subheading',label:'Subheading',type:'textarea'},{key:'postsPerRow',label:'Cards Per Row',type:'number',min:1,max:4},{key:'bgColor',label:'Background Color',type:'color'},{key:'textColor',label:'Text Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'}],
render(d,project){
  const proj=project||(typeof Builder!=='undefined'?Builder.project:null);
  const posts=((proj&&proj.posts)||[]).filter(p=>p.status==='published');
  const head=`<div class="wb-section-head"><h2>${escapeHtml(d.heading)}</h2>${d.subheading?`<p>${escapeHtml(d.subheading)}</p>`:''}</div>`;
  const cards=posts.map(p=>`<a href="blog-${escapeHtml(p.slug)}.html" class="wb-blog-card"><img src="${escapeHtml(p.featuredImage||'')}" alt="${escapeHtml(p.title)}" loading="lazy"><div class="wb-blog-body"><span class="wb-blog-date">${escapeHtml(p.publishedAt||'')}</span><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.excerpt)}</p></div></a>`).join('');
  const body=posts.length?`<div class="wb-blog-cards" style="grid-template-columns:repeat(${Math.max(1,Math.min(4,d.postsPerRow||3))},1fr);">${cards}</div>`:`<div class="wb-bloglist-empty">No published posts yet — write and publish one in Blog mode.</div>`;
  return `<section id="${d.id}" class="wb-section" style="background-color:${escapeHtml(d.bgColor)};color:${escapeHtml(d.textColor)};padding:80px 0;"><div class="wb-container">${head}${body}</div></section>`.trim();
}
});

/* ── Popup Button (button that opens a modal — pure CSS, no JS, works identically in canvas & export) ── */
registerSection({meta:{type:'popup-button',name:'Popup Button',icon:'🪟',category:'Components'},
defaultData:()=>({type:'popup-button',id:uid('sec'),visible:true,buttonLabel:'Learn More',buttonStyle:'primary',align:'center',modalHeading:'Special Offer',modalImage:'',modalBody:'Tell your visitors something important — a promotion, an announcement, or a quick note.',ctaLabel:'',ctaUrl:'',bgColor:'#ffffff',modalBgColor:'#ffffff',modalTextColor:'#0f172a',animation:Animations.defaultData()}),
fields:[{key:'buttonLabel',label:'Button Text',type:'text'},{key:'buttonStyle',label:'Button Style',type:'select',options:['primary','light']},{key:'align',label:'Button Alignment',type:'select',options:['left','center','right']},{key:'modalHeading',label:'Popup Heading',type:'text'},{key:'modalImage',label:'Popup Image',type:'image'},{key:'modalBody',label:'Popup Text',type:'textarea'},{key:'ctaLabel',label:'Popup Button Text (optional)',type:'text'},{key:'ctaUrl',label:'Popup Button Link',type:'text'},{key:'bgColor',label:'Section Background',type:'color'},{key:'modalBgColor',label:'Popup Background',type:'color'},{key:'modalTextColor',label:'Popup Text Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'}],
render(d){
  const toggleId=`${d.id}_toggle`;
  const btnClass=d.buttonStyle==='light'?'wb-btn wb-btn-light':'wb-btn wb-btn-primary';
  const img=d.modalImage?`<img src="${escapeHtml(d.modalImage)}" alt="${escapeHtml(d.modalHeading)}" class="wb-popup-image">`:'';
  const cta=d.ctaLabel?`<a href="${escapeHtml(d.ctaUrl||'#')}" class="wb-btn wb-btn-primary wb-popup-cta">${escapeHtml(d.ctaLabel)}</a>`:'';
  return `<section id="${d.id}" class="wb-section wb-popup-section" style="background-color:${escapeHtml(d.bgColor)};padding:24px 0;text-align:${escapeHtml(d.align)};">
<div class="wb-container">
<input type="checkbox" id="${toggleId}" class="wb-popup-toggle">
<label for="${toggleId}" class="${btnClass} wb-popup-trigger">${escapeHtml(d.buttonLabel)}</label>
<label for="${toggleId}" class="wb-popup-overlay" aria-hidden="true"></label>
<div class="wb-popup-box" style="background-color:${escapeHtml(d.modalBgColor)};color:${escapeHtml(d.modalTextColor)};">
<label for="${toggleId}" class="wb-popup-close" aria-label="Close">&times;</label>
${img}
<h3 class="wb-popup-heading">${escapeHtml(d.modalHeading)}</h3>
<p class="wb-popup-body">${escapeHtml(d.modalBody)}</p>
${cta}
</div>
</div>
</section>`.trim();
}
});

/* ── Custom HTML (raw code block — for embed widgets, tracking snippets, custom markup) ── */
registerSection({meta:{type:'custom-html',name:'Custom Code',icon:'🧩',category:'Components'},
defaultData:()=>({type:'custom-html',id:uid('sec'),visible:true,code:'<!-- Paste your custom HTML, CSS, or JS here -->\n<p style="text-align:center;padding:20px;">Your custom code goes here.</p>',width:'contained',bgColor:'#ffffff'}),
fields:[{key:'code',label:'HTML / CSS / JS Code',type:'code'},{key:'width',label:'Width',type:'select',options:['contained','full']},{key:'bgColor',label:'Background Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'},{type:'note',text:'Scripts in this block won\'t run in this live editor preview (browsers block that for security) — they run normally once you export or publish the site.'}],
render(d){
  // Intentionally NOT escaped — this section exists specifically so the user's own raw
  // HTML/CSS/JS renders as-is (e.g. a chat widget, tracking pixel, custom embed).
  const inner=d.code||'';
  const body=d.width==='full'?inner:`<div class="wb-container">${inner}</div>`;
  return `<section id="${d.id}" class="wb-section wb-custom-html-section" style="background-color:${escapeHtml(d.bgColor)};">${body}</section>`.trim();
}
});

/* ── iFrame Embed (load any external URL — maps, calendars, forms, tools) ── */
registerSection({meta:{type:'iframe-embed',name:'iFrame Embed',icon:'🖼️',category:'Components'},
defaultData:()=>({type:'iframe-embed',id:uid('sec'),visible:true,url:'',height:450,bgColor:'#ffffff',animation:Animations.defaultData()}),
fields:[{key:'url',label:'URL to Embed',type:'text'},{key:'height',label:'Height (px)',type:'number',min:100,max:1200},{key:'bgColor',label:'Background Color',type:'color'},{key:'visible',label:'Visible',type:'toggle'}],
render(d){
  const h=Math.max(100,Number(d.height)||450);
  const body=d.url?`<div class="wb-iframe-wrap" style="height:${h}px;"><iframe src="${escapeHtml(d.url)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
    :`<div class="wb-iframe-empty" style="height:${Math.min(h,200)}px;">No URL set yet — add one in the Inspector to embed a map, calendar, form, or other page here.</div>`;
  return `<section id="${d.id}" class="wb-section" style="background-color:${escapeHtml(d.bgColor)};padding:40px 0;"><div class="wb-container">${body}</div></section>`.trim();
}
});

window.SectionRegistry = SectionRegistry;
window.escapeHtml = escapeHtml;
window.uid = uid;
