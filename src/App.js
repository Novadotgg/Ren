import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import './index.css';
import FinalCollage from './components/FinalCollage';

/*************************************************
Config: Edit these to personalize
*************************************************/
const NAMES = { me: 'Renesh', her: 'Renesh' };

// Photo assignments
const PHOTO_INTRO = '/12.jpeg';  // First page
const PHOTO_SKY = '/3.jpeg';     // "No matter how far" page
const RANDOM_PHOTOS = ['/1.jpeg', '/2.jpeg', '/4.jpeg', '/5.jpeg', '/6.jpeg', '/7.jpeg', '/8.jpeg', '/9.jpeg', '/10.jpeg', '/11.jpeg', '/13.jpeg', '/14.jpeg', '/15.jpeg'];

// Shuffle random photos for other pages
const shuffledPhotos = [...RANDOM_PHOTOS].sort(() => Math.random() - 0.5);

// Optional background music (put a music.mp3 in public/ and use '/music.mp3')
const BACKGROUND_MUSIC = '/song.mp3';

/*************************************************
Shared UI building blocks
*************************************************/
const TurkishMoon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 300 300" aria-hidden>
    {/* Realistic Turkish Crescent and Star */}
    <defs>
      <radialGradient id="moonGlow" cx="50%" cy="50%">
        <stop offset="0%" style={{ stopColor: '#fff9e6', stopOpacity: 0.9 }} />
        <stop offset="50%" style={{ stopColor: '#ffd166', stopOpacity: 0.7 }} />
        <stop offset="100%" style={{ stopColor: '#ffd166', stopOpacity: 0 }} />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Glow effect */}
    <circle cx="120" cy="150" r="80" fill="url(#moonGlow)" opacity="0.4" />

    {/* Main crescent moon */}
    <g filter="url(#glow)">
      <circle cx="120" cy="150" r="65" fill="#ffeaa7" />
      <circle cx="135" cy="150" r="58" fill="#0a0f1a" />
    </g>

    {/* Star */}
    <g transform="translate(210,140)" filter="url(#glow)">
      <polygon
        fill="#ffeaa7"
        points="15,0 18.54,9.27 28.53,10.85 21.27,17.64 23.09,27.5 15,22.5 6.91,27.5 8.73,17.64 1.47,10.85 11.46,9.27"
      />
    </g>
  </svg>
);

