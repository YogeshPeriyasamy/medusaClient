import dashboardImage from '../../../assets/images/dashboard.webp';

export default function VisualTile() {
  return (
    <div className='relative w-full h-[350px]'>
      <img src={dashboardImage} alt="Product Dashboard Image" className='w-full h-full object-fit' />
      <div className='absolute inset-0 flex flex-col items-center justify-center text-white '>
        <h1 className='text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg'>Be Smart and Act Smart</h1>
        <p className='text-lg md:text-xl drop-shadow-md'>Automate your premise with Toyama smart gadgets</p>
      </div>
    </div>
  );
}
