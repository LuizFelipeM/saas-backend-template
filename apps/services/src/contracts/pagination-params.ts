export class PaginationParams {
  private _limit = 10;
  private _page = 1;

  constructor({ limit, page }: { limit?: number; page?: number }) {
    if (limit) this.limit = limit;
    if (page) this.page = page;
  }

  public set limit(value: number) {
    if (value < 1)
      throw new Error(
        `The limit pagination parameter must be equal or greater than 1 but received ${value}`,
      );
    this._limit = value;
  }

  public get limit(): number {
    return this._limit;
  }

  public set page(value: number) {
    if (value < 1)
      throw new Error(
        `The page parameter must be equal or greater than 1 but received ${value}`,
      );
    this._page = value;
  }

  public get page(): number {
    return this._page;
  }

  get offset(): number {
    return this.limit * (this.page - 1);
  }
}
