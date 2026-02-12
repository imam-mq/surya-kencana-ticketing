import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Sidebar from "../layout/Sidebar";
import AdminNavbar from "../layout/AdminNavbar";

const Btransfer = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("2025-08-01");
  const [endDate, setEndDate] = useState("2025-09-31");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data
  const [transferData] = useState([
    {
      no: 1,
      priode: "01-30 2025",
      komisi: "25%",
      namaAgent: "Agentsumbawakecmatansanggardaerah",
      totalTransaksi: "Rp.5.600.000",
      totalKomisi: "Rp.1.350.000",
      totalSetor: "Rp.1.350.000",
      buktiTransfer: "bukti1.jpg",
      status: "pending",
    },
    {
      no: 2,
      priode: "01-30 2025",
      komisi: "25%",
      namaAgent: "Agentsumbawakecmatansanggardaerah",
      totalTransaksi: "Rp.5.600.000",
      totalKomisi: "Rp.1.350.000",
      totalSetor: "Rp.1.350.000",
      buktiTransfer: "bukti2.jpg",
      status: "sudah bayar",
    },
    {
      no: 3,
      priode: "01-30 2025",
      komisi: "25%",
      namaAgent: "Agentsumbawakecmatansanggardaerah",
      totalTransaksi: "Rp.5.600.000",
      totalKomisi: "Rp.1.350.000",
      totalSetor: "Rp.1.350.000",
      buktiTransfer: "bukti3.jpg",
      status: "belum bayar",
    },
  ]);

  const filteredData = transferData.filter((item) =>
    item.namaAgent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleValidasi = (no) => {
    alert(`Validasi transfer untuk nomor ${no}`);
    // TODO: Implement validation logic
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { 
          bg: "#fff3e0", 
          color: "#e65100", 
          label: "PENDING",
          border: "#ffb74d"
        };
      case "sudah bayar":
        return { 
          bg: "#e8f5e9", 
          color: "#2e7d32", 
          label: "SUDAH BAYAR",
          border: "#66bb6a"
        };
      case "belum bayar":
        return { 
          bg: "#ffebee", 
          color: "#c62828", 
          label: "BELUM BAYAR",
          border: "#ef5350"
        };
      default:
        return { 
          bg: "#f5f5f5", 
          color: "#616161", 
          label: status.toUpperCase(),
          border: "#bdbdbd"
        };
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />
        
        <Box sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#1a1a1a",
                mb: 1,
                letterSpacing: "-0.5px",
              }}
            >
              Laporan Agent Transfer
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontSize: "0.95rem",
              }}
            >
              Kelola dan validasi transfer komisi agent
            </Typography>
          </Box>

          {/* Filter Card */}
          <Card
            sx={{
              mb: 3,
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e0e0e0",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CalendarTodayIcon sx={{ color: "#1976d2", fontSize: 20 }} />
                  <Typography
                    variant="body1"
                    sx={{ 
                      fontWeight: 700, 
                      color: "#1a1a1a",
                      minWidth: "100px",
                      fontSize: "0.95rem"
                    }}
                  >
                    Pilih Priode
                  </Typography>
                </Box>

                <TextField
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  size="small"
                  sx={{
                    width: "180px",
                    backgroundColor: "#f8f9fa",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />

                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: "#999",
                    fontWeight: 400,
                    mx: -1
                  }}
                >
                  —
                </Typography>

                <TextField
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  size="small"
                  sx={{
                    width: "180px",
                    backgroundColor: "#f8f9fa",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                      },
                    },
                  }}
                />

                <Box sx={{ flexGrow: 1 }} />

                <TextField
                  placeholder="Cari Nama Agent..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    minWidth: "320px",
                    backgroundColor: "#f8f9fa",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "25px",
                      paddingLeft: "8px",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: "2px",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#666", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Table */}
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #e0e0e0",
            }}
          >
            <Table sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow 
                  sx={{ 
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "none",
                      py: 2,
                      width: "50px",
                      textAlign: "center",
                    }}
                  >
                    NO
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "none",
                      py: 2,
                      width: "100px",
                    }}
                  >
                    PRIODE
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "none",
                      py: 2,
                      width: "80px",
                      textAlign: "center",
                    }}
                  >
                    KOMISI
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "none",
                      py: 2,
                      minWidth: "180px",
                    }}
                  >
                    NAMA AGENT
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "none",
                      py: 2,
                      width: "140px",
                    }}
                  >
                    TOTAL<br/>TRANSAKSI
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "none",
                      py: 2,
                      width: "130px",
                    }}
                  >
                    TOTAL<br/>KOMISI
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "none",
                      py: 2,
                      width: "130px",
                    }}
                  >
                    TOTAL<br/>SETOR
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "none",
                      py: 2,
                      width: "120px",
                      textAlign: "center",
                    }}
                  >
                    BUKTI<br/>TRANSFER
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "none",
                      py: 2,
                      width: "130px",
                      textAlign: "center",
                    }}
                  >
                    STATUS
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "none",
                      py: 2,
                      width: "120px",
                      textAlign: "center",
                    }}
                  >
                    AKSI
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item, index) => {
                  const statusStyle = getStatusColor(item.status);
                  return (
                    <TableRow
                      key={item.no}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f8f9fa",
                          transition: "all 0.2s ease",
                        },
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa",
                      }}
                    >
                      <TableCell 
                        sx={{ 
                          color: "#333", 
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                      >
                        {item.no}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          color: "#555", 
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      >
                        {item.priode}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          color: "#1976d2", 
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                      >
                        {item.komisi}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#333",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "180px",
                        }}
                        title={item.namaAgent}
                      >
                        {item.namaAgent}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#2e7d32",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                        }}
                      >
                        {item.totalTransaksi}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#1565c0",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                        }}
                      >
                        {item.totalKomisi}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#d32f2f",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                        }}
                      >
                        {item.totalSetor}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Chip
                          label="VIEW FILE"
                          size="small"
                          sx={{
                            backgroundColor: "#fff3e0",
                            color: "#e65100",
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            cursor: "pointer",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                            border: "1.5px solid #ffb74d",
                            height: "26px",
                            "&:hover": {
                              backgroundColor: "#ffe0b2",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 8px rgba(230,81,0,0.2)",
                            },
                            transition: "all 0.2s ease",
                          }}
                          onClick={() =>
                            alert(`View file: ${item.buktiTransfer}`)
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Chip
                          label={statusStyle.label}
                          size="small"
                          sx={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                            border: `1.5px solid ${statusStyle.border}`,
                            px: 0.5,
                            height: "26px",
                            minWidth: "95px",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                          onClick={() => handleValidasi(item.no)}
                          sx={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            textTransform: "none",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            borderRadius: "8px",
                            px: 2,
                            py: 0.8,
                            boxShadow: "0 4px 8px rgba(102,126,234,0.3)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                              boxShadow: "0 6px 12px rgba(102,126,234,0.4)",
                              transform: "translateY(-2px)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          Validasi
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Info Footer */}
          <Box
            sx={{
              mt: 2,
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "#666" }}>
              Menampilkan <strong>{filteredData.length}</strong> dari <strong>{transferData.length}</strong> data transfer
            </Typography>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Btransfer;