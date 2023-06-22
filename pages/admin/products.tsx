import AdminLayout from "@/components/admin/AdminLayout";
import ProductList from "@/components/admin/productList";

export default function Page() {
  return (
    <AdminLayout>
      <h1 className="font-semibold text-2xl">Product Management</h1>
      <div className="p-4">
        <h2 className="font-semibold text-xl">Products</h2>
        <div className="mt-4 p-4 max-w-4xl rounded-lg bg-gray-100 dark:bg-slate-900">
          <ProductList />
        </div>
      </div>
    </AdminLayout>
  );
}
