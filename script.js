function toggleText() {
  const textElement = document.getElementById("atxText");
  const btnElement = document.getElementById("toggleBtn");

  // Check if currently expanded or collapsed
  if (textElement.classList.contains("expanded")) {
    // Switch to Collapsed
    textElement.classList.remove("expanded");
    textElement.classList.add("collapsed");
    btnElement.innerText = "Read More";
  } else {
    // Switch to Expanded
    textElement.classList.remove("collapsed");
    textElement.classList.add("expanded");
    btnElement.innerText = "Read Less";
  }
}
// -------------------------------------
// -------------------------------------
// -------------------------------------
// -------------------------------------
// -------------------------------------
// -------------------------------------
// fetch("adminData.txt")
//   .then((response) => response.text())
//   .then((text) => {
//     const container = document.getElementById("admin-container");

//     // 2. Split text into lines (each line is one admin)
//     const lines = text.split("\n");

//     lines.forEach((line) => {
//       // Ignore empty lines
//       if (line.trim().length === 0) return;

//       // 3. Split the line by comma to get Name and Role
//       // "Zeus, Server Owner" -> ["Zeus", "Server Owner"]
//       const parts = line.split(",");

//       // Safety check: ensure we have both parts
//       if (parts.length < 2) return;

//       const name = parts[0].trim();
//       const role = parts[1].trim();

//       // 4. Generate the Avatar (using UI Avatars service based on name)
//       const avatarUrl = `https://ui-avatars.com/api/?name=${name}&background=2a1b02&color=FCF6BA`;

//       // 5. Create the HTML for the card
//       const cardHTML = `
//                         <div class="admin-card">
//                             <img src="${avatarUrl}" alt="${name}" class="admin-avatar">
//                             <h3 class="admin-name">${name}</h3>
//                             <span class="admin-role">${role}</span>
//                         </div>
//                     `;

//       // 6. Add it to the container
//       container.innerHTML += cardHTML;
//     });
//   })
//   .catch((error) => {
//     console.error("Error loading admins:", error);
//     document.getElementById("admin-container").innerHTML =
//       '<p style="color:white;">Error: Could not load admins.txt. Make sure you are running a local server.</p>';
//   });
fetch("adminData.txt")
  .then((response) => response.text())
  .then((text) => {
    const container = document.getElementById("admin-container");
    const lines = text.split("\n");

    lines.forEach((line) => {
      // Ignore empty lines
      if (line.trim().length === 0) return;

      // Split by comma
      const parts = line.split(",");

      // Safety check: ensure we have at least Name and Role
      if (parts.length < 2) return;

      const name = parts[0].trim();
      const role = parts[1].trim();

      // --- NEW LOGIC STARTS HERE ---

      // 1. Define the default fallback (UI Avatars)
      let avatarUrl = `https://ui-avatars.com/api/?name=${name}&background=2a1b02&color=FCF6BA`;

      // 2. Check if a 3rd part (Image Path) exists and is not empty
      if (parts.length >= 3) {
        const customImage = parts[2].trim();
        if (customImage !== "") {
          avatarUrl = customImage;
        }
      }

      // --- NEW LOGIC ENDS HERE ---

      const cardHTML = `
            <div class="admin-card">
                <img src="${avatarUrl}" alt="${name}" class="admin-avatar">
                <h3 class="admin-name">${name}</h3>
                <span class="admin-role">${role}</span>
            </div>
        `;

      container.innerHTML += cardHTML; // Note: For better performance, consider building a long string and setting innerHTML once at the end, but this works fine for small lists.
    });
  })
  .catch((error) => {
    console.error("Error loading admins:", error);
    document.getElementById("admin-container").innerHTML =
      '<p style="color:white;">Error loading data.</p>';
  });
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------
fetch("winners.txt")
  .then((response) => response.text())
  .then((text) => {
    const container = document.getElementById("winners-container");
    const lines = text.split("\n");

    lines.forEach((line) => {
      if (line.trim().length === 0) return;
      const parts = line.split(",");
      if (parts.length >= 2) {
        const player = parts[0].trim();
        const game = parts[1].trim();

        const cardHTML = `
                            <div class="winner-card">
                                <div class="card-inner">
                                    <div class="fa-solid fa-trophy trophy-icon">🏆</div>
                                    <div class="text-content">
                                        <div class="winner-name">${player}</div>
                                        <div class="game-name">${game}</div>
                                    </div>
                                </div>
                            </div>
                        `;
        container.innerHTML += cardHTML;
      }
    });
  })
  .catch((err) => console.error(err));
// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------
// ----------------------------------------------
const track = document.getElementById("track");
const slides = document.querySelectorAll(".testimonial-slide");
const progressBar = document.getElementById("progress");

let currentIndex = 0;
const totalSlides = slides.length;
const slideInterval = 7000; // 7 Seconds per slide

// Initialize first slide as active
slides[0].classList.add("active");
runProgressBar();

function moveCarousel() {
  // 1. Remove active class from current
  slides[currentIndex].classList.remove("active");

  // 2. Calculate next index
  currentIndex++;

  // 3. Loop back to start if at end
  if (currentIndex >= totalSlides) {
    currentIndex = 0;
  }

  // 4. Add active class to new slide (triggers the fade-in/scale-up)
  slides[currentIndex].classList.add("active");

  // 5. Move the track
  // We move left by (Index * 100%)
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  // 6. Reset Progress Bar
  runProgressBar();
}

function runProgressBar() {
  // Reset to 0
  progressBar.style.transition = "none";
  progressBar.style.width = "0%";

  // Force a browser reflow (hack to allow animation restart)
  void progressBar.offsetWidth;

  // Animate to 100% over the duration of the interval
  progressBar.style.transition = `width ${slideInterval}ms linear`;
  progressBar.style.width = "100%";
}

// Start the Loop
setInterval(moveCarousel, slideInterval);
//
// ------------------------------------------------
// ------------------------------------------------
// ------------------------------------------------
//
// --- 1. CONFIGURATION (Add new seasons here!) ---
const seasonFiles = {
  s1: "auctionXPL1.txt",
  s2: "auctionXPL2.txt",
  s3: "auctionXPL3.txt",
  // Future: 's4': 'auctionXPL4.txt'
};

// --- 2. STATE VARIABLES ---
const rowsPerPage = 10;
let currentPage = 1;
let allRows = [];
let totalPages = 0;

// --- 3. MAIN FUNCTION TO LOAD DATA ---
function loadSelectedSeason() {
  // Get the selected value from dropdown
  const seasonKey = document.getElementById("seasonSelect").value;
  const fileName = seasonFiles[seasonKey];

  // Reset pagination
  currentPage = 1;
  document.getElementById("tableBody").innerHTML =
    '<tr><td colspan="3">Loading...</td></tr>';

  // Fetch the file
  fetch(fileName)
    .then((response) => {
      if (!response.ok) throw new Error("File not found: " + fileName);
      return response.text();
    })
    .then((textData) => {
      parseData(textData);
      renderTable();
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("tableBody").innerHTML =
        `<tr><td colspan="3" style="color:red; text-align:center; font-weight:bold;">
                            Error loading ${fileName}.<br>
                            Make sure you are running this on a Local Server (Live Server).
                        </td></tr>`;
    });
}

// --- 4. PARSER ---
function parseData(text) {
  allRows = text
    .trim()
    .split("\n")
    .map((line) => {
      const parts = line.split(",");
      if (parts.length < 3) return null;
      return {
        name: parts[0].trim(),
        team: parts[1].trim(),
        coins: parts[2].trim(),
      };
    })
    .filter((item) => item !== null);

  totalPages = Math.ceil(allRows.length / rowsPerPage);
}

