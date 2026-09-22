import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useApiQuery } from '@/hooks/use-api-query';
import type { SearchResults } from '@/types';

const GROUP_LABELS: Record<keyof SearchResults, string> = {
  users: 'Users',
  departments: 'Departments',
  subjects: 'Subjects',
  classes: 'Classes',
};

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { data, isLoading } = useApiQuery<SearchResults>('search', {
    enabled: open && debouncedQuery.length > 0,
    searchParams: { q: debouncedQuery },
  });

  const groups = (Object.keys(GROUP_LABELS) as (keyof SearchResults)[]).filter(
    (key) => (data?.[key]?.length ?? 0) > 0
  );

  return (
    <>
      <Button
        variant="outline"
        className="text-muted-foreground w-48 justify-start gap-2 sm:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="bg-muted rounded px-1.5 py-0.5 text-xs">Ctrl K</kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search across the app</DialogDescription>
        </DialogHeader>
        <DialogContent className="overflow-hidden p-0">
          <Command shouldFilter={false}>
            <CommandInput placeholder="Search users, departments, subjects, classes..." value={query} onValueChange={setQuery} />
            <CommandList>
              {debouncedQuery.length === 0 && <CommandEmpty>Start typing to search...</CommandEmpty>}
              {debouncedQuery.length > 0 && !isLoading && groups.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              {groups.map((key) => (
                <CommandGroup key={key} heading={GROUP_LABELS[key]}>
                  {data![key].map((item) => (
                    <CommandItem
                      key={`${item.resource}-${item.id}`}
                      value={`${item.resource}-${item.id}`}
                      onSelect={() => {
                        setOpen(false);
                        setQuery('');
                        navigate(`/${item.resource}/show/${item.id}`);
                      }}
                    >
                      <span>{item.label}</span>
                      <span className="text-muted-foreground ml-auto text-xs">{item.sublabel}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};
