// // src/components/Hero.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function Hero({ siteName = "Tryde" }) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const navigate = useNavigate();
//   const heroRef = useRef(null);

//   const slides =[
//     {
//       title: `Grow with ${siteName}`,
//       highlight: "0% Commission",
//       highlightSub: "First 30 Days",
//       subtitle: "Fast onboarding • Instant orders • Weekly payouts",
//       icon: TrendingUp,
//       color: "from-[#FF5252] to-[#e03e3e] hover:from-[#e03e3e]"

//     },
//     {
//       title: "Zero Risk Partner Program",
//       highlight: "50,000+ Restaurants",
//       highlightSub: "Trust Us",
//       subtitle: "No fees • Dedicated support • Grow easily",
//       icon: Sparkles,
//       color: "from-[#FF5252] to-[#e03e3e] hover:from-[#e03e3e]",
//     },
//   ];

//   // Auto-slide effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 7000);
//     return () => clearInterval(timer);
//   }, [slides.length]);

//   // Mouse move parallax effect
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (!heroRef.current) return;
//       const rect = heroRef.current.getBoundingClientRect();
//       const x = (e.clientX - rect.left) / rect.width;
//       const y = (e.clientY - rect.top) / rect.height;
//       setMousePosition({ x, y });
//     };

//     const heroElement = heroRef.current;
//     heroElement?.addEventListener('mousemove', handleMouseMove);
//     return () => heroElement?.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   const current = slides[currentSlide];
//   const IconComponent = current.icon;

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.15,
//         delayChildren: 0.2,
//       },
//     },
//     exit: { opacity: 0, transition: { duration: 0.3 } },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
//     visible: {
//       opacity: 1,
//       y: 0,
//       filter: "blur(0px)",
//       transition: {
//         duration: 0.8,
//         ease: [0.25, 0.4, 0.25, 1],
//       },
//     },
//   };

//   const highlightVariants = {
//     hidden: { opacity: 0, scale: 0.8, y: 20 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       y: 0,
//       transition: {
//         duration: 0.9,
//         ease: [0.34, 1.56, 0.64, 1],
//       },
//     },
//   };

//   return (
//     <section 
//       ref={heroRef}
//       className="relative min-h-screen flex items-center bg-black overflow-hidden font-['Poppins']"
//     >
//       {/* Animated Background */}
//       <div className="absolute inset-0">
//         {/* Base Image */}
//         <motion.img
//           key={currentSlide}
//           initial={{ scale: 1.1, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 1.5, ease: "easeOut" }}
//           src="https://media.istockphoto.com/id/2117185386/photo/sandwich-one-fresh-big-submarine-sandwich-with-ham-cheese-lettuce-tomatoes-and-microgreens-on.jpg?s=612x612&w=0&k=20&c=TGF0ndDCbSxOoqD7jC8HrsrtX-vNVJPSgGrHw7d8mmk="
//           alt="Delicious food background"
//           className="w-full h-full object-cover brightness-[0.5]"
//           style={{
//             transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
//           }}
//         />
        
//         {/* Gradient Overlays */}
//         <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
//         {/* Animated Gradient Orbs */}
//         <motion.div
//           animate={{
//             x: [0, 100, 0],
//             y: [0, 50, 0],
//             scale: [1, 1.2, 1],
//           }}
//           transition={{
//             duration: 20,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r ${current.color} rounded-full blur-3xl opacity-20`}
//         />
//         <motion.div
//           animate={{
//             x: [0, -80, 0],
//             y: [0, -60, 0],
//             scale: [1, 1.3, 1],
//           }}
//           transition={{
//             duration: 25,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-[#FF5252] to-[#e03e3e] hover:from-[#e03e3e] rounded-full blur-3xl opacity-15"
//         />
//       </div>

