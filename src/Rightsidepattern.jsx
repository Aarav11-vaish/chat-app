import React from 'react';

const RightSidePattern = ({ 
  title = "Welcome to Innovation", 
  subtitle = "Experience the future of digital design with our cutting-edge platform that brings your ideas to life." 
}) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-lg text-center relative z-10">
        {/* Enhanced geometric pattern */}
        <div className="relative mb-12">
          {/* Main grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(16)].map((_, i) => {
              const delays = ['delay-0', 'delay-75', 'delay-150', 'delay-300', 'delay-500'];
              const sizes = ['h-8 w-8', 'h-10 w-10', 'h-6 w-6', 'h-12 w-12'];
              const colors = [
                'bg-gradient-to-br from-purple-400 to-purple-600',
                'bg-gradient-to-br from-cyan-400 to-cyan-600', 
                'bg-gradient-to-br from-pink-400 to-pink-600',
                'bg-gradient-to-br from-indigo-400 to-indigo-600',
                'bg-gradient-to-br from-emerald-400 to-emerald-600'
              ];
              
              return (
                <div
                  key={i}
                  className={`
                    ${sizes[i % sizes.length]}
                    ${colors[i % colors.length]}
                    ${delays[i % delays.length]}
                    rounded-2xl
                    transform hover:scale-110 hover:rotate-12
                    transition-all duration-500 ease-out
                    animate-pulse
                    shadow-lg hover:shadow-2xl
                    backdrop-blur-sm
                    border border-white/20
                    cursor-pointer
                  `}
                  style={{
                    animationDelay: `${i * 200}ms`,
                    animationDuration: `${2000 + (i * 100)}ms`
                  }}
                />
              );
            })}
          </div>

          {/* Floating accent elements */}
          <div className="absolute -top-4 -right-4 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce opacity-80"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce animation-delay-1000 opacity-80"></div>
          <div className="absolute top-1/2 -right-8 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse opacity-60"></div>
        </div>

        {/* Enhanced text content */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
            {title}
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full"></div>
          
          <p className="text-lg text-slate-300 leading-relaxed font-medium">
            {subtitle}
          </p>

          {/* Call-to-action elements */}
          <div className="flex justify-center space-x-3 mt-8">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white/80 font-medium">Live Now</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-500"></div>
              <span className="text-sm text-white/80 font-medium">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Subtle bottom accent */}
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-t from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
      </div>

+ <style>{`
    .animation-delay-1000 {
      animation-delay: 1000ms;
    }
    .animation-delay-2000 {
      animation-delay: 2000ms;
    }
    .animation-delay-4000 {
      animation-delay: 4000ms;
    }
    .animation-delay-500 {
      animation-delay: 500ms;
    }
  `}</style>
    </div>
  );
};

export default RightSidePattern;