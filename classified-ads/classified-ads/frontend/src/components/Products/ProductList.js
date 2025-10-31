import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import ChatRoom from '../Chat/ChatRoom';
import './ProductList.css';

const ProductList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [chatModal, setChatModal] = useState({ show: false, userId: null, sellerName: '' });

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/products?search=${search}`);
      setProducts(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChatClick = (product) => {
    if (!user) {
      alert('Please login to chat with seller');
      navigate('/login');
      return;
    }
    setChatModal({ 
      show: true, 
      userId: product.owner._id, 
      sellerName: product.owner.name 
    });
  };

  const closeChat = () => {
    setChatModal({ show: false, userId: null, sellerName: '' });
  };

  return (
    <div className="product-list">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="products">
        {products.map((product) => (
          <div key={product._id} className={`product-card ${product.status === 'sold' ? 'sold' : ''}`}>
            <img src={product.images[0] ? getImageUrl(product.images[0]) : ''} alt={product.title} />
            <h3>{product.title} {product.status === 'sold' && <span className="sold-label">(Sold)</span>}</h3>
            <p>${product.price}</p>
            {product.status === 'sold' ? (
              <button disabled>Sold</button>
            ) : (
              <>
                <Link to={`/products/${product._id}`}>View Details</Link>
                {user && user.id !== product.owner._id && (
                  <button 
                    onClick={() => handleChatClick(product)} 
                    className="chat-btn"
                  >
                    💬 Chat
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {chatModal.show && (
        <div className="chat-modal-overlay" onClick={closeChat}>
          <div className="chat-modal-container" onClick={(e) => e.stopPropagation()}>
            <ChatRoom 
              userId={chatModal.userId} 
              sellerName={chatModal.sellerName}
              onClose={closeChat} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
