import { useState, useRef, useCallback, Fragment } from 'react';
import ReadOnlyRow from './ReadOnlyRow';
import EditableRow from './EditableRow';
import { Promotion } from '../../types/promotion';
import { useInfiniteQuery } from 'react-query';
import moonactive from "../../api/moonactive";

interface Props {
  path: string,
}

const TableBody = ({ path }: Props) => {
  const [editRowId, setEditRowId] = useState<string | null>(null);

  const fetchInfiniteData = async ({ pageParam = 1 }) => {
    const response = await moonactive.request({
      url: path,
      method: 'GET',
      params: { cursor: pageParam }
    });
    return response.data;
  }

  // TODO: add hasPreviousPage + error
  const {
    data,
    hasNextPage,
    isLoading,
    isError,
    fetchNextPage,
  } = useInfiniteQuery('promotion', fetchInfiniteData, {
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
    getPreviousPageParam: (firstPage, allPages) => firstPage.previousPage,
  })

  const observer = useRef<IntersectionObserver | undefined>();
  const lastItemRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) {
      observer.current.observe(node)
    };
  }, [isLoading, hasNextPage, fetchNextPage]);

  const serializeRows = () => {
    return data?.pages.map((group, i: number) => (
      <Fragment key={i}>
        {
          group.results.map((item: Promotion, i: number) => {
            const lastRefProp: React.Attributes | {} = group.results.length === i + 1 ? { ref: lastItemRef } : {};
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
                    lastRefProp={lastRefProp}
                    setEdit={setEditRowId}
                  />
                }
              </Fragment>
            )
          })
        }
      </Fragment>
    ))
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