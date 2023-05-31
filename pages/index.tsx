import React from "react";
import OrderList from "../components/shared/orderList";
import MenuList from "../components/shared/menuList";

export default function Home() {
  return (
    <div className="flex">
      <MenuList></MenuList>
      <OrderList></OrderList>
    </div>
  );
}
