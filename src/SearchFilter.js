import { useEffect, useState } from "react";
import invoices from "./data/invoices.json";

function SearchFilter() {
  const [data, setData] = useState([]);
  const [filterVal, setFilterVal] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [searchData, setSearchData] = useState([]);
  const [debounceVal, setDebounceVal] = useState('');

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
    const searchTerm = debounceVal;

    if (searchTerm === '') {
      setData(searchData); 
    } else {
      let filterResult;

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

    
      if (filterResult.length > 0) {
        setData(filterResult);
      } else {
        setData([]);
      }
    }
  }, [debounceVal, filterType, searchData]); 

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
            <th>Vendor Name</th>
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
    </div>
  );
}

export default SearchFilter;
