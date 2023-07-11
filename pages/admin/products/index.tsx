import AdminLayout from "@/components/admin/adminLayout";
import { ChangeEvent, useMemo, useState } from "react";
import axios from "axios";
import { z } from "zod";
import {
  categorySchema,
  productSchema,
  variantGroupSchema,
} from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBasketShopping,
  faCircleUser,
  faCircleXmark,
  faMagnifyingGlass,
  faPencil,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import AddCategory from "@/components/admin/add-category";
import CategoryItem from "@/components/shared/categoryItem";
import Link from "next/link";
import SortButton from "@/components/shared/sortButton";
import Image from "next/image";
import TableFooter from "@/components/shared/tableFooter";
import EditCategory from "@/components/admin/edit-category";

interface Data {
  name: string;
  price: string;
  stock: number;
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

export default function Page() {
  const [inputs, setInputs] = useState("");
  const [len, setLen] = useState(0);
  const [category, setCategory] = useState("all");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getCategories = async () => {
    const response = await axios.get("/api/categories", {
      withCredentials: true,
    });
    return z
      .object({ categories: categorySchema.array() })
      .parse(response.data);
  };

  const getProducts = async () => {
    const response = await axios.get("/api/products", {
      withCredentials: true,
    });
    return z
      .object({
        products: productSchema
          .extend({
            variants: variantGroupSchema
              .pick({ name: true })
              .array()
              .optional(),
          })
          .array(),
      })
      .parse(response.data);
  };

  const categoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const productQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
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
    const filtered = productQuery.data?.products.filter(
      (p) => p.categoryId === category || category === "all"
    );
    setLen(filtered?.length || 0);

    if (inputs.length > 2) {
      return filtered
        ?.filter((a) => a.name.toLowerCase().includes(inputs))
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }
    return filtered
      ?.sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [
    order,
    orderBy,
    page,
    rowsPerPage,
    productQuery.data?.products,
    inputs,
    category,
  ]);

  if (categoryQuery.isError || productQuery.isError) {
    return <span>Something went wrong</span>;
  }

