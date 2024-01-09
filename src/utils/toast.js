import { toast } from "react-toastify";

const options = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

function toastError(message) {
  toast.error(message, options);
}

function toastSucess(message) {
  toast.success(message, options);
}
function toastDefault(message) {
  options.autoClose = 5000
  toast(message, options);
}

export { toastError, toastSucess };
export default toastDefault;
