
import { toast } from 'react-toastify';

const toastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
};

const notify = {
  success: (message) => toast.success(message, toastOptions),
  error: (message) => toast.error(message, toastOptions),
  info: (message) => toast.info(message, toastOptions),
  warn: (message) => toast.warn(message, toastOptions),
};

export default notify;
