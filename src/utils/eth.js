import Web3 from "web3";
import { toastError, toastSucess } from "./toast";

const sendEth = (val, recipientAddress) => {
  // Check if MetaMask is installed
  return new Promise((res, rej) => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);

      // Request account access if needed
      window.ethereum
        .enable()
        .then(function (accounts) {
          const account = accounts[0]; // Assuming the first account is used

          // Convert Ether amount to Wei (2.56 Ether in Wei)
          const amountToSend = web3.utils.toWei(val, "ether");

          // Send Ether
          web3.eth
            .sendTransaction({
              from: account,
              to: recipientAddress,
              value: amountToSend,
            })
            .on("transactionHash", function (hash) {
              console.log("Transaction Hash:", hash); // Transaction hash
              toastSucess(`${val} ETH sent sucessfully!`)
              res(hash);
            })
            .on("error", function (error) {
              console.error("Error:", error); // Log any errors
              toastError(error);
              rej(error);
            });
        })
        .catch(function (error) {
          console.error("Error:", error); // Handle errors with MetaMask activation
          toastError(error);
          rej(error);
        });
    } else {
      toastError("MetaMask is not installed");
      console.error("MetaMask is not installed"); // MetaMask not detected
      rej("MetaMask is not installed");
    }
  });
};

export  { sendEth };
