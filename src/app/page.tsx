'use client'

import Image from "next/image";
import { useState, useEffect } from "react";

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  isGreen: boolean;
}

export default function Home() {
  const [price, setPrice] = useState(0.001);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasCrashed, setHasCrashed] = useState(false);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Initialize with some candles
    if (candles.length === 0) {
      const initialCandles: Candle[] = [];
      let currentPrice = 0.0008;
      
      for (let i = 0; i < 15; i++) {
        const open = currentPrice;
        const change = (Math.random() * 0.0002) + 0.00005;
        const close = open + change;
        const high = close + (Math.random() * 0.00005);
        const low = open - (Math.random() * 0.00005);
        
        initialCandles.push({
          open,
          close,
          high,
          low,
          isGreen: close > open
        });
        
        currentPrice = close;
      }
      
      setCandles(initialCandles);
      setPrice(currentPrice);
    }
  }, [candles.length]);

  useEffect(() => {
    if (!isPlaying || hasCrashed) return;

    const interval = setInterval(() => {
      setCandles(prev => {
        const newCandles = [...prev];
        const lastCandle = newCandles[newCandles.length - 1];
        
        // Create new candle
        const open = lastCandle ? lastCandle.close : price;
        const change = (Math.random() * 0.0003) + 0.0001; // Always positive for uptrend
        const close = open * (1 + change / open);
        const high = close + (Math.random() * 0.00005);
        const low = open - (Math.random() * 0.00002);
        
        newCandles.push({
          open,
          close,
          high,
          low,
          isGreen: true // Always green for the pump
        });
        
        if (newCandles.length > 20) {
          newCandles.shift();
        }
        
        setPrice(close);
        return newCandles;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying, hasCrashed, price]);

  const handleBuy = () => {
    setIsPlaying(false);
    setHasCrashed(true);
    
    // Animate crash
    let steps = 10;
    let currentStep = 0;
    
    const crashInterval = setInterval(() => {
      currentStep++;
      
      setCandles(prev => {
        const newCandles = [...prev];
        const lastCandle = newCandles[newCandles.length - 1];
        
        // Create crash candles
        const open = currentStep === 1 ? lastCandle.close : newCandles[newCandles.length - 1].close;
        const close = open * 0.5; // Rapid decline
        const low = close * 0.95;
        const high = open;
        
        newCandles.push({
          open,
          close,
          high,
          low,
          isGreen: false
        });
        
        if (newCandles.length > 20) {
          newCandles.shift();
        }
        
        return newCandles;
      });
      
      setPrice(prev => prev * 0.5);
      
      if (currentStep >= steps) {
        clearInterval(crashInterval);
        setPrice(0.000001);
        setShowMessage(true);
        
        // Reset after showing message
        setTimeout(() => {
          setShowMessage(false);
          setPrice(0.001);
          setHasCrashed(false);
          setIsPlaying(true);
          setCandles([]);
        }, 3500);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen md:h-screen md:max-h-screen bg-[#f5f0e6] flex flex-col items-center justify-center p-4 md:p-6 lg:p-4 relative overflow-y-auto md:overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 15px)`,
        }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-center gap-4 md:gap-6 lg:gap-12 h-full justify-center py-4 lg:py-0">
        {/* Banner - Left side on desktop */}
        <div className="w-full max-w-xl lg:max-w-md xl:max-w-lg flex-shrink-0">
          <Image
            src="/luisbanner.png"
            alt="LUIS banner"
            width={800}
            height={200}
            className="w-full h-auto drop-shadow-xl"
          />
        </div>

        {/* Game section - Right side on desktop */}
        <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4 w-full">
          {/* Chart container */}
          <div className="bg-[#1a1a1a] rounded-lg p-3 md:p-4 lg:p-4 w-full max-w-xl lg:max-w-full shadow-2xl border-2 md:border-3 lg:border-4 border-[#f4c430]">
            <div className="flex justify-between items-center mb-2 md:mb-3 lg:mb-3">
              <h2 className="text-[#f4c430] font-bold text-lg md:text-xl lg:text-xl">$LUIS/BONK</h2>
              <div className="text-right">
                <p className={`text-lg md:text-xl lg:text-xl font-mono font-bold ${hasCrashed && price < 0.00001 ? 'text-[#ff0000]' : 'text-[#00ff00]'}`}>
                  ${price.toFixed(6)}
                </p>
                <p className={`text-xs md:text-sm font-bold ${hasCrashed && price < 0.00001 ? 'text-[#ff0000]' : 'text-[#00ff00]'}`}>
                  {hasCrashed && price < 0.00001 ? '-100.00%' : `+${((price - 0.001) / 0.001 * 100).toFixed(2)}%`}
                </p>
              </div>
            </div>

            {/* Candlestick chart */}
            <div className="h-32 md:h-36 lg:h-40 flex items-end justify-center gap-0.5 mb-3 md:mb-3 relative">
              {/* Y-axis grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-10">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border-t border-gray-500"></div>
                ))}
              </div>
              
              {candles.map((candle, index) => {
                const maxPrice = Math.max(...candles.map(c => c.high));
                const minPrice = hasCrashed ? 0 : Math.min(...candles.map(c => c.low));
                const priceRange = maxPrice - minPrice;
                
                const bodyHeight = Math.abs(candle.close - candle.open) / priceRange * 100;
                const wickHeight = (candle.high - candle.low) / priceRange * 100;
                const bottomOffset = (candle.low - minPrice) / priceRange * 100;
                const bodyBottom = (Math.min(candle.open, candle.close) - minPrice) / priceRange * 100;
                
                return (
                  <div
                    key={index}
                    className="relative flex flex-col items-center"
                    style={{
                      width: `${100 / 20}%`,
                      height: '100%',
                    }}
                  >
                    {/* Wick */}
                    <div
                      className="absolute w-px bg-gray-400"
                      style={{
                        height: `${wickHeight}%`,
                        bottom: `${bottomOffset}%`,
                      }}
                    />
                    
                    {/* Body */}
                    <div
                      className={`absolute w-full ${candle.isGreen ? 'bg-[#00ff00]' : 'bg-[#ff0000]'}`}
                      style={{
                        height: `${Math.max(bodyHeight, 1)}%`,
                        bottom: `${bodyBottom}%`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Buy button */}
            <button
              onClick={handleBuy}
              disabled={hasCrashed}
              className="w-full bg-gradient-to-r from-[#f4c430] to-[#ff6b6b] text-[#1a1a1a] font-bold text-lg md:text-xl lg:text-xl py-2 md:py-3 lg:py-3 rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:scale-100 shadow-lg"
            >
              BUY as a LUIS
            </button>
          </div>

        {/* Crash message */}
        {showMessage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] p-4 md:p-6 lg:p-8 rounded-lg border-2 md:border-3 lg:border-4 border-[#f4c430] text-center animate-bounce">
              <p className="text-[#f4c430] text-xl md:text-2xl lg:text-3xl font-bold mb-2">REKT! 📉</p>
              <p className="text-white text-base md:text-lg lg:text-xl">No problem, we all are</p>
              <p className="text-[#ff6b6b] text-lg md:text-xl lg:text-2xl font-bold">losers until it sends</p>
            </div>
          </div>
        )}

          {/* Contract address and socials */}
          <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-2">
            <div className="bg-[#1a1a1a] rounded-lg p-2 md:p-3 lg:p-2 border border-[#f4c430] md:border-2">
              <p className="text-[#f4c430] text-xs md:text-sm mb-1">CONTRACT ADDRESS</p>
              <p className="text-white font-mono text-[10px] md:text-xs">CA: Coming Soon...</p>
            </div>

            <div className="flex gap-2 md:gap-3">
              <a
                href="https://x.com/lsrsntltsnds"
          target="_blank"
          rel="noopener noreferrer"
                className="bg-[#1DA1F2] text-white px-4 md:px-5 lg:px-4 py-2 md:py-2.5 lg:py-2 rounded-full font-bold hover:scale-110 transition-transform duration-200 flex items-center gap-1 md:gap-2 text-sm md:text-base lg:text-sm"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
        </a>
        <a
                href="https://t.me/lsrsntltsnds"
          target="_blank"
          rel="noopener noreferrer"
                className="bg-[#0088cc] text-white px-4 md:px-5 lg:px-4 py-2 md:py-2.5 lg:py-2 rounded-full font-bold hover:scale-110 transition-transform duration-200 flex items-center gap-1 md:gap-2 text-sm md:text-base lg:text-sm"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.853 5.18-4.686c.223-.198-.054-.308-.346-.11l-6.4 4.02-2.76-.918c-.6-.187-.612-.6.125-.89l10.782-4.156c.5-.18.94.12.78.88z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>
          {/* Tagline */}
          <p className="text-[#1a1a1a] font-bold text-base md:text-lg lg:text-lg animate-pulse">
            LOSERS UNTIL IT SENDS 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
