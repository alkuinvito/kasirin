import { forwardRef, useImperativeHandle, useState } from "react";
import { InvitationModelSchema } from "@/lib/schema";
import { TrashIcon } from "@radix-ui/react-icons";
import { faCubes } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import ColoredRole from "@/components/shared/ColoredRole";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SortButton from "../shared/sortButton";

const InvitationList = forwardRef(function InvitationList(
  props: { onDelete: Function },
  ref
) {
  const [sort, setSort] = useState("");

  const getInvitations = async () => {
    const response = await axios.get("/api/admin/users/invitation", {
      withCredentials: true,
    });
    return z
      .object({ invitations: InvitationModelSchema.array() })
      .parse(response.data);
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["invitations"],
    queryFn: () => getInvitations(),
  });

  const sorted = (factor: string) => {
    if (!(sort === factor)) {
      switch (factor) {
        case "email":
          setSort(factor);
          return data?.invitations.sort((a, b) =>
            a.email > b.email ? 1 : b.email > a.email ? -1 : 0
          );
        case "role":
          setSort(factor);
          return data?.invitations.sort((a, b) =>
            a.role > b.role ? 1 : b.role > a.role ? -1 : 0
          );
        default:
          return data?.invitations;
      }
    }

    switch (factor) {
      case "email":
        setSort("~" + factor);
        return data?.invitations.sort((a, b) =>
          a.email < b.email ? 1 : b.email < a.email ? -1 : 0
        );
      case "role":
        setSort("~" + factor);
        return data?.invitations.sort((a, b) =>
          a.role < b.role ? 1 : b.role < a.role ? -1 : 0
        );
      default:
        return data?.invitations;
    }
  };

  const invitations = sorted("default");

  useImperativeHandle(
    ref,
    () => {
      return {
        refresh() {
          refetch();
        },
      };
    },
    []
  );

  if (isLoading) {
    return (
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">
              <div className="bg-gray-300 dark:bg-zinc-700 rounded-md h-6 w-52 p-2 animate-pulse"></div>
            </td>
            <td className="p-2">
              <div className="bg-gray-300 dark:bg-zinc-700 rounded-md h-6 w-24 p-2 animate-pulse"></div>
            </td>
            <td className="p-2">
              <div className="bg-gray-300 dark:bg-zinc-700 rounded-md h-6 w-6 p-2 animate-pulse"></div>
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
        <th className="p-2">
          {invitations?.length !== 0 ? (
            <SortButton title="Email" value="email" state={sort} />
          ) : (
            <span>Email</span>
          )}
        </th>
        <th className="p-2">
          {invitations?.length !== 0 ? (
            <SortButton title="Role" value="role" state={sort} />
          ) : (
            <span>Role</span>
          )}
        </th>
        <th className="p-2"></th>
      </tr>
      {invitations?.length !== 0 ? (
        invitations?.map((invitation) => (
          <tr
            key={invitation.id}
            className="hover:bg-gray-200 dark:hover:bg-zinc-800"
          >
            <td className="p-2">{invitation.email}</td>
            <td className="p-2">
              <ColoredRole role={invitation.role} />
            </td>
            <td className="p-2">
              <button className="block mx-auto cursor-pointer">
                <TrashIcon
                  className="w-5 h-5 text-red-700"
                  onClick={() => props.onDelete(invitation.email, refetch)}
                />
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr className="text-center">
          <td className=" h-28 text-gray-400 dark:text-zinc-600" colSpan={3}>
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <FontAwesomeIcon icon={faCubes} className="text-5xl" />
              <span className="font-medium">No invitation to show</span>
            </div>
          </td>
        </tr>
      )}
    </table>
  );
});

export default InvitationList;
