# Supabase 설정 - 수동 작업 필요

이 프로젝트를 실행하기 위해서는 Supabase 프로젝트 설정이 필요합니다. 아래 단계를 따라 진행해주세요.

## ✅ 자동으로 완료된 작업

다음 작업들은 이미 완료되었습니다:

- [x] 프로젝트에 Supabase 의존성 설치 (`@supabase/ssr`, `@supabase/supabase-js`)
- [x] 데이터베이스 스키마 SQL 파일 생성 (`supabase/migrations/`)
- [x] RLS 정책 SQL 파일 생성
- [x] Seed 데이터 SQL 파일 생성 (15개 도시)
- [x] TypeScript 타입 정의 생성 (`lib/database.types.ts`)
- [x] Server Actions 구현 (cities, reviews, interactions, profile)
- [x] Supabase 클라이언트 설정 파일 생성 (`utils/supabase/`)
- [x] 환경 변수 템플릿 파일 생성 (`.env.local.example`, `.env.example`)
- [x] `.gitignore`에 환경 변수 파일 추가 확인

## 🔴 필수: 수동으로 진행해야 하는 작업

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 로그인합니다
2. "New Project" 버튼을 클릭하여 새 프로젝트를 생성합니다
3. 프로젝트 정보 입력:
   - **Name**: `nomad-cities` (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (저장해두세요!)
   - **Region**: `Northeast Asia (Seoul)` 권장
4. "Create new project" 클릭 후 약 2분 대기

### 2. 환경 변수 설정

1. Supabase 프로젝트 대시보드에서 **Settings > API**로 이동
2. 다음 정보를 복사합니다:
   - **Project URL** (예: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (긴 문자열)

3. 프로젝트 루트에 `.env.local` 파일을 생성하고 복사한 값을 입력:

```env
# Supabase 환경 변수
NEXT_PUBLIC_SUPABASE_URL=여기에_Project_URL_붙여넣기
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_key_붙여넣기
```

**⚠️ 중요**: `.env.local` 파일은 절대 Git에 커밋하지 마세요!

### 3. 데이터베이스 스키마 생성

Supabase 대시보드에서 **SQL Editor**로 이동하여 다음 파일들을 순서대로 실행합니다:

#### 3-1. 초기 스키마 생성

1. `supabase/migrations/20250118000000_initial_schema.sql` 파일을 엽니다
2. 전체 내용을 복사합니다
3. Supabase SQL Editor에 붙여넣고 **Run** 버튼 클릭
4. ✅ "Success. No rows returned" 메시지 확인

#### 3-2. RLS 정책 적용

1. `supabase/migrations/20250118000001_rls_policies.sql` 파일을 엽니다
2. 전체 내용을 복사합니다
3. Supabase SQL Editor에 붙여넣고 **Run** 버튼 클릭
4. ✅ "Success. No rows returned" 메시지 확인

#### 3-3. 초기 데이터 입력

1. `supabase/seed.sql` 파일을 엽니다
2. 전체 내용을 복사합니다
3. Supabase SQL Editor에 붙여넣고 **Run** 버튼 클릭
4. ✅ "Success. No rows returned" 메시지 확인

**참고**: SQL Editor는 RLS를 우회하므로 권한 오류 없이 실행됩니다.

### 4. 데이터 확인

1. Supabase 대시보드에서 **Table Editor**로 이동
2. `cities` 테이블을 선택하여 15개의 도시 데이터가 있는지 확인
3. `city_stats` 테이블에서 통계 데이터 확인

### 5. 애플리케이션 실행

```bash
# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 15개의 도시가 표시되는지 확인합니다.

## 🔧 선택사항: 추가 설정

### Storage 버킷 생성 (사용자 아바타 업로드용)

1. Supabase 대시보드에서 **Storage**로 이동
2. "Create a new bucket" 클릭
3. 버킷 이름: `user-avatars`
4. Public bucket으로 설정
5. **Policies** 탭에서 다음 정책 추가:

```sql
-- 읽기 정책 (모두 읽기 가능)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'user-avatars' );

-- 쓰기 정책 (인증된 사용자만 업로드)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-avatars'
  AND auth.role() = 'authenticated'
);
```

### 관리자 사용자 설정 (도시 추가/수정/삭제용)

1. Supabase 대시보드의 **Authentication > Users**로 이동
2. 사용자 생성 또는 기존 사용자 선택
3. **User Metadata** 섹션에 추가:

```json
{
  "role": "admin"
}
```

## 📚 추가 리소스

자세한 설정 방법은 `SUPABASE_SETUP.md` 파일을 참고하세요.

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js Supabase 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## ❓ 문제 해결

### "relation does not exist" 오류
→ 3단계(스키마 생성)를 다시 실행하세요.

### "permission denied" 오류
→ RLS 정책 스크립트를 다시 실행하세요.

### 환경 변수 오류
→ `.env.local` 파일의 값을 확인하고 개발 서버를 재시작하세요.

### 데이터가 표시되지 않음
→ Seed 스크립트가 정상적으로 실행되었는지 Table Editor에서 확인하세요.

---

**다음 단계**: 위 작업을 완료한 후 이 파일을 다시 확인하지 않아도 됩니다. 프로젝트가 정상적으로 실행되면 이 파일은 삭제하셔도 좋습니다.
