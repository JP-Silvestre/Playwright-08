export interface Product {

  readonly name: string;
  readonly price: number;
}

export interface Cart {

  readonly products: readonly Product[];
  readonly subtotal: number;
}


export class CatalogBuilder {

  private readonly products: Product[] = [];

  constructor(private readonly catalog: readonly Product[]) {
    
    if (catalog.length === 0) throw new Error('catalog is empty');
  }

  withProduct(name: string): this {

    const product = this.catalog.find((p) => p.name === name);

    if (!product) {

      throw new Error(
        `product "${name}" catalog doesnt exist. ` +
          `available ${this.catalog.map((p) => p.name).join(', ')}`,
      );
    }

    this.products.push(product);
    return this;
  }

  withProducts(...names: string[]): this {
    names.forEach((name) => this.withProduct(name));
    return this;
  }

  withCheapest(count: number): this {
    return this.withSorted(count, (a, b) => a.price - b.price);
  }

  withMostExpensive(count: number): this {
    return this.withSorted(count, (a, b) => b.price - a.price);
  }

  build(): Cart {

    if (this.products.length === 0) throw new Error('no selected products');

    const subtotal = this.products.reduce((sum, p) => sum + p.price, 0);
    return { products: [...this.products], subtotal: Math.round(subtotal * 100) / 100 };
  }

  private withSorted(count: number, compare: (a: Product, b: Product) => number): this {

    const candidates = this.catalog.filter((p) => !this.products.includes(p)).sort(compare);

    if (count > candidates.length) {
      throw new Error(`ordered ${count} products but only ${candidates.length} are available`);
    }

    this.products.push(...candidates.slice(0, count));
    return this;
  }
}
 