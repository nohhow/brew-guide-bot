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

# 응답 형식
반드시 다음 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.

\`\`\`json
{
  "beanInfo": {
    "name": "원두 이름",
    "origin": "산지",
    "process": "가공방식",
    "roast": "로스팅 레벨"
  },
  "recipe": {
    "원두량": "15g",
    "물온도": "93°C",
    "총 물량": "250g",
    "분쇄도": "중간",
    "추출시간": "2:30-3:00",
    "드리퍼": "하리오 V60"
  },
  "pouring": [
    {
      "step": 1,
      "time": "0:00-0:30",
      "water": "50g",
      "description": "중심부터 원을 그리며 천천히"
    }
  ],
  "tips": [
    "게이샤의 섬세한 향미를 위해 낮은 온도 사용",
    "첫 물은 30초간 충분히 뜸들이기"
  ],
  "flavor": {
    "향": "플로럴, 자스민, 베르가못",
    "맛": "복숭아, 열대과일, 꿀",
    "산미": "밝고 산뜻한 시트러스",
    "바디": "부드럽고 실키",
    "여운": "긴 여운, 달콤한 꽃향"
  },
  "adjustments": [
    {
      "problem": "너무 시다",
      "solution": "물 온도 +2°C, 추출 시간 +15초"
    },
    {
      "problem": "밍밍하다",
      "solution": "분쇄도 한 단계 곱게, 물 온도 +3°C"
    }
  ]
}
\`\`\`

# 중요한 원칙
- 브루잉 가이드의 내용을 기반으로 하되, 사용자의 구체적인 상황에 맞게 조정
- 숫자는 정확하게 (분쇄도, 온도, 물양, 시간 등)
- 항상 15g 기준으로 추천 (사용자가 다른 양을 요청하지 않는 한)
- pouring 배열은 최소 4-5단계로 구체적으로
- tips는 3-5개의 핵심 포인트
- adjustments는 4-6개의 일반적인 문제 상황 대응

다음은 브루잉 가이드 전체 내용입니다:

---
${brewingGuide}
---

위 가이드를 참고하여, 사용자의 요청에 맞는 최적의 레시피를 JSON 형식으로만 응답하세요.`;

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
    let message = content.type === 'text' ? content.text : '';

    // JSON 추출 (```json ... ``` 블록에서)
    const jsonMatch = message.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      message = jsonMatch[1];
    }

    // JSON 파싱 시도
    try {
      const recipeData = JSON.parse(message);
      return NextResponse.json({ recipe: recipeData });
    } catch (e) {
      // JSON 파싱 실패시 원본 텍스트 반환
      return NextResponse.json({ message });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
