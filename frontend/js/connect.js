const connectButton = document.getElementById("connectButton");
const connectHero = document.getElementById("connectHero");

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask not found! Please install it to continue.");
    return;
  }

  try {
    // Ask MetaMask to connect
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Use ethers.js provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();

    console.log("Wallet Connected:", walletAddress);

    // Update UI
    connectButton.textContent = `✅ Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    connectButton.disabled = true;

    if (connectHero) {
      connectHero.textContent = "✅ Wallet Connected";
      connectHero.disabled = true;
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
  }
}

// Add event listeners
connectButton.addEventListener("click", connectWallet);
if (connectHero) connectHero.addEventListener("click", connectWallet);
