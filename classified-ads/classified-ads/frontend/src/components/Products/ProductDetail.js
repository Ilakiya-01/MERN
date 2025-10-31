import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import './ProductList.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        navigate('/');
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleBuy = () => {
    navigate('/payment', { state: { product } });
  };

  const handleDeleteImage = async (imageName) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const res = await api.delete(`/products/${id}/images/${imageName}`);
        setProduct(res.data.data);
        alert('Image deleted successfully');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete image');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const isOwner = user && user.id === product.owner._id;
  const canDeleteImages = isOwner && product.status !== 'sold';

  return (
    <div className="product-detail">
      <div className="product-images">
        {product.images.map((image, index) => (
          <div key={index} className="product-image-container">
            <img 
              src={getImageUrl(image)} 
              alt={product.title}
              onClick={() => setSelectedImage(getImageUrl(image))}
              style={{ cursor: 'pointer' }}
            />
            {canDeleteImages && (
              <button 
                className="delete-image-btn"
                onClick={() => handleDeleteImage(image)}
                title="Delete image"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="product-info">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Category: {product.category}</p>
        <p>Location: {product.location}</p>
        <p>Condition: {product.condition}</p>
        <p>Seller: {product.owner.name} ({product.owner.email})</p>
        {product.status === 'sold' ? (
          <p className="sold-message">This product has been sold.</p>
        ) : (
          <>
            {user && user.id !== product.owner._id && (
              <div className="buyer-actions">
                <Link to={`/chat/${product.owner._id}`} className="chat-btn">
                  💬 Chat with Seller
                </Link>
                <button onClick={handleBuy} className="buy-btn">Buy Now</button>
              </div>
            )}
            {user && user.id === product.owner._id && (
              <div className="owner-actions">
                <Link to={`/products/${id}/edit`} className="edit-btn">Edit</Link>
                <button onClick={handleDelete} className="delete-btn">Delete</button>
              </div>
            )}
          </>
        )}
      </div>

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

export default ProductDetail;
