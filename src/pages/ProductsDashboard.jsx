import { useEffect, useState } from 'react';
import { getCategories } from '../api/medusa';
import VisualTile from '../components/productDashboard/VisualTile';
import upArrow from '../../assets/icons/arrow_up.png';
import downArrow from '../../assets/icons/arrow_down.png';

export default function ProductsDashboard() {
  const [categories, setCategories] = useState([]);
  const [isShowMore, setIsShowMore] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const displayedCategories = isShowMore ? categories : categories.slice(0, 3);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className='w-full h-screen'>
      <VisualTile />
      <section className='flex flex-row  pt-[5vw] px-[18vw]'>
        <div className='w-[25%]'>
          <h2 className='text-l font-bold '>Product Type</h2>
          <div className='flex flex-col gap-2 mt-2'>
            {displayedCategories.map((category) => (
              <label key={category.id} className='flex items-center gap-2 cursor-pointer'>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className='w-4 h-4 accent-[#226A73] cursor-pointer '
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
          <div className='flex flex-row items-center gap-2 mt-6'>
            {isShowMore ? <img src={upArrow} alt="upArrow" /> : <img src={downArrow} alt="downArrow" />}
            <p onClick={() => setIsShowMore(!isShowMore)} className='cursor-pointer text-[#226A73]'>
              {isShowMore ? 'See less' : 'See all'}
            </p>
          </div>
        </div>
        <div>
          <p className='text-xl font-bold'>Products</p>
        </div>
      </section>
    </div>
  );
}
