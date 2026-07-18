/**
 * industry-templates.js — 20 industry preset projects
 */
const IndustryTemplates = [
  { id:'business', name:'Business', icon:'💼', description:'Professional corporate website', thumbnail:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=60',
    project:()=>({ meta:{title:'Apex Solutions',description:'Professional business solutions.',favicon:'',keywords:'business',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#2563eb',secondary:'#0f172a',accent:'#f59e0b',background:'#ffffff',surface:'#f8fafc',text:'#0f172a',mode:'light',fontHeading:'Poppins',fontBody:'Inter',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','about','services','testimonials','statistics','cta','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'restaurant', name:'Restaurant', icon:'🍽️', description:'Restaurant or cafe website', thumbnail:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=60',
    project:()=>({ meta:{title:'Spice Garden Restaurant',description:'Authentic Indian cuisine.',favicon:'',keywords:'restaurant,food',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#b45309',secondary:'#1c1917',accent:'#f59e0b',background:'#fffbeb',surface:'#fef3c7',text:'#1c1917',mode:'light',fontHeading:'Playfair Display',fontBody:'Lato',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','about','services','gallery','testimonials','contact','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'agency', name:'Agency', icon:'🚀', description:'Creative or digital agency', thumbnail:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=60',
    project:()=>({ meta:{title:'Creative Studio',description:'We build brands that matter.',favicon:'',keywords:'agency,design',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#7c3aed',secondary:'#0f0f0f',accent:'#f59e0b',background:'#ffffff',surface:'#faf5ff',text:'#0f0f0f',mode:'light',fontHeading:'Montserrat',fontBody:'Inter',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','services','gallery','team','testimonials','pricing','cta','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'portfolio', name:'Portfolio', icon:'🎨', description:'Personal or creative portfolio', thumbnail:'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=60',
    project:()=>({ meta:{title:'Arjun Kapoor — Designer',description:'Creative designer based in Mumbai.',favicon:'',keywords:'portfolio,design',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#0f172a',secondary:'#0f172a',accent:'#f59e0b',background:'#ffffff',surface:'#f8fafc',text:'#0f172a',mode:'light',fontHeading:'Raleway',fontBody:'Inter',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','about','gallery','services','testimonials','contact','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'medical', name:'Clinic / Medical', icon:'🏥', description:'Doctor, clinic or hospital', thumbnail:'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=60',
    project:()=>({ meta:{title:'HealthFirst Clinic',description:'Compassionate healthcare for your family.',favicon:'',keywords:'clinic,doctor,health',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#0891b2',secondary:'#0c4a6e',accent:'#22c55e',background:'#f0f9ff',surface:'#e0f2fe',text:'#0c4a6e',mode:'light',fontHeading:'Nunito',fontBody:'Open Sans',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','about','services','team','faq','contact','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'gym', name:'Gym / Fitness', icon:'💪', description:'Gym, fitness studio or trainer', thumbnail:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=60',
    project:()=>({ meta:{title:'Iron Temple Gym',description:'Transform your body, transform your life.',favicon:'',keywords:'gym,fitness,workout',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#dc2626',secondary:'#0f0f0f',accent:'#f59e0b',background:'#0f0f0f',surface:'#1a1a1a',text:'#ffffff',mode:'dark',fontHeading:'Oswald',fontBody:'Roboto',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','services','pricing','testimonials','statistics','cta','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'fashion', name:'Fashion', icon:'👗', description:'Fashion brand or clothing store', thumbnail:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60',
    project:()=>({ meta:{title:'Luxe Threads',description:'Fashion that speaks for itself.',favicon:'',keywords:'fashion,clothing,style',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#be185d',secondary:'#0f0f0f',accent:'#f59e0b',background:'#fff',surface:'#fdf2f8',text:'#0f0f0f',mode:'light',fontHeading:'Playfair Display',fontBody:'Lato',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','about','gallery','testimonials','cta','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'realestate', name:'Real Estate', icon:'🏠', description:'Property or real estate agency', thumbnail:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=60',
    project:()=>({ meta:{title:'Prime Properties',description:'Find your dream home.',favicon:'',keywords:'real estate,property,homes',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#059669',secondary:'#0f172a',accent:'#f59e0b',background:'#ffffff',surface:'#f0fdf4',text:'#0f172a',mode:'light',fontHeading:'Poppins',fontBody:'Inter',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','services','gallery','testimonials','statistics','contact','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'education', name:'Education', icon:'🎓', description:'School, coaching or e-learning', thumbnail:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=60',
    project:()=>({ meta:{title:'Bright Minds Academy',description:'Quality education for every student.',favicon:'',keywords:'education,school,learning',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#2563eb',secondary:'#1e3a5f',accent:'#f59e0b',background:'#eff6ff',surface:'#dbeafe',text:'#1e3a5f',mode:'light',fontHeading:'Nunito',fontBody:'Open Sans',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','about','services','team','faq','contact','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'ngo', name:'NGO / Charity', icon:'💚', description:'Non-profit or charity organization', thumbnail:'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=60',
    project:()=>({ meta:{title:'Hope Foundation',description:'Creating a better world together.',favicon:'',keywords:'ngo,charity,donate',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#16a34a',secondary:'#14532d',accent:'#f59e0b',background:'#f0fdf4',surface:'#dcfce7',text:'#14532d',mode:'light',fontHeading:'Poppins',fontBody:'Inter',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','about','services','statistics','testimonials','cta','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'construction', name:'Construction', icon:'🏗️', description:'Builder, contractor or construction firm', thumbnail:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=60',
    project:()=>({ meta:{title:'BuildRight Construction',description:'Building your vision, stone by stone.',favicon:'',keywords:'construction,builder,contractor',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#ea580c',secondary:'#1c1917',accent:'#f59e0b',background:'#fff',surface:'#fff7ed',text:'#1c1917',mode:'light',fontHeading:'Oswald',fontBody:'Roboto',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','about','services','gallery','statistics','contact','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'photographer', name:'Photographer', icon:'📷', description:'Photography studio or freelancer', thumbnail:'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=60',
    project:()=>({ meta:{title:'Priya Lens Studio',description:'Capturing moments that last forever.',favicon:'',keywords:'photography,photographer,studio',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#0f172a',secondary:'#0f172a',accent:'#f8fafc',background:'#0f172a',surface:'#1e293b',text:'#f8fafc',mode:'dark',fontHeading:'Playfair Display',fontBody:'Lato',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','gallery','about','pricing','testimonials','contact','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'cafe', name:'Cafe', icon:'☕', description:'Coffee shop or tea house', thumbnail:'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=60',
    project:()=>({ meta:{title:'The Daily Grind Cafe',description:'Your neighborhood coffee haven.',favicon:'',keywords:'cafe,coffee,tea',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#92400e',secondary:'#1c1917',accent:'#f59e0b',background:'#fef3c7',surface:'#fde68a',text:'#1c1917',mode:'light',fontHeading:'Playfair Display',fontBody:'Lato',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','about','services','gallery','contact','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'wedding', name:'Wedding', icon:'💒', description:'Wedding planner or venue', thumbnail:'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=60',
    project:()=>({ meta:{title:'Forever Weddings',description:'Your perfect day, our passion.',favicon:'',keywords:'wedding,planner,venue',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#be185d',secondary:'#1c1917',accent:'#f59e0b',background:'#fff0f6',surface:'#fce7f3',text:'#1c1917',mode:'light',fontHeading:'Playfair Display',fontBody:'Lato',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','about','services','gallery','testimonials','contact','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'event', name:'Event', icon:'🎉', description:'Event management company', thumbnail:'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=60',
    project:()=>({ meta:{title:'Spark Events',description:'Creating unforgettable experiences.',favicon:'',keywords:'events,management,party',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#7c3aed',secondary:'#0f0f0f',accent:'#f59e0b',background:'#0f0f0f',surface:'#1a1a2e',text:'#ffffff',mode:'dark',fontHeading:'Montserrat',fontBody:'Inter',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','services','gallery','team','pricing','contact','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'landing', name:'Landing Page', icon:'🎯', description:'Single product or service landing page', thumbnail:'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&q=60',
    project:()=>({ meta:{title:'LaunchReady',description:'The fastest way to get online.',favicon:'',keywords:'landing,product,launch',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#2563eb',secondary:'#0f172a',accent:'#f59e0b',background:'#ffffff',surface:'#f8fafc',text:'#0f172a',mode:'light',fontHeading:'Poppins',fontBody:'Inter',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','services','statistics','pricing','faq','cta','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'personal', name:'Personal Blog', icon:'✍️', description:'Personal website or blog', thumbnail:'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=60',
    project:()=>({ meta:{title:'Rahul Writes',description:'Thoughts on tech, life and everything in between.',favicon:'',keywords:'blog,personal,writing',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#2563eb',secondary:'#0f172a',accent:'#f59e0b',background:'#ffffff',surface:'#f8fafc',text:'#0f172a',mode:'light',fontHeading:'Playfair Display',fontBody:'Lato',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','about','blog','newsletter','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'corporate', name:'Corporate', icon:'🏢', description:'Large company or enterprise site', thumbnail:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=60',
    project:()=>({ meta:{title:'GlobalCorp Industries',description:'Engineering tomorrow\'s solutions today.',favicon:'',keywords:'corporate,enterprise,industry',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#1d4ed8',secondary:'#0f172a',accent:'#f59e0b',background:'#ffffff',surface:'#f8fafc',text:'#0f172a',mode:'light',fontHeading:'Montserrat',fontBody:'Open Sans',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','about','services','team','statistics','clients','cta','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'ecommerce', name:'E-Commerce', icon:'🛒', description:'Online shop or product store', thumbnail:'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&q=60',
    project:()=>({ meta:{title:'ShopSmart India',description:'Quality products delivered to your door.',favicon:'',keywords:'shop,ecommerce,products',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#16a34a',secondary:'#0f172a',accent:'#f59e0b',background:'#ffffff',surface:'#f0fdf4',text:'#0f172a',mode:'light',fontHeading:'Poppins',fontBody:'Inter',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','services','gallery','pricing','testimonials','faq','cta','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},

  { id:'applanding', name:'App Landing', icon:'📱', description:'Mobile app or SaaS landing page', thumbnail:'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=60',
    project:()=>({ meta:{title:'AppLaunch Pro',description:'The app that changes everything.',favicon:'',keywords:'app,saas,mobile',ogImage:'',robots:'index, follow',canonical:''},
    theme:{primary:'#7c3aed',secondary:'#0f0f23',accent:'#06b6d4',background:'#0f0f23',surface:'#1a1a3e',text:'#ffffff',mode:'dark',fontHeading:'Montserrat',fontBody:'Inter',localFonts:[]},
    assets:[],selectedSectionId:null,
    sections:['hero','services','statistics','pricing','testimonials','faq','cta','footer'].map(t=>{const d=SectionRegistry[t].defaultData();d.animation=Animations.defaultData();return d;})})},
];
window.IndustryTemplates = IndustryTemplates;
