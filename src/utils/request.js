import axios from "axios";

export const PostRequest = async (url, data) => {
   try {
    const response = await axios.post(url, data);
    return response;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const GetRequest = async (url) => {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.log(error);
  }
};


export const PutRequest = async (url,data) => {
  try {
    const response = await axios.put(url, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};


export const DeleteRequest = async (url,data) => {
  try {
    const response = await axios.delete(url, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
