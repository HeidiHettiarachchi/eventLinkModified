import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Save,
  Plus,
  Search,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
  Image,
} from "lucide-react";
import { getEventProducts, getItems, addEventProduct, URL } from "../api";

export function Order() {
  let params = useParams();
  const [items, setItems] = useState([]);
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ itemId: "", qty: 1 });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImagePreview, setCurrentImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [itemHover, setItemHover] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadItems() {
      setIsLoading(true);
      try {
        const data = await getItems();
        if (data.length > 0) {
          setItems(data);
        }
      } catch (error) {
        console.error("Error loading items:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadItems();
  }, []);

  useEffect(() => {
    async function loadEventProducts() {
      setIsLoading(true);
      try {
        const response = await getEventProducts(params.id);

        if (response && response.data && response.data.length > 0) {
          const eventData = response.data;
          let filteredResources = [];
          eventData.forEach((resource) => {
            filteredResources.push({
              itemId: resource.product_id,
              qty: resource.qty,
              accepted: resource.accepted,
            });
          });

          setResources(filteredResources);
          setCurrentImagePreview(eventData[0].image);
        } else {
          alert("Event not found or no data available.");
        }
      } catch (error) {
        console.error("Error fetching event products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadEventProducts();
  }, [params.id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const previewUrl = window.URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const addResource = () => {
    const selectedItem = items.find((item) => item._id === newResource.itemId);
    if (selectedItem) {
      const existingResourceIndex = resources.findIndex(
        (resource) => resource.itemId === newResource.itemId
      );

      const totalQty =
        existingResourceIndex !== -1
          ? resources[existingResourceIndex].qty + parseFloat(newResource.qty)
          : parseFloat(newResource.qty);

      if (newResource.qty > 0 && totalQty <= parseFloat(selectedItem.qty)) {
        if (existingResourceIndex !== -1) {
          const updatedResources = [...resources];
          updatedResources[existingResourceIndex].qty = totalQty;
          setResources(updatedResources);
        } else {
          setResources([...resources, newResource]);
        }
        setNewResource({ itemId: "", qty: 1 });
        setSearchTerm("");
        setIsOpen(false);
      } else {
        alert(
          "Please ensure the total quantity does not exceed the available quantity."
        );
      }
    } else {
      alert("Please select a valid item.");
    }
  };

  const removeResource = (index) => {
    const newResources = resources.filter((_, i) => i !== index);
    setResources(newResources);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEventProduct(params.id, JSON.stringify(resources));
    window.location.reload();
  };

  const handleDelete = async () => {
    await deleteEvent(params.id);
    navigate("/eventsAdmin");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">
          <ShoppingCart className="inline mr-3 text-blue-600" size={36} />
          Allocate Resources
        </h1>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6"
      >
        <div className="flex justify-end mb-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <Save className="animate-pulse" size={20} />
            Save Resources
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Item Selection */}
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Select Item:
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all duration-300"
                  placeholder="Search for an item"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsOpen(true)}
                />
                <Search
                  className="absolute right-3 top-3 text-gray-400"
                  size={20}
                />
              </div>

              {isOpen && (
                <ul className="absolute z-10 border border-gray-300 rounded-lg bg-white overflow-auto mt-1 w-full max-h-60 shadow-lg">
                  {items
                    .filter((item) =>
                      item.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item) => (
                      <li
                        key={item._id}
                        className="py-3 px-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 flex items-center"
                        onMouseEnter={() => setItemHover(item._id)}
                        onMouseLeave={() => setItemHover(null)}
                        onClick={() => {
                          setNewResource({ itemId: item._id, qty: 1 });
                          setImagePreview(item.image_path);
                          setSearchTerm(item.name);
                          setIsOpen(false);
                        }}
                      >
                        <Package
                          className={`mr-2 ${
                            itemHover === item._id
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                          size={18}
                        />
                        {item.name}
                      </li>
                    ))}
                  {items.filter((item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 && (
                    <li className="py-3 px-4 text-gray-500 italic">
                      No items found
                    </li>
                  )}
                </ul>
              )}
            </div>

            {newResource.itemId && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-center mb-4">
                  {items.find((item) => item._id === newResource.itemId)
                    ?.image_path ? (
                    <img
                      src={`${URL}${
                        items.find((item) => item._id === newResource.itemId)
                          ?.image_path
                      }`}
                      alt="Selected Item"
                      className="w-64 h-64 object-contain rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                      <Image size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-center">
                    <Package className="mr-2 text-blue-500" size={18} />
                    <span>Available: </span>
                    <span className="font-bold ml-1">
                      {
                        items.find((item) => item._id === newResource.itemId)
                          ?.qty
                      }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 text-green-500" size={18} />
                    <span>Price: </span>
                    <span className="font-bold ml-1">
                      Rs.{" "}
                      {
                        items.find((item) => item._id === newResource.itemId)
                          ?.price
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-gray-700 text-lg font-semibold mb-2">
                Quantity:
              </label>
              <div className="flex items-center">
                <input
                  className="border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  type="number"
                  min="1"
                  value={newResource.qty}
                  onChange={(e) =>
                    setNewResource({ ...newResource, qty: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="button"
              onClick={addResource}
              disabled={!newResource.itemId}
              className={`w-full ${
                newResource.itemId
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 cursor-not-allowed text-gray-500"
              } font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mt-4`}
            >
              <Plus
                className={newResource.itemId ? "animate-bounce" : ""}
                size={20}
              />
              Add to Cart
            </button>
          </div>

          {/* Right Side - Resources Cart */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <ShoppingCart className="mr-2 text-blue-600" size={24} />
                Resources Cart
              </h2>
              <div className="text-xl font-bold text-green-600 flex items-center bg-green-50 p-2 rounded-lg">
                <DollarSign size={24} className="mr-1" />
                <span>
                  Total: Rs.{" "}
                  {resources
                    .reduce((total, resource) => {
                      const item = items.find(
                        (item) => item._id === resource.itemId
                      );
                      return total + (item ? item.price * resource.qty : 0);
                    }, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>

            {resources.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
                <p>Your cart is empty. Add some items!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {resources.map((resource, index) => {
                  const item = items.find(
                    (item) => item._id === resource.itemId
                  );
                  return (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-lg">
                          {item?.name || "Unknown Item"}
                        </div>
                        <div className="flex mt-2 gap-4">
                          <span className="text-gray-600 flex items-center">
                            <Package size={16} className="mr-1" />
                            Qty: {resource.qty}
                          </span>
                          <span className="text-gray-600 flex items-center">
                            <DollarSign size={16} className="mr-1" />
                            {item
                              ? (item.price * resource.qty).toFixed(2)
                              : "N/A"}
                          </span>
                          <span
                            className={`flex items-center ${
                              resource.accepted
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {resource.accepted ? (
                              <CheckCircle size={16} className="mr-1" />
                            ) : (
                              <XCircle size={16} className="mr-1" />
                            )}
                            {resource.accepted ? "Accepted" : "Pending"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition-colors duration-300"
                        title="Remove item"
                      >
                        <Trash2 size={20} className="hover:animate-pulse" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Order;