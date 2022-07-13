import { PromotionHeaders } from "../../types/promotion";

const TableHeader = () => {
  const setHeaders = PromotionHeaders.map((header) => {
    return <div key={header} className="th-col">{header}</div>
  });

  return (
    <div className="t-header">
      {setHeaders}
      <div className="th-col">Actions</div>
    </div>
  )
}

export default TableHeader;