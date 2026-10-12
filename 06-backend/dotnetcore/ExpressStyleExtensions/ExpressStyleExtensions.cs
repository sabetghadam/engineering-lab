
public static class ExpressStyleExtensions
{
    public static RouteHandlerBuilder get(
        this WebApplication app,
        string path,
        Delegate handler)
        => app.MapGet(path, handler);

    public static RouteHandlerBuilder post(
        this WebApplication app,
        string path,
        Delegate handler)
        => app.MapPost(path, handler);

    public static RouteHandlerBuilder put(
        this WebApplication app,
        string path,
        Delegate handler)
        => app.MapPut(path, handler);

    public static RouteHandlerBuilder delete(
        this WebApplication app,
        string path,
        Delegate handler)
        => app.MapDelete(path, handler);
}
