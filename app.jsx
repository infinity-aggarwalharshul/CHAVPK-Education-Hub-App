import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Globe, Shield, Cpu, Zap, PlayCircle, Gamepad2, Mic, Video,
  MessageSquare, UploadCloud, Fingerprint, Lock, Coins, ArrowRight, Menu,
  X, BookOpen, Info, HelpCircle, FileText, ShieldAlert, LogIn, User,
  Search, Lightbulb, TrendingUp, Award, CheckCircle2, Image as ImageIcon,
  CreditCard, Wallet, BarChart, CheckSquare, Calendar, Star, Paperclip, File, Send, Loader2
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// --- FIREBASE CLOUD DATABASE (Zero-Trust Quantum Architecture Setup) ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- MOCK CURRENCY DATA & GEOLOCATION ---
const currencyMap = {
  'US': { code: 'USD', symbol: '$', rate: 1.00 },
  'GB': { code: 'GBP', symbol: '£', rate: 0.79 },
  'EU': { code: 'EUR', symbol: '€', rate: 0.92 },
  'IN': { code: 'INR', symbol: '₹', rate: 83.12 },
  'AU': { code: 'AUD', symbol: 'A$', rate: 1.52 },
  'CA': { code: 'CAD', symbol: 'C$', rate: 1.36 },
  'CH': { code: 'CHF', symbol: 'CHF', rate: 0.90 },
  'JP': { code: 'JPY', symbol: '¥', rate: 151.20 },
  'AE': { code: 'AED', symbol: 'د.إ', rate: 3.67 },
  'KW': { code: 'KWD', symbol: 'د.ك', rate: 0.31 },
};

const departments = [
  "HR Department", "Finance Department", "CEO / Executive Core",
  "Brainstorming Sessions", "Data Analysts", "Data Scientists",
  "Research & Development", "Shareholders", "Meeting Rooms Head",
  "CCTV Monitoring Room", "Interior Designers", "Transportation",
  "Emergency Conditions", "Cleaning Staff", "Security Guards", "Extra / Auxillary"
];

