-- Add coordinate columns to Farms table
ALTER TABLE "Farms"
ADD COLUMN lat DOUBLE PRECISION,
ADD COLUMN lng DOUBLE PRECISION;

-- Add coordinate columns to Stores table
ALTER TABLE "Stores"
ADD COLUMN lat DOUBLE PRECISION,
ADD COLUMN lng DOUBLE PRECISION; 