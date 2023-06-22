import AdminLayout from "@/components/admin/AdminLayout";
import Invitation from "@/components/admin/invitation";
import UserList from "@/components/admin/userList";

export default function Page() {
  return (
    <AdminLayout>
      <h1 className="font-semibold text-2xl">User Management</h1>
      <div className="p-4">
        <h2 className="font-semibold text-xl">Members</h2>
        <div className="mt-4 p-4 max-w-4xl rounded-lg bg-gray-100 dark:bg-slate-900">
          <UserList />
        </div>
        <Invitation />
      </div>
    </AdminLayout>
  );
}
