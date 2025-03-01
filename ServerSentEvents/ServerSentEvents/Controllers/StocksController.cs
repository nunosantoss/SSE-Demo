using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("stocks")]
public class StocksController : ControllerBase
{
    private static readonly Dictionary<string, double> BasePrices = new()
    {
        { "AAPL", 150.00 },
        { "GOOGL", 2800.00 },
        { "AMZN", 3400.00 },
        { "MSFT", 299.00 },
        { "TSLA", 750.00 }
    };

    [HttpGet("stream")]
    public async Task GetStockUpdates()
    {
        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");
        Response.Headers.Append("Connection", "keep-alive");

        var random = new Random();
        string[] stocks = { "AAPL", "GOOGL", "AMZN", "MSFT", "TSLA" };

        // **Send initial stock data for all stocks**
        var initialData = new List<object>();
        foreach (var stock in stocks)
        {
            initialData.Add(new
            {
                symbol = stock,
                price = BasePrices[stock],
                percentageChange = 0.0,  // Initially 0%
                isUp = true
            });
        }
        await Response.WriteAsync($"data: {System.Text.Json.JsonSerializer.Serialize(initialData)}\n\n");
        await Response.Body.FlushAsync();

        // **Start live updates**
        while (!HttpContext.RequestAborted.IsCancellationRequested)
        {
            var stock = stocks[random.Next(stocks.Length)];
            var newPrice = BasePrices[stock] + (random.NextDouble() * 20 - 10); // Fluctuation

            double percentageChange = ((newPrice - BasePrices[stock]) / BasePrices[stock]) * 100;
            bool isUp = newPrice >= BasePrices[stock];

            var stockUpdate = new
            {
                symbol = stock,
                price = newPrice,
                percentageChange = ((newPrice - BasePrices[stock]) / BasePrices[stock] * 100),
                isUp = isUp
            };

            await Response.WriteAsync($"data: {System.Text.Json.JsonSerializer.Serialize(stockUpdate)}\n\n");
            await Response.Body.FlushAsync();

            await Task.Delay(1000);
        }
    }
}
