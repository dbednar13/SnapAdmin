import { NavLink, useLocation } from 'react-router';

const navigationItems = [
  { to: '/admin-config', label: 'Admin Config' },
  { to: '/snapraid-config', label: 'SnapRAID Config' },
  { to: '/command-center', label: 'Command Center' },
];

export function AppNavigation() {
  const location = useLocation();

  return (
    <nav className="space-x-4 text-sm text-gray-600 dark:text-neutral-300">
      {navigationItems.map(({ to, label }) => {
        const isActive = location.pathname === to;

        return (
          <NavLink
            key={to}
            to={to}
            end={to === '/command-center'}
            className={({ isActive: linkIsActive }) =>
              `px-3 py-1 rounded ${
                linkIsActive ||
                (to === '/command-center' && location.pathname === '/')
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-neutral-700'
              }`
            }
            aria-current={isActive ? 'page' : undefined}
          >
            {label}
          </NavLink>
        );
      })}
    </nav>
  );
}