// --- 5. RENDER TABLE ---
function renderTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  if (allRows.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3">No data available for this season.</td></tr>';
    document.getElementById("pageInfo").innerText = "";
    document.getElementById("prevBtn").disabled = true;
    document.getElementById("nextBtn").disabled = true;
    return;
  }

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = allRows.slice(start, end);

  pageData.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
                    <td>${row.name}</td>
                    <td>${row.team}</td>
                    <td>${row.coins}</td>
                `;
    tbody.appendChild(tr);
  });

  // Update UI
  document.getElementById("pageInfo").innerText =
    `${currentPage}/${totalPages}`;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

// --- 6. PAGINATION CONTROL ---
function changePage(direction) {
  currentPage += direction;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  renderTable();
}

// --- INITIAL LOAD ---
// Automatically load the default selected option
loadSelectedSeason();
// -----------------------------
// -----------------------------
// -----------------------------

// --- 1. DATA CONFIGURATION ---
// EDIT THE NAMES BELOW
const seasonData = {
  s1: [
    { team: "AFK ALL DAY", owner: "Demons_In_Me" },
    { team: "BLUENICORNS", owner: "Aksha_666" },
    { team: "GREEN FURY", owner: "2busy4youu" },
    { team: "HAZEE", owner: "Foxfy" },
    { team: "INFERNO ARMY", owner: "Accelerate" },
    { team: "MAGIC", owner: "Unluck" },
    // Add more lines as needed
  ],
  s2: [
    { team: "CLAWPOCALYPSE", owner: "Asby" },
    { team: "GREEN FURY", owner: "2busy4youu" },
    { team: "GGWP", owner: "Demons_In_Me" },
    { team: "INFERNO ARMY", owner: "Accelerate" },
    { team: "NIGHT OWLS", owner: "Nur" },
    { team: "WATCH AND LEARN", owner: "meduuu" },
    // Add more lines as needed
  ],
};

// --- 2. RENDER FUNCTION ---
function showSeason(seasonKey) {
  const grid = document.getElementById("teams-grid");
  const data = seasonData[seasonKey];

  // Clear current cards
  grid.innerHTML = "";

  // Update Buttons (Visual only)
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active"); // 'event' works because of the onclick

  // Generate Cards
  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
                <h3 class="team-name">${item.team}</h3>
                <span class="owner-label">Owned By</span>
                <div class="owner-name"><span class="crown">👑</span>${item.owner}</div>
            `;
    grid.appendChild(card);
  });
}

// --- 3. INITIAL LOAD ---
// Load Season 2 by default.
// We simulate a click on the first button to set the class correctly.
document.querySelector(".tab-btn.active").click();
// Or just call: showSeason('s2');
//
// ---------------------------------------
// ---------------------------------------
// ---------------------------------------
fetch("plusminusWinners.txt")
  .then((response) => response.text())
  .then((text) => {
    const container = document.getElementById("plusminus-winners-list");
    const lines = text.trim().split("\n");

    // Clear loading text
    container.innerHTML = "";

    if (lines.length === 0 || lines[0] === "") {
      container.innerHTML =
        '<div class="plusminus-loading-text">No winners announced yet.</div>';
      return;
    }

    lines.forEach((line, index) => {
      const parts = line.split(",");
      if (parts.length < 3) return;

      const name = parts[0].trim();
      const wins = parts[1].trim();
      const status = parts[2].trim();
      const rank = index + 1;

      // Determine CSS class for status badge
      const statusClass =
        status.toLowerCase() === "claimed"
          ? "plusminus-status-claimed"
          : "plusminus-status-pending";

      // Create the HTML Row
      const rowHTML = `
                    <div class="plusminus-winner-row plusminus-rank-${rank}">
                        <div class="plusminus-rank-circle">${rank}</div>
                        <div class="plusminus-player-info">
                            <span class="plusminus-player-name">${name}</span>
                            <span class="plusminus-player-wins"> Wins: ${wins}</span>
                        </div>
                        <div class="plusminus-status-badge ${statusClass}">🪙: ${status}</div>
                    </div>
                `;

      container.innerHTML += rowHTML;
    });
  })
  .catch((err) => {
    console.error(err);
    document.getElementById("plusminus-winners-list").innerHTML =
      '<div class="plusminus-loading-text">Error loading data.</div>';
  });
