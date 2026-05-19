let currentStep = 1;
const totalSteps = 3;

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("assessmentForm");
    if (form) {
        form.addEventListener("submit", handleSubmitAssessment);
    }

    checkAuth();
});

function nextStep(currentStepNum) {
    if (validateStep(currentStepNum)) {
        currentStep = currentStepNum + 1;
        if (currentStep <= totalSteps) {
            if (currentStep === 3) {
                generateSummary();
            }
            updateSteps();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateSteps();
    } else {
        window.location.href = "/dashboard";
    }
}

function updateSteps() {
    document.querySelectorAll(".form-step").forEach((step) => {
        step.classList.remove("active");
    });

    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.add("active");
    }

    document.querySelectorAll(".progress-step").forEach((step, index) => {
        step.classList.remove("active", "completed");

        if (index + 1 < currentStep) {
            step.classList.add("completed");
        } else if (index + 1 === currentStep) {
            step.classList.add("active");
        }
    });

    document.querySelector(".form-container").scrollTop = 0;
}

function validateStep(stepNum) {
    const form = document.getElementById("assessmentForm");

    if (stepNum === 1) {
        const requiredFields = ["business_name", "product_name"];

        for (let field of requiredFields) {
            const input = form.elements[field];
            if (!input || !input.value) {
                alert(`${field.replace(/_/g, " ")} is required`);
                return false;
            }
        }
    } else if (stepNum === 2) {
        const requiredScores = [
            "character_willingness",
            "character_integrity",
            "character_personal_risk",
            "character_social_relation",
            "capacity_management",
            "capacity_experience",
            "capacity_production",
            "capacity_cost_productivity",
            "capacity_equipment",
            "capacity_sales",
            "capital_position",
            "capital_debt",
            "capital_contribution",
            "capital_receivable",
            "collateral_type",
            "collateral_marketability",
            "collateral_binding",
            "collateral_ltv",
            "condition_market",
            "condition_material",
            "condition_distribution",
            "condition_regulation",
        ];

        for (let score of requiredScores) {
            const select = form.elements[score];
            if (!select || !select.value) {
                alert(`Please score: ${score.replace(/_/g, " ")}`);
                return false;
            }
        }
    }

    return true;
}

function generateSummary() {
    const form = document.getElementById("assessmentForm");
    const summaryDiv = document.getElementById("summaryReview");

    const formData = new FormData(form);
    let html = "";

    html +=
        '<div class="summary-item"><span class="summary-label">Business Name:</span><span class="summary-value">' +
        formData.get("business_name") +
        "</span></div>";
    html +=
        '<div class="summary-item"><span class="summary-label">Product Name:</span><span class="summary-value">' +
        formData.get("product_name") +
        "</span></div>";

    html += '<hr style="margin: 20px 0;">';

    const scores = {
        Character: {
            Willingness: formData.get("character_willingness"),
            Integrity: formData.get("character_integrity"),
            "Personal Risk": formData.get("character_personal_risk"),
            "Social Relation": formData.get("character_social_relation"),
        },
        Capacity: {
            Management: formData.get("capacity_management"),
            Experience: formData.get("capacity_experience"),
            Production: formData.get("capacity_production"),
            "Cost Productivity": formData.get("capacity_cost_productivity"),
            Equipment: formData.get("capacity_equipment"),
            Sales: formData.get("capacity_sales"),
        },
        Capital: {
            Position: formData.get("capital_position"),
            Debt: formData.get("capital_debt"),
            Contribution: formData.get("capital_contribution"),
            Receivable: formData.get("capital_receivable"),
        },
        Collateral: {
            Type: formData.get("collateral_type"),
            Marketability: formData.get("collateral_marketability"),
            Binding: formData.get("collateral_binding"),
            LTV: formData.get("collateral_ltv"),
        },
        Condition: {
            Market: formData.get("condition_market"),
            Material: formData.get("condition_material"),
            Distribution: formData.get("condition_distribution"),
            Regulation: formData.get("condition_regulation"),
        },
    };

    for (let [category, items] of Object.entries(scores)) {
        html += `<h4 style="margin-top: 16px; margin-bottom: 12px; color: #1976D2;">${category} Scores</h4>`;
        for (let [label, score] of Object.entries(items)) {
            html += `<div class="summary-item"><span class="summary-label">${label}:</span><span class="summary-value">${score}</span></div>`;
        }
    }

    summaryDiv.innerHTML = html;
}

