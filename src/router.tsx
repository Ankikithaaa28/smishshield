import { Outlet, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import DetectorPage from "@/pages/DetectorPage";
import ScannerPage from "@/pages/ScannerPage";
import GuidePage from "@/pages/GuidePage";
import NotFoundPage from "@/pages/NotFoundPage";

/**
 * Code-based route tree (no generator plugin): every route is visible in one
 * file, which keeps the app's navigation easy to reason about.
 */
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const detectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/detector",
  component: DetectorPage,
});

const scannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scanner",
  component: ScannerPage,
});

const guideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: GuidePage,
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  detectorRoute,
  scannerRoute,
  guideRoute,
  notFoundRoute,
]);

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
});

// Type-safe `to={...}` and params across the whole app.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
