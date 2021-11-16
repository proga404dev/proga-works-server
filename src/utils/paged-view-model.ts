import { Paged } from './paged';

export class PagedViewModel<T> {
  public items: T[];
  public total: number;
  public skipped: number;
  public count: number;
  public page: {
    current: number;
    total: number;
  };

  constructor(page: Paged<T>, count: number, skipped: number) {
    this.items = page.data;
    this.total = page.total;
    this.skipped = skipped;
    this.count = page.count;
    this.page = {
      current: Math.floor(skipped / count) + 1,
      total: Math.ceil(page.total / count),
    };
  }
}
