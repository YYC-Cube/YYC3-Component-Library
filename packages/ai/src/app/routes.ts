/**
 * @file routes.ts
 * @description Application route configuration with React Router Data mode
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags routes, navigation, react-router
 */

import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import LayoutDesignerPage from "./pages/LayoutDesignerPage";
import WorkbenchPage from "./pages/WorkbenchPage";
import SettingsPage from "./pages/SettingsPage";
import AISettingsPage from "./pages/AISettingsPage";
import MultiInstancePage from "./pages/MultiInstancePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/layout-designer",
    Component: LayoutDesignerPage,
  },
  {
    path: "/ai-workbench",
    Component: WorkbenchPage,
  },
  {
    path: "/settings",
    Component: SettingsPage,
  },
  {
    path: "/ai-settings",
    Component: AISettingsPage,
  },
  {
    path: "/multi-instance",
    Component: MultiInstancePage,
  },
  {
    path: "*",
    Component: HomePage,
  },
]);