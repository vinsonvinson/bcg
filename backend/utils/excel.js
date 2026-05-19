const ExcelJS = require("exceljs");

const generateExcelReport = async (assessmentData, scores) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Assessment Report");

    // Set column widths
    worksheet.columns = [
        { header: "Keterangan", key: "label", width: 30 },
        { header: "Nilai", key: "value", width: 20 },
    ];

    // Add title
    worksheet.mergeCells("A1:B1");
    worksheet.getCell("A1").value = "LAPORAN PENILAIAN KELAYAKAN KREDIT 5C";
    worksheet.getCell("A1").font = { bold: true, size: 14 };
    worksheet.getCell("A1").alignment = {
        horizontal: "center",
        vertical: "center",
    };

    // Add assessment info
    worksheet.addRow({
        label: "Kode Penilaian",
        value: assessmentData.assessment_code,
    });
    worksheet.addRow({
        label: "Nama Perusahaan",
        value: assessmentData.business_name,
    });
    worksheet.addRow({
        label: "Nama Produk",
        value: assessmentData.product_name,
    });
    worksheet.addRow({
        label: "Tanggal Penilaian",
        value: new Date(assessmentData.assessment_date).toLocaleDateString(
            "id-ID",
        ),
    });
    worksheet.addRow({});

    // Add scores
    worksheet.addRow({ label: "SKOR 5C", value: "" }).font = { bold: true };
    worksheet.addRow({
        label: "Character (30%)",
        value: scores.characterScore.toFixed(2),
    });
    worksheet.addRow({
        label: "Capacity (25%)",
        value: scores.capacityScore.toFixed(2),
    });
    worksheet.addRow({
        label: "Capital (15%)",
        value: scores.capitalScore.toFixed(2),
    });
    worksheet.addRow({
        label: "Collateral (20%)",
        value: scores.collateralScore.toFixed(2),
    });
    worksheet.addRow({
        label: "Condition (10%)",
        value: scores.conditionScore.toFixed(2),
    });
    worksheet.addRow({});

    // Add total and zone
    worksheet.addRow({
        label: "TOTAL SKOR",
        value: scores.totalScore.toFixed(2),
    }).font = { bold: true };
    worksheet.addRow({
        label: "ZONA RISIKO",
        value: scores.riskZone.zone,
    }).font = { bold: true };
    worksheet.addRow({
        label: "TINGKAT RISIKO",
        value: scores.riskZone.riskLevel,
    });
    worksheet.addRow({ label: "KEPUTUSAN", value: scores.riskZone.decision });

    return workbook;
};

module.exports = { generateExcelReport };
