import { UserModelSchema, UserModel } from "@/lib/schema";
import axios from "axios";
import { z } from "zod";
import Invitation from "@/components/admin/invitation";
import { useEffect, useState } from "react";

const getUsers = async () => {
  const { data } = await axios.get(
    process.env.NEXT_PUBLIC_APP_HOST + "/api/admin/users",
    {
      withCredentials: true,
    }
  );
  return z.array(UserModelSchema).parse(data.users);
};

const renderUsers = (users: UserModel[]): JSX.Element => {
  return (
    <table className="w-full text-left">
      <tr className="border-y border-gray-300 dark:border-slate-700">
        <th className="p-2">Name</th>
        <th className="p-2">Email</th>
        <th className="p-2">Role</th>
        <th className="p-2"></th>
      </tr>
      {users.map((user) => (
        <tr
          key={user.id}
          className="border-y border-gray-300 dark:border-slate-700"
        >
          <td className="p-2">{user.name}</td>
          <td className="p-2">{user.email}</td>
          <td className="p-2">{user.role}</td>
          <td className="p-2">
            <button>Edit</button>
          </td>
        </tr>
      ))}
    </table>
  );
};

export default function Page() {
  const [users, setUsers] = useState(<></>);

  useEffect(() => {
    getUsers().then((res) => {
      setUsers(renderUsers(res));
    });
  }, []);

  return (
    <>
      <h1 className="font-semibold text-2xl">User Management</h1>
      <div className="p-4">
        <h2 className="font-semibold text-xl">Members</h2>
        <div className="mt-4 p-4 max-w-4xl rounded-lg bg-gray-100 dark:bg-slate-900">
          {users}
        </div>
        <Invitation />
      </div>
    </>
  );
}