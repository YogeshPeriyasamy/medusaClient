// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getProductsByCategory } from '../api/medusa';
// import { getVariantPrice } from '../utils/priceFormatter';

// export default function CategoryProducts() {
//   const { handle } = useParams();
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     async function load() {
//       try {
//         const result = await getProductsByCategory(handle);
//         setProducts(result ?? []);
//       } catch (err) {
//         console.error(err);
//         setProducts([]);
//       }
//     }
//     load();
//   }, [handle]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl mb-6 capitalize">{handle}</h1>

//       <div className="grid grid-cols-4 gap-6">
//         {products.map((p) => {
//           const variant = p.variants?.[0];
//           const price = getVariantPrice(variant);
//           console.log('price for product', price);

//           return (
//             <div
//               key={p.id}
//               className="border p-4 cursor-pointer hover:border-white"
//               onClick={() => navigate(`/product/${p.id}`)}
//             >
//               <img
//                 src={p.thumbnail}
//                 alt={p.title}
//                 className="w-full h-48 object-cover"
//               />

//               <h3 className="mt-2 font-medium">{p.title}</h3>

//               {price !== null ? (
//                 <p className="mt-1 text-lg font-semibold">
//                   ₹ {price.toLocaleString('en-IN')}
//                 </p>
//               ) : (
//                 <p className="mt-1 opacity-50">Price unavailable</p>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
