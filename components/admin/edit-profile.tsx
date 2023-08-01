import React, { ReactNode, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { Toast } from "../shared/toast";
import axios from "axios";
import z from "zod";
import FieldErrors from "../shared/fieldErrors";
import { Gender, Role, UserModel } from "@/lib/schema";
import { faCamera, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import AlertPopUp from "@/components/shared/alertPopUp";

export default function EditProfile({
  user,
  children,
  onUpdate,
}: {
  user: UserModel;
  children: ReactNode;
  onUpdate: Function;
}) {
  const defaultErrors = {
    id: [""],
    name: [""],
    email: [""],
    emailVerification: [""],
    image: [""],
    phone: [""],
    address: [""],
    gender: [""],
    dob: [""],
    role: [""],
  };

  const [success, setSuccess] = useState("");
  const [formErrors, setFormErrors] = useState(defaultErrors);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [openErr, setOpenErr] = useState(false);
  const [info, setInfo] = useState({ ...user, gender: "male" });
  const [image, setImage] = useState(user.image);

  const imageRef = useRef<HTMLInputElement>(null);

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fr = new FileReader();
    const file = e.target.files?.item(0) as File;
    fr.onload = () => {
      setImage(fr.result as string);
    };
    fr.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setError("");
    setFormErrors(defaultErrors);

    if (!image) {
      setFormErrors((prev) => ({ ...prev, image: ["Image can not be empty"] }));
      return;
    }

    const options = {
      method: "PATCH",
      url: `/api/admin/users/${user.id}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: { ...info, image: image },
    };
    axios
      .request(options)
      .then(() => {
        setSuccess("Profile updated successfully");
        setOpen(true);
        onUpdate();
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setFormErrors(err.response.data.error);
        } else if (err.response.status === 403) {
          const result = z.string().safeParse(err.response.data.error);
          if (result.success) {
            setError(result.data);
            setOpenErr(true);
          }
        }
      });
  };

  const handleDelete = () => {
    setError("");

    axios
      .delete(`/api/admin/users/${info.id}`, { withCredentials: true })
      .then((res) => {
        setSuccess(res.data.message);
        setOpen(true);
        onUpdate();
      })
      .catch((err) => {
        setError(err.response.data.error);
        setOpenErr(true);
      });
  };

  return (
    <ToastProvider swipeDirection="right">
      <Toast
        severity="error"
        content={error}
        open={openErr}
        setOpen={setOpenErr}
      >
        <button onClick={() => setOpenErr(false)}>
          <Cross1Icon />
        </button>
      </Toast>
      <Toast severity="success" content={success} open={open} setOpen={setOpen}>
        <button onClick={() => setOpen(false)}>
          <Cross1Icon />
        </button>
      </Toast>
      <Dialog.Root>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 w-screen h-screen fixed top-0" />
          <Dialog.Content className="bg-white dark:bg-zinc-800 rounded-lg p-5 shadow-sm fixed w-[640px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="pb-3 text-lg font-semibold">
              Update Profile
            </Dialog.Title>
            <div className="pt-2 flex gap-4">
              <section>
                <fieldset className="grid">
                  {image ? (
                    <div>
                      <button
                        className="w-[150px] h-[150px] flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 absolute text-white bg-black/40 dark:bg-black/70 rounded-full transition-opacity cursor-pointer"
                        onClick={() =>
                          imageRef.current && imageRef.current.click()
                        }
                      >
                        <FontAwesomeIcon icon={faCamera} className="text-2xl" />
                        <span className="font-medium text-sm">
                          Upload image
                        </span>
                      </button>
                      <Image
                        src={image}
                        alt="Uploaded image"
                        className="max-w-[150px] h-full max-h-[150px] object-cover rounded-full"
                        width={150}
                        height={150}
                      ></Image>
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-center w-[150px] h-[150px] border-2 border-gray-300 rounded-full text-gray-300 dark:border-zinc-700 dark:text-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                      onClick={() =>
                        imageRef.current && imageRef.current.click()
                      }
                    >
                      <FontAwesomeIcon icon={faImage} className="w-8 h-8" />
                    </div>
                  )}
                  <input
                    ref={imageRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => handleChangeImg(e)}
                  />
                  <FieldErrors errors={formErrors?.image} />
                </fieldset>
              </section>
              <section className="grow">
                <fieldset className="grid">
                  <label htmlFor="name">Name</label>
                  <FieldErrors errors={formErrors?.name} />
                  <input
                    type="text"
                    className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                    id="name"
                    value={info.name}
                    onChange={(e) =>
                      setInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    autoComplete={"off"}
                    required={true}
                  />
                </fieldset>
                <fieldset className="grid mt-2">
                  <label htmlFor="email">Email</label>
                  <FieldErrors errors={formErrors?.email} />
                  <input
                    type="email"
                    className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                    id="email"
                    value={info.email}
                    readOnly={true}
                    required={true}
                  />
                </fieldset>
                <div className="flex gap-3">
                  <fieldset className="grid mt-2">
                    <label htmlFor="phone">Phone</label>
                    <FieldErrors errors={formErrors?.phone} />
                    <input
                      type="text"
                      className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                      id="phone"
                      value={info.phone || 0}
                      onChange={(e) =>
                        setInfo((prev) => ({
                          ...prev,
                          phone: parseInt(e.target.value),
                        }))
                      }
                      autoComplete={"off"}
                      required={true}
                    />
                  </fieldset>
                  <fieldset className="grid mt-2">
                    <label htmlFor="dob">Date of Birth</label>
                    <FieldErrors errors={formErrors?.dob} />
                    <input
                      type="date"
                      className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                      id="dob"
                      value={info.dob?.toISOString().substring(0, 10)}
                      onInput={(e) => {
                        setInfo((prev) => ({
                          ...prev,
                          dob: new Date((e.target as HTMLInputElement).value),
                        }));
                      }}
                      required={true}
                    />
                  </fieldset>
                </div>
                <fieldset className="grid mt-2">
                  <label htmlFor="address">Address</label>
                  <FieldErrors errors={formErrors?.address} />
                  <textarea
                    className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950 resize-none"
                    id="address"
                    value={info.address || ""}
                    onChange={(e) =>
                      setInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    maxLength={128}
                    required={true}
                  />
                </fieldset>
                <div className="flex gap-3">
                  <fieldset className="grid mt-2 grow">
                    <label htmlFor="role">Role</label>
                    <FieldErrors errors={formErrors?.role} />
                    <select
                      name="role"
                      id="role"
                      value={info.role}
                      className="appearance-none p-2 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                      onChange={(e) =>
                        setInfo((prev) => ({
                          ...prev,
                          role: Role.parse(e.target.value),
                        }))
                      }
                    >
                      <option value="owner">Owner</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </select>
                  </fieldset>
                  <fieldset className="grid mt-2 grow">
                    <label htmlFor="gender">Gender</label>
                    <FieldErrors errors={formErrors?.gender} />
                    <select
                      name="gender"
                      id="gender"
                      value={info.gender?.toString() || "male"}
                      className="appearance-none p-2 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                      onChange={(e) =>
                        setInfo((prev) => ({
                          ...prev,
                          gender: Gender.parse(e.target.value),
                        }))
                      }
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </fieldset>
                </div>
              </section>
            </div>
            <div className="flex justify-between pt-5">
              <AlertPopUp
                title="Are you sure to delete this user?"
                action="Delete user"
                onAccept={handleDelete}
                variant="red"
              >
                <button className="py-2 px-3 hover:bg-red-100 dark:hover:bg-red-800/10 rounded-lg text-red-500 dark:text-red-700 font-medium cursor-pointer transition-colors">
                  Delete user
                </button>
              </AlertPopUp>
              <button
                onClick={handleSubmit}
                className="py-2 px-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-lg text-white font-medium cursor-pointer transition-colors"
              >
                Update profile
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <ToastViewport className="fixed bottom-0 right-0 flex flex-col gap-3 w-96 max-w-[100vw] m-0 z-50 outline-none p-6" />
    </ToastProvider>
  );
}
