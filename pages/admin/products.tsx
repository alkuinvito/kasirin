import AdminLayout from "@/components/admin/adminLayout";
import ProductList from "@/components/admin/productList";

export default function Page() {
  return (
    <AdminLayout>
      <h1 className="font-semibold text-2xl">Product Management</h1>
      <div className="p-4">
        <h2 className="font-semibold text-xl">Products</h2>
        <ProductList />
      </div>
    </AdminLayout>
  );
}
