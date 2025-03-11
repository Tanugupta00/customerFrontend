import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { GetRequest, DeleteRequest } from "../utils/request";
import EditCustomer from "./editCustomer";
import { notifySuccess, notifyError } from "../common/toastify";

const AllCustomers = ({ trigger }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await GetRequest(`${process.env.REACT_APP_API_URL}customers`);
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [trigger]);

  const handleDelete = async () => {
    try {
      await DeleteRequest(`${process.env.REACT_APP_API_URL}deleteCustomer/${deleteCustomerId}`);
      notifySuccess("Customer Deleted Successfully");
      setOpenDeleteModal(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  return (
    <div className="w-full pr-40 pl-40 pt-5 bg-white shadow-md rounded-lg pb-10">
      {data.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No results found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2">First Name</th>
                <th className="border p-2">Last Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Contact Number</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Membership</th>
                <th className="border p-2">Edit</th>
                <th className="border p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer, index) => (
                <tr key={customer._id} className="border-b text-center">
                  <td className="border p-2">{page * rowsPerPage + index + 1}</td>
                  <td className="border p-2">{customer?.firstName}</td>
                  <td className="border p-2">{customer?.lastName}</td>
                  <td className="border p-2 w-40">{customer?.email}</td>
                  <td className="border p-2 w-40">{customer?.contactNumber}</td>
                  <td className="border p-2 w-40">{customer?.status}</td>
                  <td className="border p-2 w-40">{customer?.membershipID?.name}</td>
                  <td className="border p-2">
                    <button onClick={() => { setSelectedCustomer(customer); setOpenEdit(true); }} className="text-green-500 hover:text-green-700 pl-8">
                      Edit
                    </button>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => { setDeleteCustomerId(customer._id); setOpenDeleteModal(true); }} className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(data.length / rowsPerPage)}
          onPageChange={handlePageClick}
          containerClassName="flex gap-2"
          pageClassName="px-3 py-1 border rounded cursor-pointer"
          activeClassName="bg-blue-500 text-white"
          previousClassName="px-4 py-2 border rounded cursor-pointer bg-gray-200 hover:bg-gray-300"
          nextClassName="px-4 py-2 border rounded cursor-pointer bg-gray-200 hover:bg-gray-300"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>

      {openEdit && <EditCustomer open={openEdit} handleClose={() => setOpenEdit(false)} customer={selectedCustomer} refreshCustomers={fetchData} />}

      {openDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this customer?</h2>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setOpenDeleteModal(false)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCustomers;
