import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bookmark,
  BookmarkCheck,
  Download,
  FileText,
  Trash2,
  Sun,
  Moon,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Template } from '@/types';
import { templates } from '@/data/templates';

interface ToolbarProps {
  onSave: () => void;
  isSaved?: boolean;
  onExport: () => void;
  onTemplateSelect: (template: Template) => void;
  onClear: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onSettings: () => void;
  className?: string;
}

// Reusable IconButton with Tooltip
const IconButtonWithTooltip = ({
  icon: Icon,
  tooltip,
  onClick,
  variant = "ghost",
  className,
  ariaLabel,
}: {
  icon: React.ElementType;
  tooltip: string;
  onClick: () => void;
  variant?: "ghost" | "default" | "outline";
  className?: string;
  ariaLabel: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={variant}
        size="icon"
        onClick={onClick}
        className={cn("h-9 w-9", className)}
        aria-label={ariaLabel}
      >
        <Icon className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  isSaved = false,
  onExport,
  onTemplateSelect,
  onClear,
  isDarkMode,
  toggleTheme,
  onSettings,
  className,
}) => {
  // Group templates by category
  const businessTemplates = templates.filter(t => t.category === 'business');
  const technicalTemplates = templates.filter(t => t.category === 'technical');
  const educationTemplates = templates.filter(t => t.category === 'education');

  return (
    <TooltipProvider>
      <header
        className={cn(
          "sticky top-0 z-50 w-full",
          "backdrop-blur-glass bg-glass-white",
          "border-b border-glass-border",
          "shadow-lg",
          "animate-fade-in",
          className
        )}
      >
        <div className="container max-w-full px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section: Logo + Title */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-electric-blue to-neon-violet flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white hidden sm:block">
                AI Diagram Creator
              </h1>
            </div>

            {/* Right Section: Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Save Button */}
              <IconButtonWithTooltip
                icon={isSaved ? BookmarkCheck : Bookmark}
                tooltip={isSaved ? "Saved" : "Save diagram"}
                onClick={onSave}
                ariaLabel="Save diagram"
                className={isSaved ? "text-green-600 dark:text-green-400" : ""}
              />

              {/* Export Button */}
              <IconButtonWithTooltip
                icon={Download}
                tooltip="Export as SVG"
                onClick={onExport}
                ariaLabel="Export diagram"
              />

              {/* Templates Dropdown */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Choose template">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose template</p>
                  </TooltipContent>
                </Tooltip>

                <DropdownMenuContent align="end" className="w-64 max-h-96 overflow-y-auto bg-popover z-50">
                  {/* Business Templates */}
                  {businessTemplates.length > 0 && (
                    <>
                      <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                        Business
                      </DropdownMenuLabel>
                      <DropdownMenuGroup>
                        {businessTemplates.map((template) => (
                          <DropdownMenuItem
                            key={template.id}
                            onClick={() => onTemplateSelect(template)}
                            className="flex flex-col items-start gap-1 cursor-pointer"
                          >
                            <span className="font-medium text-sm">{template.name}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {template.description}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {/* Technical Templates */}
                  {technicalTemplates.length > 0 && (
                    <>
                      <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                        Technical
                      </DropdownMenuLabel>
                      <DropdownMenuGroup>
                        {technicalTemplates.map((template) => (
                          <DropdownMenuItem
                            key={template.id}
                            onClick={() => onTemplateSelect(template)}
                            className="flex flex-col items-start gap-1 cursor-pointer"
                          >
                            <span className="font-medium text-sm">{template.name}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {template.description}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {/* Education Templates */}
                  {educationTemplates.length > 0 && (
                    <>
                      <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                        Education
                      </DropdownMenuLabel>
                      <DropdownMenuGroup>
                        {educationTemplates.map((template) => (
                          <DropdownMenuItem
                            key={template.id}
                            onClick={() => onTemplateSelect(template)}
                            className="flex flex-col items-start gap-1 cursor-pointer"
                          >
                            <span className="font-medium text-sm">{template.name}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {template.description}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Button */}
              <IconButtonWithTooltip
                icon={Trash2}
                tooltip="Clear diagram"
                onClick={onClear}
                ariaLabel="Clear diagram"
                className="text-destructive hover:text-destructive"
              />

              {/* Theme Toggle */}
              <IconButtonWithTooltip
                icon={isDarkMode ? Sun : Moon}
                tooltip={isDarkMode ? "Light mode" : "Dark mode"}
                onClick={toggleTheme}
                ariaLabel="Toggle theme"
              />

              {/* Settings Button */}
              <IconButtonWithTooltip
                icon={Settings}
                tooltip="Settings"
                onClick={onSettings}
                ariaLabel="Open settings"
              />
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default Toolbar;
