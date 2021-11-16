export class Paged<T> {
    public readonly total: number;
  
    public get count() {
      return this.data.length;
    }
  
    public readonly data: T[];
  
    public constructor(data: T[], total: number) {
      this.data = data;
      this.total = total;
    }
  
    public static fromTotal<T>(
      data: T[],
      options: { skip: number; limit: number },
    ) {
      return new Paged(data.slice(options.skip, options.limit), data.length);
    }
  }
  