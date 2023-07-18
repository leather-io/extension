import { Route } from "react-router-dom";

import { RouteUrls } from "@shared/route-urls";
import { AccountGate } from "@app/routes/account-gate";

import { Swap } from "./swap";
import { SwapContainer } from "./swap-container";

export const swapRoutes = (
  <Route element={<SwapContainer />}>
    <Route
      path={RouteUrls.Swap}
      element={
        <AccountGate>
          <Swap />
        </AccountGate>
      }
    />
  </Route>
)
