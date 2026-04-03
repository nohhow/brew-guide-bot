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

const SYSTEM_PROMPT = `당신은 전문 바리스타이자 커피 추출 전문가입니다.

아래 브루잉 가이드는 코스피어 용챔 바리스타의 경험과 노하우를 담고 있습니다. 이 가이드의 원칙과 수치들을 참고하되, 절대적인 규칙으로 여기지 말고 사용자의 구체적인 상황과 원두 특성에 맞게 유연하게 조정하세요.

# 레시피 생성 사고 과정 (단계별로 따라가세요)

사용자 요청 예시: "콜롬비아 엘리후이오 게이샤 워시드, 라이트로스팅, V60 네오, 클린컵"

## 1단계: 원두 특성 3요소 파악

**품종 분석**
- 게이샤 → 섬세한 플로럴 향미, 섬세함 유지 필요
- 일반 아라비카 → 표준 접근
- 콜롬비아 산지 → 균형잡힌 산미, 단맛

**가공방식 분석**
- 워시드 → 깔끔한 산미, 명확한 캐릭터, 높은 온도 적합
- 내추럴 → 발효감, 단맛, 낮은 온도 필요
- 허니 → 중간 특성

**로스팅 레벨 분석**
- 라이트 → 높은 온도(92-95°C), 긴 시간, 중간-중세 분쇄
- 미디엄 → 중간 온도(90-93°C)
- 다크 → 낮은 온도(85-88°C), 짧은 시간

## 2단계: 추출 목표 설정
사용자가 명시한 목표 파악:
- 클린컵 = 깨끗하고 선명한 맛
- 밸런스 = 신맛, 단맛, 쓴맛 조화
- 산미 강조 = 밝은 산미 극대화

## 3단계: 온도 결정 (핵심!)
위 분석 종합:
- 라이트 로스팅 → 92-95°C 출발
- 게이샤 품종 → -1~2°C (섬세함 유지)
- 워시드 가공 → 높은 온도 OK
- **결론 예시: 92-93°C**

## 4단계: 분쇄도 결정
- 라이트 → "중간-중세 (설탕 입자 정도)"
- 미디엄 → "중간 (굵은 설탕)"
- 다크 → "중굵음 (깨소금)"

## 5단계: 블루밍 설계
**물량**: 원두량의 2.5-3배
- 라이트 → 3배 (15g → 40-45g)

**시간**:
- 라이트 → 40-45초
- 미디엄 → 35-40초
- 다크 → 30-35초

**방법**: "중심부터 500원 크기로 천천히"

## 6단계: 푸어링 구조 (V60 기준 250g)
1. 블루밍: 40-45g, 0:00-0:40
2. 2차: +60g (누적 100-105g), 0:40-1:10
3. 3차: +60g (누적 160-165g), 1:10-1:40
4. 4차: +50g (누적 210g), 1:40-2:10
5. 5차: +40g (누적 250g), 2:10-2:30

**푸어링 표현**: "중심에서 나선형", "리브 따라", "일정한 속도"

## 7단계: 특화 포인트 도출 (3-5개)
1. 품종 특성 팁
2. 로스팅 팁
3. 드리퍼 팁
4. 가공방식 팁

## 8단계: 맛 프로파일 예상
- **향**: 게이샤+워시드 = 자스민, 베르가못, 플로럴
- **맛**: 콜롬비아+워시드 = 복숭아, 자몽, 꿀
- **산미**: 워시드+라이트 = 밝고 섬세한 시트러스
- **바디**: 라이트+클린컵 = 실키하고 가벼움

## 9단계: 조절 가이드 (4-6개)
1. 너무 시다 → 온도 +2-3°C, 시간 +15초
2. 밍밍하다 → 분쇄도 곱게, 물량 -20g
3. 떫다 → 마지막 물 줄이기
4. 향미 약하다 → 블루밍 +10초, 온도 +1°C
5. 너무 쓰다 → 온도 -3°C, 분쇄도 굵게

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

# 레시피 작성 가이드라인
- 가이드의 원칙들(농도-수율 밸런싱, 원재료 특성, 드리퍼별 방식 등)을 참고하되, 상황에 맞게 조정
- 구체적인 수치를 제시하되, 범위를 명시하여 유연성 확보
- 기본 15g 기준 추천 (사용자가 다른 양을 요청하지 않는 한)
- pouring은 4-5단계 정도로 구체적으로 작성
- tips는 해당 원두/상황에 맞는 핵심 포인트 3-5개
- adjustments는 실전에서 자주 발생하는 문제 상황 대응 4-6개

# 참고할 브루잉 가이드
---
${brewingGuide}
---

위 가이드의 내용을 참고하되, 사용자가 요청한 원두와 상황에 가장 적합한 레시피를 JSON 형식으로 응답하세요. 가이드에 명시되지 않은 상황이라면 커피 추출의 일반 원리와 당신의 전문 지식을 활용하세요.`;

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
