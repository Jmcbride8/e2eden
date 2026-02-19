import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, UserPlus, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

export default function UserManagement() {
  const [currentUser, setCurrentUser] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [editingCompanies, setEditingCompanies] = useState({});
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const checkAdmin = async () => {
      const user = await base44.auth.me();
      if (user?.role !== 'admin') {
        window.location.href = createPageUrl("Home");
      }
      setCurrentUser(user);
    };
    checkAdmin();
  }, []);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
    enabled: !!currentUser,
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await base44.users.inviteUser(inviteEmail, inviteRole);
      setInviteEmail("");
      setInviteRole("user");
      alert("User invited successfully!");
    } catch (error) {
      alert("Failed to invite user: " + error.message);
    }
  };

  const handleCompanyChange = (userId, company) => {
    setEditingCompanies({ ...editingCompanies, [userId]: company });
  };

  const handleSaveCompany = (userId) => {
    const company = editingCompanies[userId];
    if (company) {
      updateUserMutation.mutate({ id: userId, data: { company } });
      const newEditing = { ...editingCompanies };
      delete newEditing[userId];
      setEditingCompanies(newEditing);
    }
  };

  if (isLoading || !currentUser) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black p-6 sm:p-8 pt-24 sm:pt-28">
      <div className="max-w-6xl mx-auto">
        <Link to={createPageUrl("Home")}>
          <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/[0.08] mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-white mb-8">User Management</h1>

        {/* Invite User */}
        <Card className="bg-white/[0.04] border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Invite New User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="user@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder-white/40"
              />
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleInvite} className="bg-amber-500 hover:bg-amber-600">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white/[0.04] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white/70">Name</TableHead>
                  <TableHead className="text-white/70">Email</TableHead>
                  <TableHead className="text-white/70">Role</TableHead>
                  <TableHead className="text-white/70">Company</TableHead>
                  <TableHead className="text-white/70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-white/10">
                    <TableCell className="text-white">{user.full_name}</TableCell>
                    <TableCell className="text-white/70">{user.email}</TableCell>
                    <TableCell className="text-white/70">{user.role}</TableCell>
                    <TableCell>
                      {editingCompanies[user.id] !== undefined ? (
                        <Select
                          value={editingCompanies[user.id]}
                          onValueChange={(val) => handleCompanyChange(user.id, val)}
                        >
                          <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="E2Eden">E2Eden</SelectItem>
                            <SelectItem value="Seawater Greenhouse">Seawater Greenhouse</SelectItem>
                            <SelectItem value="Partner">Partner</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-white/70">{user.company || "Not set"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCompanies[user.id] !== undefined ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveCompany(user.id)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              const newEditing = { ...editingCompanies };
                              delete newEditing[user.id];
                              setEditingCompanies(newEditing);
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleCompanyChange(user.id, user.company || "E2Eden")}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        >
                          Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}