const Stars = () => {
  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 80; i++) {
      arr.push({
        left: Math.random() * 100,
        top: Math.random() * 70,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2
      });
    }
    return arr;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const Clouds = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
    <motion.div
      className="absolute w-96 h-32 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full blur-2xl"
      style={{ top: '10%', left: '-10%' }}
      animate={{ x: ['0%', '120%'] }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
    />
    <motion.div
      className="absolute w-80 h-28 bg-gradient-to-r from-transparent via-white/8 to-transparent rounded-full blur-2xl"
      style={{ top: '25%', left: '100%' }}
      animate={{ x: ['-20%', '-140%'] }}
      transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
    />
    <motion.div
      className="absolute w-72 h-24 bg-gradient-to-r from-transparent via-white/12 to-transparent rounded-full blur-xl"
      style={{ top: '40%', left: '-15%' }}
      animate={{ x: ['0%', '130%'] }}
      transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

const Trees = () => (
  <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none">
    <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
      <defs>
        <linearGradient id="treeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0a0f1a', stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Tree silhouettes */}
      <path d="M0,200 L0,120 Q50,80 80,100 Q100,60 120,90 Q140,70 160,100 Q180,85 200,110 L200,200 Z" fill="url(#treeGradient)" opacity="0.8" />
      <path d="M150,200 L150,100 Q180,70 200,95 Q220,60 240,85 Q260,75 280,95 Q300,80 320,105 L320,200 Z" fill="url(#treeGradient)" opacity="0.7" />
      <path d="M280,200 L280,110 Q310,85 330,100 Q350,70 370,95 Q390,80 410,100 Q430,90 450,110 L450,200 Z" fill="url(#treeGradient)" opacity="0.85" />
      <path d="M420,200 L420,95 Q450,65 470,90 Q490,55 510,85 Q530,70 550,95 Q570,80 590,105 L590,200 Z" fill="url(#treeGradient)" opacity="0.75" />
      <path d="M560,200 L560,105 Q590,80 610,100 Q630,65 650,90 Q670,75 690,100 Q710,85 730,110 L730,200 Z" fill="url(#treeGradient)" opacity="0.8" />
      <path d="M700,200 L700,115 Q730,90 750,105 Q770,75 790,100 Q810,85 830,105 Q850,95 870,115 L870,200 Z" fill="url(#treeGradient)" opacity="0.7" />
      <path d="M840,200 L840,100 Q870,70 890,95 Q910,60 930,90 Q950,75 970,100 Q990,85 1010,110 L1010,200 Z" fill="url(#treeGradient)" opacity="0.85" />
      <path d="M980,200 L980,110 Q1010,85 1030,100 Q1050,70 1070,95 Q1090,80 1110,105 Q1130,90 1150,115 L1150,200 Z" fill="url(#treeGradient)" opacity="0.75" />
      <path d="M1100,200 L1100,105 Q1130,80 1150,100 Q1170,65 1190,95 L1200,100 L1200,200 Z" fill="url(#treeGradient)" opacity="0.8" />
    </svg>
  </div>
);

const Particles = ({ count = 24, night = false }) => {
  const items = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i += 1) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 4;
      const size = 20 + Math.random() * 30; // Significantly larger (20px to 50px)
      const isHeart = Math.random() > 0.4; // mostly hearts
      arr.push({ left, top, delay, size, isHeart });
    }
    return arr;
  }, [count]);

  return (
    <div aria-hidden>
      {items.map((p, idx) => (
        <motion.div
          key={idx}
          className="particle select-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.9, y: -10 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: p.delay }}
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
        >
          <div
            style={{ fontSize: p.size, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}
            className={night ? 'animate-twinkle' : 'animate-float'}
          >
            {p.isHeart ? (
              <span className="text-pink-400">❤</span>
            ) : (
              <span className="text-yellow-200">★</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const BirthdayDecorations = () => {
  const elements = useMemo(() => {
    const emojis = ['🎂', '🎉', '🎁', '🎈', '✨'];
    return Array.from({ length: 6 }).map((_, i) => ({ // Reduced from 18 to 6 emojis
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      baseSpeed: 16 + Math.random() * 10, // Slower float duration
      delay: Math.random() * 5,
      size: 4 + Math.random() * 3, // Very large size (4rem to 7rem)
      rotationDir: Math.random() > 0.5 ? 1 : -1
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute"
          style={{
            left: `${el.left}%`,
            fontSize: `${el.size}rem`,
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))'
          }}
          initial={{ y: '110vh', opacity: 0, rotate: 0 }}
          animate={{
            y: '-20vh',
            opacity: [0, 1, 1, 0],
            rotate: [0, 180 * el.rotationDir, 360 * el.rotationDir]
          }}
          transition={{
            duration: el.baseSpeed,
            repeat: Infinity,
            delay: el.delay,
            ease: 'linear'
          }}
        >
          {el.emoji}
        </motion.div>
      ))}
    </div>
  );
};

const Avatar = ({ url, name = '', flip = false }) => (
  <div className={`flex flex-col items-center justify-center w-full py-2 sm:py-4 ${flip ? 'scale-x-[-1]' : ''}`}>
    <div className="avatar-ring flex items-center justify-center bg-black/20 overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.15)] w-[85vw] h-[85vw] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] transition-all duration-500 hover:scale-105">
      <img
        src={url}
        alt={name}
        className="w-full h-full object-contain p-2 drop-shadow-lg"
      />
    </div>
  </div>
);



const SceneWrapper = ({ mode = 'day', children, footer, voiceOverUrl, active, onVoiceEnd }) => {
  const isNight = mode === 'night';
  const isSunset = mode === 'sunset';
  const audioRef = useRef(null);

  useEffect(() => {
    if (active && voiceOverUrl && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
  }, [active, voiceOverUrl]);

  const bgClass = isNight
    ? 'bg-night-gradient'
    : isSunset
      ? 'bg-sunset-gradient'
      : 'bg-day-gradient';

  return (
    <motion.div
      className={`scene-container ${bgClass} text-center flex flex-col items-center justify-center`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Night scene elements */}
      {isNight && (
        <>
          <Stars />
          <Clouds />
          <div className="absolute right-4 top-4 sm:right-8 sm:top-6 w-56 sm:w-72 md:w-80 opacity-95">
            <TurkishMoon />
          </div>
          <Trees />
        </>
      )}

      <BirthdayDecorations />
      <Particles count={8} night={isNight} />

      <div className="relative z-10 w-full px-3 sm:px-6 flex flex-col items-center gap-4">
        {children}
      </div>

      {footer && (
        <div className="absolute bottom-4 left-0 right-0 z-10 flex items-center justify-center">
          {footer}
        </div>
      )}

      {voiceOverUrl && (
        <audio ref={audioRef} src={voiceOverUrl} onEnded={onVoiceEnd} />
      )}
    </motion.div>
  );
};

const Controls = ({ onPrev, onNext, auto, setAuto, musicOn, setMusicOn, handleNextClick }) => (
  <div className="fixed z-[9999] bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-between gap-2 glass-panel rounded-full px-3 py-2 text-white w-[92vw] max-w-sm sm:max-w-md sm:px-6 shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/20">
    <button onClick={onPrev} className="flex-1 px-2 py-2 rounded-full glass-panel hover:bg-white/20 transition-all font-medium text-xs sm:text-base whitespace-nowrap">⟨ Back</button>
    <button onClick={handleNextClick} className="flex-1 px-2 py-2 rounded-full bg-brand-600/60 hover:bg-brand-500 transition-all font-medium text-xs sm:text-base whitespace-nowrap shadow-[0_0_15px_rgba(236,72,153,0.4)]">Next ⟩</button>
    <button onClick={() => setAuto(!auto)} className={`flex-1 px-2 py-2 rounded-full transition-all font-medium text-xs sm:text-base whitespace-nowrap ${auto ? 'bg-brand-500/80 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'glass-panel hover:bg-white/20'}`}>Auto</button>
    <button onClick={() => setMusicOn(!musicOn)} className={`flex-1 px-2 py-2 rounded-full transition-all flex items-center justify-center gap-1 font-medium text-xs sm:text-base whitespace-nowrap ${musicOn ? 'bg-brand-500/80 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'glass-panel hover:bg-white/20 animate-pulse-glow text-pink-200'}`}>
      {musicOn ? '🎧 ON' : '🔇 OFF'}
    </button>
  </div>
);

const ProgressBar = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;
  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 bg-black/40 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

const MusicPlayer = ({ src, playing }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (playing && src) {
      ref.current.volume = 0.5;
      const play = ref.current.play();
      if (play?.catch) play.catch(() => { });
    } else {
      ref.current.pause();
    }
  }, [playing, src]);
  return src ? <audio ref={ref} src={src} loop /> : null;
};

/*************************************************
Individual scenes (each memory as its own component)
*************************************************/
const Intro = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-8">
    <motion.div
      initial={{ y: -30, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center z-10 w-full flex flex-col items-center"
    >
      <h1 className="font-dancing text-6xl sm:text-7xl md:text-[6rem] lg:text-[7rem] text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-pink-200 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)] leading-tight py-2">
        Happy Birthday
      </h1>
      <p className="font-outfit text-2xl sm:text-3xl md:text-4xl text-pink-50 tracking-[0.3em] uppercase font-light mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
        {NAMES.her}
      </p>
    </motion.div>

    <motion.div
      className="flex items-center gap-6 mt-2"
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
    >
      <Avatar url={PHOTO_INTRO} name={""} />
    </motion.div>
  </div>
);

const Birth = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[0]} name={NAMES.her} />
  </div>
);

const Class10 = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[1]} name={NAMES.her} />
  </div>
);

const Class12 = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[2]} name={NAMES.her} />
  </div>
);

