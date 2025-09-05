const CONTRACT_ADDRESS = "0xd8DFfFF2ce47E6Db7D97C439A3cC990418b0D7E8";

const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "landId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ownerName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "location",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "squareFeet",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "LandListed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "landId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "LandSold",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "landId",
        type: "uint256",
      },
    ],
    name: "buyLand",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllListings",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "landId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "wallet",
            type: "address",
          },
          {
            internalType: "string",
            name: "ownerName",
            type: "string",
          },
          {
            internalType: "string",
            name: "location",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "squareFeet",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isAvailable",
            type: "bool",
          },
        ],
        internalType: "struct LandSelling.Land[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "lands",
    outputs: [
      {
        internalType: "uint256",
        name: "landId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        internalType: "string",
        name: "ownerName",
        type: "string",
      },
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "squareFeet",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isAvailable",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "landId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "ownerName",
        type: "string",
      },
      {
        internalType: "string",
        name: "location",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "squareFeet",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "listLandForSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "listedLandIds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sellForm");
  const listingsTable = document.getElementById("landTable");
  const status = document.getElementById("status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const landIdRaw = document.getElementById("landId").value.trim();
    const match = landIdRaw.match(/^T-(\d+)$/i);
    if (!match) {
      status.textContent =
        "❌ Invalid Land ID format. Use format T-1, T-2, etc.";
      return;
    }

    const landId = parseInt(match[1], 10);
    const ownerName = document.getElementById("ownerName").value.trim();
    const location = document.getElementById("location").value.trim();
    const squareFeet = parseInt(document.getElementById("area").value.trim());
    const price = parseFloat(document.getElementById("price").value.trim());

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      status.textContent = "⏳ Sending transaction...";
      const tx = await contract.listLandForSale(
        landId,
        ownerName,
        location,
        squareFeet,
        ethers.parseEther(price.toString())
      );
      await tx.wait();

      status.innerHTML = `✅ Land listed successfully.<br><code>${tx.hash}</code>`;
      form.reset();
      await loadListings();
    } catch (err) {
      console.error(err);
      // status.textContent = `❌ Error: ${err.message}`;
      if (err.info.error.code == 4001) {
        status.innerHTML = `<span class="text-yellow-600">⚠️ Transaction cancelled by user.</span>`;
      } else {
        status.innerHTML = `<span class="text-red-600">❌ Error:</span> ${err.message}`;
      }
    }
  });

  async function loadListings() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const currentUser = (await signer.getAddress()).toLowerCase();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      const listings = await contract.getAllListings();
      listingsTable.innerHTML = "";

      listings.forEach((land) => {
        const isOwner = land.wallet.toLowerCase() === currentUser;
        const isAvailable = land.isAvailable;
        const priceEther = ethers.formatEther(land.price);

        const row = document.createElement("tr");
        row.classList.add("border-b");

        const buyButtonHTML =
          isAvailable && !isOwner
            ? `<button 
              class="buy-btn bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              data-id="${land.landId}"
              data-price="${land.price}"
            >
              🛒 Buy
            </button>`
            : `<button 
              class="bg-gray-300 text-gray-600 px-3 py-1 rounded text-sm cursor-not-allowed" disabled
            >
              ${!isAvailable ? "Sold" : "Owner"}
            </button>`;

        row.innerHTML = `
          <td class="p-2 font-mono">T-${land.landId}</td>
          <td class="p-2">${land.ownerName}</td>
          <td class="p-2">${land.location}</td>
          <td class="p-2">${land.squareFeet} sqft</td>
          <td class="p-2">${priceEther} VIC</td>
          <td class="p-2 text-xs font-mono text-blue-600">${land.wallet}</td>
          <td class="p-2 text-xs font-mono">${isAvailable ? "✅" : "❌"}</td>
          <td class="p-2">${buyButtonHTML}</td>
        `;

        listingsTable.appendChild(row);
      });

      document.querySelectorAll(".buy-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const landId = btn.getAttribute("data-id");
          const price = btn.getAttribute("data-price");

          try {
            status.textContent = `⏳ Buying land T-${landId}...`;
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
              CONTRACT_ADDRESS,
              CONTRACT_ABI,
              signer
            );

            const tx = await contract.buyLand(landId, {
              value: price,
            });

            await tx.wait();
            status.innerHTML = `✅ Purchase successful!<br><code>${tx.hash}</code>`;
            await loadListings();
            window.location.reload();
          } catch (err) {
            console.error(err);
            // status.textContent = `❌ Buy failed: ${err.message}`;
            if (err.info.error.code == 4001) {
              status.innerHTML = `<span class="text-yellow-600">⚠️ Transaction cancelled by user.</span>`;
            } else {
              status.innerHTML = `<span class="text-red-600">❌ Error:</span> ${err.message}`;
            }
          }
        });
      });
    } catch (err) {
      console.error("Failed to load listings:", err);
      status.textContent = `❌ Could not load listings.`;
    }
  }

  loadListings();
});
