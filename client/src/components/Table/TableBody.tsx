import { useState, useCallback, useRef, Fragment } from 'react';
import { useQuery } from 'react-query';
import ReadOnlyRow from './ReadOnlyRow';
import EditableRow from './EditableRow';
import { Promotion } from '../../types/promotion';
import moonactive from "../../api/moonactive";

interface Props {
  path: string,
}

const itemsPerPage = 20;
const maxItemsOnScreen = 100;

const TableBody = ({ path }: Props) => {
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [page, setPage] = useState<number>(1);
  const [rows, setRows] = useState([])

  //const [lastPage, setLastPage] = useState<number>(1);

  const lastPage = useRef<number>(1);



  const firstPage = (lastPage.current >= 5) ? lastPage.current - 5 : 1
  console.log('==> firstPage : ' + firstPage);
  console.log("==> lastPage : " + lastPage.current);

  /// Fetch Data Section /// 
  const dataHandler = (data: any) => {

    // data.results => old data
    // response.data.results => new data

    //console.log(direction)

    let newData = data.results;

    if (direction === "down") {

      newData = [...rows, ...data.results];
      console.log("D: Adding page: " + page);

      if (lastPage.current > maxItemsOnScreen / itemsPerPage) { //(data.results.length >= maxItemsOnScreen) {
        newData = newData.filter((item: any, index: number) => index > (itemsPerPage - 1));
        //console.log(newData);

        console.log("D: Removing page: " + firstPage);

      }
    }


    console.log("==== This stinks: ====")
    console.log("Direction: " + direction)
    console.log("firstPage: " + firstPage)
    if (direction === 'up') {

      console.log("U: Adding page: " + firstPage);
      newData = [...data.results, ...rows];

      console.log("U: Removing page: " + (lastPage.current));
      newData = newData.filter((item: any, index: number) => index < maxItemsOnScreen);
    }


    setRows(newData);
  }

  const fetchData = async (page: number) => {
    const response = await moonactive.request({
      url: path,
      method: 'GET',
      params: { page, limit: itemsPerPage }
    });
    return response.data;
  }

  const {
    isLoading,
    isError,
    data,
  } = useQuery(['promotion', page], () => fetchData(page), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => dataHandler(data)
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

        if (lastPage.current > 5) {
          console.log("Up observer - last page: " + lastPage.current)
          setPage(firstPage)
          lastPage.current = lastPage.current - 1
        }

      }
    }, {
      root: document.querySelector(".t-body"),
      rootMargin: "400px 0px 0px 0px"
    });

    if (node) observe.first.current.observe(node)
  }, [isLoading, data?.previousPage, observe.first, firstPage]);

  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observe.last.current) observe.last.current.disconnect();

    observe.last.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && data.nextPage) {
        setDirection("down");

        setPage(lastPage.current + 1);
        lastPage.current = lastPage.current + 1


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
    return rows.map((item: Promotion, i: number) => {

      // Set observers on DOM
      const refProp: React.Attributes | {} = i === 0
        ? { ref: firstItemRef }
        : rows.length === i + 1
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
      ) : <div className='t-body'>
        {serializeRows()}
      </div>
      }
    </>
  )
}

export default TableBody;