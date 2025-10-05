import React, { use, useEffect, useState } from "react";
import axios from 'axios'
import { Navigate, useNavigate, useParams } from "react-router-dom";

const EditForm = () => {

    const {id} = useParams();

    const cloud_name= 'da06jg60p';

    const Navigate = useNavigate();

    const [name, setname] = useState('')
    const [price, setprice] = useState('')
    const [category, setcategory] = useState('')
    const [description, setdescription] = useState('')
    const [image, setimage] = useState('')
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState('')


   useEffect(() => {
     axios
     .get(`https://blush-bloom-api.onrender.com/${id}`)
        .then(result => { 
            console.log(result.data);
            
            setname(result.data.name);
            setprice(result.data.price);
            setcategory(result.data.category);
            setdescription(result.data.description);
            setimage(result.data.image);
        })
        .catch(err => console.log(err));    
   }, [])

    const submitdata = (e) => {
        e.preventDefault();
        axios.put(`https://blush-bloom-api.onrender.com/${id}`, { name, price, category,description, image })
        .then(result => console.log(result.data))
        Navigate('/list')
        .catch(err => console.log(err));

    };

    const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "anshad");

    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        data
      );
      setimage(res.data.secure_url); // ✅ directly update product image
      setUploading(false);
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploading(false);
    }
  };


   


  return (
    <div style={{width:"1400px",marginLeft:"15px"}}  className="flex items-center gap-2 w-full max-w-lg">
      <form     
        className=""
        style={{width:"1370px"}}
        onSubmit={submitdata}
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Edit Product
        </h2>

     
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={name}            
            style={{width:"1370px"}}
            onChange={(e) => setname(e.target.value)}
            placeholder="Enter product name"
             className="flex-1 min-w-0 px-4 py-2 border rounded-lg shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

  
        <div>
          <label className="block text-gray-600 font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setprice(e.target.value)}
            placeholder="Enter price"
            className="w-full px-4 py-2 border rounded-lg shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
             hover:border-gray-400 transition"
            required
          />
        </div>


        <div>
          <label className="block text-gray-600 font-medium mb-1">
            category
          </label>
          <textarea
            name="category"
            value={category}  
            placeholder="Enter product category"
            onChange={(e) => setcategory(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          ></textarea>
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


        <div>
          <label className="block text-gray-700 font-medium mb-2">
    Product Image
  </label>
  
  <input 
    type="file" 
    onChange={uploadImage} 
    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" 
  />
  
  {uploading && (
    <p className="text-blue-500 text-sm mt-2">Uploading...</p>
  )}
  
  {image && (
    <img 
        style={{width:"180px", height:'230px',marginLeft:"20px"}}
      src={image} 
      alt="preview" 
      className="w-36 mt-3 rounded-md border" 
    />
  )}
  
  {preview && (
    <img 
      src={preview} 
      style={{width:"180px", height:'230px',marginLeft:"20px"}}
      alt="preview" 
      className="w-36 mt-3 rounded-lg shadow" 
    />
  )}
        </div>

        <button

          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          style={{marginTop:"20px",marginLeft:"600px",cursor:'pointer'}}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditForm;
