import Dropdown from './TableDropdownActions';
import { Promotion } from '../../types/promotion';

interface Props {
  index: number,
  path: string,
  item: Promotion,
  refProp: {} | React.Attributes,
  setEdit: React.Dispatch<React.SetStateAction<string | null>>
}

const ReadOnlyRow = ({ index, path, item, refProp, setEdit }: Props) => {
  return ((
    <tr key={item.id} {...refProp} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
      <td className='p-3 text-sm text-gray-700'>{item.name}</td>
      <td className='p-3 text-sm text-gray-700'>{item.type}</td>
      <td className='p-3 text-sm text-gray-700'>{item.start_date}</td>
      <td className='p-3 text-sm text-gray-700'>{item.end_date}</td>
      <td className='p-3 text-sm text-gray-700'>{item.user_group}</td>
      <td className='p-3 text-sm text-gray-700'>
        <Dropdown id={item.id} path={path} setEdit={setEdit} />
      </td>
    </tr>
  ))
}

export default ReadOnlyRow;
