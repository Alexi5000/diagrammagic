import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDiagramStore } from '@/hooks/useDiagramStore';
import { useAuth } from '@/contexts/AuthContext';
import { DiagramCard } from '@/components/diagrams/DiagramCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import Navigation from '@/components/landing/Navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown, FileQuestion, Plus, Loader2, Cloud, CloudOff, RefreshCw, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortOption = 'recent' | 'alphabetical' | 'type';

const MyDiagrams = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { diagrams, deleteDiagram, updateDiagram, isLoading, isCloudMode, syncToCloud, isSyncing } = useDiagramStore();
  
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

  const handleTitleUpdate = (id: string, newTitle: string) => {
    updateDiagram(id, { title: newTitle });
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
    <div className="min-h-screen bg-[#020202]">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-5xl font-bold text-white">
                    My Diagrams
                  </h1>
                  {/* Cloud/Local indicator */}
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                    isCloudMode 
                      ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  )}>
                    {isCloudMode ? <Cloud className="h-4 w-4" /> : <CloudOff className="h-4 w-4" />}
                    <span>{isCloudMode ? 'Cloud' : 'Local'}</span>
                  </div>
                </div>
                <p className="text-lg text-white/60">
                  {isCloudMode 
                    ? 'Your diagrams are saved to the cloud and synced across devices.'
                    : 'Diagrams are saved locally. Sign in to sync to cloud.'
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Sync button for guests with local diagrams */}
                {!isCloudMode && diagrams.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('/auth')}
                    className="border-fuchsia-500/30 text-fuchsia-400 hover:bg-fuchsia-500/10"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign in to sync
                  </Button>
                )}

                {/* Sync button for authenticated users */}
                {isCloudMode && (
                  <Button
                    variant="outline"
                    onClick={syncToCloud}
                    disabled={isSyncing}
                    className="border-white/10 text-white/70 hover:bg-white/5"
                  >
                    {isSyncing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Sync local diagrams
                  </Button>
                )}

                {/* Sort Dropdown */}
                {diagrams.length > 0 && (
                  <div className="flex items-center gap-3">
                    <ArrowUpDown size={20} className="text-white/40" />
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                      <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white backdrop-blur-md">
                        <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="alphabetical">A-Z</SelectItem>
                        <SelectItem value="type">By Type</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Guest mode prompt */}
          {!user && diagrams.length === 0 && (
            <div className="glass-card rounded-2xl p-8 mb-8 text-center">
              <CloudOff className="h-12 w-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Guest Mode</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Your diagrams are saved locally in this browser. Sign in to save them to the cloud and access from anywhere.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700"
              >
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-fuchsia-400" />
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
                onTitleUpdate={handleTitleUpdate}
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
