import { useState, useCallback, useRef, Fragment } from 'react';
import { useQuery } from 'react-query';
import ReadOnlyRow from './ReadOnlyRow';
import EditableRow from './EditableRow';
import { Promotion } from '../../types/promotion';
import moonactive from "../../api/moonactive";

interface Props {
  path: string,
}

const limit = 30;
const ItemsOnScreen = 150;

const TableBody = ({ path }: Props) => {
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [page, setPage] = useState<number>(1);

  /// Fetch Data Section /// 
  const fetchData = async (page: number) => {

    if (direction === 'up') console.log(page)



    const response = await moonactive.request({
      url: path,
      method: 'GET',
      params: { page, limit }
    });

    // data.results => old data
    // response.data.results => new data
    if (data) {

      let newData = [...data.results, ...response.data.results];


      if (direction === "down") {
        //console.log(data.results.length >= ItemsOnScreen, data.results.length, ItemsOnScreen);
        if (data.results.length >= ItemsOnScreen) {
          newData = newData.filter((item: any, index: number) => index > (limit - 1));
          console.log(newData);
        }
      }


      response.data.results = newData;
    }

    //console.log(response.data)
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
  /// End Fetch Data Section /// 

  /// Intersection Observer Section ///
  const observe = {
    first: useRef<IntersectionObserver>(),
    last: useRef<IntersectionObserver>()
  };


  const firstItemRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (observe.first.current) observe.first.current.disconnect();

    observe.first.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && data.previousPage) {
        setDirection("up");
        /* if (data.previousPage > 4) setPage(data.previousPage - 4); */
        setPage(data.previousPage)
      }
    });

    if (node) observe.first.current.observe(node)
  }, [isLoading, data?.previousPage, observe.first]);

  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observe.last.current) observe.last.current.disconnect();

    observe.last.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && data.nextPage) {
        setDirection("down");
        setPage(data.nextPage);
        //console.log("Data Next Page: " + data.nextPage)
        //console.log("Page: " + page)

      }
    }, {
      root: document.querySelector(".t-body"),
      rootMargin: "0px 0px 400px 0px"
    });

    if (node) observe.last.current.observe(node)
  }, [isLoading, data?.nextPage, observe.last]);
  /// End Intersection Observer Section ///

  /// Render Section 
  const serializeRows = () => {
    return data.results.map((item: Promotion, i: number) => {

      // Set observers on DOM
      const refProp: React.Attributes | {} = i === 0
        ? { ref: firstItemRef }
        : data.results.length === i + 1
          ? { ref: lastItemRef }
          : {}

      return (
        <Fragment key={item.id}>
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
              setEdit={setEditRowId}
              refProp={refProp}
            />
          }
        </Fragment>
      )
    })
  }

  return (
    <>
      {isLoading ? (
        <div className='t-row'>
          <div className='t-col'>Loading...</div>
        </div>
      ) : isError ? (
        <div className='t-row'>
          <div className='t-col'>Error...</div>
        </div>
      ) : <div className='t-body' style={{ width: '100%' }}>{serializeRows()}</div>
      }
    </>
  )
}

export default TableBody;