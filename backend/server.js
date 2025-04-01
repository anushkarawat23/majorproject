const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
app.use(cors());

// CSV file path
const CSV_PATH = path.join(__dirname, 'company_grouped_ratings.csv');

// Check if the file exists
if (!fs.existsSync(CSV_PATH)) {
  console.error(`🚨 CSV file not found at: ${CSV_PATH}`);
} else {
  console.log(`✅ CSV file found at: ${CSV_PATH}`);
}

// Helper function to read CSV
const readCSV = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    console.log("🔄 Starting to read CSV file..."); // Debugging

    fs.createReadStream(CSV_PATH)
      .on('error', (err) => {
        console.error("🚨 Error opening file:", err);
      })
      .pipe(csv())
      .on('data', (data) => {
        console.log("✅ Read row:", data); // Log raw row data

        if (data.companyName && data.companyName !== "OVERALL_AVERAGE") {
          results.push({
            id: results.length + 1,
            companyName: data.companyName.trim(),
            Satisfaction_Metrics: parseFloat(data.Satisfaction_Metrics?.trim()) || 0,
            Workplace_Culture: parseFloat(data.Workplace_Culture?.trim()) || 0,
            Management_Aspects: parseFloat(data.Management_Aspects?.trim()) || 0,
            Compensation: parseFloat(data.Compensation?.trim()) || 0
          });
        }
      })
      .on('end', () => {
        console.log(`✅ Finished reading CSV. Total rows: ${results.length}`);
        resolve(results);
      })
      .on('error', (error) => {
        console.error("🚨 CSV Parsing Error:", error);
        reject(error);
      });
  });
};




// API endpoint
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await readCSV();
    res.json(companies);
  } catch (error) {
    console.error('Error reading CSV:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});