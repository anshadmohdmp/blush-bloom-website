  import axios from "axios";
  import React, { useEffect, useState } from "react";

  const Orders = () => {
    const [Orders, setOrders] = useState([]);

    useEffect(() => {
      axios
        .get("https://blush-bloom-api.onrender.com/orders")
        .then((res) => setOrders(res.data))
        .catch((err) => console.log(err));
    }, []);
    

    console.log(Orders);
    

    // Helper to format date
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
  try {
    const res = await axios.put(`https://blush-bloom-api.onrender.com/orders/${orderId}/status`, { status: newStatus });
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, orderStatus: res.data.orderStatus } : order
      )
    );
  } catch (err) {
    console.error(err.response?.data?.message || err.message);
    alert("Failed to update status: " + (err.response?.data?.message || err.message));
  }
};


    const getStatusColor = (status) => {
    switch(status) {
      case "Order Placed": return "#6c757d";
      case "Order Confirmed": return "#0d6efd";
      case "Shipped": return "#0dcaf0";
      case "Delivered": return "#198754";
      case "Cancelled": return "#dc3545";
      case "Return Requested": return "#fd7e14";
      case "Return Completed": return "#20c997";
      default: return "#ffffff";
    }
  };

    return (
      <div style={{ width: "1400px" }} className="overflow-x-auto">
        <table className="min-w-[1400px] border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th style={{ width: "250px" }} className="px-4 py-2 border-b border-r border-gray-300 text-left">
                Order Id & Date
              </th>
              <th className="px-4 py-2 border-b border-r border-gray-300 text-left">Ordered Products</th>
              <th className="px-4 py-2 border-b border-r border-gray-300 text-left">Name</th>
              <th className="px-4 py-2 border-b border-r border-gray-300 text-left">Mobile</th>
              <th className="px-4 py-2 border-b border-r border-gray-300 text-left">Address</th>
              <th className="px-4 py-2 border-b border-r border-gray-300 text-left">Price & Payment Status</th>
              <th className="px-4 py-2 border-b border-gray-300 text-left">Order Status</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {Orders.map((item) => (
              <tr className="hover:bg-gray-50" key={item._id}>
                <td className="px-4 py-2 border-b border-r border-gray-300">
                  {item._id.slice(-6).toUpperCase()} {formatDate(item.createdAt)}
                </td>
                <td style={{ width: "300px" }} className="px-4 py-2 border-b border-r border-gray-300">
                  <ul style={{ paddingLeft: "20px", margin: 0 }}>
                    {item.cartItems.map((ci) => (
                      <li key={ci._id}>
                        {ci._id}- {ci.product?.name} (x{ci.quantity}) – {ci.size || "-"} – ₹{ci.product?.price}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border-b border-r border-gray-300">{item.Name}</td>
                <td className="px-4 py-2 border-b border-r border-gray-300">{item.Mobile}</td>
                <td className="px-4 py-2 border-b border-r border-gray-300">
                  {item.Address}, {item.Town}, {item.Pincode}, {item.District}, {item.State}
                </td>
                <td className="px-4 py-2 border-b border-r border-gray-300">
                  {item.PaymentMode} - {item.paymentStatus}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
  <select
    value={item.orderStatus || "Order Placed"}
    onChange={(e) => handleStatusChange(item._id, e.target.value)}
    style={{ backgroundColor: getStatusColor(item.orderStatus), color: "white" }}
    className="border rounded px-2 py-1"
  >
    <option value="Order Placed">Order Placed</option>
    <option value="Order Confirmed">Order Confirmed</option>
    <option value="Shipped">Shipped</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
    <option value="Return Requested">Return Requested</option>
    <option value="Return Completed">Return Completed</option>
  </select>
  {/* Show return reason only if status is "Return Requested" */}
  {item.orderStatus === "Return Requested" && item.returnReason && (
    <div style={{ marginTop: "4px", fontSize: "0.9rem", color: "#000000ff" }}>
      Reason: {item.returnReason}
    </div>
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default Orders;
