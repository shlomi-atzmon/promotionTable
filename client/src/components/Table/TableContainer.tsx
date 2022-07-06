import TableHeader from './TableHeader';
import TableBody from './TableBody';
import { useMutation, useQueryClient } from "react-query";
import moonactive from "../../api/moonactive";

interface tableProps {
  model: string,
  path: string
}

const TableContainer = ({ model, path }: tableProps) => {

  const queryClient = useQueryClient();

  const { mutate: addMockData, isLoading, isError, error } = useMutation(async () => {
    return await moonactive.request({
      url: `${path}/mock-data`,
      method: 'POST',
    });
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('promotion');
    }
  });

  if (isLoading) {
    return <div style={{ backgroundColor: "white" }}>Loading...</div>
  }

  if (isError && error) {
    return <div style={{ backgroundColor: "white" }}>Error</div>;
  }

  return (
    <>
      <div className='flex justify-between py-3'>
        <div className='font-semibold text-xl tracking-tight py-3 text-white'>{model} Information</div>
        <button className='mock-btn' onClick={() => addMockData()}>Add Mock {model}s</button>
      </div>
      <table className="w-full">
        <TableHeader />
        <TableBody path={path} />
      </table>
    </>
  )
}
export default TableContainer;