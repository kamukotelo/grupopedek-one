-- Blogue gerido pela equipa e subscritores da newsletter.
-- Tabelas no esquema private: só as funções /api (DATABASE_URL) lhes acedem;
-- a Data API pública não as expõe.

CREATE TABLE IF NOT EXISTS private.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    title TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 160),
    summary TEXT NOT NULL CHECK (char_length(summary) BETWEEN 3 AND 1200),
    category TEXT NOT NULL CHECK (category IN ('partnerships', 'protocol', 'experience')),
    audience TEXT CHECK (audience IS NULL OR char_length(audience) <= 120),
    media_type TEXT NOT NULL DEFAULT 'none' CHECK (media_type IN ('video', 'image', 'none')),
    mux_upload_id TEXT,
    mux_playback_id TEXT,
    image_data BYTEA,
    image_mime TEXT CHECK (image_mime IS NULL OR image_mime IN ('image/jpeg', 'image/png', 'image/webp')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_by UUID,
    created_by_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (media_type <> 'image' OR (image_data IS NOT NULL AND image_mime IS NOT NULL)),
    CHECK (media_type <> 'video' OR mux_upload_id IS NOT NULL OR mux_playback_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS blog_posts_published_idx
    ON private.blog_posts (published_at DESC) WHERE status = 'published';

CREATE TABLE IF NOT EXISTS private.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE CHECK (email = lower(email) AND email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
    language TEXT NOT NULL DEFAULT 'pt' CHECK (language IN ('pt', 'en', 'fr')),
    source TEXT NOT NULL DEFAULT 'blogue',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    unsubscribed_at TIMESTAMPTZ
);

REVOKE ALL ON private.blog_posts, private.newsletter_subscribers FROM PUBLIC, anonymous, authenticated;
