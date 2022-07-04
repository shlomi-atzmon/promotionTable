import TableContainer from '../Table/TableContainer';
import Navbar from '../Navbar/Navbar';

const App = () => {
  return (
    <>
      <Navbar />
      <div className='container mx-auto px-4'>
        <TableContainer model='Promotion' path={'/promotions'} />
      </div>
    </>
  );
};

export default App;
