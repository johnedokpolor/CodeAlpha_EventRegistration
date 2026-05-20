import { Search, X } from "lucide-react";

interface EventFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function EventFilters({
  searchTerm,
  onSearchChange,
}: EventFiltersProps) {
  return (
    <div className="bg-white border border-border rounded-lg p-4 md:p-6 mb-8">
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Search Events
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by event name, location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-3 p-1 hover:bg-secondary rounded transition"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
