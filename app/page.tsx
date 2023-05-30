import React from "react";
import MenuItem from "./components/layout/menuItem";
import OrderList from "./components/layout/orderList";

export default function Home() {
  return (
    <div className="flex">
      <div className="products grow">
        <MenuItem
          image="http://3.bp.blogspot.com/-US1FOxNnpr0/U4f3MBtDJLI/AAAAAAAARK0/aSSJTb1oUcY/s1600/Congyang_cap_tiga_orang.jpg"
          name="Congyang"
          price={85000}
        ></MenuItem>
        <MenuItem
          image="http://3.bp.blogspot.com/-US1FOxNnpr0/U4f3MBtDJLI/AAAAAAAARK0/aSSJTb1oUcY/s1600/Congyang_cap_tiga_orang.jpg"
          name="Congyang"
          price={85000}
        ></MenuItem>
        <MenuItem
          image="http://3.bp.blogspot.com/-US1FOxNnpr0/U4f3MBtDJLI/AAAAAAAARK0/aSSJTb1oUcY/s1600/Congyang_cap_tiga_orang.jpg"
          name="Congyang"
          price={85000}
        ></MenuItem>
        <MenuItem
          image="http://3.bp.blogspot.com/-US1FOxNnpr0/U4f3MBtDJLI/AAAAAAAARK0/aSSJTb1oUcY/s1600/Congyang_cap_tiga_orang.jpg"
          name="Congyang"
          price={85000}
        ></MenuItem>
        <MenuItem
          image="http://3.bp.blogspot.com/-US1FOxNnpr0/U4f3MBtDJLI/AAAAAAAARK0/aSSJTb1oUcY/s1600/Congyang_cap_tiga_orang.jpg"
          name="Congyang"
          price={85000}
        ></MenuItem>
        <MenuItem
          image="http://3.bp.blogspot.com/-US1FOxNnpr0/U4f3MBtDJLI/AAAAAAAARK0/aSSJTb1oUcY/s1600/Congyang_cap_tiga_orang.jpg"
          name="Congyang"
          price={85000}
        ></MenuItem>
        <MenuItem
          image="http://3.bp.blogspot.com/-US1FOxNnpr0/U4f3MBtDJLI/AAAAAAAARK0/aSSJTb1oUcY/s1600/Congyang_cap_tiga_orang.jpg"
          name="Congyang"
          price={85000}
        ></MenuItem>
        <MenuItem
          image="http://3.bp.blogspot.com/-US1FOxNnpr0/U4f3MBtDJLI/AAAAAAAARK0/aSSJTb1oUcY/s1600/Congyang_cap_tiga_orang.jpg"
          name="Congyang"
          price={85000}
        ></MenuItem>
        <MenuItem
          image="http://3.bp.blogspot.com/-US1FOxNnpr0/U4f3MBtDJLI/AAAAAAAARK0/aSSJTb1oUcY/s1600/Congyang_cap_tiga_orang.jpg"
          name="Congyang"
          price={85000}
        ></MenuItem>
      </div>
      <OrderList></OrderList>
    </div>
  );
}
