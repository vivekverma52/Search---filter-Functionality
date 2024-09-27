import { useEffect, useState } from "react";
import invoices from "./data/invoices.json";

function SearchFilter() {
  const [data, setData] = useState([]);
  const [filterVal, setFilterVal] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchData, setSearchData] = useState([]);
  const [debounceVal, setDebounceVal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);


  const [sortField, setSortField] = useState('vendor_name'); 
  const [sortOrder, setSortOrder] = useState('asc'); 

  useEffect(() => {
    setData(invoices.invoices);
    setSearchData(invoices.invoices);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceVal(filterVal);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filterVal]);

  useEffect(() => {
    let filterResult = searchData;

    const searchTerm = debounceVal;
    if (searchTerm !== '') {
      if (filterType === 'vendor_name') {
        filterResult = searchData.filter(item =>
          item.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (filterType === 'invoice_id') {
        filterResult = searchData.filter(item =>
          item.invoice_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (filterType === 'action') {
        filterResult = searchData.filter(item =>
          item.action.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (filterType === 'service_type') {
        filterResult = searchData.filter(item =>
          item.service_type.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        filterResult = searchData.filter(item =>
          item.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.invoice_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.service_type.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    if (sortField === 'vendor_name') {
      filterResult.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.vendor_name > b.vendor_name ? 1 : -1;
        } else {
          return a.vendor_name < b.vendor_name ? 1 : -1;
        }
      });
    }


    const totalItems = filterResult.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedData = filterResult.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    setData(paginatedData);

  }, [debounceVal, filterType, searchData, sortField, sortOrder, currentPage, itemsPerPage]);

  const handleSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField('vendor_name');
    setSortOrder(newSortOrder);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if(currentPage < Math.ceil(searchData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <div>
      <div className="search-filter-container">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Fields</option>
          <option value="vendor_name">Vendor Name</option>
          <option value="invoice_id">Invoice ID</option>
          <option value="action">Action</option>
          <option value="service_type">Service Type</option>
        </select>
        <input
          type="search"
          placeholder="Enter Your Search"
          value={filterVal}
          onInput={(e) => setFilterVal(e.target.value)}
          className="filter-input"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th onClick={handleSort}>
              Vendor Name {sortOrder === 'asc' ? '↑' : '↓'}
            </th>
            <th>Invoice Date</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Service Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.invoice_id}</td>
                <td>{item.vendor_name}</td>
                <td>{item.invoice_date}</td>
                <td>{item.amount}</td>
                <td>{item.due_date}</td>
                <td>{item.service_type}</td>
                <td>{item.action}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(searchData.length / itemsPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default SearchFilter;
