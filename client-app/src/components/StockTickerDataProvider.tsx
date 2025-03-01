/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Stock = {
  symbol: string;
  price: any;
  percentageChange: any;
  isUp: boolean;
};

type StockContextType = {
  stocks: Stock[];
  selectedStock: Stock | null;
  setSelectedStock: (stock: Stock | null) => void;
};

const StockContext = createContext<StockContextType | undefined>(undefined);

export function StockTickerDataProvider({ children }: { children: ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const ev_src = process.env.SSE_CONNECTION ?? "";

  useEffect(() => {
    const eventSource = new EventSource(ev_src);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log(data);
      if (Array.isArray(data)) {
        setStocks(data);
      } else {
        setStocks((prev) =>
          prev.map((s) => (s.symbol === data.symbol ? data : s))
        );

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
    <StockContext.Provider value={{ stocks, selectedStock, setSelectedStock }}>
      {children}
    </StockContext.Provider>
  );
}

export function useStockData() {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error(
      "useStockData must be used within a StockTickerDataProvider"
    );
  }
  return context;
}