const Met = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[3]} name={NAMES.her} />
  </div>
);

const LateNightTalks = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[4]} name={NAMES.her} />
  </div>
);

const FirstCall = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[5]} name={NAMES.her} />
  </div>
);

const VirtualDate = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[6]} name={NAMES.her} />
  </div>
);

const FourthNov = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[7]} name={NAMES.her} />
  </div>
);

const DressSelected = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[8]} name={NAMES.her} />
  </div>
);

const Concerts = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[9]} name={NAMES.her} />
  </div>
);

const FirstMeet = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[0]} name={NAMES.her} />
  </div>
);

const FavouriteFood = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[1]} name={NAMES.her} />
  </div>
);

const BirthdayMonth = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[2]} name={NAMES.her} />
  </div>
);

const ArgumentsAndReturn = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[3]} name={NAMES.her} />
  </div>
);

const Preferences = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[4]} name={NAMES.her} />
  </div>
);

const Achievements = () => (
  <div className="flex flex-col items-center gap-5">
    <Avatar url={shuffledPhotos[5]} name={NAMES.her} />
  </div>
);



const SharedSky = () => (
  <div className="flex flex-col items-center gap-6">
    <Avatar url={PHOTO_SKY} name={""} />
  </div>
);

const BirthdayWish = () => (
  <div className="flex flex-col items-center gap-6 px-2 sm:px-4 py-4 w-full max-w-7xl mx-auto flex-1">
    <motion.div
      className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 animate-pulseGlow flex items-center justify-center text-6xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 }}
      style={{ boxShadow: '0 0 30px 15px rgba(255,105,180,0.6)' }}
    >
      🎂
    </motion.div>

    <Avatar url={shuffledPhotos[5]} name={""} />

    <motion.div
      className="text-center space-y-4 max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed">
        <div style={{ height: '50px' }} />
      </div>
    </motion.div>

    <motion.div
      className="flex gap-3 text-4xl mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <span className="animate-float">🎈</span>
      <span className="animate-float" style={{ animationDelay: '0.2s' }}>🎁</span>
      <span className="animate-float" style={{ animationDelay: '0.4s' }}>🌺</span>
      <span className="animate-float" style={{ animationDelay: '0.6s' }}>✨</span>
    </motion.div>
  </div>
);

