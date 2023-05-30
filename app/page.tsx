import React from "react";
import OrderList from "./components/layout/orderList";
import MenuList from "./components/layout/menuList";

export default function Home() {
  return (
    <div className="flex">
      <MenuList></MenuList>
      <OrderList></OrderList>
    </div>
  );
}
