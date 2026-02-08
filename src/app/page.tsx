import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";

import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-gameon-blue-100 selection:text-gameon-blue-900">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Skiing Background */}
      <main>
        <section className="relative min-h-[90vh] overflow-hidden">
          {/* Theme-Matching Gradient Background */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-100 via-blue-50 to-slate-50 dark:from-[#0B1120] dark:via-[#0F1828] dark:to-[#151B2B]" />
        

          {/* Content Container - Left Aligned */}
          <div className="relative z-10 min-h-[90vh] flex items-center">
            <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-32">
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center rounded-full border border-slate-300 dark:border-white/30 bg-white/80 dark:bg-white/10 px-4 py-1.5 text-sm font-medium text-slate-700 dark:text-white mb-8 backdrop-blur-md shadow-lg">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-white mr-2 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_#fff]"></span>
                  The #1 Network for Sports Professionals
                </div>
                
                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1] drop-shadow-lg">
                  Elevate Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 relative whitespace-nowrap">
                    Game
                  </span>
                  <br />
                  Build Your Future.
                </h1>
                
                {/* Subtext */}
                <p className="text-xl sm:text-2xl text-slate-700 dark:text-white/95 mb-10 leading-relaxed font-light">
                  Connect with elite athletes, visionary coaches, and top-tier organizations. Showcase your talent, find opportunities, and level up your career.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link 
                    href="/signup" 
                    className="btn-primary w-full sm:w-auto text-lg px-8 py-4 min-w-[200px] shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 font-semibold"
                  >
                    Get Started Now
                  </Link>
                  <Link 
                    href="#demo" 
                    className="btn-secondary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center gap-2 group min-w-[200px] bg-slate-200/80 dark:bg-white/10 border-slate-300 dark:border-white/30 text-slate-900 dark:text-white hover:bg-slate-300/80 dark:hover:bg-white/20 backdrop-blur-md font-semibold shadow-xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                    Watch Demo
                  </Link>
                </div>
                
                {/* Social Proof */}
                <div className="mt-12 flex items-center gap-4 text-sm text-slate-700 dark:text-white/90">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-300 dark:border-white/50 bg-slate-300/50 dark:bg-white/20 shadow-lg backdrop-blur-sm" />
                    ))}
                  </div>
                  <p>
                    Join <span className="font-bold text-slate-900 dark:text-white">2,000+</span> athletes and coaches
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Role-Based Cards - White/Dark Blue Background */}
        <section id="community" className="py-24 lg:py-32 bg-white dark:bg-[#0B1120]">
           <div className="container-custom">
              <div className="text-center max-w-3xl mx-auto mb-16">
                 <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">Built for the Modern Game</h2>
                 <p className="text-lg text-slate-600 dark:text-slate-400">Whether you're looking to get recruited, find talent, or manage a team, The GameOn Co. provides the professional tools you need.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Card 1: Athlete */}
                <div className="card-premium p-8 group hover:-translate-y-1 bg-slate-50 dark:bg-[#151B2B] border-slate-100 dark:border-[#1E2538]">
                   <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                     </svg>
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Athletes</h3>
                   <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">Create a verified digital profile. Post highlights, track stats, and get discovered by scouts globally.</p>
                   <Link href="/athletes" className="text-gameon-blue-600 font-medium flex items-center hover:gap-2 transition-all">
                     Build Your Profile <span className="ml-1">&rarr;</span>
                   </Link>
                </div>

                {/* Card 2: Coach */}
                <div className="card-premium p-8 group hover:-translate-y-1 bg-slate-50 dark:bg-[#151B2B] border-slate-100 dark:border-[#1E2538]">
                   <div className="h-12 w-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                     </svg>
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Coaches & Scouts</h3>
                   <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">Access a database of verified talent. Filter by position, stats, and video analysis to find your next star.</p>
                   <Link href="/scouts" className="text-indigo-600 font-medium flex items-center hover:gap-2 transition-all">
                     Start Scouting <span className="ml-1">&rarr;</span>
                   </Link>
                </div>

                {/* Card 3: Organization */}
                <div className="card-premium p-8 group hover:-translate-y-1 bg-slate-50 dark:bg-[#151B2B] border-slate-100 dark:border-[#1E2538]">
                   <div className="h-12 w-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                     </svg>
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Organizations</h3>
                   <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">Manage rosters, schedules, and player development with enterprise-grade tools built for sports.</p>
                   <Link href="/organizations" className="text-emerald-600 font-medium flex items-center hover:gap-2 transition-all">
                     Manage Organization <span className="ml-1">&rarr;</span>
                   </Link>
                </div>
              </div>
           </div>
        </section>

        {/* Feature Highlights - Alternating Backgrounds */}
        <div id="features">
           {/* Section 1: Profile (Slightly Darker Background) */}
           <section className="py-24 lg:py-32 overflow-hidden bg-slate-50 dark:bg-[#0F1420]">
              <div className="container-custom">
                 <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className="order-2 lg:order-1 relative">
                       <div className="aspect-square rounded-2xl bg-white dark:bg-[#151B2B] shadow-sm border border-slate-100 dark:border-[#1E2538] p-8 flex items-center justify-center relative overflow-visible">
                           {/* Decorative Glow */}
                           <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-2xl" />
                           
                           <div className="relative w-full max-w-[280px] h-auto transform hover:scale-[1.02] transition-transform duration-500 drop-shadow-2xl">
                              <Image 
                                 src="/images/landing/ui_profile_mobile.png"
                                 alt="Mobile Athlete Profile App View"
                                 width={320}
                                 height={640}
                                 className="object-contain"
                              />
                           </div>
                       </div>
                    </div>
                    <div className="order-1 lg:order-2">
                       <div className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6 border border-blue-100 dark:border-blue-500/20">
                          For Athletes
                       </div>
                       <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">Your Stats. Verified and Visible.</h2>
                       <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                          Your career shouldn't live in spreadsheets. Build a professional digital CV that verifies your match history and highlights, making you instantly credible to scouts.
                       </p>
                       <ul className="space-y-4">
                          {[
                            "Official match statistics verification",
                            "Highlight reel integration",
                            "Direct messaging with verified coaches"
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                              <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-600 dark:text-green-400">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                 </svg>
                              </div>
                              {item}
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </div>
           </section>

           {/* Section 2: Scouting (Lighter Background) */}
           <section className="py-24 lg:py-32 overflow-hidden bg-white dark:bg-[#0B1120]">
              <div className="container-custom">
                 <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div>
                       <div className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 border border-indigo-100 dark:border-indigo-500/20">
                          For Scouts & Teams
                       </div>
                       <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">Data-Driven Recruitment.</h2>
                       <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                          Identify talent faster with advanced filtering. Search by position, performance metrics, and location to build your shortlist in seconds.
                       </p>
                       
                       <div className="p-4 bg-slate-50 dark:bg-[#151B2B] rounded-lg border border-slate-100 dark:border-[#1E2538] mb-8">
                          <div className="flex items-center gap-3 mb-2">
                             <div className="flex -space-x-2">
                                {[1,2,3].map(i => <div key={i} className="h-8 w-8 rounded-full bg-slate-300 ring-2 ring-white dark:ring-[#151B2B]" />)}
                             </div>
                             <span className="text-sm font-medium text-slate-900 dark:text-white">Trusted by 500+ Academies</span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">"The GameOn Co. cut our scouting time in half." — Elite Prep Academy</p>
                       </div>

                       <Link href="/network" className="text-indigo-600 font-semibold text-lg hover:underline underline-offset-4 flex items-center gap-1">
                          Explore the dashboard <span aria-hidden="true">&rarr;</span>
                       </Link>
                    </div>
                     <div className="relative">
                        <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151B2B]">
                             <Image 
                                src="/images/landing/ui_dashboard_desktop.png"
                                alt="Scout Dashboard Desktop View"
                                width={800}
                                height={600}
                                className="object-cover w-full h-auto"
                             />
                        </div>
                        {/* Decorative background blur behind image */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-indigo-500/10 blur-3xl rounded-full" />
                     </div>
                 </div>
              </div>
           </section>
        </div>

        {/* CTA Section */}
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gameon-blue-500/20 rounded-full blur-3xl pointer-events-none" />
           
           <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-8">Ready to Level Up?</h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join the fastest-growing professional network for sports. Create your profile today and start building your legacy.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link href="/signup" className="btn-primary bg-white text-slate-900 hover:bg-slate-100 text-lg px-10 py-4 w-full sm:w-auto">
                    Get Started Now
                 </Link>
                 <Link href="#contact" className="px-8 py-4 text-white/80 hover:text-white font-medium transition-colors">
                    Contact Sales
                 </Link>
              </div>
           </div>
        </section>
      </main>

      {/* Footer (Simplified) */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
         <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-2">
                <Logo className="w-6 h-6 text-blue-600 dark:text-gameon-blue-400" />
                <span className="font-bold text-slate-900 dark:text-white">The GameOn Co.</span>
             </div>
            <p className="text-sm text-slate-500">© 2024 The GameOn Co. All rights reserved.</p>
            <div className="flex gap-6 text-slate-400">
               <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Twitter</a>
               <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Instagram</a>
               <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">LinkedIn</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
