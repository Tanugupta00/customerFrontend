
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (message) => {
    toast.success(message);
};

export const notifyError = (message) => {
    toast.error(message);
};

const Toastify = () => {
    return (
        <>
            <ToastContainer />
        </>
    );
};

export default Toastify;

