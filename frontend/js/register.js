import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.6.0/dist/ethers.min.js";

// DOM elements
const verifyButton = document.getElementById("verifyButton");
const landNumberInput = document.getElementById("landNumber");
const statusMessage = document.getElementById("statusMessage");
const landDetails = document.getElementById("landDetails");
const registerButton = document.getElementById("registerButton");
const ownerNameEl = document.getElementById("ownerName");
const landAreaEl = document.getElementById("landArea");
const landLocationEl = document.getElementById("landLocation");

let provider, signer, contract;

// Replace with your actual deployed contract details
const contractAddress = "0xYourContractAddressHere";
const contractABI = [
  // Your contract ABI here
];

// ✅ 1. Connect Wallet
window.connectWallet = async function () {
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const account = await signer.getAddress();
    document.getElementById("connectButton").textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
    contract = new ethers.Contract(contractAddress, contractABI, signer);
  } else {
    alert("Please install MetaMask!");
  }
};

// ✅ 2. Verify Land (Mocked Backend)
verifyButton.addEventListener("click", async () => {
  const landNumber = landNumberInput.value.trim();
  if (!landNumber) {
    statusMessage.textContent = "Please enter a valid 7/12 number.";
    statusMessage.classList.add("text-danger");
    return;
  }

  statusMessage.textContent = "Verifying, please wait...";
  statusMessage.classList.remove("text-danger");
  statusMessage.classList.add("text-warning");

  // Mock backend API (replace with your PHP MySQL API later)
  // Example: const response = await fetch(`http://localhost/smartland/php/verify.php?number=${landNumber}`);
  // const data = await response.json();

  // Simulated success verification
  setTimeout(() => {
    const mockData = {
      owner: "Rahul Patil",
      area: "1200 sq.ft",
      location: "Thane, Maharashtra",
      valid: true
    };

    if (mockData.valid) {
      ownerNameEl.textContent = mockData.owner;
      landAreaEl.textContent = mockData.area;
      landLocationEl.textContent = mockData.location;
      landDetails.style.display = "block";

      registerButton.disabled = false;
      statusMessage.textContent = "Verification successful ✅";
      statusMessage.classList.remove("text-warning", "text-danger");
      statusMessage.classList.add("text-success");
    } else {
      statusMessage.textContent = "7/12 number not found or already registered.";
      statusMessage.classList.add("text-danger");
      landDetails.style.display = "none";
    }
  }, 1500);
});

// ✅ 3. Register on Blockchain
registerButton.addEventListener("click", async () => {
  try {
    if (!contract) {
      alert("Please connect your wallet first!");
      return;
    }

    statusMessage.textContent = "Processing blockchain transaction...";
    registerButton.disabled = true;

    // Example smart contract call (you'll replace with your real function)
    const tx = await contract.registerLand(
      landNumberInput.value,
      ownerNameEl.textContent,
      landAreaEl.textContent,
      landLocationEl.textContent
    );

    await tx.wait();
    statusMessage.textContent = "Land registered successfully on blockchain ✅";
    statusMessage.classList.add("text-success");
  } catch (err) {
    console.error(err);
    statusMessage.textContent = "Transaction failed. Check console for details.";
    statusMessage.classList.add("text-danger");
  }
});

// ✅ Display connected wallet from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const walletAddress = localStorage.getItem("connectedWallet");
  const walletDisplay = document.getElementById("walletAddress");

  if (!walletAddress) {
    // If no wallet found, redirect back to homepage
    alert("Please connect your wallet first!");
    window.location.href = "index.html";
  } else {
    // Show wallet address in navbar
    walletDisplay.textContent =
      "Connected: " + walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);
  }
});

document.getElementById("disconnectWallet")?.addEventListener("click", () => {
  localStorage.removeItem("connectedWallet");
  window.location.href = "index.html";
});

