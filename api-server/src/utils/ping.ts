import axios from "axios";

export const pingExternalServer = async () => {
    try {

      const response = await axios.get("https://ping.zaplaunch.tech");
      console.log('Keep-alive ping sent to external server. Response status:', response.status);
    } catch (error:any) {
      // console.error('Error sending keep-alive ping to external server:', error.message);
    }
  };
  