async function handleSubmitAssessment(e) {
    e.preventDefault();

    if (!validateStep(2)) {
        return;
    }

    showLoading();

    try {
        const form = document.getElementById("assessmentForm");
        const formData = new FormData(form);

        const assessmentResponse = await apiCall("/assessments", {
            method: "POST",
            body: JSON.stringify({
                business_name: formData.get("business_name"),
                product_name: formData.get("product_name"),
            }),
        });

        const assessmentId = assessmentResponse.assessmentId;

        const scoresResponse = await apiCall(
            `/assessments/${assessmentId}/scores`,
            {
                method: "POST",
                body: JSON.stringify({
                    characterScores: {
                        willingness: parseInt(
                            formData.get("character_willingness"),
                        ),
                        integrity: parseInt(
                            formData.get("character_integrity"),
                        ),
                        personalRisk: parseInt(
                            formData.get("character_personal_risk"),
                        ),
                        socialRelation: parseInt(
                            formData.get("character_social_relation"),
                        ),
                    },
                    capacityScores: {
                        management: parseInt(
                            formData.get("capacity_management"),
                        ),
                        experience: parseInt(
                            formData.get("capacity_experience"),
                        ),
                        production: parseInt(
                            formData.get("capacity_production"),
                        ),
                        costProductivity: parseInt(
                            formData.get("capacity_cost_productivity"),
                        ),
                        equipment: parseInt(formData.get("capacity_equipment")),
                        sales: parseInt(formData.get("capacity_sales")),
                    },
                    capitalScores: {
                        capitalPosition: parseInt(
                            formData.get("capital_position"),
                        ),
                        debtPosition: parseInt(formData.get("capital_debt")),
                        personalContribution: parseInt(
                            formData.get("capital_contribution"),
                        ),
                        receivableStock: parseInt(
                            formData.get("capital_receivable"),
                        ),
                    },
                    collateralScores: {
                        type: parseInt(formData.get("collateral_type")),
                        marketability: parseInt(
                            formData.get("collateral_marketability"),
                        ),
                        binding: parseInt(formData.get("collateral_binding")),
                        ltv: parseInt(formData.get("collateral_ltv")),
                    },
                    conditionScores: {
                        market: parseInt(formData.get("condition_market")),
                        material: parseInt(formData.get("condition_material")),
                        distribution: parseInt(
                            formData.get("condition_distribution"),
                        ),
                        regulation: parseInt(
                            formData.get("condition_regulation"),
                        ),
                    },
                }),
            },
        );

        hideLoading();

        const result = scoresResponse.scores;
        showResultModal(
            result,
            assessmentResponse.assessmentCode,
            assessmentId,
        );
    } catch (error) {
        hideLoading();
        alert("Error: " + error.message);
    }
}

function showResultModal(result, assessmentCode, assessmentId) {
    const html = `
    <div class="result-modal">
      <h3>Assessment Result</h3>
      <p><strong>Assessment Code:</strong> ${assessmentCode}</p>
      
      <div class="scores-display">
        <div class="score-item">
          <span>Character (30%):</span>
          <span class="score-value">${result.characterScore}</span>
        </div>
        <div class="score-item">
          <span>Capacity (25%):</span>
          <span class="score-value">${result.capacityScore}</span>
        </div>
        <div class="score-item">
          <span>Capital (15%):</span>
          <span class="score-value">${result.capitalScore}</span>
        </div>
        <div class="score-item">
          <span>Collateral (20%):</span>
          <span class="score-value">${result.collateralScore}</span>
        </div>
        <div class="score-item">
          <span>Condition (10%):</span>
          <span class="score-value">${result.conditionScore}</span>
        </div>
      </div>

      <hr style="margin: 20px 0;">

      <div class="total-score">
        <span>Total Score:</span>
        <span class="score-value-large">${result.totalScore}</span>
      </div>

      <div class="risk-zone-result" style="background: rgba(25, 118, 210, 0.1); padding: 16px; border-radius: 8px; margin-top: 16px;">
        <h4 style="color: ${result.riskZone.color}; margin-bottom: 8px;">Risk Zone: ${result.riskZone.zone}</h4>
        <p style="margin: 8px 0;"><strong>Level:</strong> ${result.riskZone.riskLevel}</p>
        <p style="margin: 8px 0; font-size: 13px; line-height: 1.6;">${result.riskZone.decision}</p>
      </div>

      <div style="margin-top: 20px; display: flex; gap: 10px;">
                        <button onclick="downloadExcel(${assessmentId})" class="btn btn-primary">Download Report</button>
        <button onclick="goToDashboard()" class="btn btn-secondary">Go to Dashboard</button>
      </div>
    </div>
  `;

    const modal = document.getElementById("modal") || createModal();
    modal.style.display = "flex";

    const modalBody = modal.querySelector("#modalBody");
    if (modalBody) {
        modalBody.innerHTML = html;
    }
}

function createModal() {
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.className = "modal";
    modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" onclick="closeModal()">&times;</span>
      <div id="modalBody"></div>
    </div>
  `;
    document.body.appendChild(modal);
    return modal;
}

function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "none";
    }
}

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
        alert("Gagal mengunduh file. Periksa koneksi atau hak akses.");
    }
}

function goToDashboard() {
    closeModal();
    window.location.href = "/dashboard";
}

const style = document.createElement("style");
style.textContent = `
  .result-modal {
    text-align: left;
  }
  
  .scores-display {
    margin: 20px 0;
    padding: 16px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
  }
  
  .score-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .score-item:last-child {
    border-bottom: none;
  }
  
  .score-value {
    font-weight: 600;
    color: #1976D2;
  }
  
  .score-value-large {
    font-size: 32px;
    font-weight: 700;
    color: #1976D2;
  }
  
  .total-score {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: rgba(25, 118, 210, 0.05);
    border-radius: 8px;
  }
`;
document.head.appendChild(style);
