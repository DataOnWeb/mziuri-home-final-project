# 🛍️ Pronia - Modern E-Commerce Web App

[🌐 Live Demo](https://pronia-app.onrender.com) | [📦 Template Demo](https://htmldemo.net/pronia/pronia/index.html)

A modern, full-stack e-commerce platform designed for a **seamless shopping experience**, featuring powerful product filtering, cart/wishlist management, secure authentication, multi-language support, and more.

---

## ✨ Features

### 🌐 Frontend (React + Vite)
- ⚡ Built with **Vite** for ultra-fast development
- 🧭 **React Router DOM** for SPA navigation
- 📡 Axios / Fetch for API requests
- 📦 **Context API** to manage shared state (no prop drilling!)
- 🎨 **SCSS** for modular, clean styling
- 📱 Fully **responsive** across all devices
- 🧾 Form validation with `react-hook-form` or plain hooks
- 🪝 Custom React Hooks for interactive features

### 📦 Backend (Node.js + Express)
- 🚀 **Express.js** RESTful API
- 🔒 **JWT Authentication** with Cookie storage
- 🛡️ Secure with Helmet, CORS, and rate-limiting
- 🔑 Passwords hashed with **bcrypt**
- 🌱 Environment variables managed via `.env`

### 🧠 Database (MongoDB)
- 🗃️ Schema-based modeling with **Mongoose**
- 🔎 Fast product searching and filtering

---

## 🖼️ Pages & Functionality

| Page             | Features                                                                 |
|------------------|--------------------------------------------------------------------------|
| 🏠 Homepage       | Hero banners, featured categories, product previews                     |
| 🛍 Product List   | Category + price filters, pagination                                    |
| 📄 Product Detail | Images, price, description, stock, reviews, cart/wishlist buttons       |
| 🛒 Cart           | Quantity control, remove items, subtotal                                |
| ❤️ Wishlist       | Save favorites for later                                                |
| ⚖️ Compare        | Side-by-side product comparison                                         |
| 📝 Blog           | Search + filter by tags/category                                        |
| 💳 Checkout       | Shipping form, summary, price calculation                              |
| 🔐 Login/Register | Auth routes with JWT + Cookie support                                  |
| 🧭 Forgot/Reset   | Token-based password recovery                                           |
| 📞 Contact Us     | Form with map integration                                               |

---

## 🌍 Extra Features

- 🌐 **i18n**: Multi-language support
- 💱 **Multi-currency** (frontend + backend)
- 🔐 **Auth Middleware** to protect private routes
- 🔁 **Scroll-to-top button**
- 📄 **Dynamic Page Titles**
- ⏳ **Route Loading Animations**
- 📦 **Compression & Caching Headers**

---

## 🛠️ Tech Stack

### Frontend
- `React.js`, `Vite`, `React Router DOM`, `SCSS`
- `Axios`, `Context API`, `react-hook-form`
- `i18next`, `styled-components` (if used)

### Backend
- `Node.js`, `Express.js`
- `JWT`, `bcrypt`, `Helmet`, `cors`, `dotenv`
- `MongoDB`, `Mongoose`

### Deployment
- 🐙 GitHub (Version control)
- 🚀 Render.com for hosting ([Live Link](https://pronia-app.onrender.com))
- 🌐 Domain: `mziuri-dev.ge`

---

## 🧪 Local Development

```bash
# Clone the repo
git clone https://github.com/yourusername/pronia-ecommerce.git
cd pronia-ecommerce

# Install frontend dependencies
cd client
npm install
npm run dev

# Install backend dependencies
cd ../server
npm install
npm run dev