/*************************************************
Scene registry with presentation hints
*************************************************/
const SCENES = [
  { key: 'intro', component: Intro, mode: 'sunset', duration: 5 },
  { key: 'birth', component: Birth, mode: 'night', duration: 5 },
  { key: 'class10', component: Class10, mode: 'day', duration: 5 },
  { key: 'class12', component: Class12, mode: 'day', duration: 4 },
  { key: 'met', component: Met, mode: 'sunset', duration: 5 },
  { key: 'late', component: LateNightTalks, mode: 'night', duration: 6 },
  { key: 'firstcall', component: FirstCall, mode: 'night', duration: 5 },
  { key: 'virtual', component: VirtualDate, mode: 'day', duration: 5 },
  { key: 'nov4', component: FourthNov, mode: 'sunset', duration: 4 },
  { key: 'nov10', component: DressSelected, mode: 'day', duration: 4 },
  { key: 'concerts', component: Concerts, mode: 'night', duration: 4 },
  { key: 'firstmeet', component: FirstMeet, mode: 'sunset', duration: 5 },
  { key: 'food', component: FavouriteFood, mode: 'day', duration: 4 },
  { key: 'bday', component: BirthdayMonth, mode: 'day', duration: 4 },
  { key: 'prefs', component: Preferences, mode: 'day', duration: 6 },
  { key: 'achievements', component: Achievements, mode: 'day', duration: 6 },

  { key: 'arg', component: ArgumentsAndReturn, mode: 'night', duration: 5 },
  { key: 'sky', component: SharedSky, mode: 'night', duration: 6 },
  { key: 'birthday', component: BirthdayWish, mode: 'night', duration: 10 },
  { key: 'final', component: FinalCollage, mode: 'night', duration: 15 },
];

/*************************************************
Main App
*************************************************/
function App() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const SceneComp = SCENES[index]?.component || Intro;
  const mode = SCENES[index]?.mode || 'day';
  const duration = SCENES[index]?.duration || 5;

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % SCENES.length), duration * 1000);
    return () => clearTimeout(t);
  }, [index, auto, duration]);

  const goNext = useCallback(() => setIndex((i) => (i + 1) % SCENES.length), []);
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + SCENES.length) % SCENES.length), []);

  const handleNextClick = useCallback((e) => {
    // Fire confetti from the button's position
    const rect = e.target.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x, y },
      colors: ['#ff69b4', '#8a2be2', '#ffb6c1', '#f0f8ff']
    });

    goNext();
  }, [goNext]);

  return (
    <div className="w-full h-full">
      <MusicPlayer src={BACKGROUND_MUSIC} playing={musicOn} />

      <ProgressBar current={index} total={SCENES.length} />

      <AnimatePresence mode="wait">
        <SceneWrapper key={SCENES[index].key} mode={mode} active voiceOverUrl={SCENES[index]?.voiceOver}>
          <SceneComp />
        </SceneWrapper>
      </AnimatePresence>

      <Controls onPrev={goPrev} onNext={goNext} handleNextClick={handleNextClick} auto={auto} setAuto={setAuto} musicOn={musicOn} setMusicOn={setMusicOn} />
    </div>
  );
}

export default App;
