import { httpConfig } from '../types/http-config';
import moonactive from "../api/moonactive";
import { useState } from "react";

const useHttp = ({ url, method, data, onSuccess }: httpConfig) => {
  const [errors, setErrors] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    try {
      setLoading(true);
      setErrors(null);

      const response = await moonactive.request({ method, url, data });

      if (onSuccess) {
        onSuccess(response.data.results);
      }

      // TODO : Add err type  
    } catch (err: any) {
      setErrors(
        <div role='alert'>
          <strong>Ho snap!</strong>
          <p>
            {err.response.data.errors.map((err: any) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </p>
          <strong>TRY AGIAN</strong>
        </div>
      );
    }

    setLoading(false);
  }

  return { sendRequest, errors, loading };
}

export default useHttp;