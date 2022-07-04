const TableHeader = () => {
  return (
    <thead className="bg-gray-50 border-b-2 border-gray-200">
      <tr>
        <th className="p-3 text-sm font-semibold tracking-wide text-left">Promotion name</th>
        <th className="p-3 text-sm font-semibold tracking-wide text-left">Type</th>
        <th className="p-3 text-sm font-semibold tracking-wide text-left">Start Date</th>
        <th className="p-3 text-sm font-semibold tracking-wide text-left">End Date</th>
        <th className="p-3 text-sm font-semibold tracking-wide text-left">User Group Name</th>
        <th className="p-3 text-sm font-semibold tracking-wide text-left">Actions</th>
      </tr>
    </thead>
  )
}

export default TableHeader;