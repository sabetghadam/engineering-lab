
public class Express
{
    private readonly WebApplication _app;

    public Express()
    {
        var builder = WebApplication.CreateBuilder();
        _app = builder.Build();
    }

    public RouteHandlerBuilder get(string path, Delegate handler)
        => _app.MapGet(path, handler);

    public RouteHandlerBuilder post(string path, Delegate handler)
        => _app.MapPost(path, handler);

    public RouteHandlerBuilder put(string path, Delegate handler)
        => _app.MapPut(path, handler);

    public RouteHandlerBuilder delete(string path, Delegate handler)
        => _app.MapDelete(path, handler);

    public void listen(int port = 3000)
        => _app.Run($"http://localhost:{port}");
}
