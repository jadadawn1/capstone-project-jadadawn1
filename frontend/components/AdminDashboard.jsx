import React from 'react';


import { useState, useEffect } from 'react';

function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // product being edited
  const [form, setForm] = useState({ name: '', price: '', category: '', stock: '' });

  // Fetch products
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  // Handle form input
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create product
  const handleCreate = () => {
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) })
    })
      .then(res => res.json())
      .then(prod => setProducts([...products, prod]));
    setForm({ name: '', price: '', category: '', stock: '' });
  };

  // Start editing
  const startEdit = (prod) => {
    setEditing(prod._id);
    setForm({ name: prod.name, price: prod.price, category: prod.category, stock: prod.stock });
  };

  // Save edit
  const handleUpdate = (id) => {
    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) })
    })
      .then(res => res.json())
      .then(updated => {
        setProducts(products.map(p => p._id === id ? updated : p));
        setEditing(null);
        setForm({ name: '', price: '', category: '', stock: '' });
      });
  };

  // Delete product
  const handleDelete = (id) => {
    fetch(`/api/products/${id}`, { method: 'DELETE' })
      .then(() => setProducts(products.filter(p => p._id !== id)));
  };

  return (
    <div>
      <h3>Inventory Management</h3>
      <div>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} />
        {editing ? (
          <>
            <button onClick={() => handleUpdate(editing)}>Save</button>
            <button onClick={() => { setEditing(null); setForm({ name: '', price: '', category: '', stock: '' }); }}>Cancel</button>
          </>
        ) : (
          <button onClick={handleCreate}>Add Product</button>
        )}
      </div>
      <ul>
        {products.map(prod => (
          <li key={prod._id}>
            {prod.name} (${prod.price}) [{prod.category}] Stock: {prod.stock}
            <button onClick={() => startEdit(prod)} style={{ marginLeft: 8 }}>Edit</button>
            <button onClick={() => handleDelete(prod._id)} style={{ marginLeft: 4 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  // Demo: fetch users from API (no auth, just placeholder)
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);
  const handleCreate = () => {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'changeme', role })
    })
      .then(res => res.json())
      .then(user => setUsers([...users, user]));
  };
  const handleDelete = (id) => {
    fetch(`/api/users/${id}`, { method: 'DELETE' })
      .then(() => setUsers(users.filter(u => u._id !== id)));
  };
  return (
    <div>
      <h3>User Management</h3>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="member">member</option>
        <option value="admin">admin</option>
      </select>
      <button onClick={handleCreate}>Create User</button>
      <ul>
        {users.map(u => (
          <li key={u._id}>{u.email} ({u.role}) <button onClick={() => handleDelete(u._id)}>Delete</button></li>
        ))}
      </ul>
    </div>
  );
}

function AdminOrderHistory() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch('/api/orders/all', { credentials: 'include' })
      .then(res => res.json())
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);
  return (
    <div>
      <h3>Global Order History</h3>
      {orders.length === 0 && <p>No orders found.</p>}
      {orders.length > 0 && (
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              <strong>Order #{order._id}</strong> - ${order.total} - {new Date(order.createdAt).toLocaleString()} (User: {order.userId})
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

function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <AdminInventory />
      <AdminOrderHistory />
      <AdminUsers />
    </div>
  );
}

export default AdminDashboard;
