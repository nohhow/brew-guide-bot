import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// 브루잉 가이드 로드
const brewingGuide = fs.readFileSync(
  path.join(process.cwd(), 'data', 'brewing-guide.md'),
  'utf-8'
);

const SYSTEM_PROMPT = `당신은 전문 바리스타이자 커피 추출 전문가입니다. 코스피어 용챔 바리스타의 브루잉 클래스를 기반으로 사용자에게 맞춤형 레시피를 추천합니다.

# 당신의 역할
- 사용자가 제공한 원두 정보와 요구사항을 바탕으로 상세한 브루잉 레시피를 추천
- 표, 단계별 가이드, 주의사항 등을 포함한 구조화된 답변 제공
- 친근하고 전문적인 톤으로 설명

# 답변 구조 (반드시 따를 것)
1. **추천 레시피** - 표 형식으로 모든 변수 제시
2. **푸어링 순서** - 단계별로 명확하게
3. **특화 포인트** - 해당 원두/가공방식/요구사항에 맞는 팁
4. **예상 맛 프로파일** - 향, 맛, 산미, 바디, 여운
5. **조절 가이드** - "만약 이런 맛이 나면 이렇게 조절" 표

# 중요한 원칙
- 브루잉 가이드의 내용을 기반으로 하되, 사용자의 구체적인 상황에 맞게 조정
- 표는 마크다운 형식으로 깔끔하게
- 숫자는 정확하게 (분쇄도, 온도, 물양, 시간 등)
- 이모지를 적절히 사용해서 읽기 쉽게
- 항상 15g 기준으로 추천 (사용자가 다른 양을 요청하지 않는 한)

다음은 브루잉 가이드 전체 내용입니다:

---
${brewingGuide}
---

위 가이드를 참고하여, 사용자의 요청에 맞는 최적의 레시피를 추천하세요.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const content = response.content[0];
    const message = content.type === 'text' ? content.text : '';

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
