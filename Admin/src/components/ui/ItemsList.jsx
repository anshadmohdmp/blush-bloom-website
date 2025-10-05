import React, { use, useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const ProductTable = () => {

  const Navigate = useNavigate();
  
  const [Products, setProducts] = useState([])

  useEffect(() => {
    axios
    .get("https://blush-bloom-api.onrender.com/products")
    .then(result => { console.log(result.data);
    
      setProducts(result.data)})
    .catch(err => console.log(err));

  }, [])

  const deleteproduct = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;
    axios.delete(`https://blush-bloom-api.onrender.com/products/${id}`)
    .then((res) => {
      console.log(res.data);
      alert("Product Deleted Successfully");
      setProducts(Products.filter((item) => item._id !== id));
      
    })
  }

  const editProduct = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to edit this product?");
  if (!confirmDelete) return;
    Navigate(`/editform/${id}`);
  }

  return (
    <div style={{width:'1370px'}} className="p-6">
      {/* Add Product Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product List</h2>
        <button
        style={{cursor:'pointer'}}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => Navigate('/create')}
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Product Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
              {Products.map((pro) => {
                  return(
              <tr
                className="hover:bg-gray-50 transition duration-200"
              >
                

                <td className="px-4 py-2 border" > <img style={{width:"150px", height:'200px',marginLeft:"22%"}} src={pro.image} alt="" />
                </td>
                <td style={{width:'300px'}} className="px-4 py-2 border font-medium">{pro.name}</td>
                <td className="px-4 py-2 border text-green-600">₹{pro.price}
                </td>
                <td className="px-4 py-2 border">{pro.category}
                </td>
                <td style={{width:'400px'}} className="px-4 py-2 border">{pro.description}
                </td>
                <td className="px-4 py-2 border text-center space-x-2">
                  <button
                  style={{marginRight:'20px',cursor:'pointer'}}
                  onClick={()=> editProduct(pro._id)}
                    
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                  style={{cursor:'pointer'}}

                  onClick={()=>deleteproduct(pro._id)}
                    
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
                
              </tr>
              )
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
