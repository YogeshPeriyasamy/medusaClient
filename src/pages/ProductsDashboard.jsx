import { useEffect, useState } from 'react';
import { getCategories, getProducts } from '../api/medusa';
import VisualTile from '../components/productDashboard/VisualTile';
import ProductCard from '../components/productDashboard/ProductCard';
import upArrow from '../../assets/icons/arrow_up.png';
import downArrow from '../../assets/icons/arrow_down.png';
// import CategoryFilter from '../components/productDashboard/CategoryFilter';

export default function ProductsDashboard() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isShowMore, setIsShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts()
        ]);
        setCategories(categoriesData || []);
        setProducts(productsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCategoryToggle = (categoryId) => {
    setIsFiltering(true);
    setTimeout(() => {
      setSelectedCategories((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );
      setIsFiltering(false);
    }, 500);
  };

  // Show all products if no category selected, otherwise filter
  const filteredProducts = selectedCategories.length === 0
    ? products
    : products.filter((product) =>
      product.categories?.some((cat) => selectedCategories.includes(cat.id))
    );

  const displayedCategories = isShowMore ? categories : categories.slice(0, 3);

  if (isLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#226A73] mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-[#226A73] text-white rounded hover:bg-[#1a5359]'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className='w-full min-h-screen bg-[#F8F7F7]'>
      <VisualTile />

      <section className='flex flex-col lg:flex-row gap-6 pt-12 px-4 md:px-8 lg:px-[18vw] pb-12 bg-white'>
        {/* Sidebar Filters */}
        <aside className='w-full lg:w-1/4'>
          <h2 className='text-lg font-bold mb-4'>Product Type</h2>

          {categories.length === 0 ? (
            <p className='text-gray-500 text-sm'>No categories available</p>
          ) : (
            <>
              <div className='flex flex-col gap-3'>
                {displayedCategories.map((category) => (
                  <label
                    key={category.id}
                    className='flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors'
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className='w-4 h-4 accent-[#226A73] cursor-pointer'
                      aria-label={`Filter by ${category.name}`}
                    />
                    <span className='text-sm'>{category.name}</span>
                  </label>
                ))}
              </div>

              {categories.length > 3 && (
                <button
                  onClick={() => setIsShowMore(!isShowMore)}
                  className='flex items-center gap-2 mt-6 text-[#226A73] hover:text-[#1a5359] transition-colors'
                  aria-expanded={isShowMore}
                >
                  <img
                    src={isShowMore ? upArrow : downArrow}
                    alt=""
                    className='w-4 h-4'
                    aria-hidden="true"
                  />
                  <span className='text-sm font-medium'>
                    {isShowMore ? 'See less' : `See all (${categories.length})`}
                  </span>
                </button>
              )}
            </>
          )}
        </aside>

        {/* Product Grid */}
        <main className='w-full lg:w-3/4'>
          {isFiltering ? (
            <div className='flex items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#226A73]'></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-500 text-lg'>No products found</p>
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className='mt-4 text-[#226A73] hover:underline'
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </section>
    </div>
  );
}