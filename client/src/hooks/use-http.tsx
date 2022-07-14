import { httpConfig } from '../types/http-config';
import moonactive from "../api/moonactive";
import { toast } from 'react-toastify';
import { useState } from "react";

const useHttp = ({ url, method, data, onSuccess }: httpConfig) => {
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    try {
      setLoading(true);

      const response = await moonactive.request({ method, url, data });

      if (onSuccess) {
        onSuccess(response.data.results);
      }

      // TODO : Add err type  
    } catch (e: any) {
      toast.error((
        <div>{
          e.response.data.messages.map((err: any) => (
            <li className="p-1" key={err}>{err}</li>
          ))}
        </div>
      ), {
        position: toast.POSITION.TOP_LEFT
      });
    }

    setLoading(false);
  }

  return { sendRequest, loading };
}

export default useHttp;