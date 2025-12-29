export default function Checkout() {
  return (
    <div className="p-12 max-w-xl">
      <h1 className="text-3xl mb-8">Checkout</h1>

      <input placeholder="Email" className="block w-full mb-4 p-2" />
      <input placeholder="Phone" className="block w-full mb-4 p-2" />
      <input placeholder="Address" className="block w-full mb-4 p-2" />

      <button className="border px-6 py-3">
        Place Order
      </button>
    </div>
  )
}
