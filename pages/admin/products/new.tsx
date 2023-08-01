import React, { useRef, useState } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { ToastProvider, ToastViewport } from "@radix-ui/react-toast";
import { Toast } from "@/components/shared/toast";
import axios from "axios";
import z from "zod";
import FieldErrors from "@/components/shared/fieldErrors";
import { faCamera, faImage, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import {
  categorySchema,
  productSchema,
  variantGroupSchema,
} from "@/lib/schema";
import AdminLayout from "@/components/admin/adminLayout";
import Variants from "@/components/admin/variants";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { toSnakeCase } from "@/lib/helper";

export default function Page() {
  const router = useRouter();

  const defaultErrors = {
    id: [""],
    image: [""],
    name: [""],
    permalink: [""],
    price: [""],
    stock: [""],
    categoryId: [""],
    variants: [""],
  };

  const [success, setSuccess] = useState("");
  const [formErrors, setFormErrors] = useState(defaultErrors);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [openErr, setOpenErr] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    ...productSchema.partial().parse({}),
    variants: variantGroupSchema.partial().array().parse([]),
  });

  const imageRef = useRef<HTMLInputElement>(null);

  const getCategories = async () => {
    const response = await axios.get("/api/categories", {
      withCredentials: true,
    });
    setCurrentProduct((prevState) => ({
      ...prevState,
      categoryId: response.data.categories[0].id,
    }));
    return z
      .object({ categories: categorySchema.array() })
      .parse(response.data);
  };

  const categoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const createVariant = async () => {
    axios
      .post(
        "/api/products/variants",
        {
          name: "New variants",
          required: true,
          items: [{ name: "New items", price: 0 }],
        },
        { withCredentials: true }
      )
      .then((res) => {
        const parsed = z
          .object({ variant: variantGroupSchema })
          .safeParse(res.data);
        if (parsed.success) {
          const temp = currentProduct.variants;
          temp?.push(parsed.data.variant);
          setCurrentProduct((prevState) => ({
            ...prevState,
            variants: temp,
          }));
        }
      });
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fr = new FileReader();
    const file = e.target.files?.item(0) as File;
    fr.onload = () => {
      setCurrentProduct(Object.assign(currentProduct, { image: fr.result }));
    };
    fr.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setError("");
    setFormErrors(defaultErrors);

    if (!currentProduct.image) {
      setFormErrors((prev) => ({ ...prev, image: ["Image can not be empty"] }));
      return;
    }

    const parsedVariants = variantGroupSchema
      .pick({ id: true })
      .array()
      .optional()
      .parse(currentProduct.variants);

    axios
      .post(
        `/api/products`,
        { ...currentProduct, variants: parsedVariants },
        { withCredentials: true }
      )
      .then(() => {
        setSuccess("Product updated successfully");
        setOpen(true);
        router.push(`/admin/products`);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setFormErrors(err.response.data.error);
          console.log(err.response.data);
        } else if (err.response.status === 403) {
          const result = z.string().safeParse(err.response.data.error);
          if (result.success) {
            setError(result.data);
            setOpenErr(true);
          }
        }
      });
  };

  return (
    <AdminLayout>
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
        <Toast
          severity="success"
          content={success}
          open={open}
          setOpen={setOpen}
        >
          <button onClick={() => setOpen(false)}>
            <Cross1Icon />
          </button>
        </Toast>

        <h1 className="font-semibold text-2xl">Create Product</h1>
        <section className="mt-4">
          <div className="flex gap-16">
            <section>
              <fieldset className="grid">
                {currentProduct.image ? (
                  <div>
                    <button
                      className="w-[320px] h-[320px] flex flex-col items-center justify-center gap-2 opacity-0 hover:opacity-100 absolute text-white bg-black/40 dark:bg-black/70 transition-opacity cursor-pointer"
                      onClick={() =>
                        imageRef.current && imageRef.current.click()
                      }
                    >
                      <FontAwesomeIcon icon={faCamera} className="text-2xl" />
                      <span className="font-medium text-sm">Upload image</span>
                    </button>
                    <Image
                      src={currentProduct.image}
                      alt="Uploaded image"
                      className="max-w-[320px] h-[320px] object-contain object-center bg-gray-100 dark:bg-zinc-800"
                      width={320}
                      height={320}
                    ></Image>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center w-[320px] h-[320px] border-2 border-gray-300 text-gray-300 dark:border-zinc-700 dark:text-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                    onClick={() => imageRef.current && imageRef.current.click()}
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
            <section className="grow p-4 border border-gray-200 dark:border-zinc-800 rounded-lg">
              <fieldset className="grid">
                <label htmlFor="category">Category</label>
                <FieldErrors errors={formErrors?.categoryId} />
                <select
                  className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950 appearance-none"
                  id="category"
                  value={currentProduct.categoryId}
                  onChange={(e) =>
                    setCurrentProduct((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  required={true}
                >
                  {categoryQuery.data?.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset className="grid mt-2">
                <label htmlFor="name">Name</label>
                <FieldErrors errors={formErrors?.name} />
                <input
                  type="text"
                  className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                  id="name"
                  value={currentProduct.name || ""}
                  onChange={(e) =>
                    setCurrentProduct((prev) => ({
                      ...prev,
                      name: e.target.value,
                      permalink: toSnakeCase(e.target.value),
                    }))
                  }
                  autoComplete={"off"}
                  required={true}
                />
              </fieldset>
              <fieldset className="grid mt-2">
                <label htmlFor="permalink">Permalink</label>
                <FieldErrors errors={formErrors?.permalink} />
                <input
                  type="text"
                  className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                  id="permalink"
                  value={currentProduct.permalink || ""}
                  onChange={(e) =>
                    setCurrentProduct((prev) => ({
                      ...prev,
                      permalink: e.target.value,
                    }))
                  }
                  autoComplete={"off"}
                  required={true}
                />
              </fieldset>
              <div className="flex gap-3 mt-2">
                <fieldset className="grow grid">
                  <label htmlFor="price">Price</label>
                  <FieldErrors errors={formErrors?.price} />
                  <input
                    className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                    id="price"
                    value={currentProduct.price || 0}
                    min={0}
                    max={100000000}
                    onChange={(e) =>
                      setCurrentProduct((prev) => ({
                        ...prev,
                        price: parseInt(e.target.value),
                      }))
                    }
                    required={true}
                  />
                </fieldset>
                <fieldset className="grow grid">
                  <label htmlFor="stock">Stock</label>
                  <FieldErrors errors={formErrors?.stock} />
                  <input
                    type="number"
                    className="w-full py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950"
                    id="stock"
                    value={currentProduct.stock || 0}
                    min={0}
                    max={1000}
                    onChange={(e) =>
                      setCurrentProduct((prev) => ({
                        ...prev,
                        stock: parseInt(e.target.value),
                      }))
                    }
                    required={true}
                  />
                </fieldset>
              </div>
              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <label>Variants</label>
                  <button
                    onClick={createVariant}
                    className="my-1 py-1 px-2 text-sm text-center font-medium text-indigo-500 dark:text-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-950 rounded-lg cursor-pointer transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    Add Variant
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {currentProduct.variants?.map((variant) => (
                    <Variants
                      key={variant.id}
                      variant={variant}
                      onUpdate={() => {
                        setSuccess("Variant updated successfully");
                        setOpen(true);
                      }}
                      onDelete={() => {
                        if (currentProduct.variants) {
                          setCurrentProduct({
                            ...currentProduct,
                            variants: currentProduct.variants.filter(
                              (v) => v.id !== variant.id
                            ),
                          });
                          setSuccess("Variant deleted successfully");
                          setOpen(true);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
          <div className="pt-5">
            <button
              onClick={handleSubmit}
              className="float-right py-2 px-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-lg text-white font-medium cursor-pointer transition-colors"
            >
              Create Product
            </button>
          </div>
        </section>
        <ToastViewport className="fixed bottom-0 right-0 flex flex-col gap-3 w-96 max-w-[100vw] m-0 z-50 outline-none p-6" />
      </ToastProvider>
    </AdminLayout>
  );
}
