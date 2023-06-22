import { forwardRef, useImperativeHandle } from "react";
import { InvitationModelSchema } from "@/lib/schema";
import { TrashIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import ColoredRole from "@/components/shared/ColoredRole";

const InvitationList = forwardRef(function InvitationList(
  props: { onDelete: Function },
  ref
) {
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
          <tr className="border-y border-gray-300 dark:border-slate-700">
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
        <th className="p-2">Email</th>
        <th className="p-2">Role</th>
        <th className="p-2"></th>
      </tr>
      {data?.invitations.length !== 0 ? (
        data?.invitations.map((invitation) => (
          <tr
            key={invitation.id}
            className="border-y border-gray-300 dark:border-slate-700"
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
          <td className="h-12" colSpan={2}>
            No invitation to show
          </td>
        </tr>
      )}
    </table>
  );
});

export default InvitationList;
