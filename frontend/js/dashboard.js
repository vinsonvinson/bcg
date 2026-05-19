// Dashboard Module
let dashboardData = null;
let riskZoneChart = null;
let statusChart = null;

document.addEventListener("DOMContentLoaded", function () {
    checkAuth();
    loadDashboardData();

    // Setup menu items
    document.querySelectorAll(".menu-item").forEach((item) => {
        item.addEventListener("click", function () {
            const section = this.getAttribute("data-section");
            if (section) {
                showSection(section);
            }
        });
    });
});

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.remove("active");
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add("active");
    }

    // Update menu items
    document.querySelectorAll(".menu-item").forEach((item) => {
        item.classList.remove("active");
    });

    const menuItem = document.querySelector(
        `.menu-item[onclick*="${sectionId}"]`,
    );
    if (menuItem) {
        menuItem.classList.add("active");
    }

    // Reinitialize charts if needed
    if (sectionId === "overview" && dashboardData) {
        setTimeout(() => {
            if (riskZoneChart) {
                riskZoneChart.resize();
                riskZoneChart.update();
            }
            if (statusChart) {
                statusChart.resize();
                statusChart.update();
            }
        }, 100);
    }
}

async function loadDashboardData() {
    try {
        const response = await apiCall("/dashboard/summary");
        dashboardData = response;

        // Update stats
        updateStats(response.summary);

        // Update recent assessments
        updateRecentAssessments(response.recent);

        // Update risk zones
        updateRiskZones(response.riskZones);

        // Initialize charts
        initCharts(response.summary, response.riskZones);
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

function updateStats(summary) {
    document.getElementById("totalAssessments").textContent = summary.total;
    document.getElementById("approvedCount").textContent = summary.approved;
    document.getElementById("mitigatedCount").textContent = summary.mitigated;
    document.getElementById("pendingCount").textContent =
        summary.pending_collateral;
    document.getElementById("rejectedCount").textContent = summary.rejected;
    document.getElementById("averageScore").textContent = summary.average_score;
}

function updateRecentAssessments(recentAssessments) {
    const container = document.getElementById("recentAssessments");
    if (!container) return;

    if (recentAssessments.length === 0) {
        container.innerHTML =
            '<p style="text-align: center; color: #999; padding: 20px;">No assessments yet</p>';
        return;
    }

    let html = "";
    recentAssessments.forEach((assessment) => {
        const statusClass = `status-${assessment.status}`;
        const riskClass = `zone-${assessment.risk_zone?.toLowerCase().replace(/\s+/g, "-")}`;

        html += `
      <div class="recent-item">
        <div class="recent-item-info">
          <div class="recent-item-business">${assessment.business_name}</div>
          <div class="recent-item-date">
            ${assessment.product_name || "No product"} • ${formatDate(assessment.created_at)}
          </div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <span class="zone-badge zone-${getZoneClass(assessment.risk_zone)}">
            ${assessment.risk_zone || "N/A"}
          </span>
          <span class="recent-item-score">${assessment.total_score?.toFixed(2) || "N/A"}</span>
        </div>
      </div>
    `;
    });

    container.innerHTML = html;
}

function updateRiskZones(riskZones) {
    const hT = document.getElementById("hijauTuaCount");
    const hM = document.getElementById("hijauMudaCount");
    const kN = document.getElementById("kuningCount");
    const mR = document.getElementById("merahCount");

    if (hT) hT.textContent = riskZones["HIJAU TUA"] || 0;
    if (hM) hM.textContent = riskZones["HIJAU MUDA"] || 0;
    if (kN) kN.textContent = riskZones["KUNING"] || 0;
    if (mR) mR.textContent = riskZones["MERAH"] || 0;
}

function getZoneClass(zone) {
    if (!zone) return "default";
    const lowerZone = zone.toLowerCase().replace(/\s+/g, "-");
    if (lowerZone.includes("hijau") && lowerZone.includes("tua"))
        return "green-dark";
    if (lowerZone.includes("hijau") && lowerZone.includes("muda"))
        return "green-light";
    if (lowerZone.includes("kuning")) return "yellow";
    if (lowerZone.includes("merah")) return "red";
    return "default";
}

function initCharts(summary, riskZones) {
    const riskZoneCtx = document.getElementById("riskZoneChart");
    const statusCtx = document.getElementById("statusChart");

    if (!riskZoneCtx || !statusCtx) return;

    // Risk Zone Chart
    if (riskZoneChart) {
        riskZoneChart.destroy();
    }

    riskZoneChart = new Chart(riskZoneCtx, {
        type: "doughnut",
        data: {
            labels: ["Hijau Tua", "Hijau Muda", "Kuning", "Merah"],
            datasets: [
                {
                    data: [
                        riskZones["HIJAU TUA"] || 0,
                        riskZones["HIJAU MUDA"] || 0,
                        riskZones["KUNING"] || 0,
                        riskZones["MERAH"] || 0,
                    ],
                    backgroundColor: [
                        "#4CAF50",
                        "#8BC34A",
                        "#FFC107",
                        "#F44336",
                    ],
                    borderColor: "var(--card-bg)",
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "var(--text-color)",
                        font: { size: 12 },
                    },
                },
            },
        },
    });

    // Status Chart
    if (statusChart) {
        statusChart.destroy();
    }

    statusChart = new Chart(statusCtx, {
        type: "bar",
        data: {
            labels: ["Approved", "Mitigated", "Pending", "Rejected"],
            datasets: [
                {
                    label: "Count",
                    data: [
                        summary.approved,
                        summary.mitigated,
                        summary.pending_collateral,
                        summary.rejected,
                    ],
                    backgroundColor: [
                        "rgba(76, 175, 80, 0.7)",
                        "rgba(139, 195, 74, 0.7)",
                        "rgba(255, 193, 7, 0.7)",
                        "rgba(244, 67, 54, 0.7)",
                    ],
                    borderColor: ["#4CAF50", "#8BC34A", "#FFC107", "#F44336"],
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: "y",
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: "var(--text-color)",
                    },
                    grid: {
                        color: "var(--border-color)",
                    },
                },
                y: {
                    ticks: {
                        color: "var(--text-color)",
                    },
                    grid: {
                        color: "var(--border-color)",
                    },
                },
            },
        },
    });
}

