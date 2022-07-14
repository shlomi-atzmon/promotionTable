import { Dispatch, SetStateAction } from 'react';
import Dropdown from './TableDropdownActions';
import { Promotion } from '../../types/promotion';

interface Props {
  index: number,
  path: string,
  item: Promotion,
  setEdit: Dispatch<SetStateAction<string | null>>,
  refProp: {} | React.Attributes,
  handleDelete: () => void,
  handleDuplicate: (index: number, duplicatedRowId: string) => void
}

const ReadOnlyRow = ({ index, path, item, setEdit, refProp, handleDelete, handleDuplicate }: Props) => {
  return ((
    <div key={item.id} {...refProp} className={"t-row " + (index % 2 === 0 ? "bg-white" : "bg-gray-50")}>
      <div className='t-col'>{item.name}</div>
      <div className='t-col'>{item.type}</div>
      <div className='t-col'>{item.start_date}</div>
      <div className='t-col'>{item.end_date}</div>
      <div className='t-col'>{item.user_group}</div>
      <div className='t-col'>
        <Dropdown id={item.id} index={index} path={path} setEdit={setEdit} handleDelete={handleDelete} handleDuplicate={handleDuplicate} />
      </div>
    </div>
  ))
}

export default ReadOnlyRow;
