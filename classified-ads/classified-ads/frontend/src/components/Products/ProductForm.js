import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import api, { getImageUrl } from '../../services/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    condition: 'used',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchProduct();
    }
  }, [id]);

  // Revoke object URLs to avoid memory leaks when component unmounts or images change
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img && typeof img !== 'string' && img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const product = res.data.data;
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        location: product.location,
        condition: product.condition,
      });
      setImages(product.images || []);
    } catch (error) {
      console.error(error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    onDrop: (acceptedFiles) => {
      const withPreviews = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setImages((prev) => [...prev, ...withPreviews]);
    },
    maxFiles: 5,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      images.forEach(image => {
        if (image instanceof File) {
          formDataToSend.append('images', image);
        }
      });

      if (isEdit) {
        await api.put(`/products/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/');
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || 'Failed to save product');
  } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <h2>{isEdit ? 'Edit Product' : 'Create New Product'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
        >
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag & drop images here, or click to select (up to 5)</p>
        </div>
        {images.length > 0 && (
          <div className="image-preview">
            {images.map((image, index) => {
              const src = typeof image === 'string' ? getImageUrl(image) : image.preview;
              return (
                <div key={index} className="image-preview-item">
                  <img 
                    src={src} 
                    alt="Preview" 
                    style={{ width: '100px', cursor: 'pointer' }}
                    onClick={() => setSelectedImage(src)}
                  />
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)}
                    className="remove-image-btn"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
        </button>
      </form>

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content">
            <span className="close-modal" onClick={() => setSelectedImage(null)}>&times;</span>
            <img src={selectedImage} alt="Full view" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
