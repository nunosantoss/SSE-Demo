"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2 as MuiGrid,
  Paper,
} from "@mui/material";
import Image from "next/image";

type Stock = {
  symbol: string;
  price: number;
  percentageChange: number;
  isUp: boolean;
};

export default function StockTicker() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const ev_src = process.env.SSE_CONNECTION ?? "";

  useEffect(() => {
    const eventSource = new EventSource(ev_src);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (Array.isArray(data)) {
        setStocks(data); // Initial data
      } else {
        setStocks((prev) =>
          prev.map((s) => (s.symbol === data.symbol ? data : s))
        );

        // ✅ Ensure selected stock updates when new data arrives
        setSelectedStock((prevSelected) =>
          prevSelected?.symbol === data.symbol ? data : prevSelected
        );
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 600,
        mx: "auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Live Stock Prices
      </Typography>

      {/* Selected Stock */}
      {selectedStock && (
        <Card
          sx={{
            mb: 3,
            border: "2px solid",
            borderColor: selectedStock.isUp ? "green" : "red",
          }}
        >
          <CardContent>
            <Typography variant="h5">{selectedStock.symbol}</Typography>
            <Typography
              variant="h6"
              color={selectedStock.isUp ? "green" : "red"}
            >
              ${Number(selectedStock.price).toFixed(2)}{" "}
              {selectedStock.isUp ? "↑" : "↓"}
            </Typography>
            <Typography
              variant="body1"
              color={selectedStock.isUp ? "green" : "red"}
            >
              ({Number(selectedStock.percentageChange).toFixed(2)}%)
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Stock List */}
      <MuiGrid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        columns={5}
      >
        {stocks.map(({ symbol, price, percentageChange, isUp }) => (
          <Box key={symbol}>
            <Card
              sx={{
                width: 120,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: selectedStock?.symbol === symbol ? "#f0f0f0" : "white",
              }}
              onClick={() =>
                setSelectedStock({ symbol, price, percentageChange, isUp })
              }
            >
              <CardContent>
                <Box
                  justifyContent="center"
                  alignItems="center"
                  display="flex"
                  py={2}
                >
                  <Image
                    src={`/${symbol}.png`}
                    width={32}
                    height={32}
                    alt={symbol}
                  />
                </Box>
                <Typography variant="body1" fontWeight="bold">
                  {symbol}
                </Typography>
                <Typography variant="body2" color={isUp ? "green" : "red"}>
                  ${Number(price).toFixed(2)} {isUp ? "↑" : "↓"}
                </Typography>
                <Typography variant="caption" color={isUp ? "green" : "red"}>
                  ({Number(percentageChange).toFixed(2)}%)
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </MuiGrid>
    </Paper>
  );
}
