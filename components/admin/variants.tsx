import React, { useState } from "react";
import { z } from "zod";
import { variantGroupSchema } from "@/lib/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Separator from "@radix-ui/react-separator";
import {
  faCheck,
  faPencil,
  faPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import cuid from "cuid";
import axios from "axios";
import AlertPopUp from "@/components/shared/alertPopUp";

const OptionalVariant = variantGroupSchema.deepPartial().optional();
type OptionalVariant = z.infer<typeof OptionalVariant>;

type VariantProps = React.JSX.IntrinsicElements["div"];

interface VariantGroupProps extends VariantProps {
  variant?: OptionalVariant;
  onUpdate: Function;
  onDelete: Function;
}

export default function Variants({
  variant,
  onUpdate,
  onDelete,
  ...props
}: VariantGroupProps) {
  const [edit, setEdit] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(
    variant || variantGroupSchema.deepPartial().parse({})
  );

  const handleDelete = async () => {
    axios
      .delete(`/api/products/variants/${currentVariant.id}`, {
        withCredentials: true,
      })
      .then(() => {
        onDelete();
      })
      .catch(console.error);
  };

  const handleSubmit = async () => {
    axios
      .patch(`/api/products/variants/${currentVariant.id}`, currentVariant, {
        withCredentials: true,
      })
      .then(() => {
        setEdit(false);
        onUpdate();
      })
      .catch(console.error);
  };

  if (edit) {
    return (
      <div
        {...props}
        className="p-2 border border-indigo-400 dark:border-indigo-800 rounded-lg"
      >
        <div className="flex justify-between items-center">
          <input
            type="text"
            className="w-36 px-2 py-1 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
            value={currentVariant.name}
            onChange={(e) =>
              setCurrentVariant({
                ...currentVariant,
                name: (e.target as HTMLInputElement).value,
              })
            }
          />
          <div>
            <input
              id={currentVariant.id}
              type="checkbox"
              value="required"
              checked={currentVariant.required}
              onChange={(e) =>
                setCurrentVariant({
                  ...currentVariant,
                  required: e.target.checked,
                })
              }
            />
            <label htmlFor={currentVariant.id} className="ml-1 text-sm">
              Required
            </label>
          </div>
          <div className="flex gap-2">
            <AlertPopUp
              title="Are you sure to delete this variant?"
              action="Delete variant"
              onAccept={handleDelete}
              variant="red"
            >
              <button className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-red-100 dark:hover:bg-red-800/30 text-red-500 dark:text-red-800 cursor-pointer transition-colors">
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </AlertPopUp>
            <button
              className="w-8 h-8 flex justify-center items-center rounded-full text-indigo-500 dark:text-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-950 cursor-pointer transition-colors"
              onClick={handleSubmit}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        </div>
        <Separator.Root className="mt-2 h-[1px] w-full bg-indigo-400 dark:bg-indigo-800" />
        <div>
          {currentVariant.items?.map((item, index) => (
            <div key={item.id} className="mt-2 flex gap-2 items-center">
              <input
                type="text"
                className="w-1/2 px-2 py-1 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                value={item.name}
                onChange={(e) => {
                  let temp = currentVariant?.items;
                  if (temp) {
                    temp[index] = { ...item, name: e.target.value };
                  }
                  setCurrentVariant({
                    ...currentVariant,
                    items: temp,
                  });
                }}
              />
              <input
                type="text"
                className="w-1/2 px-2 py-1 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                value={item.price || 0}
                onChange={(e) => {
                  let temp = currentVariant?.items;
                  if (temp) {
                    temp[index] = { ...item, price: parseInt(e.target.value) };
                  }
                  setCurrentVariant({
                    ...currentVariant,
                    items: temp,
                  });
                }}
              />
              <button
                className="w-[25px] h-[22px] flex justify-center items-center rounded-full text-sm text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-700/50 cursor-pointer transition-colors"
                onClick={() => {
                  if (currentVariant.items) {
                    let temp = currentVariant?.items;
                    temp.splice(index, 1);
                    setCurrentVariant({
                      ...currentVariant,
                      items: temp,
                    });
                  }
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          ))}
          <button
            className="mt-2 py-2 w-full text-sm text-center font-semibold text-indigo-500 dark:text-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-950 rounded-lg cursor-pointer transition-colors"
            onClick={() => {
              if (currentVariant.items) {
                setCurrentVariant({
                  ...currentVariant,
                  items: [
                    {
                      id: cuid(),
                      name: "",
                      price: 0,
                      groupId: currentVariant.id,
                    },
                    ...currentVariant.items,
                  ],
                });
              }
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span> Add item</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...props}
      className="p-2 border border-gray-200 dark:border-zinc-800 rounded-lg"
    >
      <div className="flex justify-between items-center">
        <input
          type="text"
          className="bg-transparent px-2 py-1 w-36 "
          value={currentVariant.name}
          readOnly={true}
        />
        <div>
          <input
            id={currentVariant.id}
            type="checkbox"
            value="required"
            checked={currentVariant.required}
            readOnly={true}
          />
          <label htmlFor={currentVariant.id} className="ml-1 text-sm">
            Required
          </label>
        </div>
        <div className="flex gap-2">
          <button
            className="w-8 h-8 flex justify-center items-center rounded-full text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-700/50 cursor-pointer transition-colors"
            onClick={() => setEdit(true)}
          >
            <FontAwesomeIcon icon={faPencil} />
          </button>
        </div>
      </div>
      <Separator.Root className="mt-2 h-[1px] w-full bg-gray-200 dark:bg-zinc-800" />
      <div>
        {currentVariant.items?.map((item) => (
          <div key={item.id} className="mt-2 flex gap-2 items-center">
            <input
              type="text"
              className="w-1/2 bg-transparent px-2 py-1"
              value={item.name}
              readOnly={true}
            />
            <input
              type="text"
              className="w-1/2 bg-transparent px-2 py-1"
              value={item.price}
              readOnly={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
