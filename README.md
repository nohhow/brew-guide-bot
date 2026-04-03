# ☕ 브루잉 레시피 추천 봇

코스피어 용챔 바리스타의 브루잉 클래스를 기반으로 맞춤형 커피 레시피를 추천해주는 AI 챗봇입니다.

## 🌟 주요 기능

- **맞춤형 레시피 추천**: 원두 정보와 요구사항에 따라 상세한 브루잉 레시피 제공
- **전문가 수준의 가이드**: 코스피어 용챔 바리스타의 실전 노하우 기반
- **상세한 조절 가이드**: 맛에 따른 변수 조절 방법 제시
- **직관적인 UI**: 간단하고 깔끔한 채팅 인터페이스

## 🚀 시작하기

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 Anthropic API 키를 설정하세요:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 API 키를 입력:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

API 키는 [Anthropic Console](https://console.anthropic.com/)에서 발급받을 수 있습니다.

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요!

## 📦 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Claude API (Anthropic)
- **Markdown**: react-markdown

## 🎯 사용 방법

1. 원두 정보 입력:
   - 원두 이름 / 산지
   - 가공 방식 (워시드, 내추럴 등)
   - 로스팅 레벨
   - 사용할 드리퍼

2. 요구사항 입력:
   - 어떤 맛을 원하는지 (밸런스, 산미 강조, 단맛 강조 등)

3. AI가 다음을 포함한 상세 레시피를 제공:
   - 기본 세팅 (분쇄도, 온도, 물양 등)
   - 푸어링 순서
   - 특화 포인트
   - 예상 맛 프로파일
   - 맛 조절 가이드

## 📝 예시

**입력:**
```
콜롬비아 엘 후이오 게이샤 워시드 먹을거야. 게이샤답게 추출되길 원해 밸런스 좋게.
```

**출력:**
- 15g 기준 상세 레시피 표
- 5단계 푸어링 가이드
- 게이샤 특화 추출 팁
- 예상 맛 프로파일 (플로럴, 프루티 등)
- 문제 상황별 조절 가이드

## 🚢 배포 (Vercel)

### Vercel로 배포하기

1. GitHub 저장소와 연결
2. Vercel 프로젝트 생성
3. Environment Variables에 `ANTHROPIC_API_KEY` 추가
4. 배포!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nohhow/brew-guide-bot)

## 📚 브루잉 가이드 출처

이 봇은 **코스피어(Cospir) 용챔 바리스타의 브루잉 클래스** 내용을 기반으로 합니다.
- 원두 특성별 추출 가이드
- 계절별 환경 변수 대응
- 물 특성별 전략
- 도구별 최적 세팅
- 로스팅 프로파일별 가이드
- 문제 해결 의사결정 트리

## 🤝 기여하기

이슈나 PR은 언제나 환영합니다!

## 📄 라이선스

MIT License

---

Made with ☕ and ❤️
