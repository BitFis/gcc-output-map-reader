import Timer from "./Timer";

test("Test timer increases expected time", async () => {
  const timer = new Timer();
  await Timer.SleepMs(1000);
  expect(timer.ElapsedMs()).toBeGreaterThanOrEqual(1000);
});

test("Test formatting of timer", () => {
  expect(Timer.Format(59)).toBe("59ms");
  expect(Timer.Format(1000)).toBe("1s");
  expect(Timer.Format(1000 * 1000)).toBe("16min 40s");
  expect(Timer.Format(60 * 1000)).toBe("1min");
  expect(Timer.Format(60 * 60 * 1000)).toBe("1h");
  expect(Timer.Format(60 * 60 * 60 * 1000)).toBe("60h");
  expect(Timer.Format(60 * 60 * 60 * 60 * 1000)).toBe("3600h");
  expect(Timer.Format(60 * 60 * 60 * 60 * 1000 - 1)).toBe(
    "3599h 59min 59s 999ms"
  );
});

test("Test reset timer", async () => {
  const t = new Timer();

  await Timer.SleepMs(200);

  const before = t.ElapsedMs();

  t.Reset();

  expect(t.ElapsedMs()).toBeLessThan(before);
});
