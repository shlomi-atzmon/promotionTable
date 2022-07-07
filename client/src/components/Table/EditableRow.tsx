import { SaveIcon, XIcon } from '@heroicons/react/solid';
import { PromotionTypes } from '../../types/promotion';
import { Promotion } from '../../types/promotion';
import { useMutation, useQueryClient } from 'react-query';
import DialogBox from '../Modals/DialogBox';
import moonactive from '../../api/moonactive';
import { useState } from 'react';

interface Props {
  index: number,
  path: string,
  item: Promotion,
  setEdit: React.Dispatch<React.SetStateAction<string | null>>
}

const EditableRow = ({ index, path, item, setEdit }: Props) => {
  const [itemData, setItemData] = useState({ ...item });
  const queryClient = useQueryClient();

  const handleItemData = (element: EventTarget & HTMLInputElement | HTMLSelectElement) => {
    setItemData({ ...itemData, [element.name]: element.value });
  }

  const { mutate: update, isError, error } = useMutation(async (id: string) => {
    return await moonactive.request({
      url: `${path}/${id}`,
      data: itemData,
      method: 'PUT',
    });
  }, {
    // TODO: HOW TO RETURN ONLY MESSAGE
    onError: (error: any) => { },
    onSuccess: () => {
      setEdit(null);
      queryClient.invalidateQueries('promotion');
    }
  })

  return (
    <>
      {isError && <tr><td><DialogBox title="Error..." body={error.response.data.errors.message} /></td></tr>}
      <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
        <td className='p-3 text-sm text-gray-700'>
          <input
            type="text"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            value={itemData.name}
            onChange={e => handleItemData(e.target)}
            name="name" />
        </td>
        <td className='p-3 text-sm text-gray-700'>
          <select
            name="type"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            onChange={e => handleItemData(e.target)}
            value={itemData.type}
          >
            {PromotionTypes.map((type, i) => (
              <option key={i} value={type}>
                {type}
              </option>
            ))}
          </select>
        </td>
        <td className='p-3 text-sm text-gray-700'>
          <input
            type="text"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            value={itemData.start_date}
            onChange={e => handleItemData(e.target)}
            name="start_date" />
        </td>
        <td className='p-3 text-sm text-gray-700'>
          <input type="text"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            value={itemData.end_date}
            onChange={e => handleItemData(e.target)}
            name="end_date" />
        </td>
        <td className='p-3 text-sm text-gray-700'>
          <input type="text"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            value={itemData.user_group}
            onChange={e => handleItemData(e.target)}
            name="user_group" />
        </td>
        <td className='p-3 text-sm text-gray-700'>
          <div className='inline-flex justify-center px-2 py-2 bg-white text-gray-700'>
            <SaveIcon onClick={() => update(itemData.id)} className='h-6 w-6 cursor-pointer' aria-hidden='true' />
            <XIcon onClick={() => setEdit(null)} className='h-6 w-6 cursor-pointer' />
          </div>
        </td>
      </tr>
    </>

  )
}

export default EditableRow;
