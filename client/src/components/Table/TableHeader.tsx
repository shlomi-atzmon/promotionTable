import { PromotionHeaders } from "../../types/promotion";

const TableHeader = () => {
  const setHeaders = PromotionHeaders.map((header) => {
    return <th key={header} className="p-3 text-sm font-semibold tracking-wide text-left">{header}</th>
  });

  return (
    <thead className="sticky top-0 z-50 bg-gray-50 border-b-2 border-gray-200">
      <tr>
        {setHeaders}
        <th className="p-3 text-sm font-semibold tracking-wide text-left">Actions</th>
      </tr>
    </thead>
  )
}

export default TableHeader;