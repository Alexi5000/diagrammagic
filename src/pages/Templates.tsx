import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { templates } from '@/data/templates';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, FileText, Plus } from 'lucide-react';
import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';

type Category = 'all' | 'business' | 'technical' | 'education';
type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';
type SortBy = 'popular' | 'name';

export default function Templates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>('all');
  const [sortBy, setSortBy] = useState<SortBy>('popular');

  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((t) => t.difficulty === difficultyFilter);
    }

    // Sort
    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => b.usageCount - a.usageCount);
    } else {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchQuery, categoryFilter, difficultyFilter, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 -z-10 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <Navigation />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Diagram{' '}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Templates
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
              Start with professionally crafted Mermaid diagrams. Browse by category, difficulty, or search for what you need.
            </p>
            <Button
              onClick={() => navigate('/editor')}
              className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-medium shadow-lg shadow-blue-500/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start from Scratch
            </Button>
          </div>

          {/* Filters Section */}
          <GlassPanel className="mb-8 animate-scale-in">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-slate-400 flex items-center gap-2">
                  <Filter size={16} />
                  Category:
                </span>
                {(['all', 'business', 'technical', 'education'] as Category[]).map((cat) => (
                  <Button
                    key={cat}
                    variant={categoryFilter === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCategoryFilter(cat)}
                    className={
                      categoryFilter === cat
                        ? 'bg-gradient-to-r from-blue-500 to-violet-600 text-white'
                        : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700/50'
                    }
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Difficulty and Sort */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as Difficulty)}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GlassPanel>

          {/* Results Count */}
          <div className="mb-6 text-slate-400 text-sm">
            Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template, index) => (
                <div key={template.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                  <TemplateCard template={template} />
                </div>
              ))}
            </div>
          ) : (
            <GlassPanel className="text-center py-16">
              <FileText size={64} className="mx-auto mb-4 text-slate-600" />
              <h3 className="text-2xl font-bold text-white mb-2">No templates found</h3>
              <p className="text-slate-400 mb-6">
                Try adjusting your filters or search query
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setDifficultyFilter('all');
                }}
                className="bg-gradient-to-r from-blue-500 to-violet-600 text-white"
              >
                Clear Filters
              </Button>
            </GlassPanel>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
