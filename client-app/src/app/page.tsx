"use client";
import { useStockData } from "@/components/StockTickerDataProvider";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2 as MuiGrid,
  Paper,
} from "@mui/material";
import Image from "next/image";

export default function StockTicker() {
  const { stocks, selectedStock, setSelectedStock } = useStockData();

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
              ({parseFloat(selectedStock.percentageChange).toFixed(2)}%)
            </Typography>
          </CardContent>
        </Card>
      )}

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
                  ${parseFloat(price).toFixed(2)} {isUp ? "↑" : "↓"}
                </Typography>
                <Typography variant="caption" color={isUp ? "green" : "red"}>
                  ({parseFloat(percentageChange).toFixed(2)}%)
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </MuiGrid>
    </Paper>
  );
}
