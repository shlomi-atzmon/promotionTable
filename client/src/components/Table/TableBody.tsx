import { useState, useRef, useCallback, Fragment } from 'react';
import ReadOnlyRow from './ReadOnlyRow';
import EditableRow from './EditableRow';
import { Promotion } from '../../types/promotion';
import { useQuery } from 'react-query';
import moonactive from "../../api/moonactive";
import { useScrollDirection, ScrollDirection } from '../../hooks/useScrollDirection';

interface Props {
  path: string,
}

const TableBody = ({ path }: Props) => {
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const direction = useScrollDirection();

  const fetchData = async (page: number) => {
    const response = await moonactive.request({
      url: path,
      method: 'GET',
      params: { cursor: page }
    });
    return response.data;
  }


  /* 
    if (page > 1) {
       const length = data.results.length;
       const oldRows = data.slice(length / 2, length);
       console.log(oldRows);
       const newRows = response.data.concat(oldRows);
       console.log(newRows);
      }
      
  */

  // TODO: handle errors
  const {
    isLoading,
    isError,
    data,
  } = useQuery(['promotion', page], () => fetchData(page), {
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });

  // Observer first item of a page
  const firstItemObserver = useRef<IntersectionObserver | undefined>();
  const firstItemRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (firstItemObserver?.current && direction === ScrollDirection.Up) {
      firstItemObserver.current.disconnect();
    };

    firstItemObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && data.previousPage) {
        console.log('first item');
        setPage(data.previousPage);
      }
    });

    if (node) {
      firstItemObserver.current.observe(node)
    };
  }, [isLoading, direction]);


  // Observer last item of a page
  const lastItemObserver = useRef<IntersectionObserver | undefined>();
  const lastItemRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (lastItemObserver.current) {
      lastItemObserver.current.disconnect();
    }
    lastItemObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && data.nextPage) {
        setPage(data.nextPage);
        console.log('last item');
      }
    });

    if (node) {
      lastItemObserver.current.observe(node);
    };
  }, [isLoading]);

  const serializeRows = () => {
    return data.results.map((item: Promotion, i: number) => {
      const refProp: React.Attributes | {} = data.results.length === i + 1
        ? { ref: lastItemRef }
        : i === 0
          ? { ref: firstItemRef }
          : {}

      return (
        <Fragment key={i}>
          {editRowId === item.id
            ? <EditableRow
              index={i}
              path={path}
              item={item}
              setEdit={setEditRowId}
            />
            : <ReadOnlyRow
              index={i}
              path={path}
              item={item}
              refProp={refProp}
              setEdit={setEditRowId}
            />
          }
        </Fragment>
      )
    })
  }

  return (
    <tbody>
      {isLoading ? (
        <tr>
          <td className='p-3 text-sm text-white'>Loading...</td>
        </tr>
      ) : isError ? (
        <tr>
          <td className='p-3 text-sm text-red-900'>Error...</td>
        </tr>
      ) : serializeRows()
      }
    </tbody>
  );
}

export default TableBody;