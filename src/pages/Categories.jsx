import { useEffect, useState } from 'react';
import { getCategories } from '../api/medusa';

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);
  console.log('categories', categories);
  return (
    <div className="p-12">
      <h1 className="text-3xl mb-8">Categories</h1>

      <div className="grid grid-cols-2 gap-6">
        {categories.map((c) => (
          <a
            key={c.id}
            href={`/category/${c.handle}`}
            className="p-6 bg-neutral-900 border border-neutral-800 hover:border-yellow-500"
          >
            {c.name}
          </a>
        ))}
      </div>
    </div>
  );
}
