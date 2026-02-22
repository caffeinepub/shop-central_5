import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

export default function SearchBar() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as { search?: string };
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({
        to: '/',
        search: (prev: any) => ({ ...prev, search: searchTerm || undefined })
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, navigate]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

