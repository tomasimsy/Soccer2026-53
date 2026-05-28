// hostandref.tsx
export default function HostAndRef() {
  return (
    <section className="relative max-w-6xl mx-auto px-4 py-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,160,72,0.12),transparent_70%)]" />
      
      {/* Decorative field lines - matching hero section */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[300px] border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-20 border border-white rounded-3xl" />
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white" />
      </div>

      {/* Floating soccer balls with animations */}
      <div className="absolute top-20 right-20 text-4xl opacity-10 animate-bounce">⚽</div>
      <div className="absolute bottom-20 left-20 text-4xl opacity-10 animate-pulse">⚽</div>
      <div className="absolute top-1/2 right-32 text-3xl opacity-8 animate-spin [animation-duration:15s]">⚽</div>

      {/* Golden glow particles */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-40 right-0 w-64 h-64 bg-[#d4a048]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-[#d4a048]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-3 bg-[#d4a048]/10 px-6 py-2 rounded-full border border-[#d4a048]/30 backdrop-blur-sm shadow-lg shadow-[#d4a048]/10">
              {/* <span className="text-2xl animate-pulse">🫅</span> */}
              {/* <span className="text-[#d4a048] font-semibold tracking-wide">Tournament Officials</span> */}
              {/* <span className="text-2xl animate-spin [animation-duration:8s]">⚡</span> */}
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Meet the <span className="text-[#d4a048] drop-shadow-[0_0_10px_rgba(212,160,72,0.3)]">Hosts</span> of the Game
          </h2>
          {/* <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            Dedicated professionals ensuring fair play and smooth tournament operations
          </p> */}
          
          {/* Top glow bar */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4a048] to-transparent mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* REFEREES CARD */}
          <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-[#d4a048]/40 hover:bg-white/10 transition-all duration-300 shadow-[0_0_30px_rgba(212,160,72,0.05)] hover:shadow-[0_0_40px_rgba(212,160,72,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#d4a048]/20 flex items-center justify-center border border-[#d4a048]/40 group-hover:scale-110 transition duration-300 group-hover:shadow-[0_0_15px_rgba(212,160,72,0.3)]">
                <span className="text-2xl">🟨</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Match Officials</h3>
                <p className="text-xs text-[#d4a048] uppercase tracking-wider">Referee Team</p>
              </div>
            </div>

            {/* Head Referee */}
            <div className="border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#d4a048] text-lg">👨‍⚖️</span>
                    <span className="font-bold text-white text-lg">David</span>
                  </div>
                  <p className="text-xs text-[#d4a048] mt-1">Head Referee & Center Official</p>
                </div>
                <div className="bg-[#d4a048]/10 px-3 py-1 rounded-full border border-[#d4a048]/30">
                  <span className="text-xs text-[#d4a048] font-semibold">⚡ 10+ Years Experience</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Certified FIFA-level referee with over a decade of experience. Responsible for main decisions, 
                kickoffs, match flow, and overall game control.
              </p>
            </div>

            {/* Assistant Referees */}
            <div className="space-y-3">
              <p className="text-sm text-gray-300 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-[#d4a048] rounded-full animate-pulse"></span>
                Assistant Referees (Side Lines)
              </p>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 hover:border-[#d4a048]/20 transition">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🚩</span>
                  <div>
                    <p className="font-semibold text-white">Chris</p>
                    <p className="text-xs text-gray-500">Left Sideline Official</p>
                  </div>
                </div>
                <span className="text-xs text-[#d4a048]">Offside & Throw-ins</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 hover:border-[#d4a048]/20 transition">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🚩</span>
                  <div>
                    <p className="font-semibold text-white">Sean</p>
                    <p className="text-xs text-gray-500">Right Sideline Official</p>
                  </div>
                </div>
                <span className="text-xs text-[#d4a048]">Offside & Throw-ins</span>
              </div>
            </div>

            {/* Referee Note */}
            <div className="mt-6 p-3 rounded-lg bg-[#d4a048]/5 border border-[#d4a048]/20">
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <span>🟨</span> 
                All referee decisions are final. Respect the game, respect the officials.
                <span>🟥</span>
              </p>
            </div>
          </div>

          {/* HOSTS CARD */}
          <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-[#d4a048]/40 hover:bg-white/10 transition-all duration-300 shadow-[0_0_30px_rgba(212,160,72,0.05)] hover:shadow-[0_0_40px_rgba(212,160,72,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#d4a048]/20 flex items-center justify-center border border-[#d4a048]/40 group-hover:scale-110 transition duration-300 group-hover:shadow-[0_0_15px_rgba(212,160,72,0.3)]">
                <span className="text-2xl">🎙️</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Tournament Hosts</h3>
                <p className="text-xs text-[#d4a048] uppercase tracking-wider">Event Management</p>
              </div>
            </div>

            {/* Hosts */}
<div className="space-y-4">
  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#d4a048]/10 to-transparent border-l-4 border-[#d4a048] hover:border-l-[6px] transition-all">
    <div className="w-14 h-14 rounded-full bg-[#d4a048]/30 flex items-center justify-center group-hover:scale-105 transition">
      <span className="text-3xl">👑</span>
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-bold text-white text-lg">Lee DaaMan</p>
        <span className="text-xs bg-[#d4a048]/20 px-2 py-1 rounded-full text-[#d4a048] border border-[#d4a048]/30">Head Host</span>
      </div>
      <p className="text-sm text-gray-400 mt-1">
        Tournament director & ceremony coordinator. Handles team check-ins, schedule coordination, 
        and award presentations.
      </p>
    </div>
  </div>

  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#d4a048]/8 to-transparent border-l-4 border-[#d4a048]/40 hover:border-l-[6px] transition-all">
    <div className="w-14 h-14 rounded-full bg-[#d4a048]/25 flex items-center justify-center group-hover:scale-105 transition">
      <span className="text-3xl">👩‍🎤</span>
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-bold text-white text-lg">Lena</p>
        <span className="text-xs bg-[#d4a048]/20 px-2 py-1 rounded-full text-[#d4a048] border border-[#d4a048]/30">Assistant Host</span>
      </div>
      <p className="text-sm text-gray-400 mt-1">
        Player liaison & hospitality coordinator. Assists with team communications, handles player inquiries, 
        and ensures smooth backstage operations.
      </p>
    </div>
  </div>

  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#d4a048]/5 to-transparent border-l-4 border-[#d4a048]/50 hover:border-l-[6px] transition-all">
    <div className="w-14 h-14 rounded-full bg-[#d4a048]/20 flex items-center justify-center group-hover:scale-105 transition">
      <span className="text-3xl">🎤</span>
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-bold text-white text-lg">Tom Ngo Khong</p>
        <span className="text-xs bg-[#d4a048]/20 px-2 py-1 rounded-full text-[#d4a048] border border-[#d4a048]/30">Co-Host</span>
      </div>
      <p className="text-sm text-gray-400 mt-1">
        Match announcer & crowd engagement specialist. Keeps the energy high throughout the tournament 
        with live commentary and fan interactions.
      </p>
    </div>
  </div>
</div>

            {/* Host Responsibilities */}
            <div className="mt-6">
              <p className="text-sm text-gray-300 font-semibold flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-[#d4a048] rounded-full animate-pulse"></span>
                Key Responsibilities
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-xl bg-black/30 border border-white/5 hover:border-[#d4a048]/20 transition group">
                  <div className="text-[#d4a048] text-xl mb-1 group-hover:scale-110 transition inline-block">📋</div>
                  <p className="text-xs text-gray-400">Team Registration & Check-in</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-black/30 border border-white/5 hover:border-[#d4a048]/20 transition group">
                  <div className="text-[#d4a048] text-xl mb-1 group-hover:scale-110 transition inline-block">⏰</div>
                  <p className="text-xs text-gray-400">Schedule & Time Management</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-black/30 border border-white/5 hover:border-[#d4a048]/20 transition group">
                  <div className="text-[#d4a048] text-xl mb-1 group-hover:scale-110 transition inline-block">🏆</div>
                  <p className="text-xs text-gray-400">Award Ceremony & Presentations</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-black/30 border border-white/5 hover:border-[#d4a048]/20 transition group">
                  <div className="text-[#d4a048] text-xl mb-1 group-hover:scale-110 transition inline-block">📢</div>
                  <p className="text-xs text-gray-400">Live Announcements & Crowd Engagement</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact/Info Footer */}
 
      </div>
    </section>
  );
}