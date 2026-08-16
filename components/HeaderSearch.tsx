'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function HeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q');
    if (query) {
      router.push(`/?q=${encodeURIComponent(query as string)}`);
    } else {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center group">
      <Search className="absolute left-3 h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
      <input
        name="q"
        defaultValue={searchParams.get('q') || ''}
        placeholder="Search..."
        className="w-32 sm:w-40 md:w-48 lg:w-64 rounded-full bg-white/10 pl-9 pr-4 py-1.5 text-sm text-white placeholder:text-gray-400 outline-none ring-1 ring-white/10 transition-all duration-300 focus:bg-white/20 focus:ring-white/30 focus:w-48 sm:focus:w-56 md:focus:w-64 lg:focus:w-80"
      />
    </form>
  );
}
