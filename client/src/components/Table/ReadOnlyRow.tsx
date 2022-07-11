import { Dispatch, SetStateAction, CSSProperties } from 'react';
import Dropdown from './TableDropdownActions';
import { Promotion } from '../../types/promotion';

interface Props {
  index: number,
  path: string,
  item: Promotion,
  style: CSSProperties,
  setEdit: Dispatch<SetStateAction<string | null>>,
}

const ReadOnlyRow = ({ index, path, item, style, setEdit }: Props) => {
  return ((
    <div key={item.id} style={style} className="t-row">
      <div className='t-col'>{item.name}</div>
      <div className='t-col'>{item.type}</div>
      <div className='t-col'>{item.start_date}</div>
      <div className='t-col'>{item.end_date}</div>
      <div className='t-col'>{item.user_group}</div>
      <div className='t-col'>
        <Dropdown id={item.id} path={path} setEdit={setEdit} />
      </div>
    </div>
  ))
}

export default ReadOnlyRow;
