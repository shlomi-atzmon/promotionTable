import TableHeader from './TableHeader';
import TableBody from './TableBody';
import DialogBox from '../Modals/DialogBox';
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

    // TODO: HOW TO RETURN ONLY MESSAGE
    onError: (error: any) => { },
    onSuccess: () => {
      queryClient.invalidateQueries('promotion');
    }
  });

  return (
    <>
      {isLoading && <DialogBox title="Loading..." body="Let's make some data &#129300; ?!" />}
      {isError && <DialogBox title="Loading..." body={error.response.data.errors.message} />}
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