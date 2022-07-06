import { useRef, useCallback, Fragment } from 'react';
import Dropdown from './TableDropdownActions';
import { Promotion } from '../../types/promotion';
import { useInfiniteQuery } from 'react-query';
import moonactive from "../../api/moonactive";

interface Props {
  path: string,
}

const TableBody = ({ path }: Props) => {

  const fetchInfiniteData = async ({ pageParam = 1 }) => {
    const response = await moonactive.request({
      url: path,
      method: 'GET',
      params: { cursor: pageParam }
    });
    return response.data;
  }

  // TODO: add hasPreviousPage
  const {
    data,
    error,
    hasNextPage,
    isLoading,
    isError,
    fetchNextPage,
  } = useInfiniteQuery('promotion', fetchInfiniteData, {
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


  if (isLoading) {
    return <tbody><tr><td className='p-3 text-sm text-gray-700'>Loading...</td></tr></tbody>
  }

  if (isError && error) {
    return <tbody><tr><td className='p-3 text-sm text-gray-700'>Error...</td></tr></tbody>
  }

  const serializeRows = () => {
    return data?.pages.map((group, i: number) => (
      <Fragment key={i}>
        {
          group.results.map((item: Promotion, i: number) => {
            const refProp: React.Attributes | {} = group.results.length === i + 1 ? { ref: lastItemRef } : {};
            return ((
              <tr key={item.id} {...refProp} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className='p-3 text-sm text-gray-700'>{item.name}</td>
                <td className='p-3 text-sm text-gray-700'>{item.type}</td>
                <td className='p-3 text-sm text-gray-700'>{item.start_date}</td>
                <td className='p-3 text-sm text-gray-700'>{item.end_date}</td>
                <td className='p-3 text-sm text-gray-700'>{item.user_group}</td>
                <td className='p-3 text-sm text-gray-700'>
                  <Dropdown id={item.id} path={path} />
                </td>
              </tr>
            ))
          })
        }
      </Fragment>
    ))

  }

  return <tbody>{serializeRows()}</tbody>;



}
export default TableBody;