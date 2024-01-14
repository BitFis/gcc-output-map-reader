let instance: typeof import("../wasm/build") | null = null;

export async function Load(): Promise<void> {
  if (instance != null) {
    instance = await import("../wasm/build");
  }
}

export class Parser {
  greet(): void {
    instance?.greet();
  }
}
