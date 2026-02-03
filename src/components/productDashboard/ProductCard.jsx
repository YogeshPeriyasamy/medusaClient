import checkIcon from '../../../assets/icons/checkIcon.png';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/400x400/F3F4F6/6B7280?text=No+Image';
    const highlights = product.highlights || [];

    return (
        <Link to={`/product/${product.id}`} state={{ product }}>
            <article className='flex flex-col bg-white rounded-lg  hover:shadow-md transition-shadow p-5 active:border-2 active:border-[#5BEF20]'>

                <div className='bg-gray-50 rounded-lg overflow-hidden mb-4 aspect-square'>
                    <img
                        src={imageUrl}
                        alt={product.title}
                        className='w-full h-full object-cover'
                    />
                </div>

                <h3 className='text-sm font-semibold text-gray-900 mb-3 line-clamp-2'>
                    {product.title}
                </h3>

                {highlights.length > 0 && (
                    <ul className='space-y-2 px-2' aria-label="Product highlights" >
                        {highlights.slice(0, 4).map((highlight, index) => (
                            <li key={index} className='flex items-start gap-2'>
                                <span
                                    className='flex-shrink-0 flex items-center justify-center w-4 h-4 bg-[#226A73] rounded-full mt-0.5'
                                    aria-hidden="true"
                                >
                                    <img
                                        src={checkIcon}
                                        alt=""
                                    />
                                </span>
                                <p className='text-xs text-gray-700 leading-relaxed'>
                                    {highlight}
                                </p>
                            </li>
                        ))}
                        {highlights.length > 4 && (
                            <li className='text-xs text-[#226A73] font-medium pl-6'>
                                +{highlights.length - 4} more features
                            </li>
                        )}
                    </ul>
                )}
            </article>
        </Link>
    );
}