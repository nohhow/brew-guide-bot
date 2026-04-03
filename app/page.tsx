'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Coffee, Droplets, Lightbulb, Sparkles, SlidersHorizontal, Send, Search } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null);

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
      setRecipe(data.message);
    } catch (error) {
      console.error('Error:', error);
      setRecipe('죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    setRecipe(null);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* Initial State - Google-like Search */}
      {!recipe && !isLoading && (
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

      {/* Dashboard State */}
      {recipe && !isLoading && (
        <div className="min-h-screen pb-20">
          {/* Top Search Bar */}
          <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#262626]">
            <div className="max-w-7xl mx-auto px-6 py-4">
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

          {/* Dashboard Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => {
                    const text = String(children);
                    let icon = <Coffee size={24} className="text-amber-400" />;

                    if (text.includes('푸어링') || text.includes('순서')) {
                      icon = <Droplets size={24} className="text-blue-400" />;
                    } else if (text.includes('특화') || text.includes('포인트') || text.includes('팁')) {
                      icon = <Lightbulb size={24} className="text-yellow-400" />;
                    } else if (text.includes('맛') || text.includes('프로파일')) {
                      icon = <Sparkles size={24} className="text-purple-400" />;
                    } else if (text.includes('조절') || text.includes('가이드')) {
                      icon = <SlidersHorizontal size={24} className="text-green-400" />;
                    }

                    return (
                      <div className="flex items-center gap-3 mt-8 mb-4 pb-3 border-b border-[#262626]">
                        {icon}
                        <h2 className="text-2xl font-bold text-white m-0">{children}</h2>
                      </div>
                    );
                  },
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold mt-6 mb-3 text-amber-300">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-base leading-relaxed text-gray-300">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-6 text-gray-300">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-3 mb-6 text-gray-300">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-base leading-relaxed">{children}</li>
                  ),
                  table: ({ children }) => (
                    <div className="my-6 overflow-hidden rounded-xl border border-[#333333] bg-[#1a1a1a]">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#333333]">
                          {children}
                        </table>
                      </div>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-[#262626]">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="px-5 py-4 text-left text-sm font-bold text-amber-400 tracking-wide">
                      {children}
                    </th>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-[#262626]">{children}</tbody>
                  ),
                  td: ({ children }) => (
                    <td className="px-5 py-4 text-base text-gray-200">
                      {children}
                    </td>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-[#262626] text-amber-300 px-2 py-1 rounded text-sm font-mono border border-[#333333]">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-[#0f0f0f] p-4 rounded-lg text-sm font-mono overflow-x-auto text-gray-300 border border-[#262626]">
                        {children}
                      </code>
                    );
                  },
                  strong: ({ children }) => (
                    <strong className="font-bold text-amber-300">{children}</strong>
                  ),
                }}
              >
                {recipe}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
