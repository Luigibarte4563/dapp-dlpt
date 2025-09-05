const NOTARY_ADDRESS = "0x06F68963Bbd7A9564442E8Ba2ee26f38fdD1F3C2";

const NOTARY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "docId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "landId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "documentURL",
        type: "string",
      },
    ],
    name: "DocumentNotarized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "docId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isValid",
        type: "bool",
      },
    ],
    name: "Voted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "docId",
        type: "uint256",
      },
    ],
    name: "getNotarization",
    outputs: [
      {
        internalType: "uint256",
        name: "landId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "documentURL",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "validVotes",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "invalidVotes",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextDocId",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "landId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "documentURL",
        type: "string",
      },
    ],
    name: "notarize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "docId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isValid",
        type: "bool",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const form = document.getElementById("notarizeForm");
const status = document.getElementById("status");
const tableBody = document.getElementById("recordsTable");

// 📝 Form Submission Handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const rawLandId = document.getElementById("landId").value.trim();
  const url = document.getElementById("documentURL").value.trim();

  const match = rawLandId.match(/^T-(\d+)$/i);
  if (!match) {
    status.textContent = "❌ Invalid Land ID format. Use format T-1, T-2, etc.";
    return;
  }

  const landId = parseInt(match[1], 10);

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(NOTARY_ADDRESS, NOTARY_ABI, signer);

    status.textContent = "⏳ Sending transaction...";
    const tx = await contract.notarize(landId, url);
    await tx.wait();

    status.innerHTML = `✅ Notarization added.<br><code class="text-blue-600 break-all">${tx.hash}</code>`;
    form.reset();
    await loadNotarizations();
  } catch (err) {
    console.error(err);
    if (err.info.error.code == 4001) {
      status.innerHTML = `<span class="text-yellow-600">⚠️ Transaction cancelled by user.</span>`;
    } else {
      status.innerHTML = `<span class="text-red-600">❌ Error:</span> ${err.message}`;
    }
  }
});

// 📄 Load All Notarizations
async function loadNotarizations() {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(NOTARY_ADDRESS, NOTARY_ABI, provider);
    const total = await contract.nextDocId();

    tableBody.innerHTML = "";

    for (let i = Number(total) - 1; i >= 0; i--) {
      const [landId, documentURL, validVotes, invalidVotes] =
        await contract.getNotarization(i);

      const row = document.createElement("tr");
      row.className = "border-t";

      row.innerHTML = `
        <td class="p-2 text-center">${i}</td>
        <td class="p-2 text-center">T-${landId}</td>
        <td class="p-2 text-blue-600 underline break-all">
          <a href="${documentURL}" target="_blank">${documentURL}</a>
        </td>
        <td class="p-2 text-center">${validVotes}</td>
        <td class="p-2 text-center">${invalidVotes}</td>
      `;

      tableBody.appendChild(row);
    }
  } catch (err) {
    console.error("❌ Failed to load notarizations:", err);
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-red-600">Error loading records</td></tr>`;
  }
}

// 🔁 Load on Page Load
window.addEventListener("DOMContentLoaded", loadNotarizations);
