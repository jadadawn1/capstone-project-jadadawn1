
import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard.jsx';

// Minimal product list for demo
const demoProducts = [
  { _id: '1', name: 'Hammer', price: 20, category: 'Equipment', stock: 3 },
  { _id: '2', name: 'Online Course', price: 50, category: 'Education', stock: 100 },
  { _id: '3', name: 'Consulting', price: 100, category: 'Service', stock: 10 },
];

function Cart({ cart, setCart, onCheckout }) {
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };
  const changeQty = (id, delta) => {
    setCart(cart.map(item =>
      item._id === id ? { ...item, qty: Math.max(1, (item.qty || 1) + delta) } : item
    ));
  };
  const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? <p>Cart is empty.</p> : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item._id}>
                {item.name} (${item.price})
                <button onClick={() => changeQty(item._id, -1)} style={{ marginLeft: 8 }}>-</button>
                <span style={{ margin: '0 4px' }}>{item.qty || 1}</span>
                <button onClick={() => changeQty(item._id, 1)}>+</button>
                <button onClick={() => removeFromCart(item._id)} style={{ marginLeft: 8 }}>Remove</button>
              </li>
            ))}
          </ul>
          <div><strong>Total: ${total.toFixed(2)}</strong></div>
          <button onClick={onCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
}

function ProductList({ products, addToCart }) {
  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product._id}>
            {product.name} (${product.price})
            {typeof product.stock === 'number' && product.stock < 5 && (
              <span style={{ color: 'red', marginLeft: 8 }}>(Low Stock: {product.stock})</span>
            )}
            <button onClick={() => addToCart(product)} style={{ marginLeft: 8 }}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LoginRegister({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const handleLogin = () => {
    fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }) // password ignored for demo
    })
      .then(res => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      })
      .then(data => {
        setError('');
        setMsg('');
        onLogin(email);
      })
      .catch(() => setError('Login failed'));
  };
  const handleRegister = () => {
    fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
      .then(res => {
        if (res.status === 409) throw new Error('User already exists');
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      })
      .then(() => {
        setMsg('Registration successful! You can now log in.');
        setError('');
      })
      .catch(err => setError(err.message));
  };
  return (
    <div>
      <h2>Login / Register</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister} style={{ marginLeft: 8 }}>Register</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {msg && <div style={{ color: 'green' }}>{msg}</div>}
    </div>
  );
}

function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (user) {
      fetch('/api/orders/myorders', { credentials: 'include' })
        .then(res => res.json())
        .then(setOrders)
        .catch(() => setOrders([]));
    }
  }, [user]);
  return (
    <div>
      <h2>Order History</h2>
      {!user && <p>Please log in to view your orders.</p>}
      {user && orders.length === 0 && <p>No orders found.</p>}
      {user && orders.length > 0 && (
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              <strong>Order #{order._id}</strong> - ${order.total} - {new Date(order.createdAt).toLocaleString()}
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.name} x{item.quantity} @ ${item.price}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('store');
  const [checkoutMsg, setCheckoutMsg] = useState('');
    // For demo: treat 'admin@omnia.com' as admin
    const isAdmin = user === 'admin@omnia.com';

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (!existing) {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Filter products by search and category
  const filteredProducts = demoProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? product.category === category : true;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(demoProducts.map(p => p.category)));

  const handleCheckout = () => {
    if (!user) {
      alert('Please log in to checkout.');
      setPage('login');
    } else {
      // Prepare order payload
      const items = cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.qty || 1
      }));
      const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items, total })
      })
        .then(res => {
          if (!res.ok) throw new Error('Order failed');
          return res.json();
        })
        .then(() => {
          setCheckoutMsg('Checkout successful!');
          setCart([]);
          setTimeout(() => setCheckoutMsg(''), 3000);
        })
        .catch(() => {
          setCheckoutMsg('Order failed. Please try again.');
          setTimeout(() => setCheckoutMsg(''), 3000);
        });
    }
  };

  const handleLogin = (email) => {
    setUser(email);
    setPage('store');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('store');
  };

  return (
    <div>
      <h1>Project Omnia Store</h1>
      <nav style={{ marginBottom: 16 }}>
        <button
          onClick={() => setPage('store')}
          style={{ fontWeight: page === 'store' ? 'bold' : 'normal' }}
        >Store</button>
        <button
          onClick={() => setPage('orders')}
          style={{ fontWeight: page === 'orders' ? 'bold' : 'normal' }}
        >Order History</button>
          {isAdmin && (
            <button
              onClick={() => setPage('admin')}
              style={{ fontWeight: page === 'admin' ? 'bold' : 'normal' }}
            >Admin Dashboard</button>
          )}
        {!user && (
          <button
            onClick={() => setPage('login')}
            style={{ fontWeight: page === 'login' ? 'bold' : 'normal' }}
          >Login/Register</button>
        )}
        {user && <>
          <span style={{ marginLeft: 8 }}>Logged in as {user}</span>
          <button onClick={handleLogout} style={{ marginLeft: 8 }}>Log out</button>
        </>}
      </nav>
      {checkoutMsg && <div style={{ color: 'green', marginBottom: 8 }}>{checkoutMsg}</div>}
      {page === 'login' && <LoginRegister onLogin={handleLogin} />}
      {page === 'orders' && <OrderHistory user={user} />}
        {page === 'admin' && isAdmin && <AdminDashboard />}
      {page === 'store' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <ProductList products={filteredProducts} addToCart={addToCart} />
          <Cart cart={cart} setCart={setCart} onCheckout={handleCheckout} />
        </>
      )}
    </div>
  );
}

export default App;
