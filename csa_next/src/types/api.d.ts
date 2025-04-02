type ApiCallOptions = {
    method?: string;
    body?: object | FormData;
    query?: Record<string, string | number | undefined | null>;
    headers?: Record<string, string>;
}