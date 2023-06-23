import { useState } from "react";
import { UserModelSchema } from "@/lib/schema";
import { Pencil2Icon, PersonIcon } from "@radix-ui/react-icons";
import {
  faCaretDown,
  faCaretUp,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import EditProfile from "./edit-profile";
import Image from "next/image";
import ColoredRole from "@/components/shared/ColoredRole";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SortButton from "../shared/sortButton";

export default function UserList() {
  const [sort, setSort] = useState("");

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

  const sorted = (factor: string) => {
    if (!(sort === factor)) {
      switch (factor) {
        case "name":
          setSort(factor);
          return data?.users.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
        case "email":
          setSort(factor);
          return data?.users.sort((a, b) =>
            a.email > b.email ? 1 : b.email > a.email ? -1 : 0
          );
        case "role":
          setSort(factor);
          return data?.users.sort((a, b) =>
            a.role > b.role ? 1 : b.role > a.role ? -1 : 0
          );
        default:
          return data?.users;
      }
    }

    switch (factor) {
      case "name":
        setSort("~" + factor);
        return data?.users.sort((a, b) =>
          a.name < b.name ? 1 : b.name < a.name ? -1 : 0
        );
      case "email":
        setSort("~" + factor);
        return data?.users.sort((a, b) =>
          a.email < b.email ? 1 : b.email < a.email ? -1 : 0
        );
      case "role":
        setSort("~" + factor);
        return data?.users.sort((a, b) =>
          a.role < b.role ? 1 : b.role < a.role ? -1 : 0
        );
      default:
        return data?.users;
    }
  };

  const users = sorted("default");

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
      <tr>
        <th className="p-2"></th>
        <th
          className="p-2"
          onClick={() => {
            sorted("name");
          }}
        >
          <SortButton title="Name" value="name" state={sort} />
        </th>
        <th
          className="p-2"
          onClick={() => {
            sorted("email");
          }}
        >
          <SortButton title="Email" value="email" state={sort} />
        </th>
        <th
          className="p-2"
          onClick={() => {
            sorted("role");
          }}
        >
          <SortButton title="Role" value="role" state={sort} />
        </th>
        <th className="p-2"></th>
      </tr>
      {users?.map((user) => (
        <tr key={user.id} className="hover:bg-gray-200 dark:hover:bg-zinc-800">
          <td className="p-2">
            {user?.image ? (
              <Image
                className="rounded-full"
                src={user?.image}
                alt={user.name}
                width={40}
                height={40}
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
