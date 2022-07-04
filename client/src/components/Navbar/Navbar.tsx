import logo from '../../logo.svg';
import './Navbar.css';

const Navbar = () => {
  return (
    <header>
      <div className='wrraper'>
        <img
          src={logo}
          className='app-logo'
          alt='logo'
        />
        <h3 className='text-[#e4b21e] font-extrabold text-3xl'>OPERATION TEAM</h3>
      </div>
    </header>
  );
};

export default Navbar;