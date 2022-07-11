import { useState, Fragment, CSSProperties } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer, { Size } from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import ReadOnlyRow from './ReadOnlyRow';
import EditableRow from './EditableRow';
import { useQuery } from 'react-query';
import moonactive from "../../api/moonactive";

interface Props {
  path: string,
}

const TableBody = ({ path }: Props) => {
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const fetchData = async (page: number) => {
    const response = await moonactive.request({
      url: path,
      method: 'GET',
      params: { page: page, limit: 30 }
    });

    if (data) {
      response.data.results = [...data.results, ...response.data.results];
    }

    return response.data;
  }

  const {
    isLoading,
    isError,
    data,
  } = useQuery(['promotion', page], () => fetchData(page), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });


  const isItemLoaded = (index: number) => !!data.results[index];
  const loadMoreItems = (startIndex: number, stopIndex: number) => {
    if (!data.nextPage) {
      return;
    }
    return setPage(data.nextPage);
  };

  const Row = ({ index, style }: { index: number, style: CSSProperties }) => {
    const item = data.results[index];
    return (
      <Fragment key={index}>
        {editRowId === item.id
          ? <EditableRow
            index={index}
            path={path}
            item={item}
            style={style}
            setEdit={setEditRowId}
          />
          : <ReadOnlyRow
            index={index}
            path={path}
            item={item}
            style={style}
            setEdit={setEditRowId}
          />
        }
      </Fragment>
    );
  };

  return (
    <div className='h-[66vh]'>
      {!data || isLoading ? (
        <div className='t-row'>
          <div className='t-col'>Loading...</div>
        </div>
      ) : isError ? (
        <div className='t-row'>
          <div className='t-col'>Error...</div>
        </div>
      ) :
        <AutoSizer>
          {({ height, width }: Size) => (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              loadMoreItems={loadMoreItems}
              itemCount={data.results.length + 1}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  height={height}
                  itemCount={data.results.length}
                  itemSize={62}
                  width={width}
                  ref={ref}
                  onItemsRendered={onItemsRendered}
                >
                  {Row}
                </List>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      }
    </div>
  );
}

export default TableBody;