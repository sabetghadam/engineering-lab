
var app = new Express();

app.get("/", () => "API is running");

app.get("/api/products", () => new[]
{
    new { Id = 1, Name = "Laptop", Price = 1200 },
    new { Id = 2, Name = "Mouse", Price = 25 }
});

app.listen(3000);
