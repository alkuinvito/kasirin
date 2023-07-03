import AdminLayout from "@/components/admin/adminLayout";
import UserList from "@/components/admin/userList";

export default function Page() {
  return (
    <AdminLayout>
      <h1 className="font-semibold text-2xl">User Management</h1>
      <div className="mt-4">
        <h2 className="font-semibold text-xl">Members</h2>
        <div className="mt-4 max-w-6xl">
          <UserList />
        </div>
      </div>
    </AdminLayout>
  );
}
