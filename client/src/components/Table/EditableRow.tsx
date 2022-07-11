import { useState, CSSProperties } from 'react';
import { SaveIcon, XIcon } from '@heroicons/react/solid';
import { PromotionTypes } from '../../types/promotion';
import { Promotion } from '../../types/promotion';
import { useMutation, useQueryClient } from 'react-query';
import moonactive from '../../api/moonactive';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
  index: number,
  path: string,
  item: Promotion,
  style: CSSProperties,
  setEdit: React.Dispatch<React.SetStateAction<string | null>>
}

const EditableRow = ({ index, path, item, style, setEdit }: Props) => {
  const [itemData, setItemData] = useState({ ...item });
  const queryClient = useQueryClient();

  const handleItemData = (element: EventTarget & HTMLInputElement | HTMLSelectElement) => {
    setItemData({ ...itemData, [element.name]: element.value });
  }

  const { mutate: update } = useMutation(async (id: string) => {
    return await moonactive.request({
      url: `${path}/${id}`,
      data: itemData,
      method: 'PUT',
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
      setEdit(null);
      toast.success('Update successfully', {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1200
      });
      queryClient.invalidateQueries('promotion');
    }
  })

  return (
    <>
      <div key={itemData.id} style={style} className="t-row">
        <div className='t-col'>
          <input
            type="text"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            value={itemData.name}
            onChange={e => handleItemData(e.target)}
            name="name" />
        </div>
        <div className='t-col'>
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
        </div>
        <div className='t-col'>
          <input
            type="text"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            value={itemData.start_date}
            onChange={e => handleItemData(e.target)}
            name="start_date" />
        </div>
        <div className='t-col'>
          <input type="text"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            value={itemData.end_date}
            onChange={e => handleItemData(e.target)}
            name="end_date" />
        </div>
        <div className='t-col'>
          <input type="text"
            className='bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            value={itemData.user_group}
            onChange={e => handleItemData(e.target)}
            name="user_group" />
        </div>
        <div className='t-col'>
          <div className='inline-flex justify-center px-2 py-2 bg-white text-gray-700'>
            <SaveIcon onClick={() => update(itemData.id)} className='h-6 w-6 cursor-pointer' aria-hidden='true' />
            <XIcon onClick={() => setEdit(null)} className='h-6 w-6 cursor-pointer' />
          </div>
        </div>
      </div>
    </>

  )
}

export default EditableRow;
