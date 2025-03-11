import React, { useState, useEffect } from "react";
import { PutRequest, GetRequest } from "../utils/request";
import { notifySuccess, notifyError } from '../common/toastify';

const EditCustomer = ({ open, handleClose, customer, refreshCustomers }) => {
  const [memberships, setMemberships] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    status: "",
    membershipID: ""
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer?._id || "",
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        contactNumber: customer.contactNumber || "",
        status: customer.status || "",
        membershipID: customer?.membershipID?._id || ""
      });
    }
  }, [customer]);

  const fetchMemberships = async () => {
    try {
      const response = await GetRequest(`${process.env.REACT_APP_API_URL}memberships`);
      setMemberships(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching memberships:", error);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMembershipChange = (e) => {
    setFormData({ ...formData, membershipID: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await PutRequest(`${process.env.REACT_APP_API_URL}editCustomer/${formData.id}`, formData);
      if (response) {
        notifySuccess("Customer updated successfully")
      }
      refreshCustomers();
      handleClose();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-200">
        <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="">Select Status</option>
            <option value="Gold">Gold</option>
            <option value="Diamond">Diamond</option>
          </select>

          <select
            name="membershipID"
            value={formData.membershipID}
            onChange={handleMembershipChange}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="">Select Membership</option>
            {memberships.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-500 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;
