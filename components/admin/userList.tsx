import { UserModelSchema } from "@/lib/schema";
import { Pencil2Icon, PersonIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import EditProfile from "./edit-profile";
import Image from "next/image";
import ColoredRole from "@/components/shared/ColoredRole";

export default function UserList() {
  const getUsers = async () => {
    const response = await axios.get("/api/admin/users", {
      withCredentials: true,
    });
    return z.object({ users: UserModelSchema.array() }).parse(response.data);
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  if (isLoading) {
    return (
      <table className="w-full text-left">
        <thead>
          <tr className="border-y border-gray-300 dark:border-slate-700">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-y border-gray-300 dark:border-slate-700">
            <td className="p-2">
              <div className="bg-slate-700 rounded-md h-4 p-2 animate-pulse"></div>
            </td>
            <td className="p-2">
              <div className="bg-slate-700 rounded-md h-4 p-2 animate-pulse"></div>
            </td>
            <td className="p-2">
              <div className="bg-slate-700 rounded-md h-4 p-2 animate-pulse"></div>
            </td>
            <td className="p-2">
              <div className="bg-slate-700 rounded-md h-4 p-2 animate-pulse"></div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  if (error instanceof Error) {
    return <span>Error occured: {error.message}</span>;
  }

  return (
    <table className="w-full text-left">
      <tr className="border-y border-gray-300 dark:border-slate-700">
        <th className="p-2">Image</th>
        <th className="p-2">Name</th>
        <th className="p-2">Email</th>
        <th className="p-2">Role</th>
        <th className="p-2"></th>
      </tr>
      {data?.users.map((user) => (
        <tr
          key={user.id}
          className="border-y border-gray-300 dark:border-slate-700"
        >
          <td className="p-2">
            {user?.image ? (
              <Image
                className="rounded-lg"
                src={user?.image}
                alt={user.name}
                width={44}
                height={44}
              />
            ) : (
              <PersonIcon />
            )}
          </td>
          <td className="p-2">{user.name}</td>
          <td className="p-2">{user.email}</td>
          <td className="p-2">
            <ColoredRole role={user.role} />
          </td>
          <td className="p-2">
            <EditProfile
              email={user.email}
              fullname={user.name}
              role={user.role}
              trigger={
                <button className="block mx-auto cursor-pointer">
                  <Pencil2Icon className="w-5 h-5" />
                </button>
              }
              onUpdate={() => refetch()}
            />
          </td>
        </tr>
      ))}
    </table>
  );
}