//       {/* Floating Particles */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(15)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-1 h-1 bg-white rounded-full"
//             initial={{
//               x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
//               y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
//               opacity: 0,
//             }}
//             animate={{
//               y: [null, -100],
//               opacity: [0, 1, 0],
//             }}
//             transition={{
//               duration: Math.random() * 5 + 5,
//               repeat: Infinity,
//               delay: Math.random() * 5,
//               ease: "linear",
//             }}
//           />
//         ))}
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={currentSlide}
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             className="max-w-3xl space-y-8"
//           >
//             {/* Icon Badge */}
//             <motion.div
//               variants={itemVariants}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
//             >
//               <IconComponent className="w-4 h-4 text-[#FF5252]" />
//               <span className="text-sm font-medium text-white/90">Partner Program</span>
//               <Zap className="w-3 h-3 from-[#FF5252] to-[#e03e3e] hover:from-[#e03e3e]" />
//             </motion.div>

//             {/* Main Title */}
//             <motion.h1
//               variants={itemVariants}
//               className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold leading-[1.1] text-white tracking-tight"
//             >
//               {current.title}
//             </motion.h1>

//             {/* Highlight Box */}
//             <motion.div
//   variants={highlightVariants}
//   className="relative inline-block"
// >
//   <div className="relative px-5 py-3 rounded-xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg border border-white/20 overflow-hidden">
    
//     {/* Animated Border */}
//     <motion.div
//       animate={{ rotate: 360 }}
//       transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
//       className={`absolute inset-0 bg-gradient-to-r ${current.color} opacity-20 blur-xl`}
//     />

//     <div className="relative space-y-0.5">
//       <div
//         className={`text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r ${current.color} bg-clip-text text-transparent`}
//       >
//         {current.highlight}
//       </div>

//       <div className="text-xs sm:text-sm text-white/80 font-semibold">
//         {current.highlightSub}
//       </div>
//     </div>
//   </div>
// </motion.div>


//             {/* Subtitle */}
//             <motion.p
//               variants={itemVariants}
//               className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-light max-w-2xl leading-relaxed"
//             >
//               {current.subtitle}
//             </motion.p>

//             {/* CTA Button */}
//             <motion.div 
//               variants={itemVariants}
//               className="pt-4 flex flex-wrap gap-4 items-center"
//             >
//               <motion.button
//                 onClick={() => navigate("/register")}
//                 className={`
//                   group relative inline-flex items-center gap-3
//                   bg-gradient-to-r ${current.color}
//                   text-white px-8 py-5 rounded-full text-lg font-bold
//                   shadow-2xl shadow-orange-500/30
//                   overflow-hidden cursor-pointer
//                 `}
//                 whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(251, 146, 60, 0.4)" }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 {/* Button Shimmer Effect */}
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent "
//                   animate={{
//                     x: ['-200%', '200%'],
//                   }}
//                   transition={{
//                     duration: 2,
//                     repeat: Infinity,
//                     ease: "linear",
//                   }}
//                 />
                
//                 <span className="relative z-10">Join Now</span>
//                 <ArrowRight 
//                   size={22} 
//                   className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" 
//                 />
//               </motion.button>

//               <motion.div
//                 variants={itemVariants}
//                 className="flex items-center gap-2 text-white/60 text-sm"
//               >
                
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         </AnimatePresence>

//         {/* Slide Indicators */}
//         <motion.div
//           variants={itemVariants}
//           initial="hidden"
//           animate="visible"
//           className="absolute bottom-10 left-6 sm:left-10 lg:left-16 flex gap-3"
//         >
//           {slides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentSlide(index)}
//               className="group relative"
//               aria-label={`Go to slide ${index + 1}`}
//             >
//               <div
//                 className={`
//                   h-0 rounded-full transition-all duration-500
//                   ${index === currentSlide ? 'w-12 bg-gradient-to-r from-[#FF5252] to-[#e03e3e] hover:from-[#e03e3e]' : 'w-8 bg-white/30'}
//                 `}
//               />
//               {index === currentSlide && (
//                 <motion.div
//                   layoutId="activeSlide"
//                   className="absolute inset-0 bg-white/20 rounded-full blur-md"
//                 />
//               )}
//             </button>
//           ))}
//         </motion.div>
//       </div>

