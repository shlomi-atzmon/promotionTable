import TableHeader from './TableHeader';
import TableBody from './TableBody';
import { useMutation, useQueryClient } from "react-query";
import moonactive from "../../api/moonactive";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './table.css';

interface tableProps {
  model: string,
  path: string
}

const TableContainer = ({ model, path }: tableProps) => {

  const queryClient = useQueryClient();

  const { mutate: addMockData } = useMutation(async () => {
    toast.info("Cooking your data...", {
      position: toast.POSITION.TOP_LEFT,
      icon: "🚀",
      autoClose: 4000
    });

    return await moonactive.request({
      url: `${path}/mock-data`,
      method: 'POST',
    });
  }, {
    // TODO : Add err type 
    onError: (error: any) => {
      toast.error((
        <div>{
          error.response.data.messages.map((err: any) => (
            <li className="p-1" key={err}>{err}</li>
          ))}
        </div>
      ), {
        position: toast.POSITION.TOP_LEFT
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('promotion');
    }
  });

  return (
    <>
      <div className='flex justify-between py-3'>
        <div className='font-semibold text-xl tracking-tight py-3 text-white'>{model} Information</div>
        <button className='mock-btn' onClick={() => addMockData()}>Add Mock {model}s</button>
      </div>
      <div className="t-section">
        <TableHeader />
        <TableBody path={path} />
      </div>
    </>
  )
}
export default TableContainer;