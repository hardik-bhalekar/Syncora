-- Enterprise Row-Level Security (RLS) Policies
-- These policies enforce tenant isolation at the database layer.
-- They rely on a transaction-scoped session variable 'app.tenant_id'.

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GoalSheet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Goal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SharedGoal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Cycle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CheckIn" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

-- 1. User Isolation
CREATE POLICY tenant_isolation_user ON "User"
  FOR ALL
  USING ("tenantId" = current_setting('app.tenant_id')::text);

-- 2. GoalSheet Isolation
CREATE POLICY tenant_isolation_goalsheet ON "GoalSheet"
  FOR ALL
  USING ("tenantId" = current_setting('app.tenant_id')::text);

-- 3. Goal Isolation
CREATE POLICY tenant_isolation_goal ON "Goal"
  FOR ALL
  USING ("tenantId" = current_setting('app.tenant_id')::text);

-- 4. SharedGoal Isolation
CREATE POLICY tenant_isolation_sharedgoal ON "SharedGoal"
  FOR ALL
  USING ("tenantId" = current_setting('app.tenant_id')::text);

-- 5. Cycle Isolation
CREATE POLICY tenant_isolation_cycle ON "Cycle"
  FOR ALL
  USING ("tenantId" = current_setting('app.tenant_id')::text);

-- 6. CheckIn Isolation
CREATE POLICY tenant_isolation_checkin ON "CheckIn"
  FOR ALL
  USING ("tenantId" = current_setting('app.tenant_id')::text);

-- 7. AuditLog Isolation
CREATE POLICY tenant_isolation_auditlog ON "AuditLog"
  FOR ALL
  USING ("tenantId" = current_setting('app.tenant_id')::text);

-- 8. Notification Isolation
CREATE POLICY tenant_isolation_notification ON "Notification"
  FOR ALL
  USING ("tenantId" = current_setting('app.tenant_id')::text);

-- Bypass RLS for Super Admin tasks (Optional/System maintenance)
-- CREATE POLICY super_admin_bypass ON "User" FOR ALL USING (current_user = 'super_admin_role');