// Load and display all assessments
async function loadAllAssessments() {
    const container = document.getElementById("assessmentsList");
    if (!container) return;

    try {
        const response = await apiCall("/assessments");

        if (response.assessments.length === 0) {
            container.innerHTML =
                '<p style="text-align: center; color: #999; padding: 20px;">No assessments found</p>';
            return;
        }

        let html =
            '<div class="table-header"><div>Business Name</div><div>Product</div><div>Status</div><div>Risk Zone</div><div>Score</div><div>Actions</div></div>';

        response.assessments.forEach((assessment) => {
            const statusBadge = `<span class="status-badge status-${assessment.status}">${assessment.status}</span>`;
            const zoneBadge = `<span class="zone-badge zone-${getZoneClass(assessment.risk_zone)}">${assessment.risk_zone || "N/A"}</span>`;

            html += `
                <div class="table-row">
                    <div>${assessment.business_name}</div>
                    <div>${assessment.product_name || "N/A"}</div>
                    <div>${statusBadge}</div>
                    <div>${zoneBadge}</div>
                    <div>${assessment.total_score?.toFixed(2) || "N/A"}</div>
                    <div><button class="btn-download" onclick="downloadExcel(${assessment.id})">Download</button></div>
                </div>
            `;
        });

        container.innerHTML = html;
    } catch (error) {
        console.error("Error loading assessments:", error);
    }
}

// Search and filter assessments
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");

    if (searchInput) {
        searchInput.addEventListener("input", filterAssessments);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", filterAssessments);
    }

    // Show assessments when clicking on menu
    const assessmentsMenu = document.querySelector('[onclick*="assessments"]');
    if (assessmentsMenu) {
        assessmentsMenu.addEventListener("click", loadAllAssessments);
    }
});

function filterAssessments() {
    const searchValue =
        document.getElementById("searchInput")?.value.toLowerCase() || "";
    const statusValue = document.getElementById("statusFilter")?.value || "";

    const rows = document.querySelectorAll(".table-row");

    rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const showBySearch = text.includes(searchValue);
        const showByStatus =
            !statusValue || row.textContent.includes(statusValue);

        row.style.display = showBySearch && showByStatus ? "grid" : "none";
    });
}

// Download assessment Excel file
async function downloadExcel(assessmentId) {
    try {
        const token = localStorage.getItem("token");
        const url = `${API_BASE_URL}/assessments/${assessmentId}/export`;

        const res = await fetch(url, {
            method: "GET",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Server error: ${res.status} ${text}`);
        }

        const blob = await res.blob();

        // Try to extract filename from header
        let filename = `Assessment-${assessmentId}.xlsx`;
        const cd = res.headers.get("Content-Disposition");
        if (cd) {
            const match = /filename="?([^";]+)"?/.exec(cd);
            if (match && match[1]) filename = match[1];
        }

        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
    } catch (err) {
        console.error("Download error:", err);
        showNotification(
            "Gagal mengunduh file. Periksa kembali koneksi atau hak akses.",
            "error",
        );
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Listen to modal close
document.addEventListener("click", function (event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        closeModal();
    }
});

// Display user info
document.addEventListener("DOMContentLoaded", function () {
    const user = getUser();
    if (user) {
        const userInfo = document.getElementById("userInfo");
        if (userInfo) {
            userInfo.textContent = `${user.full_name} (${user.role})`;
        }
    }
});
