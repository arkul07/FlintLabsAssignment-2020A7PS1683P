import { useState } from "react";
import "./App.css";
// import { Web3 } from "web3";
import Toastify from "toastify-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [count, setCount] = useState(0);

  const mantleAddress = "0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7";
  const lineaAddress = "0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7";
  const kromaAddress = "0x7afb9de72A9A321fA535Bb36b7bF0c987b42b859";

  let chains = [
    {
      name: "Mantle",
      address: "0x3c3a81e81dc49A522A592e7622A7E711c06bf354",
    },
    {
      name: "Linea",
      address: "0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7",
    },
    {
      name: "Kroma",
      address: "0x7afb9de72A9A321fA535Bb36b7bF0c987b42b859",
    },
  ];

  const showToastMessage = () => {
    toast("This is a custom toast Notification!", {
      position: toast.POSITION.BOTTOM_LEFT,
      className: "text-3xl font-bold underline text-center",
    });
  };

  return (
    <div className="text-3xl font-bold underline text-center">
      <button onClick={showToastMessage}>Notify</button>
      <ToastContainer />
    </div>
  );
}

export default App;
