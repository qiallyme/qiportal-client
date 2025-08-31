-- Migration: Add slug column to orgs table
-- Run this in your Supabase SQL Editor

-- 1. Add slug column
ALTER TABLE orgs ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 2. Backfill existing orgs with slug values
UPDATE orgs SET slug = LOWER(name) WHERE slug IS NULL;

-- 3. Set specific slug values for known orgs
UPDATE orgs SET slug = 'builtbyrays' WHERE name ILIKE '%builtbyrays%';
UPDATE orgs SET slug = 'zaitullahk' WHERE name ILIKE '%zaitullahk%';
UPDATE orgs SET slug = 'rosalucas' WHERE name ILIKE '%rosalucas%';
UPDATE orgs SET slug = 'innovahire' WHERE name ILIKE '%innovahire%';
UPDATE orgs SET slug = 'qially' WHERE name ILIKE '%qially%';

-- 4. Make slug NOT NULL after backfilling
ALTER TABLE orgs ALTER COLUMN slug SET NOT NULL;

-- 5. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orgs_slug ON orgs(slug);

-- 6. Verify the data
SELECT id, name, slug FROM orgs ORDER BY name;
