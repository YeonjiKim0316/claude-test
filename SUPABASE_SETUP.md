# Supabase 설정 가이드

이 문서는 Nomad Cities 프로젝트를 Supabase와 연동하기 위한 단계별 가이드입니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정을 만들거나 로그인합니다.
2. "New Project" 버튼을 클릭하여 새 프로젝트를 생성합니다.
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전을 설정합니다.
4. 프로젝트가 생성될 때까지 기다립니다 (약 2분 소요).

## 2. 환경 변수 설정

1. Supabase 프로젝트 대시보드에서 **Settings > API**로 이동합니다.
2. 다음 정보를 확인합니다:
   - Project URL
   - anon/public API key

3. 프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. 데이터베이스 스키마 생성

### 방법 1: SQL Editor 사용 (권장)

1. Supabase 대시보드에서 **SQL Editor**로 이동합니다.
2. `supabase/migrations/20250118000000_initial_schema.sql` 파일의 내용을 복사합니다.
3. SQL Editor에 붙여넣고 "Run" 버튼을 클릭합니다.
4. `supabase/migrations/20250118000001_rls_policies.sql` 파일의 내용도 동일하게 실행합니다.

### 방법 2: Supabase CLI 사용

```bash
# Supabase CLI 설치 (아직 설치하지 않은 경우)
npm install -g supabase

# Supabase 로그인
supabase login

# 프로젝트 링크
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

## 4. 초기 데이터 Seeding

1. Supabase 대시보드의 **SQL Editor**로 이동합니다.
2. `supabase/seed.sql` 파일의 내용을 복사하여 실행합니다.
3. 이 작업으로 15개의 도시 데이터가 데이터베이스에 삽입됩니다.

**참고**: RLS 정책 때문에 Seed 스크립트가 실패할 경우:
- SQL Editor에서는 RLS가 우회되므로 정상 작동합니다.
- 또는 스크립트 상단의 주석을 해제하여 임시로 RLS를 비활성화할 수 있습니다.

## 5. Storage 버킷 생성 (선택사항)

사용자 아바타 업로드 기능을 사용하려면:

1. Supabase 대시보드에서 **Storage**로 이동합니다.
2. "Create a new bucket" 버튼을 클릭합니다.
3. 버킷 이름을 `user-avatars`로 설정합니다.
4. Public bucket으로 설정합니다.
5. 생성 완료 후 **Policies** 탭에서 다음 정책을 추가합니다:

**읽기 정책** (모두 읽기 가능):
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'user-avatars' );
```

**쓰기 정책** (인증된 사용자만 업로드 가능):
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-avatars'
  AND auth.role() = 'authenticated'
);
```

## 6. 타입 생성 (선택사항)

TypeScript 타입을 자동으로 생성하려면:

```bash
npx supabase gen types typescript --project-id your-project-id > lib/database.types.ts
```

**참고**: 이 프로젝트에는 이미 `lib/database.types.ts` 파일이 포함되어 있습니다.

## 7. 애플리케이션 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 애플리케이션을 확인합니다.

## 8. 관리자 사용자 설정 (선택사항)

도시 데이터를 추가/수정/삭제하려면 관리자 권한이 필요합니다:

1. Supabase 대시보드의 **Authentication > Users**로 이동합니다.
2. 사용자를 생성하거나 기존 사용자를 선택합니다.
3. **User Metadata** 섹션에서 다음을 추가합니다:

```json
{
  "role": "admin"
}
```

## 데이터베이스 구조

### 주요 테이블

- **cities**: 도시 기본 정보 (이름, 위치, 예산, 인터넷 속도 등)
- **city_details**: 도시 상세 정보 (설명, 하이라이트, 장단점)
- **cost_breakdown**: 생활비 상세 분석
- **city_stats**: 실시간 통계 (좋아요, 리뷰 수, 노마드 수 등)
- **reviews**: 사용자 리뷰
- **user_likes**: 사용자 좋아요/싫어요
- **user_bookmarks**: 사용자 북마크
- **user_profiles**: 사용자 프로필

### RLS 정책 요약

- **cities, city_details, cost_breakdown, city_stats**: 모두 읽기 가능, 관리자만 쓰기
- **reviews**: 모두 읽기 가능, 인증된 사용자가 작성, 본인만 수정/삭제
- **user_likes, user_bookmarks**: 본인 데이터만 조회/관리
- **user_profiles**: 모두 읽기 가능, 본인만 수정

## Server Actions

프로젝트에서 사용 가능한 Server Actions:

### 도시 관련 (`app/actions/cities.ts`)
- `getCities(filters)`: 도시 목록 조회
- `getCityBySlug(slug)`: 특정 도시 조회
- `getCityStats(cityId)`: 도시 통계 조회
- `searchCities(query)`: 도시 검색
- `getTotalStats()`: 전체 통계

### 리뷰 관련 (`app/actions/reviews.ts`)
- `getReviewsByCity(cityId)`: 도시별 리뷰 조회
- `createReview(data)`: 리뷰 작성
- `updateReview(id, data)`: 리뷰 수정
- `deleteReview(id)`: 리뷰 삭제
- `getUserReviews()`: 내 리뷰 조회

### 인터랙션 관련 (`app/actions/interactions.ts`)
- `toggleLike(cityId, isLike)`: 좋아요/싫어요
- `toggleBookmark(cityId)`: 북마크
- `getUserLikes()`: 내 좋아요 목록
- `getUserBookmarks()`: 내 북마크 목록

### 프로필 관련 (`app/actions/profile.ts`)
- `getProfile(userId)`: 프로필 조회
- `updateProfile(data)`: 프로필 수정
- `uploadAvatar(formData)`: 아바타 업로드

## 문제 해결

### 1. "relation does not exist" 오류

스키마 마이그레이션이 제대로 실행되지 않았습니다. SQL Editor에서 마이그레이션 스크립트를 다시 실행하세요.

### 2. "permission denied" 오류

RLS 정책이 올바르게 설정되지 않았습니다. RLS 정책 마이그레이션을 다시 실행하세요.

### 3. 환경 변수 오류

`.env.local` 파일이 올바르게 설정되었는지 확인하고, 개발 서버를 재시작하세요.

### 4. 타입 오류

`lib/database.types.ts` 파일과 실제 데이터베이스 스키마가 일치하는지 확인하세요.

## 추가 리소스

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js Supabase 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
