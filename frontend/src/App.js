import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Box, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { ErrorBoundary } from './ErrorBoundary';

function App() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      field: 'companyName', 
      headerName: 'Company Name', 
      width: 250,
    },
    { 
      field: 'Satisfaction_Metrics',
      headerName: 'Satisfaction',
      width: 150,
      type: 'number',
      sortable: true,
      valueFormatter: (params) => params.value?.toFixed?.(1) || 'N/A'
    },
    { 
      field: 'Workplace_Culture',  // Note the exact field name from your data
      headerName: 'Workplace Culture',
      width: 180,
      type: 'number',
      sortable: true,
      valueFormatter: (params) => params.value?.toFixed?.(1) || 'N/A'

    },
    { 
      field: 'Management_Aspects',
      headerName: 'Management',
      width: 150,
      type: 'number',
      sortable: true,
      valueFormatter: (params) => params.value?.toFixed?.(1) || 'N/A'

    },
    { 
      field: 'Compensation',
      headerName: 'Compensation',
      width: 150,
      type: 'number',
      sortable: true,
      valueFormatter: (params) => params.value?.toFixed?.(1) || 'N/A'

    }
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Company Ratings Dashboard
      </Typography>
      
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <TextField
          label="Search Companies"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>
      
      <div style={{ height: 600, width: '100%' }}>
        <ErrorBoundary>
          <DataGrid
            rows={filteredCompanies}
            columns={columns}
            loading={loading}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            disableSelectionOnClick
            getRowId={(row) => row.id}
          />
        </ErrorBoundary>
      </div>
    </Box>
  );
}

export default App;