import React, { useState, useEffect } from "react";
import SideBarOrg from "../../components/SideBar/SideBarOrg";
import { getItems, URL } from "../../api";

const Resources = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadItems() {
      const data = await getItems();
      if (data.length > 0) {
        setItems(data);
      }
    }
    loadItems();
  }, []);

  return (
    <div style={{ display: "flex", alignItems:"center", justifyItems:"center"}}>
      <SideBarOrg />
      <div style={{ flex: "1", backgroundColor: "white" }}>
        <table className="user-table" style={{marginTop:"80px"}}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  <input
                    className="admin-search border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.name}
                  />
                </td>
                <td
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={`${URL}${item.image_path}`}
                    alt="Item Preview"
                    style={{
                      width: "60px",
                      height: "auto",
                      marginBottom: "10px",
                    }}
                  />
                </td>
                <td>
                  <input
                    className="admin-search border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.qty}
                  />
                </td>
                <td>
                  <input
                    className="admin-search border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.price}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Resources;
