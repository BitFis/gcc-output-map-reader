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
}
export default Formatter;