var app = WebApplication.Create(args);

app.MapGet("/", () => "API is running");

app.MapGet("/api/products", () => new[]
{
    new { Id = 1, Name = "Laptop", Price = 1200 },
    new { Id = 2, Name = "Mouse", Price = 25 }
});

app.Run();