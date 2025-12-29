import { createContext, useContext, useEffect, useState } from "react"
import { createCart, getCart } from "../api/medusa"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)

  useEffect(() => {
    const storedCartId = localStorage.getItem("cart_id")

    if (storedCartId) {
      getCart(storedCartId)
        .then(setCart)
        .catch(() => {
          // cart invalid then, create new
          createCart().then(c => {
            localStorage.setItem("cart_id", c.id)
            setCart(c)
          })
        })
    } else {
      createCart().then(c => {
        localStorage.setItem("cart_id", c.id)
        setCart(c)
      })
    }
  }, [])

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
