import React, { useState, useEffect } from 'react';
import { PostRequest, GetRequest } from '../utils/request';
import { notifySuccess, notifyError } from '../common/toastify';
import Loader from '../common/loader';
import { validateEmail } from '../utils/formfunction';
import AllCustomers from './allCustomers';



const Addcustomer = () => {
    const validPhoneRegex = /^(?!.*(\d)\1{9})[6-9]\d{9}$/;
    const [disabled, setDisabled] = useState(false);
    const [handleError,] = useState('');
    const [trigger, setTrigger] = useState(false);
    const [error, setError] = useState({
        message: "",
        success: false
    });
    const [membership, setMembership] = useState([]);

    const [formState, setFormState] = useState({
        firstname: "",
        lastname: "",
        contactNumber: "",
        email: "",
        status: "",
        membershipId: ""

    });

    useEffect(() => {
        const fetchMembership = async () => {
            try {
                const response = await GetRequest(`${process.env.REACT_APP_API_URL}memberships`);
                const membership = response?.data?.data
                setMembership(membership);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchMembership();
    }, []);



    const handlePhoneInputChange = (e) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/\D/g, '');
        if (numericValue.length <= 10) {
            setFormState((prevState) => ({ ...prevState, contactNumber: numericValue }));
            setError((prevState) => ({ ...prevState, contactNumber: false, message: '' }));
        }
    };
    const handleChange = (event) => {
        const value = event.target.value;
        console.log("value", value)
        setFormState((prevData) => ({
            ...prevData,
            status: value,
        }));
    };
    const handleMembership = (e) => {

        const { name, value } = e.target;
        console.log("name", name, value)
        if (name === "membership") {
            setFormState((prevData) => ({
                ...prevData,
                membershipId: value
            }
            ));

        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(prevState => ({ ...prevState, message: "" }));
        if (!formState.firstname || !formState.lastname || !formState.email || !formState.contactNumber || !formState.status
             || !formState.membershipId
        ) {
            setError(prevState => ({ ...prevState, success: false, message: "Fields must not be empty!" }));
            setDisabled(false);
        }
        else if (!validateEmail(formState.email)) {
            setError((prevState) => ({
                ...prevState,
                email: true,
                message: "Email is invalid!",
            }));
        }
        else {
            try {
                const response = await PostRequest(`${process.env.REACT_APP_API_URL}customer`, {
                    firstName: formState.firstname,
                    lastName: formState.lastname,
                    email: formState.email,
                    contactNumber: formState.contactNumber,
                    status: formState.status,
                    membershipID: formState.membershipId
                });
                if (response) {
                    setDisabled(false);
                    setFormState({
                        firstname:"",
                        lastname:"",
                        email:"",
                        contactNumber:"",
                        status:"",
                        membershipId:""
                    })
                    notifySuccess("User Add successfully")
                }
                setTrigger(prev => prev + 1);
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'An error occurred';
                console.log("errorMessage", errorMessage)
                notifyError(errorMessage);
            }
        }
    };

    return (
        <>

            <div className="pb-[20px]">
                <div className='mb-[30px]'>
                    <h1 className='text-center uppercase text-xl font-bold pt-5'>Add Customer</h1>
                </div>
                <div className="mx-auto max-w-2xl p-10 bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-lg relative">
                    <div>
                        <div className='mb-[15px]'>
                            {handleError ?
                                <p className={`text-[14px] text-left text-[#FF0000] font-semibold ${handleError ? 'block' : 'hidden '}`}>{handleError}</p>
                                :
                                <p className={`text-[14px] text-left text-[#FF0000] font-semibold  ${error.message ? 'block' : 'hidden '}`}>{error.message}</p>
                            }
                        </div>
                        {disabled && (<Loader />)}
                        <form onSubmit={handleSubmit}>
                            <div className="w-full mb-[15px]">
                                <label className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
                                <input className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none transition"
                                    placeholder="First Name"
                                    name="firstname"
                                    value={formState.firstname}
                                    disabled={disabled}
                                    onChange={(e) => setFormState({ ...formState, firstname: e.target.value })} />

                            </div>
                            <div className="w-full mb-[15px]">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
                                <input className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none transition"
                                    placeholder="Last Name"
                                    name="lastname"
                                    value={formState.lastname}
                                    disabled={disabled}
                                    onChange={(e) => setFormState({ ...formState, lastname: e.target.value })} />
                            </div>
                            <div className="w-full mb-[15px]">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none transition"
                                    placeholder="Email"
                                    name="email"
                                    value={formState.email}
                                    disabled={disabled}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })} />
                            </div>
                            <div className="w-full mb-[15px]">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Contact Number</label>
                                <input className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 outline-none transition"
                                    placeholder="Contact Number"
                                    name="contactNumber"
                                    value={formState.contactNumber}
                                    disabled={disabled}
                                    onChange={handlePhoneInputChange} />
                            </div>
                            <label className='block font-medium text-gray-700 mb-[5px]'>Status</label>
                            <select id="default" className='w-full border border-gray-300 rounded px-2 py-3 focus:outline-none focus:black-600'
                                name="status"
                                value={formState.status}
                                onChange={handleChange}
                            >
                                <option value="Select">Select status</option>
                                <option value="Gold">Gold</option>
                                <option value="Diamond">Diamond</option>
                            </select>
                            <label className='block font-medium text-gray-700 mb-[5px] mt-[15px]'>Select Membership</label>
                            <select id="default" className='w-full border border-gray-300 rounded px-2 py-3 focus:outline-none focus:black-600'
                                onChange={handleMembership}
                                name="membership"
                                value={formState.membershipId}>
                                <option value="Select">Select Membership</option>
                                {membership?.map((item, i) => (
                                    <option key={i} value={item?._id}>{item?.name}</option>
                                ))}
                            </select>
                            <div className="mt-[30px] text-center">
                                <button className="w-full max-w-[150px] mx-auto text-white bg-[#355adc] hover:bg-[#355adc]/[80%] focus:outline-none font-medium rounded-lg px-5 py-3 text-center">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <AllCustomers trigger={trigger} />
            </>

    );
}

export default Addcustomer;
