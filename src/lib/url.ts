URL.prototype.ext = function ext(
    path: string | Record<string, string | null | undefined>,
    query?: Record<string, string | null | undefined>
) {
    const newURL = typeof path === 'string' ? new URL(path, this) : new URL(this);
    if (typeof path === 'object') query = path;
    if (query) {
        for (const [key, value] of Object.entries(query)) {
            if (typeof value === 'string') newURL.searchParams.set(key, value);
            else newURL.searchParams.delete(key);
        }
    }
    return newURL;
};
URL.prototype.to = function to(
    path: string | Record<string, string | null | undefined>,
    query?: Record<string, string | null | undefined>
) {
    return (this.ext as any)(path, query).toString();
};

URLSearchParams.prototype.getNumber = function getNumber(name: string) {
    const value = Number(this.get(name));
    return isNaN(value) ? null : value;
};
