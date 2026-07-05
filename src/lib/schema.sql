-- 시절소담 데이터베이스 스키마
-- Neon SQL Editor 또는 psql에서 이 파일 내용을 한 번 실행해주세요.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 카카오 로그인 등 소셜 로그인 대비 컬럼.
-- 지금은 이메일+비밀번호 가입만 쓰지만, 나중에 카카오 연동을 붙일 때
-- 이 컬럼들을 그대로 활용하면 기존 이메일 유저와 테이블을 분리하지 않아도 됨.
-- (카카오로 가입한 유저는 password_hash가 없을 수 있어 NOT NULL을 풀어둠)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(20) NOT NULL DEFAULT 'email';
ALTER TABLE users ADD COLUMN IF NOT EXISTS kakao_id VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- ============================================
-- 커뮤니티(소담) 관련 테이블
-- ============================================

-- 유저가 직접 작성한 레시피 (사이트 기본 제공 레시피와는 별개)
CREATE TABLE IF NOT EXISTS user_recipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  main_ingredient VARCHAR(50),
  description TEXT,
  ingredients_text TEXT NOT NULL, -- 한 줄에 하나씩: "재료 이름 분량"
  steps_text TEXT NOT NULL,       -- 한 줄에 하나씩: 조리 순서
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_recipes_created_at ON user_recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_recipes_user_id ON user_recipes(user_id);

-- 커뮤니티 피드 게시물 (사진 + 캡션). 사이트 기본 레시피(recipe_id) 또는
-- 유저가 쓴 레시피(user_recipe_id) 중 하나를 선택적으로 태그할 수 있음.
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  recipe_id VARCHAR(20),          -- 사이트 기본 레시피 id (느슨한 참조, FK 없음)
  user_recipe_id INTEGER REFERENCES user_recipes(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);

-- 게시물 반응("맛있어요"). 좋아요와 동일한 역할이지만 이름만 우리 서비스답게.
CREATE TABLE IF NOT EXISTS post_reactions (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);

-- 게시물 댓글
CREATE TABLE IF NOT EXISTS post_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);

-- 로그인한 유저가 어떤 레시피를 열어봤는지 기록.
-- 홈 화면 개인화 추천("최근 관심 재료 기반 추천")의 근거 데이터로 사용.
CREATE TABLE IF NOT EXISTS recipe_views (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id VARCHAR(20) NOT NULL,
  main_ingredient VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipe_views_user_id ON recipe_views(user_id, created_at DESC);

-- 소담이(AI 에이전트)에게 물어본 내용 기록.
-- 즐겨찾기·조회기록과 함께 '이 유저가 요즘 관심 있는 재료'를 추정하는 세 번째 신호로 쓰임.
CREATE TABLE IF NOT EXISTS agent_queries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  matched_ingredient VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_queries_user_id ON agent_queries(user_id, created_at DESC);

