import { useState, useCallback, useRef, Fragment, useEffect } from 'react';
import { Promotion } from '../../types/promotion';
import moonactive from "../../api/moonactive";
import ReadOnlyRow from './ReadOnlyRow';
import EditableRow from './EditableRow';

interface Props {
  path: string,
}

const itemsPerPage = 20;
const maxItemsOnScreen = 100;
const maxPagesOnScreen = maxItemsOnScreen / itemsPerPage;

const TableBody = ({ path }: Props) => {
  // row read/edit state
  const [editRowId, setEditRowId] = useState<string | null>(null);
  // direction state
  const [direction, setDirection] = useState<"down" | "up">("down");
  // page to fetch form server
  const [page, setPage] = useState<number>(1);
  // rows to render
  const [rows, setRows] = useState<Promotion[]>([]);
  // loading page from server
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // runs after CRUD operations for render use only - rows !== primitive type
  const [render, setRender] = useState<number>(0);
  // paging helpers
  const totalPages = useRef<number>(1);
  const lastPage = useRef<number>(1);
  const firstPage = (lastPage.current > maxPagesOnScreen)
    ? lastPage.current - maxPagesOnScreen
    : 1;

  ////// CRUD section //////
  const handleDelete = () => {
    getAllPages();
  }

  const handleDuplicate = (index: number, duplicatedRowId: string) => {
    const tempRows: Promotion[] = rows;
    tempRows.splice(index, 0, { ...tempRows[index], id: duplicatedRowId });
    setRows(tempRows);
    setRender(prev => prev + 1);
  }

  const handleUpdate = (index: number, item: Promotion) => {
    const tempRows: Promotion[] = rows;
    tempRows[index] = item;
    setRows(tempRows);
    setRender(prev => prev + 1);
  }

  ////// Fetch Data Section /////// 
  const dataHandler = useCallback((data: any) => {
    let newData = data.results;
    totalPages.current = data.pages

    // Removing rows from the end of the array
    if (direction === "down") {
      newData = [...rows, ...data.results];
      if (lastPage.current > maxPagesOnScreen) {
        newData = newData.filter((item: Promotion, index: number) => index > (itemsPerPage - 1));
      }
    }

    // Removing rows from the start of the array
    if (direction === 'up') {
      newData = [...data.results, ...rows];
      newData = newData.filter((item: Promotion, index: number) => index < maxItemsOnScreen);
    }

    setRows(newData);

  }, [direction, rows]);

  const fetchData = useCallback(async (page: number) => {
    setIsLoading(true);

    const response = await moonactive.request({
      url: path,
      method: 'GET',
      params: { page, limit: itemsPerPage }
    });

    setIsLoading(false);
    return response.data;
  }, [path]);


  // Update on screen pages form server
  const getAllPages = async () => {
    let data;
    let newData: Promotion[] = [];
    const startPage = lastPage.current <= maxPagesOnScreen ? 1 : firstPage + 1;
    for (let pageCounter = startPage; pageCounter <= lastPage.current; pageCounter++) {
      data = await fetchData(pageCounter);
      newData = [...newData, ...data.results];
    }
    setRows(newData)
  }

  useEffect(() => {
    const handleRenderedRows = async () => {
      const data = await fetchData(page);
      dataHandler(data);
    }
    if (page && !isLoading) handleRenderedRows();
  }, [page]);

  ////// Intersection Observer Section ///// 
  const observe = {
    first: useRef<IntersectionObserver>(),
    last: useRef<IntersectionObserver>()
  };

  const firstItemRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (observe.first.current) observe.first.current.disconnect();

    observe.first.current = new IntersectionObserver(entries => {

      if (entries[0].isIntersecting) {
        setDirection("up");

        if (lastPage.current > maxPagesOnScreen) {
          setPage(firstPage);
          lastPage.current = lastPage.current - 1
        }

      }
    }, {
      root: document.querySelector(".t-body"),
      rootMargin: "400px 0px 0px 0px"
    });

    if (node) observe.first.current.observe(node)
  }, [isLoading, observe.first, firstPage]);

  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observe.last.current) observe.last.current.disconnect();

    observe.last.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setDirection("down");

        if (lastPage.current < totalPages.current) {
          setPage(lastPage.current + 1);
          lastPage.current = lastPage.current + 1
        }

      }
    }, {
      root: document.querySelector(".t-body"),
      rootMargin: "0px 0px 400px 0px"
    });

    if (node) observe.last.current.observe(node)
  }, [isLoading, observe.last]);

  ////// Render Section ///////  
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
              handleUpdate={handleUpdate}
            />
            : <ReadOnlyRow
              index={i}
              path={path}
              item={item}
              setEdit={setEditRowId}
              refProp={refProp}
              handleDelete={handleDelete}
              handleDuplicate={handleDuplicate}
            />
          }
        </Fragment>
      )
    })
  }

  return (
    <div className='t-body'>
      {serializeRows()}
    </div>
  )
}

export default TableBody;