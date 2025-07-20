import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_SERVER_URL, {
      auth: { token: localStorage.getItem('token') },
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return socketRef.current;
};