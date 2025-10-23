import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, X } from 'lucide-react';
import { DiagramType } from '@/types';
import { DiagramTitleSchema, DiagramDescriptionSchema, TagSchema } from '@/lib/validation';
import { z } from 'zod';
import { toast } from '@/components/ui/use-toast';

interface SaveDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { title: string; description?: string; tags: string[] }) => void;
  defaultTitle: string;
  diagramType: DiagramType;
  isSaving?: boolean;
}

const SaveDiagramDialog: React.FC<SaveDiagramDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  defaultTitle,
  diagramType,
  isSaving = false,
}) => {
  const [title, setTitle] = useState<string>(defaultTitle);
  const [description, setDescription] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  // Reset form when dialog opens with new default title
  useEffect(() => {
    if (open) {
      setTitle(defaultTitle);
      setDescription('');
      setTagInput('');
      setTags([]);
    }
  }, [open, defaultTitle]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    
    // Validate tag
    try {
      TagSchema.parse(trimmedTag);
      
      if (!tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setTagInput('');
      } else {
        toast({
          title: "Duplicate Tag",
          description: "This tag has already been added",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid Tag",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all inputs
    try {
      const validatedTitle = DiagramTitleSchema.parse(title);
      const validatedDescription = DiagramDescriptionSchema.parse(description);
      
      onSave({
        title: validatedTitle,
        description: validatedDescription || undefined,
        tags,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Save Diagram</DialogTitle>
            <DialogDescription>
              Give your {diagramType} a title and optional metadata to help organize your diagrams.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title Input */}
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter diagram title..."
                required
                autoFocus
                disabled={isSaving}
                className="w-full"
              />
            </div>

            {/* Description Textarea */}
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={3}
                disabled={isSaving}
                className="resize-none"
              />
            </div>

            {/* Tags Input */}
            <div className="grid gap-2">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add tags (press Enter)..."
                  disabled={isSaving}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || isSaving}
                >
                  Add
                </Button>
              </div>

              {/* Tags Display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="pl-3 pr-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={isSaving}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Diagram'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveDiagramDialog;
