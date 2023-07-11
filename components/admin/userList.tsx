import { ChangeEvent, useMemo, useState } from "react";
import { Role, UserModelSchema } from "@/lib/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faMagnifyingGlass,
  faCircleXmark,
  faCircleUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import EditProfile from "./edit-profile";
import Image from "next/image";
import ColoredRole from "@/components/shared/ColoredRole";
import SortButton from "../shared/sortButton";
import TableFooter from "../shared/tableFooter";
import AddUser from "@/components/admin/add-user";

interface Data {
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | boolean },
  b: { [key in Key]: number | string | boolean }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const statusBadge = (active = true) => {
  if (active) {
    return (
      <span className="px-2 py-1 text-sm font-semibold rounded-full bg-green-300/50 dark:bg-green-500/30 text-green-600 dark:text-green-400">
        Active
      </span>
    );
  }
  return (
    <span className="px-2 py-1 text-sm font-semibold rounded-full bg-yellow-300/50 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-400">
      Pending
    </span>
  );
};

export default function UserList() {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [inputs, setInputs] = useState("");

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

  const handleRequestSort = (property: keyof Data) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const visibleRows = useMemo(() => {
    if (inputs.length > 2) {
      return data?.users
        .filter((a) => a.name.toLowerCase().includes(inputs))
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }
    return data?.users
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, data, inputs]);

  if (isLoading) {
    return (
      <div className="table-auto bg-gray-100 dark:bg-zinc-900 rounded-lg p-4">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">
                <div className="flex gap-3 items-center">
                  <div className="bg-gray-300 dark:bg-zinc-700 rounded-full h-10 w-10 p-2 animate-pulse"></div>
                  <div className="bg-gray-300 dark:bg-zinc-700 rounded-md h-6 w-52 p-2 animate-pulse"></div>
                </div>
              </td>
              <td className="p-2">
                <div className="bg-gray-300 dark:bg-zinc-700 rounded-md h-6 w-60 p-2 animate-pulse"></div>
              </td>
              <td className="p-2">
                <div className="bg-gray-300 dark:bg-zinc-700 rounded-md h-6 w-20 p-2 animate-pulse"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (error instanceof Error) {
    return <span>Error occured: {error.message}</span>;
  }

  return (
    <div className="bg-gray-100 dark:bg-zinc-900 rounded-lg">
      <div className="p-2 flex justify-between items-center">
        <div className="grow">
          <div className="p-2 flex items-center w-72 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 hover:dark:bg-zinc-700 focus-within:bg-gray-300 focus-within:dark:bg-zinc-700 rounded-lg transition-colors">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="mr-2 text-gray-400 dark:text-zinc-500"
            />
            <form className="w-full">
              <input
                type="text"
                name="q"
                placeholder="Search members..."
                className="bg-transparent focus:outline-none w-full"
                autoComplete="off"
                value={inputs}
                onInput={(e) => {
                  setInputs((e.target as HTMLInputElement).value);
                }}
              />
            </form>
            {inputs !== "" ? (
              <button onClick={() => setInputs("")}>
                <FontAwesomeIcon
                  className="text-gray-400 dark:text-zinc-500"
                  icon={faCircleXmark}
                />
              </button>
            ) : null}
          </div>
        </div>
        <AddUser onUpdate={refetch}>
          <button className="px-2 h-[2.25rem] bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-lg text-white text-sm font-medium cursor-pointer transition-colors">
            <FontAwesomeIcon icon={faPlus} />
            <span className="ml-1">New User</span>
          </button>
        </AddUser>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-200 dark:bg-zinc-800">
            <th
              className="py-4 pl-6 font-medium"
              onClick={() => {
                handleRequestSort("name");
              }}
            >
              <SortButton
                title="Name"
                value="name"
                order={order}
                orderBy={orderBy}
              />
            </th>
            <th
              className="px-2 py-4 font-medium"
              onClick={() => {
                handleRequestSort("email");
              }}
            >
              <SortButton
                title="Email"
                value="email"
                order={order}
                orderBy={orderBy}
              />
            </th>
            <th
              className="px-2 py-4 font-medium"
              onClick={() => {
                handleRequestSort("role");
              }}
            >
              <SortButton
                title="Role"
                value="role"
                order={order}
                orderBy={orderBy}
              />
            </th>
            <th
              className="px-2 py-4 font-medium"
              onClick={() => {
                handleRequestSort("active");
              }}
            >
              <SortButton
                title="Status"
                value="active"
                order={order === "desc" ? "asc" : "desc"}
                orderBy={orderBy}
              />
            </th>
            <th className="px-2 py-4 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {visibleRows?.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-200 dark:hover:bg-zinc-800"
            >
              <td className="p-2 pl-6 flex gap-3 items-center">
                {user?.image ? (
                  <Image
                    className="rounded-full"
                    src={user?.image}
                    alt={user.name}
                    width={40}
                    height={40}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faCircleUser}
                    className="w-[40px] h-[40px]"
                  />
                )}
                <span className="font-medium">{user.name}</span>
              </td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <ColoredRole role={user.role} />
              </td>
              <td className="p-2">{statusBadge(user.active)}</td>
              <td className="p-2">
                <EditProfile user={user} onUpdate={refetch}>
                  <button className="w-8 h-8 flex justify-center mx-auto items-center rounded-full hover:bg-gray-300/50 dark:hover:bg-zinc-700/50 cursor-pointer transition">
                    <FontAwesomeIcon
                      icon={faPencil}
                      className="text-gray-400"
                    />
                  </button>
                </EditProfile>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter
        visibleRowsLength={visibleRows?.length}
        dataLength={data?.users.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}
