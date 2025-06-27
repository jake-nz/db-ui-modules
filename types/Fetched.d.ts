export type Fetched<Fetcher extends (...a: any[]) => Promise<any>> = Awaited<ReturnType<Fetcher>>
