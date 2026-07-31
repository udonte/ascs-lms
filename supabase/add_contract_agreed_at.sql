-- Migration: Add contract_agreed_at to enrollments
-- Run this in the Supabase SQL editor

ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS contract_agreed_at TIMESTAMPTZ;
