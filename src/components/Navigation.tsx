import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
export const navigationGroups = [
  {
    label: 'Advisory & Solutions',
    items: [
      ['What We Do', '/advisory'],
      ['Success Profiles', '/success-profiles'],
    ],
  },
  {
    label: 'Development',
    items: [
      ['Services We Offer', '/development'],
      ['Websites', '/website-development'],
      ['Custom Applications', '/applications'],
      ['Workflow Automation', '/workflow-automation'],
    ],
  },
];
export function NavigationGroup({ label, items }: (typeof navigationGroups)[number]) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const id = label.startsWith('Advisory') ? 'advisory-navigation' : 'development-navigation';
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);
  useEffect(() => {
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  return (
    <div
      ref={root}
      className="nav-group"
      onMouseEnter={() => {
        if (window.matchMedia('(min-width: 861px) and (hover: hover)').matches) setOpen(true);
      }}
      onMouseLeave={() => {
        if (
          window.matchMedia('(min-width: 861px) and (hover: hover)').matches &&
          !root.current?.contains(document.activeElement)
        )
          setOpen(false);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        className="nav-group-toggle"
        aria-expanded={open}
        aria-controls={id}
        onFocus={() => {
          if (window.matchMedia('(min-width: 861px) and (hover: hover)').matches) setOpen(true);
        }}
        onClick={() =>
          setOpen((v) =>
            window.matchMedia('(min-width: 861px) and (hover: hover)').matches ? true : !v
          )
        }
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            setOpen(false);
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() =>
              root.current?.querySelector<HTMLAnchorElement>('a')?.focus()
            );
          }
        }}
      >
        {label}
        <ChevronDown size={14} aria-hidden />
      </button>
      <div id={id} className="nav-submenu" hidden={!open} role="group" aria-label={label}>
        {items.map(([name, path]) => (
          <NavLink
            key={path}
            to={path}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.stopPropagation();
                root.current?.querySelector<HTMLButtonElement>('button')?.focus();
                setOpen(false);
              }
            }}
          >
            {name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
