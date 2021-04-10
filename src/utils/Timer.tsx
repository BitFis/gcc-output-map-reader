class Timer {
  constructor(private start = Date.now()) {}

  ElapsedMs(): number {
    return Date.now() - this.start;
  }

  private static str(num: number, suffix: string) {
    return num ? `${num}${suffix}` : "";
  }

  static Format(elapsedMs: number): string {
    const ms = elapsedMs % 60;
    elapsedMs -= ms;
    const sec = Math.floor((elapsedMs / 60) % 60);
    elapsedMs -= sec * 60;
    const min = Math.floor((elapsedMs / 60 / 60) % 60);
    elapsedMs -= min * 60 * 60;
    const hours = Math.floor(elapsedMs / 60 / 60 / 60);
    elapsedMs -= hours * 60 * 60 * 60;

    const res = [
      Timer.str(hours, "h"),
      Timer.str(min, "min"),
      Timer.str(sec, "s"),
      Timer.str(ms, "ms"),
    ];

    return res.join(" ").trim();
  }
}
export default Timer;
