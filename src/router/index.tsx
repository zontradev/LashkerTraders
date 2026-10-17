import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState<string>(() => window.location.pathname || '/');
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    () => new URLSearchParams(window.location.search)
  );
  const [, startTransition] = useTransition();

  useEffect(() => {
    const handlePopState = () => {
      startTransition(() => {
        setPath(window.location.pathname);
        setSearchParams(new URLSearchParams(window.location.search));
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (to.startsWith('http://') || to.startsWith('https://') || to.startsWith('mailto:') || to.startsWith('tel:') || to.startsWith('wa.me')) {
      window.location.href = to;
      return;
    }

    const [targetPath, queryString] = to.split('?');
    if (window.location.pathname !== targetPath || window.location.search !== (queryString ? `?${queryString}` : '')) {
      window.history.pushState({}, '', to);
      startTransition(() => {
        setPath(targetPath || '/');
        setSearchParams(new URLSearchParams(queryString || ''));
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Extract dynamic params if matching routes like /product/:slug or /category/:slug
  const params: Record<string, string> = {};
  const segments = path.split('/').filter(Boolean);
  if (segments[0] === 'product' && segments[1]) {
    params.slug = segments[1];
  } else if (segments[0] === 'category' && segments[1]) {
    params.slug = segments[1];
  }

  return (
    <RouterContext.Provider value={{ path, navigate, params, searchParams }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

export function Link({
  to,
  children,
  className,
  onClick,
  target,
  rel,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && (!target || target === '_self') && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className} target={target} rel={rel} {...props}>
      {children}
    </a>
  );
}
