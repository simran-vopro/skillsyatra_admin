import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronDownIcon,
  GridIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import {
  Calendar,
  CreditCard,
  Diamond,
  ListIcon,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { adminUser } = useAuth();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // ✅ Instructor-specific restrictions
  const blocked = ["Manage Sub Admins", "Audit Logs & Activities", "System Settings", "Manage Instructors"];

  // ✅ Grouped Sidebar Items with conditional filtering
  const academics: NavItem[] = useMemo(
    () =>
      [
        { icon: <GridIcon />, name: "Dashboard", path: "/" },
        { icon: <UserCircleIcon />, name: "Manage Students", path: "/users" },
        { icon: <GridIcon />, name: "Manage Courses", path: "/courses" },
        { icon: <TableIcon />, name: "Manage Instructors", path: "/instructors" },
      ].filter((item) => adminUser?.type === "instructor" ? !blocked.includes(item.name) : true),
    [adminUser]
  );

  const administration: NavItem[] = useMemo(
    () =>
      [
        { icon: <TableIcon />, name: "Manage Sub Admins", path: "/subAdmins" },
        { icon: <Calendar />, name: "Practical Scheduling", path: "/scheduling" },
      ].filter((item) => adminUser?.type === "instructor" ? !blocked.includes(item.name) : true),
    [adminUser]
  );

  const finance: NavItem[] = useMemo(
    () =>
      [{ icon: <CreditCard />, name: "Payments & Bills", path: "/payments" }].filter(
        (item) => adminUser?.type === "instructor" ? !blocked.includes(item.name) : true
      ),
    [adminUser]
  );

  const reports: NavItem[] = useMemo(
    () =>
      [
        { icon: <ListIcon />, name: "Certificates & Achievements", path: "/certificates" },
        { icon: <Diamond />, name: "Reports & Analytics", path: "/reports" },
      ].filter((item) => adminUser?.type === "instructor" ? !blocked.includes(item.name) : true),
    [adminUser]
  );

  const system: NavItem[] = useMemo(
    () =>
      [
        { icon: <Users />, name: "Support Tickets", path: "/tickets" },
        { icon: <Users />, name: "Audit Logs & Activities", path: "/audit" },
      ].filter((item) => adminUser?.type === "instructor" ? !blocked.includes(item.name) : true),
    [adminUser]
  );

  const user: NavItem[] = useMemo(
    () =>
      [
        { icon: <User />, name: "Manage Profile", path: "/profile" },
        { icon: <Settings />, name: "System Settings", path: "/settings" },
      ].filter((item) => adminUser?.type === "instructor" ? !blocked.includes(item.name) : true),
    [adminUser]
  );



  // ✅ Submenu handling
  useEffect(() => {
    let submenuMatched = false;
    ["academics", "administration", "finance", "reports", "system", "user"].forEach(
      (menuType) => {
        const items =
          menuType === "academics"
            ? academics
            : menuType === "administration"
              ? administration
              : menuType === "finance"
                ? finance
                : menuType === "reports"
                  ? reports
                  : menuType === "system"
                    ? system
                    : user;

        items.forEach((nav, index) => {
          if (nav.subItems) {
            nav.subItems.forEach((subItem) => {
              if (isActive(subItem.path)) {
                setOpenSubmenu({ type: menuType, index });
                submenuMatched = true;
              }
            });
          }
        });
      }
    );
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);



  const handleSubmenuToggle = (index: number, menuType: string) => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  // ✅ Generic Renderer
  const renderMenuItems = (items: NavItem[], menuType: string) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                }`}
            >
              <span className="menu-item-icon-size">{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              <ChevronDownIcon
                className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                  openSubmenu?.index === index
                  ? "rotate-180 text-brand-500"
                  : ""
                  }`}
              />
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span className="menu-item-icon-size">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {(isExpanded || isHovered || isMobileOpen) ? (
            <span className="text-black dark:text-white font-bold text-3xl flex items-baseline">
              SKILLS YATRA <div className="bg-sky-500 h-2 w-2 ml-1"></div>
            </span>
          ) : (
            <span className="text-black dark:text-white font-bold text-3xl">
              SY <div className="bg-sky-500 h-2 w-2"></div>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6 flex flex-col gap-6">
          <div>
            <h2 className="mb-3 text-xs uppercase text-gray-400">Academics</h2>
            {renderMenuItems(academics, "academics")}
          </div>
          <div>
            <h2 className="mb-3 text-xs uppercase text-gray-400">Administration</h2>
            {renderMenuItems(administration, "administration")}
          </div>
          <div>
            <h2 className="mb-3 text-xs uppercase text-gray-400">Finance</h2>
            {renderMenuItems(finance, "finance")}
          </div>
          <div>
            <h2 className="mb-3 text-xs uppercase text-gray-400">Reports</h2>
            {renderMenuItems(reports, "reports")}
          </div>
          <div>
            <h2 className="mb-3 text-xs uppercase text-gray-400">System</h2>
            {renderMenuItems(system, "system")}
          </div>
          <div>
            <h2 className="mb-3 text-xs uppercase text-gray-400">User</h2>
            {renderMenuItems(user, "user")}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
