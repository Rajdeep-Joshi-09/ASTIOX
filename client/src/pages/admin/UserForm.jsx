import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormCard,
  PageShell,
  StatusToggle,
  ErrorAlert,
  SelectField,
} from "@/components/admin/PageShell";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const USER_TYPES = [
  { value: "admin", label: "Admin" },
  { value: "sub_admin", label: "Sub Admin" },
  { value: "super_admin", label: "Super Admin" },
];

const UserForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userType, setUserType] = useState("admin");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableTypes =
    currentUser?.userType === "super_admin"
      ? USER_TYPES
      : USER_TYPES.filter((t) => t.value !== "super_admin");

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const res = await apiFetch(`/users/${id}`);
        const user = res.data;
        setUsername(user.userName);
        setUserEmail(user.userEmail);
        setUserType(user.userType);
        setIsActive(user.isStatus === "Active" || user.isStatus === 1);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isEdit) {
        await apiFetch(`/users/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            username,
            userEmail,
            userType,
            isStatus: isActive ? 1 : 0,
          }),
        });
      } else {
        await apiFetch("/users", {
          method: "POST",
          body: JSON.stringify({
            username,
            userEmail,
            userType,
            password,
            confirmPassword,
          }),
        });
      }
      navigate("/admin/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title={isEdit ? "Edit User" : "Add User"}
      description="Create or update panel user accounts"
      action={
        <Button variant="outline" asChild>
          <Link to="/admin/users">Back</Link>
        </Button>
      }
    >
      <ErrorAlert message={error} />
      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userEmail">Email</Label>
            <Input id="userEmail" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userType">User Type</Label>
            <SelectField id="userType" value={userType} onChange={(e) => setUserType(e.target.value)}>
              {availableTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </SelectField>
          </div>
          {!isEdit && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
            </>
          )}
          {isEdit && <StatusToggle active={isActive} onChange={setIsActive} />}
          <Button type="submit" disabled={loading} className="w-full h-10">
            {loading ? "Saving..." : isEdit ? "Update User" : "Create User"}
          </Button>
        </form>
      </FormCard>
    </PageShell>
  );
};

export default UserForm;
