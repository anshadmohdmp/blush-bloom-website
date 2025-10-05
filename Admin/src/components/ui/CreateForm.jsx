import React, { use, useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const CreateForm = () => {
  
  const [name, setname] = useState('')
  const [price, setprice] = useState('')
  const [category, setcategory] = useState('')
  const [description, setdescription] = useState('')
  const [image, setimage] = useState('')
  const [selectedcategory, setselectedcategory] = useState([])

  const cloud_name= 'da06jg60p';

  const navigate = useNavigate();

  const uploadImage = async (e) => {
    const file = e.target.files[0]; // get the file
    const data = new FormData(); // create FormData object
    data.append("file", file); // append the file
    data.append("upload_preset", "anshad"); // replace with your Cloudinary preset

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, data);
      setimage(res.data.secure_url); // set uploaded image URL
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://blush-bloom-api.onrender.com/create", { name, price, category, description, image })
    .then(result => console.log(result.data))
    .then(() => navigate('/list'))
        .catch(err => console.log(err));
  };
  
  useEffect(() => {
    axios
    .get("https://blush-bloom-api.onrender.com/category")
    .then(result => { setselectedcategory(result.data)})
    .catch(err => console.log(err));
    
  }, [])
  

  return (
    <div style={{width:"1400px",marginLeft:"15px"}} className="flex items-center gap-2 w-full max-w-lg">
      <form 
        onSubmit={handleSubmit}
        className=""
        style={{width:"1370px"}}
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Add Product
        </h2>

        {/* Product Name */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            onChange={(e)=> setname(e.target.value)}
            style={{width:"1370px"}}
            placeholder="Enter product name"
             className="flex-1 min-w-0 px-4 py-2 border rounded-lg shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
         
            onChange={(e)=> setprice(e.target.value)}
            placeholder="Enter price"
            className="w-full px-4 py-2 border rounded-lg shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             hover:border-gray-400 transition"
            required
          />
        </div>

        {/* category */}
        <div>
  <label className="block text-gray-600 font-medium mb-1">
    Category
  </label>
  <select
    name="category"
    value={category}
    onChange={(e) => setcategory(e.target.value)}
    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
    required
  >
    {/* Placeholder */}
    <option value="" disabled>
      -- Choose a category --
    </option>

    {/* Real categories */}
    {selectedcategory.map((cate) => (
      <option key={cate._id} value={cate.categoryname}>
        {cate.categoryname}
      </option>
    ))}
  </select>
</div>

<div>
          <label className="block text-gray-600 font-medium mb-1">
            Product Description
          </label>
          <input
            type="text"
            name="name"
            onChange={(e)=> setdescription(e.target.value)}
            style={{width:"1370px"}}
            placeholder="Enter product description"
             className="flex-1 min-w-0 px-4 py-2 border rounded-lg shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
    Product Image
  </label>
  <input
    type="file"
    onChange={uploadImage}
    className="block w-full text-sm text-gray-700 
               border border-gray-300 rounded-lg cursor-pointer 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:border-blue-500 file:mr-4 file:py-2 file:px-4 
               file:rounded-md file:border-0 
               file:text-sm file:font-semibold 
               file:bg-blue-600 file:text-white 
               hover:file:bg-blue-700"
  />
  
  {Image && (
    <img
      src={image}
      alt="preview"
      width="150"
      className="mt-3 rounded-lg shadow-md"
      style={{width:"180px", height:'230px',marginLeft:"20px"}}
    />
  )}
        </div>

        {/* Submit Button */}
        <button
        style={{cursor:'pointer',marginTop:"20px",marginLeft:"600px"}}
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateForm;
