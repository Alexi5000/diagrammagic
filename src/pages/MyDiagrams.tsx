import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagramStore } from '@/hooks/useDiagramStore';
import { DiagramCard } from '@/components/diagrams/DiagramCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import Navigation from '@/components/landing/Navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown, FileQuestion, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortOption = 'recent' | 'alphabetical' | 'type';

const MyDiagrams = () => {
  const navigate = useNavigate();
  const { diagrams, deleteDiagram, isLoading } = useDiagramStore();
  
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [diagramToDelete, setDiagramToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sort diagrams based on selected option
  const sortedDiagrams = useMemo(() => {
    const sorted = [...diagrams];
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case 'alphabetical':
        return sorted.sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      case 'type':
        return sorted.sort((a, b) => 
          a.type.localeCompare(b.type)
        );
      default:
        return sorted;
    }
  }, [diagrams, sortBy]);

  const handleEdit = (id: string) => {
    navigate(`/editor?diagram=${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setDiagramToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (diagramToDelete) {
      setIsDeleting(true);
      try {
        deleteDiagram(diagramToDelete);
        setShowDeleteConfirm(false);
        setDiagramToDelete(null);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCreateDiagram = () => {
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-5xl font-bold text-white mb-3">
                  My Diagrams
                </h1>
                <p className="text-lg text-slate-300">
                  Manage and organize your saved diagrams
                </p>
              </div>

              {/* Sort Dropdown */}
              {diagrams.length > 0 && (
                <div className="flex items-center gap-3">
                  <ArrowUpDown size={20} className="text-slate-400" />
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white backdrop-blur-md">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="alphabetical">A-Z</SelectItem>
                      <SelectItem value="type">By Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-electric-blue" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && diagrams.length === 0 && (
            <div className="animate-fade-in">
              <EmptyState
                icon={FileQuestion}
                title="No diagrams yet"
                description="Start creating amazing diagrams to see them here. Use AI or create manually from templates."
                action={{
                  label: "Create Diagram",
                  onClick: handleCreateDiagram
                }}
              />
            </div>
          )}

          {/* Diagram Grid */}
          {!isLoading && sortedDiagrams.length > 0 && (
            <div className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
              "animate-fade-in"
            )}>
              {sortedDiagrams.map((diagram) => (
                <DiagramCard 
                  key={diagram.id}
                  diagram={diagram}
                  onDelete={handleDeleteClick}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete diagram?"
        description="This action cannot be undone. This will permanently delete your diagram."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
};

export default MyDiagrams;