//       {/* Scroll Indicator */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1.5, duration: 0.8 }}
//         className="absolute bottom-8 right-8 sm:right-12 lg:right-16"
//       >
//         <motion.div
//           animate={{ y: [0, 10, 0] }}
//           transition={{ duration: 2, repeat: Infinity }}
//           className="flex flex-col items-center gap-2 text-white/50"
//         >         
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle, TrendingUp, Zap, Shield, Clock, ChefHat, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    badge: "🍕Food Delivery Platform",
    line1: "Scale Your",
    line2: "Restaurant",
    line3: "Revenue",
    accentLine: 1,
    desc: "Join 50,000+ restaurants earning more every day. Zero commission for your first 30 days — guaranteed.",
    cta: "Start For Free",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&q=85",
    earnings: "₹18,240",
    growth: "↑ 31%",
    orders: "342 Live Orders",
    stats: [
      { icon: TrendingUp, value: "0%",   label: "Commission"  },
      { icon: Users,      value: "50K+", label: "Restaurants" },
      { icon: Clock,      value: "24hr", label: "Onboarding"  },
    ],
  },
  {
    badge: "⚡Weekly Guaranteed Payouts",
    line1: "Real Orders.",
    line2: "Real Growth.",
    line3: "Real Money.",
    accentLine: 2,
    desc: "Instant order management, live analytics, and a dedicated partner success team for restaurant owners.",
    cta: "Join Now — Free",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=85",
    earnings: "₹24,580",
    growth: "↑ 43%",
    orders: "519 Live Orders",
    stats: [
      { icon: Zap,        value: "2min", label: "Avg Order" },
      { icon: Star,       value: "4.9★", label: "Rating"   },
      { icon: TrendingUp, value: "3x",   label: "Revenue"  },
    ],
  },
  {
    badge: "🏆Award Winning Partner Program",
    line1: "More Diners.",
    line2: "More Orders.",
    line3: "More Profit.",
    accentLine: 0,
    desc: "Smart menu tools, surge pricing alerts, and marketing support — everything a modern restaurant needs.",
    cta: "Get Started Today",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=85",
    earnings: "₹31,900",
    growth: "↑ 58%",
    orders: "781 Live Orders",
    stats: [
      { icon: ChefHat, value: "200+", label: "Cuisines" },
      { icon: Shield,  value: "Safe", label: "Payouts"  },
      { icon: Zap,     value: "Live", label: "Analytics"},
    ],
  },
];

const PERKS = ["Free onboarding", "No hidden fees", "Weekly payouts", "24/7 support"];

const BARS = [42, 58, 35, 70, 52, 80, 96];

