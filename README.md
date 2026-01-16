# Fireboard - Firebase 기반 게시판

Firebase를 활용한 실시간 게시판 시스템입니다.

## 🔥 주요 기능

- ✅ **실시간 게시판** - Firebase Firestore 기반
- ✅ **4개 카테고리** - 공지사항, 자유게시판, Q&A, 갤러리
- ✅ **인증 시스템** - Firebase Auth (이메일/비밀번호)
- ✅ **이미지 업로드** - Firebase Storage (최대 3장)
- ✅ **검색 & 페이징** - 클라이언트 기반
- ✅ **권한 관리** - 작성자만 수정/삭제
- ✅ **푸시 알림 준비** - FCM 토큰 저장

## 📁 프로젝트 구조

```
fireboard/
├── public/
│   ├── index.html          # 메인 (4개 게시판 최신글)
│   ├── board.html          # 게시판 목록
│   ├── post.html           # 게시글 상세
│   ├── write.html          # 글쓰기
│   ├── login.html          # 로그인
│   ├── register.html       # 회원가입
│   ├── js/
│   │   ├── firebase-init.js   # Firebase 초기화
│   │   ├── config.js          # Firebase Config
??  ??  ?????? runtime-config.example.js # Runtime Firebase Config (template)
??  ??  ?????? runtime-config.js  # Runtime Firebase Config (gitignored)
│   │   ├── auth.js            # 인증 로직
│   │   └── posts.js           # 게시글 CRUD
│   └── css/
│       └── style.css          # next_board 스타일
├── firestore.rules         # Security Rules
├── storage.rules           # Storage Rules
└── package.json
```

## 🚀 빠른 시작

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 생성
3. Authentication → Email/Password 활성화
4. Firestore Database → 테스트 모드로 생성
5. Storage → 테스트 모드로 활성화

### 2. 설정 파일 업데이트

`public/js/runtime-config.example.js`? ??? `public/js/runtime-config.js`? ??? Firebase ??? ?????:

```javascript
window.__FIREBASE_CONFIG__ = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Optional
window.__VAPID_KEY__ = "YOUR_VAPID_KEY";
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 3. 로컬 실행

```bash
npm install
npm run serve
```

브라우저: http://localhost:8080

## 📊 데이터 구조

### Firestore Collections

#### `posts`

```javascript
{
  title: string,           // 제목
  content: string,         // 내용
  category: string,        // "notice" | "free" | "qna" | "gallery"
  price: number,           // 가격 (사용 안 함)
  images: string[],        // Storage URLs
  author: {
    uid: string,
    name: string,
    photoURL: string
  },
  status: string,          // "판매중" (사용 안 함)
  keywords: string[],      // 검색 키워드
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `users`

```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  keywords: string[],      // 구독 키워드 (미구현)
  fcmToken: string,        // 푸시 알림용
  createdAt: timestamp
}
```

## 🔒 Security Rules

현재: **테스트 모드** (30일 만료)

프로덕션 배포 시:

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## 🧪 테스트

자세한 테스트 가이드는 `walkthrough.md` 참조

**간단 테스트:**

1. 회원가입: test@example.com / test123
2. 공지사항 → 글쓰기
3. 메인 페이지 확인

## ⚠️ 알려진 제한사항

1. **실시간 업데이트**: 현재는 수동 새로고침 필요

   - 이유: 클라이언트 필터링 방식 (인덱스 불필요)
   - 개선: `onSnapshot` 사용 + Firestore 인덱스 생성

2. **검색**: 클라이언트 기반 (포함 검색)

   - 개선: Algolia 연동 또는 Full-text search

3. **페이징**: 모든 데이터 로드 후 클라이언트 분할
   - 개선: `startAfter` 사용 + 서버 페이징

## 🚀 배포

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
netlify deploy --prod
```

## 📝 TODO

- [ ] 댓글 시스템
- [ ] 좋아요 기능
- [ ] 조회수 카운트
- [ ] 키워드 알림 (Cloud Functions)
- [ ] 1:1 채팅
- [ ] 실시간 구독 (`onSnapshot`)
- [ ] Firestore 인덱스 생성

## 📄 라이센스

MIT

## 🙋 문의

Firebase Console 에러 발생 시 F12 Console 확인
