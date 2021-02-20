import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./panel/App";

ReactDOM.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,

  document.getElementById("panel")
);
