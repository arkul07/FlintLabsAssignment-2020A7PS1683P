import { useState, useEffect } from "react";
import "./App.css";
// import { Web3 } from "web3";
import Toastify from "toastify-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Web3 from "web3";
import { ethers, JsonRpcProvider, formatEther } from "ethers";
import env from "react-dotenv";

function App() {
  const nodeEndpoint = `https://mainnet.infura.io/v3/d9687556bb264857b68824d213341b90`;
  const web3 = new Web3(new Web3.providers.HttpProvider(nodeEndpoint));

  //Store all tokens
  const [tokens, setTokens] = useState([
    {
      name: "Mantle",
      address: "0x3c3a81e81dc49A522A592e7622A7E711c06bf354",
      contractAddress: "0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7",
      balance: [1],
    },
    {
      name: "Linea",
      address: "0x860B90550902248213d841d8D14F05ad489A100F",
      contractAddress: "0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7",
      balance: [0],
    },
    {
      name: "Kroma",
      address: "0x91a1b0247df9B803Dcfa820522711E456909Ac80",
      contractAddress: "0x7afb9de72A9A321fA535Bb36b7bF0c987b42b859",
      balance: [0],
    },
  ]);

  //Add token
  function addToken(token) {
    setTokens((prevTokens) => [
      ...prevTokens,
      {
        name: token.name,
        address: token.address,
        contractAddress: token.contractAddress,
      },
    ]);
  }

  //Store all the balances every 12 hours in an array. The previous balance will be the last element of the array
  //Compare current Balance with the previous balance to decide whether the alert should be sent or not

  //ABI
  const erc20ABI = [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_spender",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_from",
          type: "address",
        },
        {
          name: "_to",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [
        {
          name: "",
          type: "uint8",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "balance",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_to",
          type: "address",
        },
        {
          name: "_value",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
        {
          name: "_spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      payable: true,
      stateMutability: "payable",
      type: "fallback",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
  ];

  async function getTokenBalance(token) {
    try {
      const tokenContract = new web3.eth.Contract(erc20ABI, token.address);
      const balance = await tokenContract.methods
        .balanceOf(token.contractAddress)
        .call();
      console.log(balance);
      if (balance - balance[balance.length - 1] > 0.1 * balance) {
        showToastMessage(); //show notification
      }
      token.balance.push(balance);
      console.log("Token Balance:", balance);
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  }

  function getTokensBalance() {
    tokens.map((token) => {
      getTokenBalance(token);
    });
  }

  useEffect(() => {
    getTokensBalance();
    let sec = 12 * 3600 * 1000;
    const intervalId = setInterval(getTokensBalance, sec);
    return () => clearInterval(intervalId);
  }, []);

  //Call every 12 hours

  const showToastMessage = () => {
    toast("Balance reduced by 10%!", {
      position: toast.POSITION.TOP_RIGHT,
      className: "text-3xl font-bold text-center",
    });
  };

  return (
    <div className="container mx-auto p-8 overflow-scroll">
      {/* <button onClick={showToastMessage}>Notify</button> */}
      {tokens.map((token) => {
        return (
          <div className="m-10 bg-gray-100 p-4 rounded-md shadow-md mb-4">
            <div className="text-xl font-semibold mb-2">
              Token Name: {token.name}
            </div>
            <div className="font-bold overflow-scroll">
              Token Address:{token.address}
            </div>
            <div className="font-bold overflow-scroll">
              Contract Address: {token.contractAddress}
            </div>
            <div className="font-bold">
              Token Balance: {token.balance[token.balance.length - 1]}
            </div>
            <br />
          </div>
        );
      })}
      <ToastContainer />
    </div>
  );
}

export default App;
