import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  KeyRound,
  Plus,
  Trash2,
  Users,
  Loader2,
  Save,
  RotateCcw,
} from "lucide-react";

interface Permission {
  _id: string;
  name: string;
  description?: string;
}

interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  userCount: number;
}

const RolesPermissions = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  // permissionIds currently checked per role, keyed by role id - lets each
  // card be edited independently before saving.
  const [selections, setSelections] = useState<Record<string, Set<string>>>({});
  const [savingRoleId, setSavingRoleId] = useState<string | null>(null);
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "" });

  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("auth_token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const handleAuthFailure = (status: number) => {
    if (status === 401 || status === 403) {
      navigate("/admin/login", { replace: true });
      return true;
    }
    return false;
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/roles`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/admin/permissions`, { headers: getAuthHeaders() }),
      ]);

      if (handleAuthFailure(rolesRes.status) || handleAuthFailure(permissionsRes.status)) return;

      const rolesData = await rolesRes.json();
      const permissionsData = await permissionsRes.json();

      if (!rolesRes.ok) throw new Error(rolesData?.errors?.[0]?.msg || "Failed to fetch roles");
      if (!permissionsRes.ok) throw new Error(permissionsData?.errors?.[0]?.msg || "Failed to fetch permissions");

      const fetchedRoles: Role[] = rolesData.roles || [];
      setRoles(fetchedRoles);
      setPermissions(permissionsData.permissions || []);
      setSelections(
        Object.fromEntries(
          fetchedRoles.map((role) => [role._id, new Set(role.permissions.map((p) => p._id))])
        )
      );
      setActiveRoleId((prev) =>
        prev && fetchedRoles.some((r) => r._id === prev) ? prev : fetchedRoles[0]?._id ?? null
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load roles & permissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDirty = (role: Role) => {
    const selected = selections[role._id];
    if (!selected) return false;
    const original = new Set(role.permissions.map((p) => p._id));
    if (selected.size !== original.size) return true;
    for (const id of selected) if (!original.has(id)) return true;
    return false;
  };

  const togglePermission = (roleId: string, permissionId: string, checked: boolean) => {
    setSelections((prev) => {
      const next = new Set(prev[roleId] || []);
      if (checked) next.add(permissionId);
      else next.delete(permissionId);
      return { ...prev, [roleId]: next };
    });
  };

  const resetSelections = (role: Role) => {
    setSelections((prev) => ({ ...prev, [role._id]: new Set(role.permissions.map((p) => p._id)) }));
  };

  const handleSave = async (role: Role) => {
    setSavingRoleId(role._id);
    try {
      const permissionIds = Array.from(selections[role._id] || []);
      const response = await fetch(`${API_URL}/api/admin/roles/${role._id}/permissions`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ permissionIds }),
      });

      if (handleAuthFailure(response.status)) return;

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to update role");

      setRoles((prev) => prev.map((r) => (r._id === role._id ? { ...r, permissions: data.role.permissions } : r)));
      toast({ title: "Saved", description: `Updated permissions for ${role.name}` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update role", variant: "destructive" });
    } finally {
      setSavingRoleId(null);
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      toast({ title: "Error", description: "Role name is required", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/roles`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newRole),
      });

      if (handleAuthFailure(response.status)) return;

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to create role");

      setRoles((prev) => [...prev, data.role]);
      setSelections((prev) => ({ ...prev, [data.role._id]: new Set() }));
      setActiveRoleId(data.role._id);
      setNewRole({ name: "", description: "" });
      setCreateOpen(false);
      toast({ title: "Role created", description: `"${data.role.name}" is ready to configure` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create role", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/roles/${deleteTarget._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (handleAuthFailure(response.status)) return;

      const data = await response.json();
      if (!response.ok) throw new Error(data?.errors?.[0]?.msg || "Failed to delete role");

      setRoles((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      toast({ title: "Role deleted", description: `"${deleteTarget.name}" has been removed` });
      setDeleteTarget(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete role", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const sortedPermissions = useMemo(
    () => [...permissions].sort((a, b) => a.name.localeCompare(b.name)),
    [permissions]
  );

  // Groups "resource:action" permissions under their "resource" prefix so
  // both tabs can render permissions in readable sections.
  const permissionGroups = useMemo(() => {
    const groups = new Map<string, Permission[]>();
    for (const permission of sortedPermissions) {
      const category = permission.name.split(":")[0] || "other";
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category)!.push(permission);
    }
    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [sortedPermissions]);

  const activeRole = roles.find((r) => r._id === activeRoleId) || null;

  const rolesGrantingPermission = (permissionId: string) =>
    roles.filter((role) => role.permissions.some((p) => p._id === permissionId));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold">Roles & Permissions</h2>
          <p className="text-muted-foreground mt-1">
            Control what each role is allowed to do across the platform
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Role</DialogTitle>
              <DialogDescription>
                New roles start with no permissions - grant them below once created.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Name</Label>
                <Input
                  id="role-name"
                  placeholder="e.g. Moderator"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  placeholder="What is this role for?"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole} disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-96 w-full rounded-lg md:col-span-1" />
          <Skeleton className="h-96 w-full rounded-lg md:col-span-2" />
        </div>
      ) : (
        <Tabs defaultValue="roles">
          <TabsList>
            <TabsTrigger value="roles">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <KeyRound className="h-4 w-4 mr-2" />
              Permissions
            </TabsTrigger>
          </TabsList>

          {/* Roles tab: pick a role on the left, tick its permissions on the right */}
          <TabsContent value="roles">
            {roles.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No roles found. Run <code>npm run seed:rbac</code> in the backend to seed the defaults.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-3 items-start">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-base">All Roles</CardTitle>
                    <CardDescription>Select a role to manage its permissions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {roles.map((role) => {
                      const dirty = isDirty(role);
                      const active = role._id === activeRoleId;
                      return (
                        <button
                          key={role._id}
                          onClick={() => setActiveRoleId(role._id)}
                          className={`w-full flex items-start justify-between gap-2 rounded-md px-3 py-2 text-left transition-colors ${
                            active ? "bg-muted" : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="text-sm font-medium truncate">{role.name}</span>
                              {dirty && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" title="Unsaved changes" />}
                            </div>
                            {role.description && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5 ml-5">{role.description}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1 shrink-0">
                            <Users className="h-3 w-3" />
                            {role.userCount}
                          </Badge>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  {!activeRole ? (
                    <CardContent className="py-12 text-center text-muted-foreground">
                      Select a role to view and edit its permissions
                    </CardContent>
                  ) : (
                    (() => {
                      const selected = selections[activeRole._id] || new Set<string>();
                      const dirty = isDirty(activeRole);
                      const saving = savingRoleId === activeRole._id;
                      return (
                        <>
                          <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <CardTitle className="flex items-center gap-2">
                                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                  {activeRole.name}
                                </CardTitle>
                                {activeRole.description && (
                                  <CardDescription className="mt-1">{activeRole.description}</CardDescription>
                                )}
                              </div>
                              <Badge variant="outline" className="flex items-center gap-1 shrink-0">
                                <Users className="h-3 w-3" />
                                {activeRole.userCount} user{activeRole.userCount === 1 ? "" : "s"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {permissionGroups.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                No permissions defined yet - add one in constants/permissions.js and re-run the seed script.
                              </p>
                            ) : (
                              permissionGroups.map(([category, perms]) => (
                                <div key={category} className="space-y-3">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    {category}
                                  </p>
                                  <div className="space-y-3">
                                    {perms.map((permission) => (
                                      <label
                                        key={permission._id}
                                        htmlFor={`perm-${activeRole._id}-${permission._id}`}
                                        className="flex items-start gap-3 cursor-pointer"
                                      >
                                        <Checkbox
                                          id={`perm-${activeRole._id}-${permission._id}`}
                                          checked={selected.has(permission._id)}
                                          onCheckedChange={(checked) =>
                                            togglePermission(activeRole._id, permission._id, checked === true)
                                          }
                                          className="mt-0.5"
                                        />
                                        <div className="space-y-0.5">
                                          <p className="text-sm font-medium leading-none">{permission.name}</p>
                                          {permission.description && (
                                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                                          )}
                                        </div>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              ))
                            )}

                            <div className="flex items-center justify-between pt-4 border-t">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={activeRole.userCount > 0}
                                title={
                                  activeRole.userCount > 0
                                    ? "Reassign users off this role before deleting it"
                                    : undefined
                                }
                                onClick={() => setDeleteTarget(activeRole)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Role
                              </Button>
                              <div className="flex items-center gap-2">
                                {dirty && (
                                  <Button variant="outline" size="sm" onClick={() => resetSelections(activeRole)}>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Discard
                                  </Button>
                                )}
                                <Button size="sm" onClick={() => handleSave(activeRole)} disabled={!dirty || saving}>
                                  {saving ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                  )}
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </>
                      );
                    })()
                  )}
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Permissions tab: read-only catalog of every permission and which roles grant it */}
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">All Permissions</CardTitle>
                <CardDescription>
                  Permissions are defined in the backend. Grant them to a role from the Roles tab.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {permissionGroups.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No permissions defined yet - add one in constants/permissions.js and re-run the seed script.
                  </p>
                ) : (
                  permissionGroups.map(([category, perms]) => (
                    <div key={category} className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {category}
                      </p>
                      <div className="space-y-3">
                        {perms.map((permission) => {
                          const grantedTo = rolesGrantingPermission(permission._id);
                          return (
                            <div
                              key={permission._id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-md border p-3"
                            >
                              <div className="space-y-0.5 flex items-start gap-2">
                                <KeyRound className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-sm font-medium leading-none">{permission.name}</p>
                                  {permission.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1.5 sm:justify-end">
                                {grantedTo.length === 0 ? (
                                  <span className="text-xs text-muted-foreground">Not granted to any role</span>
                                ) : (
                                  grantedTo.map((role) => (
                                    <Badge key={role._id} variant="secondary" className="text-xs">
                                      {role.name}
                                    </Badge>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the role and its permission mappings. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteRole();
              }}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RolesPermissions;
