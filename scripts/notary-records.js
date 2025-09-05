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

const recordsTable = document.getElementById("recordsTable");

async function loadNotarizations() {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(NOTARY_ADDRESS, NOTARY_ABI, signer);
    const nextDocId = await contract.nextDocId();
    const total = Number(nextDocId);

    for (let i = 0; i < total; i++) {
      const [landId, documentURL, validVotes, invalidVotes] =
        await contract.getNotarization(i);

      const row = document.createElement("tr");
      row.classList.add("border-t");

      const voteBtns = `
        <div class="flex gap-2 justify-center">
          <button data-id="${i}" data-valid="true" class="vote-btn bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs">✅ Valid</button>
          <button data-id="${i}" data-valid="false" class="vote-btn bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">❌ Invalid</button>
        </div>
      `;

      row.innerHTML = `
        <td class="p-2 text-center">${i}</td>
        <td class="p-2 text-center">T-${Number(landId)}</td>
        <td class="p-2"><a href="${documentURL}" target="_blank" class="text-blue-600 underline break-all">${documentURL}</a></td>
        <td class="p-2 text-center text-green-600 font-semibold">${Number(
          validVotes
        )}</td>
        <td class="p-2 text-center text-red-600 font-semibold">${Number(
          invalidVotes
        )}</td>
        <td class="p-2 text-center">${voteBtns}</td>
      `;

      recordsTable.appendChild(row);
    }

    attachVoteHandlers(contract);
  } catch (err) {
    console.error("Failed to load notarizations:", err);
  }
}

function attachVoteHandlers(contract) {
  const buttons = document.querySelectorAll(".vote-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const docId = parseInt(btn.getAttribute("data-id"));
      const isValid = btn.getAttribute("data-valid") === "true";

      try {
        btn.textContent = "⏳ Sending...";
        btn.disabled = true;
        const tx = await contract.vote(docId, isValid);
        await tx.wait();
        alert(`✅ Vote recorded! TX: ${tx.hash}`);
        location.reload(); // Refresh the page to show updated votes
      } catch (err) {
        console.error(err);
        if (err.info.error.code == 4001) {
          alert("⚠️ Warning: Transaction cancelled by user.");
        } else {
          alert(`❌ Error: ${err.message}`);
        }
        btn.textContent = isValid ? "✅ Valid" : "❌ Invalid";
        btn.disabled = false;
      }
    });
  });
}

loadNotarizations();