  if (categoryQuery.data?.categories.length === 0) {
    return (
      <AdminLayout>
        <h1 className="font-semibold text-2xl">Product Management</h1>
        <div className="flex flex-col items-center mt-4">
          <div className="text-gray-400 dark:text-zinc-600 h-full flex flex-col items-center justify-center gap-1">
            <FontAwesomeIcon icon={faBasketShopping} className="text-5xl" />
            <span className="py-5 font-medium">
              You do not have any category yet
            </span>
          </div>
          <AddCategory onUpdate={categoryQuery.refetch}>
            <button>
              <CategoryItem className="rounded-lg px-4 py-2 cursor-pointer font-medium bg-gray-300 dark:bg-zinc-800 hover:bg-indigo-700 dark:hover:bg-indigo-900 hover:text-white transition-colors">
                <FontAwesomeIcon icon={faPlus} className="mr-4" />
                <span>Create category</span>
              </CategoryItem>
            </button>
          </AddCategory>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="font-semibold text-2xl">Product Management</h1>
      <div className="mt-4">
        <div className="mt-4 max-w-6xl">
          <section className="mt-4 w-full">
            <div className="mb-4 flex justify-between">
              <div className="flex gap-2 items-center">
                <select
                  className="w-72 py-2 px-3 bg-gray-100 dark:bg-zinc-900 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-950 focus:bg-gray-200 dark:focus:bg-zinc-950 appearance-none"
                  value={category}
                  onChange={(e) =>
                    setCategory((e.target as HTMLSelectElement).value)
                  }
                >
                  <option key="all" value="all">
                    All
                  </option>
                  {categoryQuery.data?.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {category !== "all" ? (
                  <EditCategory
                    category={
                      categoryQuery.data?.categories.find(
                        (c) => c.id === category
                      ) || { id: "", name: "" }
                    }
                    onUpdate={() => {
                      categoryQuery.refetch().then(() => {
                        setCategory("all");
                      });
                    }}
                  >
                    <button
                      className="w-8 h-8 flex justify-center mx-auto items-center rounded-full hover:bg-gray-300/50 dark:hover:bg-zinc-700/50 cursor-pointer transition"
                      onClick={() => {}}
                    >
                      <FontAwesomeIcon
                        icon={faPencil}
                        className="text-gray-400"
                      />
                    </button>
                  </EditCategory>
                ) : null}
              </div>
              <div>
                <AddCategory onUpdate={categoryQuery.refetch}>
                  <button className="px-2 h-[2.25rem] bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-lg text-white text-sm font-medium cursor-pointer transition-colors">
                    <FontAwesomeIcon icon={faPlus} />
                    <span className="ml-1">New Category</span>
                  </button>
                </AddCategory>
              </div>
            </div>

            <div className="mt-2 rounded-lg bg-gray-100 dark:bg-zinc-900">
              <div className="p-2 flex justify-between items-center">
                <div className="p-2 flex items-center w-72 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 hover:dark:bg-zinc-700 focus-within:bg-gray-300 focus-within:dark:bg-zinc-700 rounded-lg transition-colors">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="mr-2 text-gray-400 dark:text-zinc-500"
                  />
                  <form className="w-full">
                    <input
                      type="text"
                      name="q"
                      placeholder="Search products..."
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
                <Link
                  href="/admin/products/new"
                  className="flex items-center px-3 h-[2.25rem] bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-lg text-white text-sm font-medium cursor-pointer transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span className="ml-1">New Product</span>
                </Link>
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
                        handleRequestSort("price");
                      }}
                    >
                      <SortButton
                        title="Price"
                        value="price"
                        order={order}
                        orderBy={orderBy}
                      />
                    </th>
                    <th
                      className="px-2 py-4 font-medium"
                      onClick={() => {
                        handleRequestSort("stock");
                      }}
                    >
                      <SortButton
                        title="Stock"
                        value="stock"
                        order={order}
                        orderBy={orderBy}
                      />
                    </th>
                    <th className="px-2 py-4 font-medium">Variants</th>
                    <th className="px-2 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows?.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-200 dark:hover:bg-zinc-800"
                    >
                      <td className="p-2 pl-6 flex gap-3 items-center">
                        {product?.image ? (
                          <Image
                            className="rounded-lg w-[60px] h-[60px] object-cover"
                            src={product?.image}
                            alt={product.name}
                            width={60}
                            height={60}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faCircleUser}
                            className="w-[40px] h-[40px]"
                          />
                        )}
                        <div className="grid">
                          <span className="font-medium">{product.name}</span>
                          <span className="font-medium text-sm text-gray-400 dark:text-zinc-600">
                            {
                              categoryQuery.data?.categories.find(
                                (c) => c.id === product.categoryId
                              )?.name
                            }
                          </span>
                        </div>
                      </td>
                      <td className="p-2">
                        {Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumSignificantDigits: 3,
                        }).format(product.price)}
                      </td>
                      <td className="p-2">{product.stock}</td>
                      <td className="p-2">
                        <ul>
                          {product.variants?.map((variant, index) => (
                            <li className="mb-2" key={`${product.id}-${index}`}>
                              <span className="px-2 py-1 text-sm font-semibold rounded-full bg-gray-300/50 dark:bg-gray-500/30 text-gray-600 dark:text-gray-400">
                                {variant.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-2">
                        <Link
                          className="w-8 h-8 flex justify-center mx-auto items-center rounded-full hover:bg-gray-300/50 dark:hover:bg-zinc-700/50 cursor-pointer transition"
                          href={`/admin/products/${product.permalink}`}
                        >
                          <FontAwesomeIcon
                            icon={faPencil}
                            className="text-gray-400"
                          />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TableFooter
                visibleRowsLength={visibleRows?.length}
                dataLength={len}
                page={page}
                rowsPerPage={rowsPerPage}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
