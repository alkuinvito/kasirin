import React from "react";
import OrderList from "../components/shared/orderList";
import MenuList from "../components/shared/menuList";

export default function Home(props: { query: string }) {
  return (
    <div className="flex scroll-smooth">
      <section className="grow">
        <MenuList query={props.query}></MenuList>
      </section>
      <OrderList></OrderList>
    </div>
  );
}
