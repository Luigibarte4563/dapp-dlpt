const CONTRACT_ADDRESS = "0xa159EE999BC713f6538D3B6Bcb012A54933125Bb";

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
        name: "lessee",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalPaid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "leaseDurationMonths",
        type: "uint256",
      },
    ],
    name: "LandLeased",
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
        name: "monthlyRate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "leaseDurationMonths",
        type: "uint256",
      },
    ],
    name: "LandListedForLease",
    type: "event",
  },
  {
    inputs: [],
    name: "getAllLeases",
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
            name: "monthlyRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "leaseDurationMonths",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isAvailable",
            type: "bool",
          },
        ],
        internalType: "struct LandLending.Lease[]",
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
        name: "landId",
        type: "uint256",
      },
    ],
    name: "leaseLand",
    outputs: [],
    stateMutability: "payable",
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
    name: "leases",
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
        name: "monthlyRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "leaseDurationMonths",
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
        name: "monthlyRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "leaseDurationMonths",
        type: "uint256",
      },
    ],
    name: "listLandForLease",
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
    name: "listedLeaseIds",
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
  const form = document.getElementById("leaseForm");
  const tableBody = document.getElementById("leaseTable");
  const status = document.getElementById("status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";

    const landIdRaw = document.getElementById("landId").value.trim();
    const match = landIdRaw.match(/^T-(\d+)$/i);
    if (!match) return (status.textContent = "❌ Use format T-1, T-2, etc.");

    const landId = parseInt(match[1], 10);
    const ownerName = document.getElementById("ownerName").value.trim();
    const location = document.getElementById("location").value.trim();
    const squareFeet = parseInt(document.getElementById("area").value.trim());
    const price = parseFloat(document.getElementById("price").value.trim());
    const months = parseInt(document.getElementById("duration").value.trim());

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      status.textContent = "⏳ Sending transaction...";
      const tx = await contract.listLandForLease(
        landId,
        ownerName,
        location,
        squareFeet,
        ethers.parseEther(price.toString()),
        months
      );

      await tx.wait();
      status.innerHTML = `✅ Listed for lease! <code>${tx.hash}</code>`;
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

      const leases = await contract.getAllLeases();
      tableBody.innerHTML = "";

      leases.forEach((land) => {
        const isOwner = land.wallet.toLowerCase() === currentUser;
        const isAvailable = land.isAvailable;
        const leasePriceEther = ethers.formatEther(land.monthlyRate);

        const leaseButtonHTML =
          isAvailable && !isOwner
            ? `<button
                class="lease-btn bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                data-id="${land.landId}"
                data-price="${land.monthlyRate}"
                data-duration="${land.leaseDurationMonths}"
              >
                📄 Lease
              </button>`
            : `<button
                class="bg-gray-300 text-gray-600 px-3 py-1 rounded text-sm cursor-not-allowed"
                disabled
              >
                ${!isAvailable ? "Leased" : "Owner"}
              </button>`;

        const row = document.createElement("tr");
        row.classList.add("border-b");

        row.innerHTML = `
          <td class="p-2 font-mono">T-${land.landId}</td>
          <td class="p-2">${land.ownerName}</td>
          <td class="p-2">${land.location}</td>
          <td class="p-2">${land.squareFeet} sqft</td>
          <td class="p-2">${leasePriceEther} VIC</td>
          <td class="p-2">${land.leaseDurationMonths} mo</td>
          <td class="p-2 text-xs font-mono text-blue-600">${land.wallet}</td>
          <td class="p-2">${isAvailable ? "✅" : "❌"}</td>
          <td class="p-2">${leaseButtonHTML}</td>
        `;

        tableBody.appendChild(row);
      });

      document.querySelectorAll(".lease-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const landId = btn.getAttribute("data-id");
          const price = BigInt(btn.getAttribute("data-price"));
          const duration = BigInt(btn.getAttribute("data-duration"));
          const totalCost = price * duration;

          try {
            status.textContent = `⏳ Leasing land T-${landId}...`;
            const tx = await contract.leaseLand(landId, { value: totalCost });
            await tx.wait();
            status.innerHTML = `✅ Lease confirmed! <code>${tx.hash}</code>`;
            await loadListings();
          } catch (err) {
            console.error(err);
            // status.textContent = `❌ Lease failed: ${err.message}`;
            if (err.info.error.code == 4001) {
              status.innerHTML = `<span class="text-yellow-600">⚠️ Transaction cancelled by user.</span>`;
            } else {
              status.innerHTML = `<span class="text-red-600">❌ Error:</span> ${err.message}`;
            }
          }
        });
      });
    } catch (err) {
      console.error(err);
      status.textContent = `❌ Failed to load listings: ${err.message}`;
    }
  }

  loadListings();
});