export default function Hero({ siteName = "Tryde" }) {
  const [slide, setSlide]       = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const heroRef  = useRef(null);
  const navigate = useNavigate();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 55, damping: 20 });
  const sy = useSpring(my, { stiffness: 55, damping: 20 });
  const px = useTransform(sx, [0,1], [-10, 10]);
  const py = useTransform(sy, [0,1], [-6,  6 ]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setProgress(0);
    let p = 0;
    timerRef.current = setInterval(() => {
      p += 100 / 60;
      if (p >= 100) { setSlide(prev => (prev + 1) % SLIDES.length); p = 0; }
      setProgress(p);
    }, 100);
  };

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, []);
  const goTo = (i) => { setSlide(i); startTimer(); };

  const onMouseMove = (e) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top)  / r.height);
  };

  const s = SLIDES[slide];

  const wrap = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
    exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 32, filter: "blur(10px)" },
    show:   { opacity: 1, y: 0,  filter: "blur(0px)",  transition: { duration: 0.65, ease: [0.22,1,0.36,1] } },
    exit:   { opacity: 0, y: -18, filter: "blur(6px)", transition: { duration: 0.3 } },
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={onMouseMove}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#080C14",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        position: "relative",
      }}
    >
      {/* ── BG gradient ── */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`
          radial-gradient(ellipse 70% 55% at 15% 55%, rgba(255,72,60,0.10) 0%, transparent 65%),
          radial-gradient(ellipse 50% 45% at 88% 25%, rgba(255,130,0,0.07) 0%, transparent 60%)
        `,
      }}/>
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", opacity:0.025,
        backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
        backgroundSize:"52px 52px",
      }}/>
      <motion.div
        animate={{ scale:[1,1.2,1], opacity:[0.1,0.22,0.1] }}
        transition={{ duration:10, repeat:Infinity, ease:"easeInOut" }}
        style={{
          position:"absolute", top:"25%", left:"-8%",
          width:500, height:500, borderRadius:"50%", pointerEvents:"none",
          background:"radial-gradient(circle, rgba(255,72,60,0.32) 0%, transparent 70%)",
        }}
      />

      {/* ════ LAYOUT ════ */}
      <div style={{
        position:"relative", zIndex:10,
        width:"100%", maxWidth:1200, margin:"0 auto",
        padding:"60px 48px",
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:56,
        alignItems:"center",
      }}>

        {/* ─── LEFT: TEXT ─── */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              variants={wrap} initial="hidden" animate="show" exit="exit"
              style={{ display:"flex", flexDirection:"column", gap:20 }}
            >
              {/* Badge */}
              <motion.span variants={item} style={{
                alignSelf:"flex-start",
                padding:"6px 14px", borderRadius:999,
                background:"rgba(255,72,60,0.13)",
                border:"1px solid rgba(255,72,60,0.32)",
                color:"#FF8A80", fontSize:12, fontWeight:600, letterSpacing:"0.02em",
              }}>
                {s.badge}
              </motion.span>

              {/* Headline — compact */}
              <motion.h1 variants={item} style={{ margin:0, lineHeight:1.06 }}>
                {[s.line1, s.line2, s.line3].map((w, i) => (
                  <span key={i} style={{ display:"block", fontSize:46, fontWeight:800, letterSpacing:"-1.5px" }}>
                    {i === s.accentLine
                      ? <span style={{ background:"linear-gradient(118deg,#FF5252,#FF8C00)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{w}</span>
                      : <span style={{ color:"#fff" }}>{w}</span>
                    }
                  </span>
                ))}
              </motion.h1>

              {/* Desc */}
              <motion.p variants={item} style={{
                margin:0, color:"#8B95A8", fontSize:14, lineHeight:1.65, maxWidth:420,
              }}>
                {s.desc}
              </motion.p>

              {/* Perks */}
              <motion.div variants={item} style={{ display:"flex", flexWrap:"wrap", gap:"6px 18px" }}>
                {PERKS.map(p => (
                  <span key={p} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12.5, color:"#C4CDD8", fontWeight:500 }}>
                    <CheckCircle size={13} style={{ color:"#FF5252", flexShrink:0 }} />
                    {p}
                  </span>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={item} style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <motion.button
                  whileHover={{ scale:1.04, boxShadow:"0 16px 48px rgba(255,72,60,0.45)" }}
                  whileTap={{ scale:0.97 }}
                  onClick={() => navigate("/register")}
                  style={{
                    position:"relative", overflow:"hidden",
                    display:"flex", alignItems:"center", gap:8,
                    padding:"12px 24px", borderRadius:12,
                    background:"linear-gradient(135deg,#FF5252,#FF8C00)",
                    color:"#fff", fontWeight:700, fontSize:14,
                    border:"none", cursor:"pointer",
                  }}
                >
                  <motion.div
                    style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)" }}
                    animate={{ x:["-180%","180%"] }}
                    transition={{ duration:2.2, repeat:Infinity, ease:"linear" }}
                  />
                  <span style={{ position:"relative", zIndex:1 }}>{s.cta}</span>
                  <ArrowRight size={15} style={{ position:"relative", zIndex:1 }} />
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div variants={item} style={{
                display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14,
                paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.06)",
              }}>
                {s.stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{
                        width:26, height:26, borderRadius:7,
                        background:"rgba(255,72,60,0.15)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        <Icon size={13} style={{ color:"#FF5252" }} />
                      </div>
                      <span style={{ fontSize:22, fontWeight:800, color:"#fff" }}>{value}</span>
                    </div>
                    <span style={{ fontSize:11, color:"#5C6470", fontWeight:500, paddingLeft:32 }}>{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── RIGHT: IMAGE ─── */}
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"flex-end" }}>

          {/* Rings */}
          {[430, 360, 285].map((size, i) => (
            <motion.div key={size}
              style={{
                position:"absolute",
                width:size, height:size, borderRadius:"50%",
                border:`1px dashed rgba(255,72,60,${0.07 + i * 0.035})`,
                pointerEvents:"none",
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration:38 + i * 12, repeat:Infinity, ease:"linear" }}
            />
          ))}

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div key={`card-${slide}`}
              initial={{ opacity:0, scale:0.84, x:60 }}
              animate={{ opacity:1, scale:1,    x:0  }}
              exit={{   opacity:0, scale:0.89,  x:-44 }}
              transition={{ duration:0.85, ease:[0.22,1,0.36,1] }}
            >
              <motion.div style={{ x:px, y:py }}>
                <motion.div
                  whileHover={{ scale:1.02 }}
                  transition={{ type:"spring", stiffness:170, damping:24 }}
                  style={{
                    position:"relative",
                    width:360, height:460,
                    borderRadius:32,
                    overflow:"hidden",
                    boxShadow:"0 32px 80px rgba(0,0,0,0.75), 0 0 0 1.5px rgba(255,72,60,0.28)",
                  }}
                >
                  {/* Photo */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={s.image}
                      src={s.image}
                      alt="food"
                      initial={{ scale:1.14, opacity:0, filter:"blur(14px)" }}
                      animate={{ scale:1,    opacity:1, filter:"blur(0px)"  }}
                      exit={{   scale:1.07,  opacity:0, filter:"blur(7px)"  }}
                      transition={{ duration:0.85, ease:"easeOut" }}
                      style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}
                    />
                  </AnimatePresence>

                  {/* Overlay */}
                  <div style={{
                    position:"absolute", inset:0,
                    background:"linear-gradient(180deg,rgba(0,0,0,0.04) 0%,rgba(0,0,0,0.72) 100%)",
                  }}/>

                  {/* Live orders chip */}
                  <motion.div
                    initial={{ opacity:0, x:-14 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay:0.5 }}
                    style={{
                      position:"absolute", top:16, left:16,
                      display:"flex", alignItems:"center", gap:6,
                      padding:"7px 12px", borderRadius:12,
                      background:"rgba(8,12,20,0.80)", backdropFilter:"blur(14px)",
                      border:"1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    <motion.span
                      animate={{ opacity:[1,0.2,1], scale:[1,1.4,1] }}
                      transition={{ duration:1.4, repeat:Infinity }}
                      style={{ width:7, height:7, borderRadius:"50%", background:"#4CAF50", display:"block" }}
                    />
                    <span style={{ color:"#fff", fontSize:12, fontWeight:600 }}>{s.orders}</span>
                  </motion.div>

                  {/* 0% chip */}
                  <motion.div
                    initial={{ opacity:0, x:14 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay:0.65 }}
                    style={{
                      position:"absolute", top:16, right:16,
                      padding:"6px 12px", borderRadius:10, textAlign:"center",
                      background:"rgba(255,72,60,0.22)", backdropFilter:"blur(12px)",
                      border:"1px solid rgba(255,72,60,0.38)",
                    }}
                  >
                    <div style={{ color:"#FF8A80", fontSize:13, fontWeight:800, lineHeight:1 }}>0% Fee</div>
                    <div style={{ color:"#A0AAB4", fontSize:10, marginTop:2 }}>30 days</div>
                  </motion.div>

                  {/* Earnings card */}
                  <motion.div
                    initial={{ opacity:0, y:24 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.8, type:"spring", stiffness:110 }}
                    style={{
                      position:"absolute", bottom:14, left:14, right:14,
                      padding:"14px 16px", borderRadius:20,
                      background:"rgba(8,12,20,0.86)", backdropFilter:"blur(18px)",
                      border:"1px solid rgba(255,255,255,0.09)",
                    }}
                  >
                    <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                      <div>
                        <p style={{ color:"#5C6470", fontSize:11, margin:"0 0 3px", fontWeight:500 }}>Today's Earnings</p>
                        <p style={{ color:"#fff", fontSize:26, fontWeight:900, margin:0, letterSpacing:"-0.5px" }}>{s.earnings}</p>
                        <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:5 }}>
                          <span style={{
                            fontSize:11, fontWeight:700,
                            padding:"2px 7px", borderRadius:999,
                            background:"rgba(76,175,80,0.2)", color:"#81C784",
                          }}>{s.growth}</span>
                          <span style={{ color:"#5C6470", fontSize:11 }}>vs yesterday</span>
                        </div>
                      </div>
                      {/* Bar chart */}
                      <div style={{ display:"flex", alignItems:"flex-end", gap:3 }}>
                        {BARS.map((h, i) => (
                          <motion.div key={i}
                            initial={{ scaleY:0 }}
                            animate={{ scaleY:1 }}
                            transition={{ delay:1.05 + i * 0.07, duration:0.4, ease:"easeOut" }}
                            style={{
                              width:6, height:h * 0.3,
                              background: i === 6 ? "#FF5252" : "rgba(255,255,255,0.14)",
                              borderRadius:3, transformOrigin:"bottom",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Orbiting emojis */}
          {[
            { emoji:"🍕", deg:0,   r:220, dur:22 },
            { emoji:"🍔", deg:130, r:220, dur:28 },
            { emoji:"🍜", deg:250, r:220, dur:20 },
          ].map(({ emoji, deg, r, dur }) => (
            <motion.div key={emoji}
              style={{ position:"absolute", pointerEvents:"none", zIndex:20 }}
              animate={{ rotate:360 }}
              transition={{ duration:dur, repeat:Infinity, ease:"linear" }}
            >
              <motion.span
                style={{
                  display:"flex", alignItems:"center", justifyContent:"center",
                  width:36, height:36, borderRadius:"50%", fontSize:16,
                  background:"rgba(255,72,60,0.13)", backdropFilter:"blur(8px)",
                  border:"1px solid rgba(255,72,60,0.22)",
                  position:"absolute",
                  left: Math.cos((deg * Math.PI) / 180) * r - 18,
                  top:  Math.sin((deg * Math.PI) / 180) * r - 18,
                }}
                animate={{ rotate:-360 }}
                transition={{ duration:dur, repeat:Infinity, ease:"linear" }}
              >
                {emoji}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Slide indicators ── */}
      <div style={{
        position:"absolute", bottom:22, left:"50%", transform:"translateX(-50%)",
        display:"flex", gap:8, zIndex:20, alignItems:"center",
      }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{
              position:"relative", overflow:"hidden", borderRadius:999,
              width: i === slide ? 38 : 8, height:8, border:"none", cursor:"pointer",
              background: i === slide ? "rgba(255,72,60,0.35)" : "rgba(255,255,255,0.16)",
              transition:"width 0.38s ease, background 0.3s",
              padding:0,
            }}
          >
            {i === slide && (
              <div style={{
                position:"absolute", inset:0,
                background:"#FF5252", borderRadius:999,
                width:`${progress}%`,
                transition:"width 0.1s linear",
              }}/>
            )}
          </button>
        ))}
      </div>

      {/* Watermark */}
      <div style={{
        position:"absolute", bottom:22, right:24,
        color:"rgba(255,255,255,0.07)", fontSize:10,
        fontWeight:900, letterSpacing:"0.28em",
      }}>
        {siteName.toUpperCase()}
      </div>
    </section>
  );
}