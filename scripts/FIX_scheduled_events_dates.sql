-- ============================================
-- FIX SCHEDULED EVENTS DATES
-- Move all pending events to start today
-- Run this in Supabase SQL Editor
-- ============================================

-- First, let's see what we have
SELECT 
    COUNT(*) as total,
    MIN(scheduled_for) as earliest,
    MAX(scheduled_for) as latest
FROM scheduled_events 
WHERE executed = false;

-- Update all pending events to start from today
-- This shifts all events by subtracting the delay
UPDATE scheduled_events
SET scheduled_for = scheduled_for - INTERVAL '2 days'
WHERE executed = false 
AND scheduled_for > NOW();

-- Verify the fix
SELECT 
    COUNT(*) as total_pending,
    COUNT(*) FILTER (WHERE scheduled_for <= NOW()) as ready_to_process,
    MIN(scheduled_for) as earliest,
    MAX(scheduled_for) as latest
FROM scheduled_events 
WHERE executed = false;
