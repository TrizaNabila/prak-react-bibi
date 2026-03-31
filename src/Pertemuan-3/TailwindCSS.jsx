export default function TailwindCSS() {
  return (
    // Background menggunakan radial gradient tipis agar tidak flat
    <div className="min-h-screen bg-[#fffafa] bg-[radial-gradient(#ffe4e6_1px,transparent_1px)] [background-size:20px_20px] pb-24 font-sans">
      <FlexboxGrid />

      <main className="max-w-6xl mx-auto px-6">
        {/* Header dengan animasi fade-in-up */}
        <header className="py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-pink-600 uppercase bg-pink-50 rounded-full border border-pink-100">
            Design System 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
            Belajar Tailwind CSS <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">4</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Eksplorasi komponen modern dengan utility-first CSS
          </p>
          <button className="group relative bg-pink-500 text-white px-10 py-4 rounded-full shadow-[0_10px_20px_rgba(244,114,182,0.3)] hover:shadow-[0_15px_30px_rgba(244,114,182,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 font-bold text-lg overflow-hidden">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-pink-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </header>

        {/* Grid Layout yang lebih dinamis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Spacing 
            title="Konsep Spacing" 
            content="Mengatur margin dan padding dengan presisi menggunakan utility classes." 
          />
          <BackgroundColors />
          <ShadowEffects />
          
          {/* Card Gabungan yang lebih elegan */}
          <div className="lg:col-span-2 flex flex-col md:flex-row justify-between items-center p-12 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-pink-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] gap-10">
            <Typography />
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-rose-300 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
               <BorderRadius />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function FlexboxGrid() {
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-pink-50/50 p-4 px-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-black text-pink-500 tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-500 rounded-lg rotate-12 flex items-center justify-center text-white text-xs">T</div>
          MY.LAB
        </h1>
        <ul className="hidden md:flex space-x-10 font-bold text-gray-500">
          <li><a href="#" className="hover:text-pink-500 transition-all hover:tracking-widest">Home</a></li>
          <li><a href="#" className="hover:text-pink-500 transition-all hover:tracking-widest">About</a></li>
          <li><a href="#" className="hover:text-pink-500 transition-all hover:tracking-widest">Contact</a></li>
        </ul>
        <button className="bg-gray-900 text-white px-8 py-2.5 rounded-full font-bold hover:bg-pink-600 transition-all shadow-lg hover:shadow-pink-200 transform active:scale-95">
          Login
        </button>
      </div>
    </nav>
  )
}

function Spacing({ title, content }) {
  return (
    <div className="group bg-gradient-to-br from-pink-500 to-rose-500 p-10 rounded-[2.5rem] shadow-[0_20px_40px_rgba(244,114,182,0.3)] hover:shadow-[0_30px_60px_rgba(244,114,182,0.4)] transition-all duration-500 transform hover:-translate-y-2">
      <div className="bg-white/20 w-12 h-12 rounded-2xl mb-6 flex items-center justify-center backdrop-blur-sm">
         <span className="text-white text-xl font-bold">#</span>
      </div>
      <h2 className="text-2xl font-black text-white mb-4 tracking-tight">{title}</h2>
      <p className="text-pink-50 leading-relaxed text-lg opacity-90">{content}</p>
    </div>
  )
}

function Typography() {
  return (
    <div className="text-left">
      <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-3">
        Tailwind <br/><span className="text-pink-500 underline decoration-pink-200 decoration-8 underline-offset-4">Typography</span>
      </h1>
      <p className="text-gray-400 text-lg italic mt-4 font-medium">"Cepat, Ringkas, dan Menyenangkan!"</p>
    </div>
  )
}

function BorderRadius() {
  return (
    <button className="relative bg-white border-2 border-pink-500 text-pink-500 px-10 py-4 rounded-2xl font-black text-lg hover:bg-pink-500 hover:text-white transition-all duration-500 overflow-hidden group">
      Outline Button
    </button>
  )
}

function BackgroundColors() {
  return (
    <div className="relative overflow-hidden bg-white p-10 rounded-[2.5rem] border border-pink-50 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-pink-100 transition-all duration-500 group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Tailwind Colors</h3>
        <p className="text-gray-500 text-lg leading-relaxed">
          Gunakan palet warna yang luas untuk membangun identitas brand yang kuat.
        </p>
      </div>
    </div>
  )
}

function ShadowEffects() {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-pink-50 shadow-sm hover:shadow-[0_40px_80px_rgba(244,114,182,0.15)] transition-all duration-700 group flex flex-col justify-between overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-2xl font-black text-pink-500 mb-4 group-hover:scale-105 transition-transform duration-500 origin-left">
          Hover Shadow Effect
        </h3>
        <p className="text-gray-400 text-lg leading-relaxed">
          Mainkan elevasi dengan utility <code className="bg-pink-50 text-pink-600 px-2 py-1 rounded-lg text-sm font-bold">shadow</code> untuk kedalaman visual.
        </p>
      </div>
      <div className="mt-8 h-1 w-0 group-hover:w-full bg-gradient-to-r from-pink-400 to-transparent transition-all duration-700"></div>
    </div>
  )
}