import { ThemeProvider } from "@emotion/react";
import Router from "./components/Router";
const theme = {
  colors: {
    primary: "#6B85D3",
    secondary: "#304B9C",
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
