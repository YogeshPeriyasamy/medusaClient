import { Link } from 'react-router-dom';
import { useCart } from '../../cart/cart-context';
import ToyamaLogo from '../../../assets/icons/ToyamaLogo.webp';
import cartIcon from '../../../assets/icons/cartIcon.png';

export default function Navbar() {
  const { cart } = useCart();

  // const count = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const count = 1;

  return (
    <div className="flex justify-center h-[60px] shadow-sm sticky top-0 z-50 bg-white">
      <header className="flex flex-row items-center justify-between p-6 w-full ">
        <Link to="/">
          <img src={ToyamaLogo} alt="Toyama" className="h-[24px] " />
        </Link>

        <Link to="/cart" className="relative">
          <img src={cartIcon} alt="Cart" className="h-[24px]" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black text-xs px-2 rounded-full">
              {count}
            </span>
          )}
        </Link>
      </header>
    </div>
  );
}