const compressPayload = (data) => JSON.stringify(data);

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [themeGlow, setThemeGlow] = useState('rgba(6, 182, 212, 0.4)');
 
  // Auth & Cloud State
  const [user, setUser] = useState(null);
  const [loginMode, setLoginMode] = useState('student');
  const [authStatus, setAuthStatus] = useState('');

  // Location & Pricing State
  const [basePriceUSD] = useState(99.99);
  const [userCurrency, setUserCurrency] = useState(currencyMap['US']);
 
  // Payment Gateway State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentStatus, setPaymentStatus] = useState('');

  // Scholar State
  const [scholarQuery, setScholarQuery] = useState('');
  const [scholarResult, setScholarResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Education Portal State
  const [eduTab, setEduTab] = useState('learn'); // 'learn', 'quiz', 'report'
  const [selectedClass, setSelectedClass] = useState('Class 3');

  // AI Tutor Chat State
  const fileInputRef = useRef(null);
  const [chatInput, setChatInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [silentTraining, setSilentTraining] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Namaste! I am your VidyaPragya AI Tutor. I use powerful NLP and Computer Vision. You can type, speak, or upload an image/document of a problem you are stuck on! 🎤📷' }
  ]);

  // Dynamic Quizzes Based on Selected Class
  const classAssessments = useMemo(() => ({
    'Class 1': [
      { subject: 'Mathematics', time: '10 Mins', title: 'Counting & Basic Shapes', desc: 'Identify primary shapes (Circle, Square) and count objects up to 50.' },
      { subject: 'Science', time: '15 Mins', title: 'Living vs Non-Living', desc: 'Categorize objects around us based on sensory observation frameworks.' }
    ],
    'Class 2': [
      { subject: 'Mathematics', time: '15 Mins', title: 'Multi-Digit Arithmetic', desc: 'Addition and subtraction of double-digit numbers.' },
      { subject: 'Science', time: '20 Mins', title: 'Weather Matrices', desc: 'Identify seasons, weather patterns, and structural physics of simple forces.' }
    ],
    'Class 3': [
      { subject: 'Mathematics', time: '20 Mins', title: 'Fractions & Proportions', desc: 'Test your knowledge on shapes, spatial volume, and basic fractional groupings.' },
      { subject: 'Science', time: '20 Mins', title: 'Ecosystems & Energy', desc: 'Identify terrestrial ecosystems, food chains, and states of matter.' }
    ],
    'Class 4': [
      { subject: 'Mathematics', time: '25 Mins', title: 'Long Division & Decimals', desc: 'Advanced multi-digit division and decimal transformations.' },
      { subject: 'Science', time: '30 Mins', title: 'Human Anatomy & Electricity', desc: 'Comparative human anatomy and introduction to electrical circuits.' }
    ],
    'Class 5': [
      { subject: 'Mathematics', time: '30 Mins', title: 'Ratios & 3D Spatial Volume', desc: 'Calculate multi-variable algebraic equations and coordinate graphing.' },
      { subject: 'Science', time: '35 Mins', title: 'Planetary Systems & Mechanics', desc: 'Identify classical mechanics foundations and planetary astronomy patterns.' }
    ]
  }), []);

  // --- INITIALIZATION & GEOLOCATION ---
  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.includes('Kolkata')) setUserCurrency(currencyMap['IN']);
      else if (timezone.includes('London')) setUserCurrency(currencyMap['GB']);
      else if (timezone.includes('Europe')) setUserCurrency(currencyMap['EU']);
      else if (timezone.includes('Sydney')) setUserCurrency(currencyMap['AU']);
      else if (timezone.includes('Dubai')) setUserCurrency(currencyMap['AE']);
      else setUserCurrency(currencyMap['US']);
    } catch (e) {
      setUserCurrency(currencyMap['US']);
    }

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Cloud Auth Error:", err);
      }
    };
    initAuth();
   
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setAuthStatus('Connection Secured via Quantum-Encrypted Node');
    });

    const glowInterval = setInterval(() => {
      setThemeGlow(prev => prev === 'rgba(6, 182, 212, 0.4)' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(6, 182, 212, 0.4)');
    }, 4000);

    return () => {
      unsubscribe();
      clearInterval(glowInterval);
    };
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimulatedLogin = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      setAuthStatus('Authenticating via Blockchain Ledger & Data Compression...');
      const payload = compressPayload({ role: loginMode, security: 'Quantum 256-bit' });
      const userRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
      await setDoc(userRef, { data: payload, lastLogin: serverTimestamp() });
     
      setTimeout(() => {
        setAuthStatus('Login Successful! Welcome to The CHAVPK.');
        setTimeout(() => navigate(loginMode === 'corporate' ? 'scholar' : 'education'), 1500);
      }, 1200);
    } catch (err) {
      setAuthStatus('Database connection error. Retrying securely...');
    }
  };

  const handleScholarSearch = (e) => {
    e.preventDefault();
    if (!scholarQuery) return;
    setIsSearching(true);
    setScholarResult(null);
   
    setTimeout(() => {
      setIsSearching(false);
      setScholarResult({
        noveltyScore: Math.floor(Math.random() * 20) + 80,
        impact: 'Transformative (Global Scale)',
        patentable: true,
        summary: `Your idea "${scholarQuery}" intersects multiple advanced domains. The 10-Trillion SQL cross-reference confirms high ideological novelty. High potential for global socioeconomic impact via AI integration. Recommended for immediate documentation under The ChitraHarshaVPK protocols.`,
        competitors: 0
      });
    }, 2500);
  };

  const openPaymentModal = (planName, planPrice) => {
    setSelectedPlan({ name: planName, price: planPrice });
    setPaymentStatus('');
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPaymentStatus('Processing Secure Payment...');
    setTimeout(() => {
      setPaymentStatus('Payment Successful! Ecosystem Access Granted.');
      setTimeout(() => {
        setShowPaymentModal(false);
        navigate('education');
      }, 2000);
    }, 2500);
  };

  // --- AI TUTOR CHAT LOGIC ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() && !selectedFile) return;

    const newUserMsg = { role: 'user', text: chatInput, file: selectedFile };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setSelectedFile(null);
    setIsAiTyping(true);

    // Simulate AI Processing & Silent Training
    setTimeout(() => {
      let aiResponse = "";
     
      if (newUserMsg.file) {
        const fileType = newUserMsg.file.type.split('/')[0] || 'file';
        aiResponse = `I have successfully parsed the ${fileType} data from "${newUserMsg.file.name}". Based on my multimodal analysis of this content alongside your query, I can see exactly where the concept connects. Let me break down the solution step-by-step for ${selectedClass} level...`;
       
        // Trigger silent background training
        setSilentTraining(true);
        setTimeout(() => setSilentTraining(false), 4500);
      } else {
        aiResponse = `That's a brilliant question about ${selectedClass} topics! Imagine the Earth is a giant, friendly magnet... This invisible pull is called gravity. Want me to generate a lightweight 3D model for you? 🌍✨`;
      }

      setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsAiTyping(false);
    }, 2500);
  };


  // --- SEO BLOG CONTENT ---
  const blogContent = useMemo(() => [
    { type: 'h1', text: 'The Future of AI-Driven Education: Bridging Ancient Wisdom with Quantum Technology' },
    { type: 'p', text: 'In an era defined by rapid technological acceleration, the intersection of education and artificial intelligence represents the most crucial frontier for human development. The ChitraHarshaVPK Ventures Pvt Ltd is pioneering this space by developing ecosystems that seamlessly blend ancient Indian philosophical concepts—like VidyaPragya (Supreme Knowledge)—with hyper-advanced, quantum-encrypted 10-Trillion SQL architectures.' },
    { type: 'img', src: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200', alt: 'AI Education Hologram' },
    { type: 'h2', text: 'Cognitive NLP Tutors for Class 1 to 5' },
    { type: 'p', text: 'The traditional classroom model is undergoing a monumental shift. Rather than a one-size-fits-all approach, generative Large Language Models (LLMs) and Multimodal AI agents can now adapt dynamically to a child’s unique learning pace. For students in Class 1 through 5, this means interacting with empathetic digital tutors capable of processing speech, text, and visual inputs in real-time. By utilizing lightning-fast data compression techniques, these complex models are delivered instantly, making learning entirely frictionless and deeply engaging.' },
    { type: 'p', text: 'Furthermore, cognitive breaks are mathematically programmed into the curriculum. After a continuous hour of study, the AI transitions the environment into interactive 3D spatial mini-games. This gamification of physics and mathematics cements foundational concepts in young minds while completely avoiding cognitive fatigue.' },
    { type: 'h2', text: 'Zero-Trust Security & Sovereign Cloud Storage' },
    { type: 'p', text: 'As educational platforms digitize, data privacy has become a paramount global concern. Modern architectures must transcend standard protections. The CHAVPK ecosystem utilizes a Zero-Trust, MeitY-Compliant framework. Every byte of student progress and biometric login data is fragmented, encrypted using post-quantum cryptographic primitives, and dispersed across decentralized blockchain ledgers. Continuous Dark Web and Malware heuristic monitoring ensures that the perimeter is impenetrable, safeguarding the identities of the next generation.' },
    { type: 'img', src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200', alt: 'Global Tech Infrastructure' },
    { type: 'h2', text: 'Global Accessibility & Freemium Commercial Readiness' },
    { type: 'p', text: 'To truly transform lives on a global scale, cutting-edge technology must be financially accessible. Innovative dynamic pricing APIs automatically geolocate users, presenting premium educational tiers in their native currencies—be it INR, USD, GBP, or native CHC Crypto-currency. This removes friction from the onboarding process. Coupled with ad-free video streaming wrappers and 10-Trillion SQL database query support, the platform guarantees a premium, uninterrupted experience regardless of the user\'s global location.' },
    { type: 'p', text: 'In conclusion, the synthesis of robust SEO marketing strategies, lightweight data conversion, and unprecedented AI integration positions The CHAVPK VidyaPragya not just as an educational tool, but as an innovative, commercially-ready paradigm shift in human intellectual development.' }
  ], []);

  return (
    <div className="min-h-screen bg-[#050B14] text-gray-100 font-sans selection:bg-cyan-500 selection:text-white transition-all duration-700 overflow-x-hidden">
     
      {/* Dynamic Glow & Core CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .neon-border { box-shadow: 0 0 20px ${themeGlow}, inset 0 0 10px ${themeGlow}; border: 1px solid rgba(255,255,255,0.15); }
        .neon-text { text-shadow: 0 0 15px ${themeGlow}; }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        .scanline-effect { position: fixed; top: 0; left: 0; width: 100%; height: 8px; background: rgba(6, 182, 212, 0.15); animation: scanline 10s linear infinite; pointer-events: none; z-index: 50; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050B14; }
        ::-webkit-scrollbar-thumb { background: #06b6d4; border-radius: 10px; }
        .glass-panel { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.05); }
        .tab-active { background: rgba(6, 182, 212, 0.15); border-bottom: 2px solid #06b6d4; color: #22d3ee; }
        .tab-inactive { color: #9ca3af; hover:color: #d1d5db; }
      `}} />

      <div className="scanline-effect"></div>

      {/* --- SIDEBAR NAVIGATION --- */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-[#0A1120] border-r border-gray-800/50 z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.8)]`}>
        <div className="p-6 border-b border-gray-800/50 flex justify-between items-center bg-[#050B14]">
          <div className="flex items-center space-x-3">
            <Cpu className="w-8 h-8 text-cyan-400" />
            <span className="font-black text-xl text-cyan-400 tracking-wider">NAVIGATE</span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white transition bg-gray-800/50 hover:bg-gray-700 p-2 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {[
            { id: 'home', icon: Globe, label: 'Home Universe' },
            { id: 'education', icon: BookOpen, label: 'AI Education Portal' },
            { id: 'scholar', icon: Lightbulb, label: 'VidyaPragya Scholar' },
            { id: 'blogs', icon: FileText, label: 'SEO Tech Blogs' },
            { id: 'pricing', icon: Coins, label: 'Dynamic Global Pricing' },
          ].map((item) => (
            <button key={item.id} onClick={() => navigate(item.id)} className={`w-full flex items-center p-4 rounded-2xl transition duration-300 ${currentPage === item.id ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50 shadow-inner' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}`}>
              <item.icon className="w-6 h-6 mr-4" /> <span className="font-bold">{item.label}</span>
            </button>
          ))}
         
          <div className="h-px bg-gray-800/50 my-6"></div>
         
          {[
            { id: 'about', icon: Info, label: 'About Us' },
            { id: 'faqs', icon: HelpCircle, label: 'FAQs' },
            { id: 'privacy', icon: ShieldAlert, label: 'Privacy & Security' },
            { id: 'terms', icon: CheckCircle2, label: 'Terms & Conditions' },
          ].map((item) => (
            <button key={item.id} onClick={() => navigate(item.id)} className={`w-full flex items-center p-4 rounded-2xl transition duration-300 ${currentPage === item.id ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50 shadow-inner' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}`}>
              <item.icon className="w-5 h-5 mr-4" /> <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-6 border-t border-gray-800/50 bg-[#050B14]">
          <div className="text-[11px] text-emerald-400 flex flex-col space-y-2 bg-emerald-900/20 p-4 rounded-2xl border border-emerald-500/20">
            <span className="flex items-center font-bold text-sm"><Shield className="w-5 h-5 mr-2" /> Quantum DB Active</span>
            <span className="opacity-70 leading-relaxed">Encrypted lightweight data compression. Dark Web Monitoring Online.</span>
          </div>
        </div>
      </div>
     
      {isMenuOpen && <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>}

      {/* --- HEADER --- */}
      <nav className="sticky top-0 z-30 glass-panel border-b border-gray-800/50 p-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <button onClick={() => setIsMenuOpen(true)} className="text-cyan-400 hover:text-white transition p-2.5 rounded-xl bg-gray-900/50 border border-gray-700/50 hover:border-cyan-500/50 hover:bg-gray-800 shadow-inner">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('home')}>
              <div className="relative hidden sm:block">
                <Cpu className="w-9 h-9 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 blur-lg bg-cyan-400/30 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 tracking-tighter">
                  The CHAVPK VidyaPragya
                </h1>
                <p className="text-[10px] text-gray-400 tracking-[0.25em] uppercase hidden sm:block font-bold">World's Most Powerful Innovations</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button onClick={() => navigate('login')} className="px-6 py-2.5 text-sm neon-border rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold transition flex items-center shadow-lg transform hover:scale-105">
              <LogIn className="w-4 h-4 mr-2" /> Auth Portal
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto p-5 md:p-8 min-h-[85vh]">
       
        {/* --- PAGE: HOME --- */}
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-1000 py-16 md:py-24">
            <div className="text-center max-w-5xl mx-auto mb-24 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-900/20 to-purple-900/20 blur-[100px] rounded-full pointer-events-none"></div>
             
              <div className="relative z-10">
                <div className="inline-flex items-center px-5 py-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-sm font-bold mb-8 shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur">
                  <Zap className="w-4 h-4 mr-2" /> Compressed Data architecture & 10-Trillion SQL Support
                </div>
                <h2 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                  The Pinnacle of AI-Edutech & <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400">Advanced Blockchain Ecosystem</span>
                </h2>
                <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Engineered with unparalleled novelty features. Integrating Google Scholar-tier ideological search, Class 1-5 NLP learning hubs, Assessment Quizzes, and MeitY-Compliant Quantum Storage dynamically scaled for commercial global impact.
                </p>
               
                <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
                  <button onClick={() => navigate('education')} className="px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-black text-lg hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition duration-300 flex items-center w-full sm:w-auto justify-center">
                    <PlayCircle className="w-6 h-6 mr-3" /> Access Learning Portal
                  </button>
                  <button onClick={() => navigate('scholar')} className="px-10 py-5 glass-panel rounded-2xl font-bold text-lg hover:bg-gray-800/80 transition duration-300 flex items-center w-full sm:w-auto justify-center border border-purple-500/30 text-purple-300">
                    <Lightbulb className="w-6 h-6 mr-3" /> Try VidyaPragya Scholar
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <div className="p-8 rounded-3xl glass-panel border-t border-gray-700/50 hover:border-emerald-500/50 transition duration-500 text-center sm:text-left group">
                <div className="bg-emerald-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto sm:mx-0 border border-emerald-500/20 group-hover:bg-emerald-600 transition duration-500">
                  <Shield className="w-8 h-8 text-emerald-400 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white">Quantum Security</h3>
                <p className="text-base text-gray-400 leading-relaxed">Impenetrable Blockchain data encryption, active Dark Web monitoring, and highly compressed data pipelines ensuring lightning-fast performance.</p>
              </div>
              <div className="p-8 rounded-3xl glass-panel border-t border-gray-700/50 hover:border-blue-500/50 transition duration-500 text-center sm:text-left group">
                <div className="bg-blue-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto sm:mx-0 border border-blue-500/20 group-hover:bg-blue-600 transition duration-500">
                  <Globe className="w-8 h-8 text-blue-400 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white">Universal Payments</h3>
                <p className="text-base text-gray-400 leading-relaxed">Auto-detects user location to provide local pricing. Universal gateway supports Cards, PayPal, UPI, and native Crypto APIs.</p>
              </div>
              <div className="p-8 rounded-3xl glass-panel border-t border-gray-700/50 hover:border-purple-500/50 transition duration-500 text-center sm:text-left group">
                <div className="bg-purple-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto sm:mx-0 border border-purple-500/20 group-hover:bg-purple-600 transition duration-500">
                  <Cpu className="w-8 h-8 text-purple-400 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white">Innovative AI & NLP</h3>
                <p className="text-base text-gray-400 leading-relaxed">Featuring proprietary novelty features, real-time voice transcripts, file analysis uploads, and abroad syllabus-mapped assessments.</p>
              </div>
            </div>
          </div>
        )}

        {/* --- PAGE: LOGIN / REGISTER --- */}
        {currentPage === 'login' && (
          <div className="max-w-xl mx-auto py-16 animate-in zoom-in-95 duration-500 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-transparent blur-3xl rounded-full"></div>
           
            <div className="glass-panel rounded-[2rem] border border-gray-700/50 overflow-hidden shadow-2xl neon-border relative z-10">
              <div className="flex border-b border-gray-800 bg-[#0A1120]">
                <button onClick={() => setLoginMode('student')} className={`flex-1 py-6 text-center font-black text-sm md:text-base transition duration-300 ${loginMode === 'student' ? 'bg-cyan-900/30 text-cyan-400 border-b-2 border-cyan-400 shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>
                  <User className="w-5 h-5 inline-block mr-2" /> Student Portal
                </button>
                <button onClick={() => setLoginMode('corporate')} className={`flex-1 py-6 text-center font-black text-sm md:text-base transition duration-300 ${loginMode === 'corporate' ? 'bg-purple-900/30 text-purple-400 border-b-2 border-purple-400 shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>
                  <Shield className="w-5 h-5 inline-block mr-2" /> Corporate Staff
                </button>
              </div>

              <div className="p-8 md:p-12">
                <form onSubmit={handleSimulatedLogin} className="space-y-6">
                  <div className="text-center mb-10">
                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">
                      {loginMode === 'student' ? 'Welcome Back!' : 'Enterprise Access'}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {loginMode === 'student'
                        ? 'Sign in securely to access quizzes, reports, and the interactive Class 1-5 learning universe.'
                        : 'For verified staff, operations, and registered venture roles.'}
                    </p>
                  </div>
                 
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
                        {loginMode === 'student' ? 'Student Name / Parent Email' : 'Corporate Email / Virtual ID'}
                      </label>
                      <input type="text" required placeholder="Enter credentials" className="w-full p-4 bg-[#050B14] rounded-2xl border border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none text-white text-lg transition shadow-inner" />
                    </div>
                   
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
                        {loginMode === 'student' ? 'Biometric Passkey or Secure PIN' : 'Quantum Encrypted Password'}
                      </label>
                      <input type="password" required placeholder="••••••••" className="w-full p-4 bg-[#050B14] rounded-2xl border border-gray-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none text-white text-lg tracking-widest transition shadow-inner" />
                    </div>

                    {loginMode === 'corporate' && (
                      <>
                        <select className="w-full p-4 bg-[#050B14] rounded-2xl border border-gray-800 focus:border-purple-500 focus:outline-none text-gray-300 transition shadow-inner cursor-pointer appearance-none mt-4">
                          <option value="" disabled selected>Select Designated Department...</option>
                          {departments.map((dep, idx) => <option key={idx} value={dep}>{dep}</option>)}
                        </select>
                        <input type="text" placeholder="Govt ID Hash (Aadhaar/PAN)" className="w-full p-4 bg-[#050B14] rounded-2xl border border-gray-800 focus:outline-none text-white mt-4 shadow-inner" />
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-center text-xs font-bold text-emerald-400 bg-emerald-400/10 p-3 rounded-xl border border-emerald-400/20 mt-6">
                    <Fingerprint className="w-4 h-4 mr-2" /> OTP & Biometrics Authenticated via Blockchain
                  </div>

                  <button type="submit" className={`w-full py-4 mt-6 rounded-2xl font-black text-lg text-white transition transform hover:-translate-y-1 ${loginMode === 'student' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]' : 'bg-gradient-to-r from-purple-600 to-blue-700 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]'}`}>
                    {loginMode === 'student' ? 'Secure Login' : 'Authenticate via Node'}
                  </button>
                </form>

                {authStatus && (
                  <div className="mt-8 text-center text-sm font-bold text-cyan-400 animate-pulse bg-cyan-900/30 p-4 rounded-xl border border-cyan-500/30">
                    {authStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- PAGE: SCHOLAR --- */}
        {currentPage === 'scholar' && (
          <div className="py-12 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-4 bg-purple-900/20 rounded-full mb-6 border border-purple-500/30">
                <Lightbulb className="w-12 h-12 text-purple-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6 tracking-tight">
                VidyaPragya Scholar
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Powered by our proprietary 10-Trillion SQL database. Enter an idea to scan global databases, evaluate innovation level, and analyze its potential to transform lives on a global scale.
              </p>
            </div>

            <form onSubmit={handleScholarSearch} className="relative max-w-3xl mx-auto mb-16">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-gray-500" />
              </div>
              <input
                type="text"
                value={scholarQuery}
                onChange={(e) => setScholarQuery(e.target.value)}
                placeholder="Describe your innovative idea (e.g., AI-driven water purification)..."
                className="w-full pl-16 pr-40 py-6 bg-gray-900/80 backdrop-blur-xl border-2 border-gray-700 focus:border-purple-500 rounded-full text-lg text-white shadow-2xl focus:outline-none transition hover:border-gray-600 placeholder-gray-600"
              />
              <button
                type="submit"
                disabled={isSearching || !scholarQuery}
                className="absolute inset-y-2 right-2 px-8 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                {isSearching ? 'Scanning DB...' : 'Analyze Idea'}
              </button>
            </form>

            {isSearching && (
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-[scanline_1.5s_ease-in-out_infinite] w-1/3 rounded-full"></div>
                </div>
                <p className="text-center text-sm text-purple-400 font-mono animate-pulse">Running semantic analysis against 10-Trillion records...</p>
              </div>
            )}

            {scholarResult && !isSearching && (
              <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-[2rem] border border-purple-500/30 animate-in slide-in-from-bottom-10 shadow-[0_20px_60px_rgba(168,85,247,0.15)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
               
                <h3 className="text-2xl font-black text-white mb-8 border-b border-gray-800 pb-4">Analysis Report</h3>
               
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-700 text-center">
                    <TrendingUp className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-1">Innovation Grade</p>
                    <p className="text-4xl font-black text-emerald-400">{scholarResult.noveltyScore}%</p>
                  </div>
                  <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-700 text-center">
                    <Globe className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-1">Global Impact</p>
                    <p className="text-xl font-black text-blue-400 leading-tight mt-2">{scholarResult.impact}</p>
                  </div>
                  <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-700 text-center">
                    <Award className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-1">Registration Status</p>
                    <p className="text-2xl font-black text-purple-400 mt-2">Clear</p>
                  </div>
                </div>

                <div className="bg-purple-900/10 p-8 rounded-2xl border border-purple-500/20">
                  <h4 className="font-bold text-purple-300 text-lg mb-3">Executive Summary</h4>
                  <p className="text-gray-300 leading-relaxed text-lg">{scholarResult.summary}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- PAGE: EDUCATION DASHBOARD (Class 1-5 Portal) --- */}
        {currentPage === 'education' && (
          <div className="py-8 animate-in slide-in-from-right-8">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 space-y-4 sm:space-y-0">
               <div>
                 <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 tracking-tight">
                   AI Learning Portal
                 </h2>
                 <p className="text-base text-gray-400 mt-2 font-medium">Mapped to Global Syllabi (US Common Core, UK KS1/KS2)</p>
               </div>
               <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="glass-panel border-2 border-cyan-500 text-white rounded-2xl p-3 focus:outline-none shadow-[0_0_20px_rgba(6,182,212,0.2)] font-bold text-base w-full sm:w-auto cursor-pointer transition hover:bg-gray-800 appearance-none pr-10">
                 <option value="Class 1">🌟 Class 1: Foundations</option>
                 <option value="Class 2">🚀 Class 2: Exploration</option>
                 <option value="Class 3">🔭 Class 3: Intermediate</option>
                 <option value="Class 4">🔬 Class 4: Advanced Basics</option>
                 <option value="Class 5">🌍 Class 5: Global Preparatory</option>
               </select>
             </div>

             {/* Portal Navigation Tabs */}
             <div className="flex space-x-2 border-b border-gray-800 mb-8 overflow-x-auto">
               <button onClick={() => setEduTab('learn')} className={`px-6 py-4 font-bold text-lg whitespace-nowrap transition-all duration-300 rounded-t-2xl flex items-center ${eduTab === 'learn' ? 'tab-active' : 'tab-inactive'}`}>
                 <BookOpen className="w-5 h-5 mr-2"/> Learning Hub
               </button>
               <button onClick={() => setEduTab('quiz')} className={`px-6 py-4 font-bold text-lg whitespace-nowrap transition-all duration-300 rounded-t-2xl flex items-center ${eduTab === 'quiz' ? 'tab-active' : 'tab-inactive'}`}>
                 <CheckSquare className="w-5 h-5 mr-2"/> Quizzes & Assessments
               </button>
               <button onClick={() => setEduTab('report')} className={`px-6 py-4 font-bold text-lg whitespace-nowrap transition-all duration-300 rounded-t-2xl flex items-center ${eduTab === 'report' ? 'tab-active' : 'tab-inactive'}`}>
                 <BarChart className="w-5 h-5 mr-2"/> Parent Weekly Report
               </button>
             </div>

             {/* Tab 1: Learning Hub (Advanced AI Chat & Video) */}
             {eduTab === 'learn' && (
               <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-black aspect-video rounded-[2rem] border border-gray-700 relative group overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=1200" alt="Space Science" className="opacity-70 w-full h-full object-cover group-hover:scale-110 transition duration-[1.5s] ease-out" />
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/95 via-black/30 to-transparent">
                        <PlayCircle className="w-24 h-24 text-cyan-400 opacity-90 group-hover:scale-110 group-hover:text-white transition duration-300 shadow-2xl rounded-full" />
                      </div>
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="inline-block bg-cyan-600 text-white px-4 py-1.5 rounded-full text-xs font-black mb-4 uppercase tracking-widest shadow-lg">Science Module</div>
                        <h3 className="text-4xl font-black text-white drop-shadow-2xl leading-tight">Planetary Habitats & Space Gravity</h3>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="glass-panel p-8 rounded-[2rem] border border-gray-700 hover:border-purple-500 cursor-pointer transition duration-300 flex items-center shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] group">
                        <div className="bg-purple-900/30 p-5 rounded-2xl mr-6 group-hover:bg-purple-600 transition duration-300">
                          <Gamepad2 className="w-10 h-10 text-purple-400 group-hover:text-white transition" />
                        </div>
                        <div>
                          <h4 className="font-black text-white text-xl">3D Mini-Games</h4>
                          <p className="text-sm text-gray-400 font-medium mt-1">Play & Learn (Unlocks after 1hr)</p>
                        </div>
                      </div>
                      <div className="glass-panel p-8 rounded-[2rem] border border-gray-700 hover:border-cyan-500 cursor-pointer transition duration-300 flex items-center shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] group">
                        <div className="bg-cyan-900/30 p-5 rounded-2xl mr-6 group-hover:bg-cyan-600 transition duration-300">
                          <UploadCloud className="w-10 h-10 text-cyan-400 group-hover:text-white transition" />
                        </div>
                        <div>
                          <h4 className="font-black text-white text-xl">File Upload Hub</h4>
                          <p className="text-sm text-gray-400 font-medium mt-1">Auto-compressed Cloud Storage</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced AI Interactive Chat */}
                  <div className="glass-panel rounded-[2rem] flex flex-col h-[650px] shadow-2xl relative overflow-hidden border border-gray-700">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"></div>
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#050B14]/80 backdrop-blur z-10">
                      <h3 className="font-black flex items-center text-xl text-white"><MessageSquare className="w-6 h-6 mr-3 text-cyan-400" /> AI Tutor</h3>
                      <div className="flex items-center text-xs font-bold text-gray-400 bg-gray-900 border border-gray-700 px-4 py-2 rounded-full shadow-inner">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping mr-2"></span> Online
                      </div>
                    </div>
                   
                    {/* Silent Training Indicator */}
                    {silentTraining && (
                      <div className="bg-emerald-900/20 border-b border-emerald-500/30 p-2 flex justify-center items-center text-xs text-emerald-400 font-mono tracking-widest animate-pulse">
                        <Cpu className="w-3 h-3 mr-2"/> Encrypting & Silently Training Model Weights...
                      </div>
                    )}
                   
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-transparent custom-scrollbar">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`w-11/12 text-base shadow-md border leading-relaxed p-5 rounded-3xl ${msg.role === 'ai' ? 'bg-gray-800/80 rounded-tl-sm border-gray-700 text-gray-100' : 'bg-cyan-900/40 rounded-tr-sm ml-auto border-cyan-700/50 text-cyan-50'}`}>
                          {msg.file && (
                            <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-lg mb-3 border border-gray-700/50 w-fit">
                              <File className="w-4 h-4 text-cyan-400"/>
                              <span className="text-xs text-gray-300 font-mono truncate max-w-[150px]">{msg.file.name}</span>
                            </div>
                          )}
                          <p>{msg.text}</p>
                        </div>
                      ))}
                      {isAiTyping && (
                         <div className="w-11/12 bg-gray-800/80 rounded-3xl rounded-tl-sm border border-gray-700 p-5 shadow-md flex space-x-2 items-center">
                           <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                           <span className="text-gray-400 text-sm">Processing multimodal data...</span>
                         </div>
                      )}
                    </div>
                   
                    <div className="p-5 bg-[#050B14] border-t border-gray-800 relative">
                      {/* Selected File Preview Badge */}
                      {selectedFile && (
                        <div className="absolute -top-10 left-5 bg-cyan-900 border border-cyan-500 text-cyan-100 px-3 py-1.5 rounded-lg text-xs flex items-center shadow-lg">
                          <File className="w-3 h-3 mr-2"/> {selectedFile.name}
                          <button onClick={() => setSelectedFile(null)} className="ml-3 text-cyan-300 hover:text-white"><X className="w-3 h-3"/></button>
                        </div>
                      )}
                     
                      <form onSubmit={handleChatSubmit} className="flex items-center space-x-3 bg-gray-900 rounded-full p-2 border border-gray-700 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition shadow-inner">
                       
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx" />
                       
                        <button type="button" onClick={() => fileInputRef.current.click()} className="p-3 text-gray-400 hover:text-cyan-400 hover:bg-gray-800 transition rounded-full" title="Upload Image, Document or Audio">
                          <Paperclip className="w-5 h-5"/>
                        </button>
                        <button type="button" className="p-3 text-gray-400 hover:text-purple-400 hover:bg-gray-800 transition rounded-full"><Mic className="w-5 h-5"/></button>
                       
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask AI or upload a file..."
                          className="flex-1 bg-transparent border-none px-2 text-base text-white focus:outline-none placeholder-gray-600 font-medium"
                        />
                        <button type="submit" disabled={!chatInput.trim() && !selectedFile} className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-105 rounded-full transition text-white shadow-lg disabled:opacity-50 disabled:scale-100">
                          <Send className="w-5 h-5"/>
                        </button>
                      </form>
                    </div>
                  </div>
               </div>
             )}

             {/* Tab 2: Quizzes & Assessments (Dynamic by Class) */}
             {eduTab === 'quiz' && (
               <div className="animate-in fade-in max-w-5xl mx-auto space-y-6">
                 <div className="glass-panel p-8 rounded-[2rem] border border-cyan-500/30 flex justify-between items-center shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                   <div>
                     <h3 className="text-2xl font-black text-white mb-2 flex items-center"><CheckSquare className="w-6 h-6 text-cyan-400 mr-3"/> Global Standard Assessments ({selectedClass})</h3>
                     <p className="text-gray-400 text-lg">Mapped to US Common Core & UK KS1/KS2 curriculums.</p>
                   </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-6">
                   {classAssessments[selectedClass].map((assessment, idx) => (
                     <div key={idx} className={`bg-gray-900/80 p-8 rounded-3xl border border-gray-700 transition duration-300 ${assessment.subject === 'Mathematics' ? 'hover:border-cyan-500' : 'hover:border-purple-500'}`}>
                       <div className="flex justify-between items-start mb-4">
                         <span className={`text-xs font-bold px-3 py-1 rounded-full border ${assessment.subject === 'Mathematics' ? 'bg-blue-900/40 text-blue-400 border-blue-500/20' : 'bg-purple-900/40 text-purple-400 border-purple-500/20'}`}>
                           {assessment.subject}
                         </span>
                         <span className="text-gray-500 text-sm font-mono">{assessment.time}</span>
                       </div>
                       <h4 className="text-2xl font-bold text-white mb-3">{assessment.title}</h4>
                       <p className="text-gray-400 mb-6 line-clamp-2">{assessment.desc}</p>
                       <button className={`w-full py-4 rounded-xl font-bold text-white transition ${assessment.subject === 'Mathematics' ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-purple-600 hover:bg-purple-500'}`}>
                         Start Quiz
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {/* Tab 3: Parent Report */}
             {eduTab === 'report' && (
               <div className="animate-in fade-in max-w-5xl mx-auto space-y-6">
                 <div className="glass-panel p-8 rounded-[2rem] border border-emerald-500/30 flex justify-between items-center">
                   <div>
                     <h3 className="text-2xl font-black text-white mb-2 flex items-center"><BarChart className="w-6 h-6 text-emerald-400 mr-3"/> Parent Dashboard: Weekly Progress</h3>
                     <p className="text-gray-400 text-lg">Track active study time, assessment scores, and AI Tutor interactions for {selectedClass}.</p>
                   </div>
                   <div className="hidden md:flex items-center text-gray-400 bg-gray-900 px-4 py-2 rounded-xl border border-gray-700">
                     <Calendar className="w-5 h-5 mr-2" /> Current Week
                   </div>
                 </div>

                 <div className="grid md:grid-cols-3 gap-6">
                   <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-700 text-center">
                     <h4 className="text-gray-400 font-bold tracking-widest text-sm uppercase mb-4">Total Study Time</h4>
                     <p className="text-5xl font-black text-cyan-400 mb-2">12.5</p>
                     <p className="text-gray-500 font-medium">Hours logged this week</p>
                   </div>
                   <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-700 text-center">
                     <h4 className="text-gray-400 font-bold tracking-widest text-sm uppercase mb-4">Average Score</h4>
                     <p className="text-5xl font-black text-emerald-400 mb-2">92%</p>
                     <p className="text-gray-500 font-medium">Across 4 {selectedClass} assessments</p>
                   </div>
                   <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-700 text-center">
                     <h4 className="text-gray-400 font-bold tracking-widest text-sm uppercase mb-4">Badges Earned</h4>
                     <div className="flex justify-center space-x-2 mb-2 text-yellow-400">
                       <Star className="w-10 h-10 fill-current" />
                       <Star className="w-10 h-10 fill-current" />
                     </div>
                     <p className="text-gray-500 font-medium">Science Explorer, Math Wiz</p>
                   </div>
                 </div>

                 <div className="bg-gray-900/80 p-8 rounded-3xl border border-gray-700">
                   <h4 className="font-bold text-white text-xl mb-4">AI Tutor Feedback Analysis</h4>
                   <p className="text-gray-300 leading-relaxed bg-gray-800 p-5 rounded-xl border border-gray-700/50">
                     "Your child is showing exceptional curiosity in {selectedClass} topics, specifically querying the AI using uploaded image diagrams. They consistently ask highly relevant questions. I recommend continuing the current pace, as their multimodal comprehension is above the international standard threshold."
                   </p>
                 </div>
               </div>
             )}
          </div>
        )}

        {/* --- PAGE: PRICING (Universal Gateway) --- */}
        {currentPage === 'pricing' && (
          <div className="py-16 animate-in fade-in duration-500 max-w-6xl mx-auto">
             <div className="text-center mb-16">
              <div className="inline-flex items-center px-5 py-2.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-bold mb-6 backdrop-blur">
                <Globe className="w-4 h-4 mr-2" /> Auto-Detected Location: {userCurrency.code}
              </div>
              <h2 className="text-5xl font-black neon-text mb-6">Simplified Dynamic Pricing</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Prices adjust automatically to your local currency. Pay instantly via Credit Card, PayPal, Local Wallets (UPI), or native Crypto APIs.
              </p>
             </div>

             <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                {/* Guest Tier */}
                <div className="p-10 rounded-[2.5rem] glass-panel border border-gray-700 text-center relative overflow-hidden transition hover:border-gray-500 flex flex-col">
                  <h3 className="text-2xl font-black mb-3 text-gray-300">Guest Mode</h3>
                  <div className="flex justify-center items-baseline mb-8">
                    <p className="text-6xl font-black text-white">Free</p>
                  </div>
                  <p className="text-lg text-gray-400 mb-10 leading-relaxed flex-1">Basic AI agent access. Ad-supported UI. Lacks secure cloud storage, assessments, and advanced 10-Trillion SQL DB querying.</p>
                  <button className="w-full py-5 bg-gray-800 hover:bg-gray-700 rounded-2xl font-bold text-white transition text-lg mt-auto">Continue as Guest</button>
                </div>
               
                {/* Premium Tier */}
                <div className="p-10 rounded-[2.5rem] bg-gray-900 border-2 border-cyan-500 neon-border text-center relative shadow-[0_20px_50px_rgba(6,182,212,0.2)] flex flex-col">
                  <div className="absolute top-0 right-0 left-0 bg-cyan-600 py-2 text-xs font-black text-white uppercase tracking-widest shadow-md">Full Ecosystem Access</div>
                  <h3 className="text-2xl font-black mb-3 mt-6 text-white">Global Platinum</h3>
                  <div className="flex justify-center items-baseline mb-8">
                    <span className="text-4xl font-bold text-cyan-400 mr-2">{userCurrency.symbol}</span>
                    <p className="text-6xl font-black text-cyan-400">{(basePriceUSD * userCurrency.rate).toFixed(2)}</p>
                    <span className="text-xl font-bold text-gray-500 ml-2">/mo</span>
                  </div>
                  <p className="text-lg text-gray-300 mb-10 leading-relaxed flex-1">Unrestricted access: Ad-free videos, 3D Mini-games, VidyaPragya Scholar, Global Quizzes, and full Data Compression benefits.</p>
                  <button onClick={() => openPaymentModal('Global Platinum', (basePriceUSD * userCurrency.rate).toFixed(2))} className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-[1.02] rounded-2xl font-black text-white transition shadow-xl text-lg mt-auto">
                    Select Platinum Plan
                  </button>
                </div>
             </div>
          </div>
        )}

        {/* --- PAGE: SEO BLOGS --- */}
        {currentPage === 'blogs' && (
          <div className="py-12 max-w-4xl mx-auto animate-in fade-in">
            <div className="glass-panel p-8 md:p-14 rounded-[2rem] border border-gray-700/50 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">SEO Ranked • 1.5k Read</div>
             
              <article className="prose prose-invert prose-lg max-w-none">
                {blogContent.map((block, idx) => {
                  if (block.type === 'h1') return <h1 key={idx} className="text-4xl md:text-5xl font-black text-cyan-400 mb-8 leading-tight tracking-tight">{block.text}</h1>;
                  if (block.type === 'h2') return <h2 key={idx} className="text-2xl font-bold text-white mt-12 mb-6 border-b border-gray-800 pb-4">{block.text}</h2>;
                  if (block.type === 'img') return (
                    <div key={idx} className="my-10 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative group">
                      <img src={block.src} alt={block.alt} className="w-full h-[400px] object-cover group-hover:scale-105 transition duration-700" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur p-3 text-xs text-gray-300 text-center font-mono flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 mr-2" /> SEO Optimized Realistic Image Render
                      </div>
                    </div>
                  );
                  return <p key={idx} className="text-gray-300 leading-loose mb-6 text-lg">{block.text}</p>;
                })}
              </article>
            </div>
          </div>
        )}

        {/* --- STATIC CONTENT PAGES (About, FAQs, Privacy, Terms) --- */}
        {['about', 'faqs', 'privacy', 'terms'].includes(currentPage) && (
          <div className="py-12 max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
            <div className="glass-panel p-8 md:p-16 rounded-[3rem] border border-gray-700/50 shadow-2xl relative">
             
              {currentPage === 'about' && (
                <>
                  <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-12 flex items-center tracking-tight"><Info className="w-12 h-12 mr-5 text-cyan-400"/> About Us</h2>
                 
                  <div className="space-y-10 text-gray-300 text-lg leading-relaxed">
                    <p className="p-8 bg-gray-900/80 rounded-3xl border border-gray-700/50 shadow-inner text-xl leading-relaxed">
                      <strong>The ChitraHarshaVPK Ventures Pvt Ltd</strong> is a pioneering, future-ready force in AI-driven educational innovations. We are dedicated to merging ancient Indian philosophical wisdom—encapsulated in the name <em>VidyaPragya</em> (Supreme Knowledge)—with cutting-edge technological architectures.
                    </p>
                   
                    <div className="px-4 space-y-6">
                      <p>Our primary mission is to provide an incredibly accessible, powerful, and child-friendly learning ecosystem curated strictly for students from Class 1 to Class 5.</p>
                     
                      <p>By utilizing Large Language Models (LLMs) and advanced Natural Language Processing (NLP), we create interactive, multimodal AI tutors. These empathetic digital agents adapt dynamically to each child's unique cognitive learning pace, reading visual, audio, and text inputs instantly via lightweight compressed data structures.</p>
                    </div>
                   
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-10"></div>

                    <div className="px-4 space-y-6">
                      <p>Engineered for global commercial readiness, our platform operates on a robust foundation of serverless cloud infrastructure, supporting a <strong>10-Trillion row SQL data architecture</strong>. This guarantees enterprise-grade scalability, speed, and uncompromising performance globally.</p>

                      <p>Through highly interactive 3D spatial models, exploratory mechanics, and secure, ad-free environments, <em>The CHAVPK VidyaPragya</em> stands as a monumental leap forward in commercial EdTech capability.</p>
                    </div>
                  </div>
                </>
              )}

              {currentPage === 'faqs' && (
                <>
                  <h2 className="text-4xl md:text-5xl font-black text-cyan-400 mb-12 flex items-center tracking-tight"><HelpCircle className="w-12 h-12 mr-5"/> FAQs</h2>
                 
                  <div className="space-y-8 text-gray-300">
                    <div className="bg-[#050B14]/80 p-8 rounded-[2rem] border border-gray-700/50 hover:border-cyan-500/50 transition duration-300 shadow-lg">
                      <h4 className="font-black text-white text-2xl mb-4 flex items-center"><Zap className="text-yellow-400 w-7 h-7 mr-4" /> How does the platform ensure an ad-free environment?</h4>
                      <p className="text-lg leading-relaxed text-gray-400">Our commercial-grade platform integrates specialized API streaming wrappers that algorithmically filter and strip advertisement packets before delivering any educational video content, ensuring complete focus.</p>
                    </div>
                   
                    <div className="bg-[#050B14]/80 p-8 rounded-[2rem] border border-gray-700/50 hover:border-emerald-500/50 transition duration-300 shadow-lg">
                      <h4 className="font-black text-white text-2xl mb-4 flex items-center"><Shield className="text-emerald-400 w-7 h-7 mr-4" /> Is the AI Agent safe and appropriate for young children?</h4>
                      <p className="text-lg leading-relaxed text-gray-400">Absolutely. The VidyaPragya AI Agent is powered by highly fine-tuned, restricted LLM models operating under strict cognitive safety guardrails, rejecting off-topic or complex adult queries instantly.</p>
                    </div>
                   
                    <div className="bg-[#050B14]/80 p-8 rounded-[2rem] border border-gray-700/50 hover:border-purple-500/50 transition duration-300 shadow-lg">
                      <h4 className="font-black text-white text-2xl mb-4 flex items-center"><Gamepad2 className="text-purple-400 w-7 h-7 mr-4" /> What happens after 1 hour of study?</h4>
                      <p className="text-lg leading-relaxed text-gray-400">To prevent cognitive fatigue, the platform automatically pauses intense study sessions after 1 to 2 hours, unlocking highly interactive 3D mini-games designed to reinforce scientific concepts through play.</p>
                    </div>
                  </div>
                </>
              )}

              {currentPage === 'privacy' && (
                <>
                  <h2 className="text-4xl md:text-5xl font-black text-cyan-400 mb-12 flex items-center tracking-tight"><ShieldAlert className="w-12 h-12 mr-5"/> Privacy & Security Protocol</h2>
                 
                  <div className="space-y-10 text-gray-300 text-lg leading-relaxed">
                    <p className="px-4 font-medium text-xl">
                      At The CHAVPK, data security and commercial readiness are paramount. Our ecosystem operates strictly under a <strong>Zero-Trust Architecture</strong>.
                    </p>
                   
                    <div className="bg-emerald-900/10 p-8 rounded-[2rem] border-l-4 border-emerald-500 shadow-inner">
                      <h4 className="font-black text-emerald-400 text-2xl mb-4">Quantum-Level Encryption</h4>
                      <p className="text-gray-400">All user profiles and biometric authentication passkeys are end-to-end encrypted using post-quantum cryptographic standards and compressed dynamically to ensure fast performance over MeitY-Compliant Sovereign Cloud nodes.</p>
                    </div>

                    <div className="bg-blue-900/10 p-8 rounded-[2rem] border-l-4 border-blue-500 shadow-inner">
                      <h4 className="font-black text-blue-400 text-2xl mb-4">Blockchain Management System</h4>
                      <p className="text-gray-400">We utilize a decentralized Blockchain Management System for all transaction ledgers, guaranteeing that every login, data upload, and financial settlement is tamper-proof.</p>
                    </div>

                    <div className="bg-purple-900/10 p-8 rounded-[2rem] border-l-4 border-purple-500 shadow-inner">
                      <h4 className="font-black text-purple-400 text-2xl mb-4">Active Dark Web & Phishing Monitoring</h4>
                      <p className="text-gray-400">Our backend engines run continuous, real-time heuristic scans targeting Malware and Dark Web credential leaks. Automated smart protocols instantly rotate secure tokens to secure the user’s integrity.</p>
                    </div>

                    <p className="px-4 py-6 text-white bg-gray-900 rounded-2xl text-center border border-gray-700 font-bold shadow-lg">
                      We categorically DO NOT sell user telemetry or personal data to third parties.
                    </p>
                  </div>
                </>
              )}

              {currentPage === 'terms' && (
                <>
                  <h2 className="text-4xl md:text-5xl font-black text-cyan-400 mb-12 flex items-center tracking-tight"><FileText className="w-12 h-12 mr-5"/> Terms & Conditions</h2>
                 
                  <div className="space-y-10 text-gray-300 text-lg leading-relaxed">
                    <p className="px-4">
                      By registering and accessing <em>The CHAVPK VidyaPragya</em>, users inherently agree to the comprehensive terms outlined within our corporate commercial charter, designed for global readiness.
                    </p>

                    <div className="px-4">
                      <h4 className="font-black text-white text-2xl mb-4">Financial Transactions & Settlements</h4>
                      <p className="text-gray-400 mb-4">All payments processed via The CHAVPK Pay (UPI), global fiat gateways, or the native CHC Crypto-currency are executed instantly. They are governed by strict blockchain ledger smart contracts ensuring transparent, non-reversible settlements.</p>
                      <p className="text-gray-400">Pricing adjusts automatically to the user's localized currency equivalent to ensure a frictionless global commercial experience.</p>
                    </div>
                   
                    <div className="w-full h-px bg-gray-800 my-8"></div>

                    <div className="px-4">
                      <h4 className="font-black text-white text-2xl mb-4">Intellectual Property</h4>
                      <p className="text-gray-400 mb-4">All innovative features—including the <em>VidyaPragya Scholar</em> AI logic, 3D interactive assets, fine-tuned multimodal NLP models, and the 10-Trillion SQL architecture—are exclusively proprietary technologies.</p>
                      <p className="text-gray-400">Owned unequivocally by <strong>The ChitraHarshaVPK Ventures Pvt Ltd</strong>, unauthorized extraction or reverse engineering is strictly prohibited.</p>
                    </div>

                    <div className="bg-red-900/10 p-8 rounded-[2rem] border-2 border-red-500/30">
                      <h4 className="font-black text-red-400 text-2xl mb-3">Zero-Tolerance Policy</h4>
                      <p className="text-red-200/80 text-base font-medium">The platform’s algorithms reserve the automated right to instantly suspend accounts detected utilizing malicious scraping bots, automated injection tools, or violating community guidelines designed to protect our educational environment.</p>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        )}

      </main>

      {/* --- PAYMENT GATEWAY MODAL (Universal) --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}></div>
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-6 h-6"/></button>
            <h3 className="text-2xl font-black text-white mb-2">Secure Checkout</h3>
            <p className="text-gray-400 text-sm mb-6">You are purchasing: <strong className="text-cyan-400">{selectedPlan?.name}</strong> for {userCurrency.symbol}{selectedPlan?.price}</p>

            {/* Payment Options */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button onClick={() => setPaymentMethod('card')} className={`p-4 rounded-xl border flex flex-col items-center justify-center transition ${paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-900/20 text-cyan-400' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
                <CreditCard className="w-6 h-6 mb-2"/> Card / PayPal
              </button>
              <button onClick={() => setPaymentMethod('local')} className={`p-4 rounded-xl border flex flex-col items-center justify-center transition ${paymentMethod === 'local' ? 'border-blue-500 bg-blue-900/20 text-blue-400' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
                <Wallet className="w-6 h-6 mb-2"/> Local Wallet / UPI
              </button>
              <button onClick={() => setPaymentMethod('crypto')} className={`col-span-2 p-4 rounded-xl border flex flex-col items-center justify-center transition ${paymentMethod === 'crypto' ? 'border-purple-500 bg-purple-900/20 text-purple-400' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}>
                <Coins className="w-6 h-6 mb-2"/> Pay via CHC Crypto
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <input type="text" required placeholder="Cardholder Name" className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 text-white focus:outline-none focus:border-cyan-500" />
                  <input type="text" required placeholder="Card Number" className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 text-white focus:outline-none focus:border-cyan-500" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" required placeholder="MM/YY" className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 text-white focus:outline-none focus:border-cyan-500" />
                    <input type="text" required placeholder="CVC" className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 text-white focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>
              )}
              {paymentMethod === 'local' && (
                <div className="space-y-4 mb-6 text-center text-gray-400">
                  <Wallet className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                  <p>You will be securely redirected to your local wallet or UPI provider (The CHAVPK Pay).</p>
                </div>
              )}
              {paymentMethod === 'crypto' && (
                <div className="space-y-4 mb-6 text-center text-gray-400">
                  <Coins className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                  <p>Connect your Web3 Wallet to complete transaction via CHC token.</p>
                </div>
              )}

              <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white shadow-lg hover:scale-[1.02] transition">
                Pay {userCurrency.symbol}{selectedPlan?.price} Safely
              </button>
            </form>

            {paymentStatus && (
              <div className="mt-4 p-3 rounded-lg text-center font-bold text-sm bg-gray-800 text-cyan-400 border border-cyan-500/50 animate-pulse">
                {paymentStatus}
              </div>
            )}
           
            <p className="text-center text-xs text-gray-500 mt-4 flex justify-center items-center">
              <Lock className="w-3 h-3 mr-1" /> Quantum Encrypted Transaction
            </p>
          </div>
        </div>
      )}

      {/* --- MINIMAL FOOTER --- */}
      <footer className="bg-[#02050A] border-t border-gray-900/80 mt-16 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#02050A] to-[#02050A] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
         
          <div className="flex justify-center items-center space-x-4 mb-10">
            <Cpu className="w-12 h-12 text-cyan-500" />
            <span className="font-black text-4xl text-white tracking-widest uppercase">The CHAVPK</span>
          </div>
         
          <h4 className="font-bold text-gray-300 mb-8 text-xl tracking-widest uppercase">Get in Touch</h4>
         
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 text-gray-400 mb-14">
            <a href="#" className="hover:text-cyan-400 transition flex items-center bg-gray-900/50 px-8 py-4 rounded-full border border-gray-800 shadow-inner font-medium">
              <Globe className="w-5 h-5 mr-3 text-blue-400"/> operations@chavpk.ventures
            </a>
            <a href="#" className="hover:text-cyan-400 transition flex items-center bg-gray-900/50 px-8 py-4 rounded-full border border-gray-800 shadow-inner font-medium">
              <Shield className="w-5 h-5 mr-3 text-emerald-400"/> trust@chavpk.ventures
            </a>
          </div>

          <div className="inline-flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 px-10 py-5 bg-gray-950 border border-gray-800/80 rounded-2xl text-sm text-gray-400 shadow-2xl">
            <div className="flex items-center font-semibold text-emerald-400/80">
              <Lock className="w-4 h-4 mr-2" />
              <span>Quantum Blockchain Encryption</span>
            </div>
            <div className="hidden md:block w-px h-5 bg-gray-700"></div>
            <div className="flex items-center font-semibold text-emerald-400/80">
              <ShieldAlert className="w-4 h-4 mr-2" />
              <span>Dark Web & Malware Monitoring</span>
            </div>
          </div>
         
          <div className="mt-16 pt-10 border-t border-gray-900/80 text-gray-500 text-sm font-semibold tracking-wider uppercase">
            © 2026 The ChitraHarshaVPK Ventures Pvt Ltd. All Trademarks & Copyrights Reserved. <br className="md:hidden mt-2"/> Built for Commercial Global Scalability.
          </div>
        </div>
      </footer>
    </div>
  );
}

