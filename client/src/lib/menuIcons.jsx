import {
  Folder,
  Layers,
  LayoutDashboard,
  Menu,
  Package,
  Shield,
  Users,
} from "lucide-react";

const ICON_MAP = {
  "layout-dashboard": LayoutDashboard,
  users: Users,
  folder: Folder,
  layers: Layers,
  package: Package,
  menu: Menu,
  shield: Shield,
};

export const getMenuIcon = (iconName) => ICON_MAP[iconName] || LayoutDashboard;
