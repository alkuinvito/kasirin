import AdminLayout from "@/components/admin/adminLayout";
import UserList from "@/components/admin/userList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddUser from "@/components/admin/add-user";
import { useRef } from "react";

export default function Page() {
  const userListRef = useRef<any>(null);

  const handleUpdate = () => {
    userListRef.current && userListRef.current.refreshUser();
  };
  return (
    <AdminLayout>
      <h1 className="font-semibold text-2xl">User Management</h1>
      <div className="mt-4">
        <div className="flex items-center">
          <h2 className="font-semibold text-xl">Members</h2>
          <div className="grow"></div>
          <AddUser onUpdate={handleUpdate}>
            <button className="flex gap-2 items-center py-2 px-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-lg text-white font-medium cursor-pointer transition-colors">
              <FontAwesomeIcon icon={faPlus} />
              <span className="text-sm">New user</span>
            </button>
          </AddUser>
        </div>
        <div className="mt-4 max-w-6xl">
          <UserList ref={userListRef} />
        </div>
      </div>
    </AdminLayout>
  );
}
