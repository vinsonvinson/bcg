const ExcelJS = require("exceljs");

const generateExcelReport = async (assessmentData, scores) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Assessment Report");

    // 1. Atur Lebar Kolom Sesuai Permintaan
    worksheet.getColumn("A").width = 5; // Kolom: No
    worksheet.getColumn("B").width = 25; // Kolom: Variabel 5C
    worksheet.getColumn("C").width = 45; // Kolom: Indikator Penilaian
    worksheet.getColumn("D").width = 15; // Kolom: Skor

    // 2. Header Judul Laporan
    worksheet.mergeCells("A1:D1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "LAPORAN PENILAIAN KELAYAKAN KREDIT 5C";
    titleCell.font = { bold: true, size: 14 };
    titleCell.alignment = { horizontal: "center", vertical: "center" };

    worksheet.addRow([]); // Baris kosong pembatas

    worksheet.addRow(["", "Nama Perusahaan", assessmentData.business_name, ""]);
    worksheet.addRow(["", "Nama Produk", assessmentData.product_name, ""]);
    worksheet.addRow([
        "",
        "Tanggal Penilaian",
        new Date(assessmentData.assessment_date).toLocaleDateString("id-ID"),
        "",
    ]);
    worksheet.addRow([]); // Baris kosong pembatas

    // 4. Pembuatan Header Tabel Utama
    const headerRow = worksheet.addRow([
        "No",
        "Variabel 5C",
        "Indikator Penilaian",
        "Skor",
    ]);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
        // Beri warna latar abu-abu pada header tabel
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" },
        };
        // Beri garis pembatas (border)
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // 5. Fungsi Helper: Memasukkan baris tabel beserta border & penomoran
    let indicatorNo = 1;
    const addDataRow = (variabel, indikator, skor, isAverage = false) => {
        // Jika baris ini adalah rata-rata, kosongkan nomor. Jika tidak, tambah nomor urut.
        const rowNo = !isAverage ? indicatorNo++ : "";
        const row = worksheet.addRow([rowNo, variabel, indikator, skor]);

        // Format teks jika ini baris Rata-rata
        if (isAverage) {
            row.font = { bold: true, italic: true };
            row.getCell(3).alignment = { horizontal: "right" }; // Rata kanan untuk tulisan Rata-rata
            row.getCell(4).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF5F5F5" },
            };
        }

        // Berikan border untuk setiap cell di tabel ini
        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        return row;
    };

    // --- INPUT 22 INDIKATOR KE DALAM TABEL ---

    // 1. DATA CHARACTER
    addDataRow(
        "Character (30%)",
        "Kemauan Berusaha",
        scores.characterDetail.willingness || 0,
    );
    addDataRow(
        "",
        "Integritas (Kejujuran)",
        scores.characterDetail.integrity || 0,
    );
    addDataRow(
        "",
        "Risiko Personal",
        scores.characterDetail.personalRisk ||
            scores.characterDetail.personal_risk ||
            0,
    );
    addDataRow(
        "",
        "Hubungan Sosial & Regulasi",
        scores.characterDetail.socialRelation ||
            scores.characterDetail.social_relation ||
            0,
    );
    addDataRow(
        "",
        "Rata-rata Skor Character",
        Number(scores.characterScore).toFixed(2),
        true,
    );

    // 2. DATA CAPACITY
    addDataRow(
        "Capacity (25%)",
        "Kemampuan Mengelola",
        scores.capacityDetail.management || 0,
    );
    addDataRow("", "Pengalaman Usaha", scores.capacityDetail.experience || 0);
    addDataRow("", "Kapasitas Produksi", scores.capacityDetail.production || 0);
    addDataRow(
        "",
        "Biaya & Produktivitas",
        scores.capacityDetail.costProductivity ||
            scores.capacityDetail.cost_productivity ||
            0,
    );
    addDataRow(
        "",
        "Sarana Pendukung Alat",
        scores.capacityDetail.equipment || 0,
    );
    addDataRow("", "Penjualan & Laba Usaha", scores.capacityDetail.sales || 0);
    addDataRow(
        "",
        "Rata-rata Skor Capacity",
        Number(scores.capacityScore).toFixed(2),
        true,
    );

    // 3. DATA CAPITAL
    addDataRow(
        "Capital (15%)",
        "Posisi Modal & Laba Ditahan",
        scores.capitalDetail.capitalPosition ||
            scores.capitalDetail.capital_position ||
            0,
    );
    addDataRow(
        "",
        "Posisi Hutang & Kewajiban",
        scores.capitalDetail.debtPosition ||
            scores.capitalDetail.debt_position ||
            0,
    );
    addDataRow(
        "",
        "Setoran Modal Pribadi",
        scores.capitalDetail.personalContribution ||
            scores.capitalDetail.personal_contribution ||
            0,
    );
    addDataRow(
        "",
        "Piutang & Stok Barang",
        scores.capitalDetail.receivableStock ||
            scores.capitalDetail.receivable_stock ||
            0,
    );
    addDataRow(
        "",
        "Rata-rata Skor Capital",
        Number(scores.capitalScore).toFixed(2),
        true,
    );

    // 4. DATA COLLATERAL
    addDataRow(
        "Collateral (20%)",
        "Jenis & Nilai Agunan",
        scores.collateralDetail.type || 0,
    );
    addDataRow(
        "",
        "Marketability Agunan",
        scores.collateralDetail.marketability || 0,
    );
    addDataRow("", "Pengikatan Agunan", scores.collateralDetail.binding || 0);
    addDataRow("", "Persentase Rasio LTV", scores.collateralDetail.ltv || 0);
    addDataRow(
        "",
        "Rata-rata Skor Collateral",
        Number(scores.collateralScore).toFixed(2),
        true,
    );

    // 5. DATA CONDITION
    addDataRow(
        "Condition (10%)",
        "Pasar & Market Share",
        scores.conditionDetail.market || 0,
    );
    addDataRow(
        "",
        "Ketersediaan Bahan Baku",
        scores.conditionDetail.material || 0,
    );
    addDataRow(
        "",
        "Sarana Distribusi & Akses",
        scores.conditionDetail.distribution || 0,
    );
    addDataRow(
        "",
        "Regulasi & Legalitas",
        scores.conditionDetail.regulation || 0,
    );
    addDataRow(
        "",
        "Rata-rata Skor Condition",
        Number(scores.conditionScore).toFixed(2),
        true,
    );

    worksheet.addRow([]); // Baris kosong sebelum hasil akhir

    // 6. Ringkasan Hasil Akhir
    const addSummaryRow = (label, value) => {
        const row = worksheet.addRow(["", "", label, value]);
        row.getCell(3).font = { bold: true };
        row.getCell(4).font = { bold: true };
        row.getCell(3).alignment = { horizontal: "right" };

        // Berikan garis (border) hanya untuk sel Keputusan Akhir
        row.getCell(3).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
        row.getCell(4).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
    };

    addSummaryRow("TOTAL SKOR AKHIR", Number(scores.totalScore).toFixed(2));
    addSummaryRow("ZONA RISIKO", scores.riskZone.zone);
    addSummaryRow("TINGKAT RISIKO", scores.riskZone.riskLevel);
    addSummaryRow("KEPUTUSAN", scores.riskZone.decision);

    return workbook;
};

module.exports = { generateExcelReport };
