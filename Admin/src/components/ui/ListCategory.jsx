import React, { use, useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const ListCategory = () => {

  const Navigate = useNavigate();
  
  const [category, setcategory] = useState([])

  useEffect(() => {
    axios
    .get("https://blush-bloom-api.onrender.com/category")
    .then(result => { setcategory(result.data)})
    .catch(err => console.log(err));

  }, [])

  const deleteproduct = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;
    axios.delete(`https://blush-bloom-api.onrender.com/category/${id}`)
    .then((res) => {
      console.log(res.data);
      alert("Product Deleted Successfully");
      setcategory(category.filter((item) => item._id !== id));
      
    })
  }

  const editProduct = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to edit this product?");
  if (!confirmDelete) return;
    Navigate(`/editcategory/${id}`);
  }

  return (
    <div style={{width:'1370px'}} className="p-6">
      {/* Add Product Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Category List</h2>
        <button
        style={{cursor:'pointer'}}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => Navigate('/createcategory')}
        >
          + Add Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 border">Category Image</th>
              <th className="px-4 py-2 border">Category Name</th>
              <th className="px-4 py-2 border">Category Description</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
              {category.map((cat) => {
                  return(
              <tr
                className="hover:bg-gray-50 transition duration-200"
              >
                

                <td className="px-4 py-2 border" > <img style={{width:"150px", height:'200px',marginLeft:"25%"}} src={cat.categoryimage} alt="" />
                </td>
                <td className="px-4 py-2 border font-medium">{cat.categoryname}</td>
                <td style={{width:'400px'}} className="px-4 py-2 border">{cat.categorydescription}
                </td>
                <td className="px-4 py-2 border text-center space-x-2">
                  <button
                  style={{marginRight:'20px',cursor:'pointer'}}
                  onClick={()=> editProduct(cat._id)}
                    
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                  style={{cursor:'pointer'}}

                  onClick={()=>deleteproduct(cat._id)}
                    
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

export default ListCategory;
