import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../services/api';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
      alert('Live Stripe.js integrations must use HTTPS.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/payments/create-payment-intent', {
        amount: product.price,
      });

      const { error } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        alert('Payment failed: ' + error.message);
      } else {
        alert('Payment successful!');

        // Mark product as sold
        await api.patch(`/products/${product._id}/sold`);

        navigate('/');
      }
    } catch (error) {
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pay for {product?.title}</h2>
      <p>Amount: ${product?.price}</p>
      <CardElement />
      <button disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

const PaymentForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentForm;
