"use client";

import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllUsers } from "@/lib/hooks/use-all-users";
import { updateUserRole } from "@/lib/users-admin";
import { useAuth } from "@/context/auth-context";
import type { UserDoc, UserRole } from "@/lib/user-doc";

function UserRow({ user, isSelf }: { user: UserDoc; isSelf: boolean }) {
  const initials = user.displayName
    ? user.displayName.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()
    : user.email?.[0].toUpperCase() ?? "U";

  const handleChange = async (value: UserRole) => {
    if (isSelf && value !== "admin") {
      if (!confirm("This removes your own admin access. Continue?")) return;
    }
    try {
      await updateUserRole(user.uid, value);
      toast.success("Role updated.");
    } catch {
      toast.error("Couldn't update — try again.");
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarImage src={user.photoURL ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.displayName || "—"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={user.role === "admin" ? "default" : "outline"} className="capitalize">
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>
        <Select value={user.role} onValueChange={(v) => handleChange(v as UserRole)}>
          <SelectTrigger className="h-9 w-36 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
}

export default function UsersManagerPage() {
  const { users, loading } = useAllUsers();
  const { user: currentUser } = useAuth();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">{users.length} accounts. Promote trusted people to admin here.</p>

      <Card className="mt-6">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Change role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <UserRow key={u.uid} user={u} isSelf={u.uid === currentUser?.uid} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
