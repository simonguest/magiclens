export class Debug {
  static write(message: string): void {
    const now = new Date();
    console.log(`[${now.toISOString()}] ${message}`);
  }
}
