'use client';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';
import { Clock, Building2, Hash, Plus, Zap, Target } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  ticketNumber: string;
  openingTime: string;
  closingTime: string;
  jodiInfo?: string;
  panelInfo?: string;
  createdAt: Date;
}

export default function ModernDisplayPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'companies'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const companiesData: Company[] = [];
      querySnapshot.forEach((doc) => {
        companiesData.push({
          id: doc.id,
          ...doc.data()
        } as Company);
      });
      setCompanies(companiesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getGradientClass = (index: number): string => {
    const gradients = [
      'from-yellow-400 via-orange-400 to-red-400',
      'from-blue-400 via-purple-500 to-pink-500',
      'from-green-400 via-blue-500 to-purple-600',
      'from-pink-400 via-red-400 to-yellow-400',
      'from-indigo-400 via-purple-400 to-pink-400',
      'from-teal-400 via-cyan-500 to-blue-500'
    ];
    return gradients[index % gradients.length];
  };

  const formatTime = (time: string | undefined): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const preferredOrder = [
    'Lucky Day',
    'Lucky Night',
    'Kalyan',
    'Main Bazar'
  ];

  const sortCompanies = (companies: Company[]) => {
    const ordered = [...companies].sort((a, b) => {
      const aIndex = preferredOrder.findIndex(
        name => a.name.trim().toLowerCase() === name.toLowerCase()
      );
      const bIndex = preferredOrder.findIndex(
        name => b.name.trim().toLowerCase() === name.toLowerCase()
      );
      if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
    return ordered;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <div className="text-2xl font-bold text-white animate-pulse">Loading Companies...</div>
          <div className="text-purple-300 mt-2">Fetching real-time data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 animate-pulse">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-4 animate-fade-in">
              FANCY MATKA
            </h1>
          </div>
          
          {/* Companies Grid */}
          {companies.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Companies Yet</h3>
                <p className="text-purple-200 text-lg mb-8">Start building your business directory</p>
                <Link 
                  href="/update-form"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Company
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortCompanies(companies).map((company, index) => (
                <div
                  key={company.id}
                  className="group relative animate-popup"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Card */}
                  <div className={`relative bg-gradient-to-br ${getGradientClass(index)} p-1 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 h-full">
                      {/* Action Buttons */}
                      <div className="flex justify-between items-center mb-6">
                        <button 
                          className="group/btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-indigo-500/25 transform hover:scale-110 transition-all duration-300 flex items-center gap-2"
                          title={company.jodiInfo || 'Jodi Information'}
                        >
                          <Zap className="w-4 h-4 group-hover/btn:animate-bounce" />
                          Jodi
                        </button>
                        <button 
                          className="group/btn bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-pink-500/25 transform hover:scale-110 transition-all duration-300 flex items-center gap-2"
                          title={company.panelInfo || 'Panel Information'}
                        >
                          <Target className="w-4 h-4 group-hover/btn:animate-spin" />
                          Panel
                        </button>
                      </div>
                      
                      {/* Company Info */}
                      <div className="text-center space-y-4">
                        {/* Company Name */}
                        <div className="relative">
                          <h2 className="text-3xl font-black text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                            {company.name}
                          </h2>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500 rounded-full"></div>
                        </div>
                        
                        {/* Ticket Number */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-pink-100 px-4 py-2 rounded-xl">
                          <Hash className="w-5 h-5 text-red-600" />
                          <span className="text-2xl font-bold text-red-600">
                            {company.ticketNumber}
                          </span>
                        </div>
                        
                        {/* Time */}
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-xl">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <span className="text-xl font-semibold text-blue-800">
                            {formatTime(company.openingTime)} - {formatTime(company.closingTime)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(index)} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Stats */}
          {companies.length > 0 && (
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl px-8 py-4 border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Live Updates</span>
                </div>
                <div className="w-px h-6 bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">
                    {companies.length} {companies.length === 1 ? 'Company' : 'Companies'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        @keyframes popup {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-popup {
          animation: popup 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}