class Formatter {
  /**
   * Format the size for a table
   * @param bytes Size to be formatted in Bytes
   * @returns
   */
  public static Size(bytes: number): string {
    const all = bytes;
    const B = bytes % 1000;
    bytes -= B;
    const KB = Math.floor((bytes / 1000) % 1000);
    bytes -= KB;
    const MB = Math.floor(bytes / 1000 / 1000);

    if (MB > 0) {
      return `${all} (+${MB}M)`;
    }
    if (KB > 0) {
      return `${all} (+${KB}K)`;
    }
    return `${all}`;
  }

  /**
   * Converts number to string
   * @param number Number to be converted
   * @returns Hex version of number
   */
  public static ToHex(number: number): string {
    return "0x" + `0000000000000000${number.toString(16)}`.slice(-16);
  }
}
export default Formatter;
