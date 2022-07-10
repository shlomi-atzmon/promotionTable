import { QueryClientProvider, QueryClient } from 'react-query';
import TableContainer from '../Table/TableContainer';
import Navbar from '../Navbar/Navbar';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient();

const App = () => {
  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className='container mx-auto px-4'>
        <QueryClientProvider client={queryClient}>
          <TableContainer model='Promotion' path={'/promotions'} />
        </QueryClientProvider>
      </div>
    </>
  );
};

export default App;
