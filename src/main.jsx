// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   
import App from './App.jsx'
import './index.css'
import GetRestaurant from './context/getRestaurant.jsx'
import GetAllCategories from './context/GetAllCategories.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GetRestaurant>
      <GetAllCategories>
            <App/>
      </GetAllCategories>
    </GetRestaurant>           
  </BrowserRouter>

)