// ✅ connect.js
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask to continue!");
    return;
  }

  try {
    // Request wallet connection
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const walletAddress = accounts[0];

    // Save wallet address in localStorage (used in register.html)
    localStorage.setItem("connectedWallet", walletAddress);

    // Update button text immediately
    document.getElementById("connectButton").textContent =
      walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4);

    // Redirect to registration page
    window.location.href = "register.html";
  } catch (error) {
    console.error("Connection failed:", error);
    alert("Failed to connect wallet.");
  }
}

// Bind both buttons (in navbar & hero section)
const connectButton = document.getElementById("connectButton");
const connectHero = document.getElementById("connectHero");

if (connectButton) connectButton.addEventListener("click", connectWallet);
if (connectHero) connectHero.addEventListener("click", connectWallet);
