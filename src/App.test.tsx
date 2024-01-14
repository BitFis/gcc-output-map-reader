import { render, act } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

test("renders learn react link", async () => {
  await act(async () => {
    render(<App />, { wrapper: BrowserRouter });
  });
});
