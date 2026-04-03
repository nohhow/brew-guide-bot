'use client';

import { useState } from 'react';
import { Coffee, Droplets, Lightbulb, Sparkles, SlidersHorizontal, Search } from 'lucide-react';

interface RecipeData {
  beanInfo: {
    name: string;
    origin: string;
    process: string;
    roast: string;
  };
  recipe: {
    [key: string]: string;
  };
  pouring: Array<{
    step: number;
    time: string;
    water: string;
    description: string;
  }>;
  tips: string[];
  flavor: {
    [key: string]: string;
  };
  adjustments: Array<{
    problem: string;
    solution: string;
  }>;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      if (data.recipe) {
        setRecipeData(data.recipe);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Initial State - Google-like Search */}
      {!recipeData && !isLoading && (
        <div className="flex flex-col items-center justify-center min-h-screen px-6">
          <div className="w-full max-w-3xl">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                브루잉 레시피 추천
              </h1>
              <p className="text-lg text-gray-400">
                원두 정보를 입력하면 맞춤형 레시피를 생성해드립니다
              </p>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSubmit} className="mb-12">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="예: 콜롬비아 엘 후이오 게이샤 워시드, 하리오 V60, 밸런스 좋게"
                  className="w-full pl-14 pr-6 py-5 bg-[#1a1a1a] text-gray-100 placeholder-gray-500 border border-[#333333] rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base shadow-2xl"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="mt-6 w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed transition-all font-semibold shadow-lg"
              >
                레시피 생성하기
              </button>
            </form>

            {/* Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#1a1a1a] border border-[#262626] rounded-xl">
                <h3 className="font-semibold text-amber-400 mb-2">원두 정보</h3>
                <p className="text-sm text-gray-400">이름, 산지, 가공 방식</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] border border-[#262626] rounded-xl">
                <h3 className="font-semibold text-amber-400 mb-2">로스팅 레벨</h3>
                <p className="text-sm text-gray-400">라이트, 미디엄, 다크 등</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] border border-[#262626] rounded-xl">
                <h3 className="font-semibold text-amber-400 mb-2">드리퍼 종류</h3>
                <p className="text-sm text-gray-400">하리오 V60, 칼리타 등</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] border border-[#262626] rounded-xl">
                <h3 className="font-semibold text-amber-400 mb-2">맛의 방향성</h3>
                <p className="text-sm text-gray-400">밸런스, 산미 강조 등</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="flex space-x-2 mb-4">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-gray-400">레시피를 생성하고 있습니다...</p>
        </div>
      )}

      {/* Dashboard State - Cheatsheet Layout */}
      {recipeData && !isLoading && (
        <div className="min-h-screen p-6">
          {/* Top Search Bar */}
          <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#262626] mb-6 -mx-6 px-6 py-4">
            <div className="max-w-[1800px] mx-auto">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="새로운 레시피 생성..."
                    className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] text-gray-100 placeholder-gray-500 border border-[#333333] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e as any);
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed transition-all font-medium text-sm"
                >
                  생성
                </button>
              </div>
            </div>
          </div>

          {/* Cheatsheet Grid Layout */}
          <div className="max-w-[1800px] mx-auto">
            {/* Bean Info Header */}
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-4">
                <Coffee size={24} className="text-amber-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">{recipeData.beanInfo.name}</h2>
                  <p className="text-sm text-gray-400">
                    {recipeData.beanInfo.origin} · {recipeData.beanInfo.process} · {recipeData.beanInfo.roast}
                  </p>
                </div>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Recipe + Pouring */}
              <div className="space-y-6">
                {/* Recipe Card */}
                <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#262626]">
                    <Coffee size={20} className="text-amber-400" />
                    <h3 className="text-lg font-bold text-white">추천 레시피</h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(recipeData.recipe).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-[#1a1a1a]">
                        <span className="text-sm text-gray-400">{key}</span>
                        <span className="text-sm font-semibold text-amber-300">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pouring Steps Card */}
                <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#262626]">
                    <Droplets size={20} className="text-blue-400" />
                    <h3 className="text-lg font-bold text-white">푸어링 순서</h3>
                  </div>
                  <div className="space-y-4">
                    {recipeData.pouring.map((step, idx) => (
                      <div key={idx} className="bg-[#0f0f0f] border border-[#262626] rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-400">{step.step}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-mono text-gray-400">{step.time}</span>
                              <span className="text-sm font-bold text-blue-300">{step.water}</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column - Tips + Flavor */}
              <div className="space-y-6">
                {/* Tips Card */}
                <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#262626]">
                    <Lightbulb size={20} className="text-yellow-400" />
                    <h3 className="text-lg font-bold text-white">특화 포인트</h3>
                  </div>
                  <ul className="space-y-3">
                    {recipeData.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2"></span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Flavor Profile Card */}
                <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#262626]">
                    <Sparkles size={20} className="text-purple-400" />
                    <h3 className="text-lg font-bold text-white">예상 맛 프로파일</h3>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(recipeData.flavor).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-xs font-semibold text-purple-400 mb-1">{key}</div>
                        <div className="text-sm text-gray-300 leading-relaxed">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Adjustments */}
              <div>
                <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#262626]">
                    <SlidersHorizontal size={20} className="text-green-400" />
                    <h3 className="text-lg font-bold text-white">조절 가이드</h3>
                  </div>
                  <div className="space-y-4">
                    {recipeData.adjustments.map((adj, idx) => (
                      <div key={idx} className="bg-[#0f0f0f] border border-[#262626] rounded-lg p-4">
                        <div className="text-sm font-semibold text-red-400 mb-2">
                          {adj.problem}
                        </div>
                        <div className="text-sm text-gray-300 leading-relaxed">
                          → {adj.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
