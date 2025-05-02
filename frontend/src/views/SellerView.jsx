import { useEffect, useState } from "react";
import {
  getSellerItems,
  createItem,
  deleteItem,
  updateItem,
  searchSellerItems,
  getSellerEventProducts,
  updateEventProduct,
  URL,
} from "../api";
import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiImage,
  FiPackage,
  FiDollarSign,
  FiShoppingCart,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const SellerView = () => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("manage");
  const [newItem, setNewItem] = useState({
    name: "",
    image: "",
    qty: "",
    price: "",
    imageFile: null,
  });
  const [editableItems, setEditableItems] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const ordersData = await getSellerEventProducts();
        if (ordersData.data && ordersData.data.length > 0) {
          setOrders(ordersData.data);
        }
        const itemsData = await getSellerItems();
        if (itemsData.length > 0) {
          setItems(itemsData);
          const initialEditableItems = itemsData.reduce((acc, item) => {
            acc[item._id] = { ...item };
            return acc;
          }, {});
          setEditableItems(initialEditableItems);
        }
      } catch (error) {
        showNotification("Failed to load data", "error");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      setIsLoading(true);
      const data = await searchSellerItems(query);
      setItems(data);
      const initialEditableItems = data.reduce((acc, item) => {
        acc[item._id] = { ...item };
        return acc;
      }, {});
      setEditableItems(initialEditableItems);
    } catch (error) {
      showNotification("Search error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemAction = async (itemId, action) => {
    const itemData = editableItems[itemId];
    if (action === "update") {
      if (itemData.user_id !== "0") {
        try {
          await updateItem(itemId, itemData);
          showNotification("Product updated successfully", "success");
          const data = await getSellerItems();
          setItems(data);
          const initialEditableItems = data.reduce((acc, item) => {
            acc[item._id] = { ...item };
            return acc;
          }, {});
          setEditableItems(initialEditableItems);
        } catch (error) {
          showNotification("Failed to update product", "error");
        }
      } else {
        showNotification("Please select a Shop Owner", "error");
      }
    } else if (action === "delete") {
      if (window.confirm("Are you sure you want to delete this item?")) {
        try {
          await deleteItem(itemId);
          showNotification("Product deleted successfully", "success");
          setItems(items.filter((item) => item._id !== itemId));
        } catch (error) {
          showNotification("Failed to delete product", "error");
        }
      }
    }
  };

  const handleInputChange = (itemId, field, value) => {
    setEditableItems((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const handleAddItem = async () => {
    if (newItem.name && newItem.imageFile && newItem.qty && newItem.price) {
      setIsLoading(true);
      const itemObject = {
        name: newItem.name,
        image: newItem.image,
        qty: newItem.qty,
        price: newItem.price,
      };
      try {
        await createItem(itemObject, newItem.imageFile);
        setNewItem({ name: "", image: "", qty: "", price: "", imageFile: null });
        setImagePreview("");
        showNotification("Product added successfully", "success");
        const data = await getSellerItems();
        setItems(data);
        const initialEditableItems = data.reduce((acc, item) => {
          acc[item._id] = { ...item };
          return acc;
        }, {});
        setEditableItems(initialEditableItems);
      } catch (error) {
        showNotification("Failed to add product", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      showNotification("Please fill in all fields", "error");
    }
  };

  const handleSelectChange = async (event, id) => {
    const selectedValue = event.target.value;
    try {
      setIsLoading(true);
      await updateEventProduct(id, selectedValue);
      showNotification("Order status updated successfully", "success");
      const ordersData = await getSellerEventProducts();
      if (ordersData.data && ordersData.data.length > 0) {
        setOrders(ordersData.data);
      }
    } catch (error) {
      showNotification("Failed to update order status", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/Login");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-2 sm:px-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiPackage className="text-indigo-600" size={32} />
          EventLink Seller Dashboard
        </h1>
        <button
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded transition"
          onClick={handleLogout}
        >
          <FiLogOut /> Log Out
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-8">
        <button
          className={`flex items-center gap-2 px-5 py-2 font-medium border-b-2 transition ${
            activeTab === "manage"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-indigo-500"
          }`}
          onClick={() => setActiveTab("manage")}
        >
          <FiPackage /> Manage Products
        </button>
        <button
          className={`flex items-center gap-2 px-5 py-2 font-medium border-b-2 transition ${
            activeTab === "orders"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-indigo-500"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          <FiShoppingCart /> Manage Orders
        </button>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded shadow-lg flex items-center gap-2 text-white transition-all ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <FiCheckCircle className="text-xl" />
          ) : (
            <FiXCircle className="text-xl" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-40 bg-white/60 flex items-center justify-center">
          <svg className="animate-spin h-10 w-10 text-indigo-600" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {activeTab === "manage" ? (
          <>
            {/* Add Product */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiPlus className="text-indigo-500" /> Add New Product
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
                      <FiPackage /> Product Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
                      <FiImage /> Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setNewItem({
                            ...newItem,
                            imageFile: file,
                            image: window.URL.createObjectURL(file),
                          });
                          setImagePreview(window.URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
                      <FiPackage /> Quantity
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={newItem.qty}
                      onChange={(e) =>
                        setNewItem({ ...newItem, qty: e.target.value })
                      }
                      placeholder="Available quantity"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 flex items-center gap-1">
                      <FiDollarSign /> Price
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={newItem.price}
                      onChange={(e) =>
                        setNewItem({ ...newItem, price: e.target.value })
                      }
                      placeholder="Product price"
                    />
                  </div>
                  <button
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold transition"
                    onClick={handleAddItem}
                    disabled={isLoading}
                  >
                    <FiPlus /> Add Product
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-48 h-48 object-contain border rounded shadow"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center border rounded bg-gray-100 text-gray-400">
                      <FiImage size={48} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FiPackage className="text-indigo-500" /> Your Products
                </h2>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              {items.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  No products found. Add your first product above!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left font-semibold">Product</th>
                        <th className="py-3 px-4 text-left font-semibold">Image</th>
                        <th className="py-3 px-4 text-left font-semibold">Quantity</th>
                        <th className="py-3 px-4 text-left font-semibold">Price</th>
                        <th className="py-3 px-4 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item._id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">
                            <input
                              className="w-full border border-gray-200 rounded px-2 py-1"
                              value={editableItems[item._id]?.name || ""}
                              onChange={(e) =>
                                handleInputChange(item._id, "name", e.target.value)
                              }
                            />
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex flex-col items-center gap-1">
                              <img
                                src={
                                  editableItems[item._id]?.image
                                    ? editableItems[item._id].image
                                    : `${URL}${editableItems[item._id].image_path}`
                                }
                                alt="Product"
                                className="w-14 h-14 object-contain border rounded"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                className="w-full text-xs"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const imageUrl = window.URL.createObjectURL(file);
                                    handleInputChange(item._id, "imageFile", file);
                                    handleInputChange(item._id, "item_image_path", file.name);
                                    handleInputChange(item._id, "image", imageUrl);
                                  }
                                }}
                              />
                            </div>
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="number"
                              className="w-20 border border-gray-200 rounded px-2 py-1"
                              value={editableItems[item._id]?.qty || ""}
                              onChange={(e) =>
                                handleInputChange(item._id, "qty", e.target.value)
                              }
                            />
                          </td>
                          <td className="py-2 px-4">
                            <input
                              type="number"
                              className="w-24 border border-gray-200 rounded px-2 py-1"
                              value={editableItems[item._id]?.price || ""}
                              onChange={(e) =>
                                handleInputChange(item._id, "price", e.target.value)
                              }
                            />
                          </td>
                          <td className="py-2 px-4 flex gap-2">
                            <button
                              onClick={() => handleItemAction(item._id, "update")}
                              className="flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded transition text-xs"
                              disabled={isLoading}
                            >
                              <FiEdit2 /> Update
                            </button>
                            <button
                              onClick={() => handleItemAction(item._id, "delete")}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition text-xs"
                              disabled={isLoading}
                            >
                              <FiTrash2 /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FiShoppingCart className="text-indigo-500" /> Manage Orders
            </h2>
            {orders.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                No orders found. Orders will appear here when customers place them.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left font-semibold">Event</th>
                      <th className="py-3 px-4 text-left font-semibold">Product</th>
                      <th className="py-3 px-4 text-left font-semibold">Quantity</th>
                      <th className="py-3 px-4 text-left font-semibold">Total Price</th>
                      <th className="py-3 px-4 text-left font-semibold">Expected Before</th>
                      <th className="py-3 px-4 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className={
                          order.accepted
                            ? "bg-green-50"
                            : "bg-red-50"
                        }
                      >
                        <td className="py-2 px-4">{order.event_id.eventName}</td>
                        <td className="py-2 px-4">{order.product_id.name}</td>
                        <td className="py-2 px-4">{order.qty}</td>
                        <td className="py-2 px-4">
                          ${(order.product_id.price * order.qty).toFixed(2)}
                        </td>
                        <td className="py-2 px-4">
                          {new Date(order.event_id.eventDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">
                          <select
                            className={`border rounded px-2 py-1 font-semibold ${
                              order.accepted
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-red-100 text-red-700 border-red-300"
                            }`}
                            value={order.accepted ? "true" : "false"}
                            onChange={(event) => handleSelectChange(event, order._id)}
                            disabled={isLoading}
                          >
                            <option value="true" className="text-green-700">
                              Accepted
                            </option>
                            <option value="false" className="text-red-700">
                              Not Accepted
                            </option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerView;
