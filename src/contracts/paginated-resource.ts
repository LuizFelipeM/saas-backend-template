export class PaginatedResource<T> {
  readonly data: T[];
  readonly total: number;

  constructor(
    data: T[],
    total: number,
    private readonly offset: number,
  ) {
    this.data = data ?? [];
    this.total = total ?? 0;
  }

  get count(): number {
    return this.data.length;
  }

  get hasMore(): boolean {
    return this.offset < this.total;
  }
}
