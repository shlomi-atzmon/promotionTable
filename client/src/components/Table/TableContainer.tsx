import { useState, useEffect } from 'react';
import { Promotion } from '../../types/promotion';
import TableHeader from '../Table/TableHeader';
import TableBody from '../Table/TableBody';
import useHttp from '../../hooks/use-http';


interface tableProps {
  model: string,
  path: string
}

const TableContainer = ({model, path}: tableProps) => {
  const [rows, setRows] = useState<Promotion[]>([]);
  
  // Get init data
  const { sendRequest: getRequest, errors: getErrors, loading: getLoading }  = useHttp({
    url: `${path}?cursor=0`,
    method: 'GET',
    onSuccess: (data) => setRows(data)
  });

  useEffect(() => {
    getRequest();
  }, []);

  // Create Mock Data
  const { sendRequest: mockRequest, errors: mockErrors, loading: mockLoading }  = useHttp({
    url: `${path}/mock-data`,
    method: 'POST',
    onSuccess: (data) => setRows([...rows , ...data])
  });

  const createMockData = () => {
    mockRequest();
  }


  return (
    <>
      <div className='flex justify-between py-3'>
        <div className='font-semibold text-xl tracking-tight py-3 text-white'>{model} Information</div>
        <button className='mock-btn' onClick={() => createMockData()}>Add Mock {model}s</button>
      </div>
      <table className="w-full">
        <TableHeader/>
        <TableBody rows={rows} path={path} setRows={setRows}/>
     </table>
    </>
  )
}
export default TableContainer;