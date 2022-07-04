import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import useHttp from '../../hooks/use-http';
import { Promotion } from '../../types/promotion';
import Dropdown from './TableDropdownActions';

interface Props {
  rows: Promotion[],
  path: string,
  setRows: Dispatch<SetStateAction<Promotion[]>>
}

const TableBody = ({ rows, path, setRows }: Props) => {
  const [rowId, setRowId] = useState<string>('')

  // Create Mock Data
  const { sendRequest: remove, errors: removeErrors, loading: removeLoading } = useHttp({
    url: `${path}/${rowId}`,
    method: 'DELETE',
    onSuccess: () => setRowId('')
  });

  const setAction = useCallback((action: string, id: string) => {
    setRowId(id);
    switch (action) {
      case 'update':
        console.log('update');
        break;
      case 'duplicate':
        console.log('duplicate');
        break;
      case 'remove':
        remove()
        break;
    }
  }, [remove]);

  const serializeRows = () => {
    return rows.map((promotion: Promotion, i) => (
      <tr key={promotion.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
        <td className='p-3 text-sm text-gray-700'>{promotion.name}</td>
        <td className='p-3 text-sm text-gray-700'>{promotion.type}</td>
        <td className='p-3 text-sm text-gray-700'>{promotion.start_date}</td>
        <td className='p-3 text-sm text-gray-700'>{promotion.end_date}</td>
        <td className='p-3 text-sm text-gray-700'>{promotion.user_group}</td>
        <td className='p-3 text-sm text-gray-700'>
          <Dropdown doOperation={setAction} id={promotion.id} />
        </td>
      </tr>
    ))
  }

  return <tbody>{serializeRows()}</tbody>;

}
export default TableBody;