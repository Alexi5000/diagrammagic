
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Check, X, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ApiKeyInputProps } from '@/types';

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ className, onKeySaved }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showSecurityDialog, setShowSecurityDialog] = useState<boolean>(false);
  const [pendingApiKey, setPendingApiKey] = useState<string>('');

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    // Simple validation - OpenAI keys typically start with "sk-"
    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API keys typically start with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    // Show security warning dialog before saving
    setPendingApiKey(apiKey);
    setShowSecurityDialog(true);
  };

  const handleConfirmSave = () => {
    localStorage.setItem('openai_api_key', pendingApiKey);
    setIsSaved(true);
    setIsVisible(false);
    setShowSecurityDialog(false);
    setPendingApiKey('');
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved locally",
    });
  };

  const handleCancelSave = () => {
    setShowSecurityDialog(false);
    setPendingApiKey('');
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsSaved(false);
    toast({
      title: "API Key Removed",
      description: "Your OpenAI API key has been removed",
    });
  };

  return (
    <>
      <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
        {/* Security Warning Banner */}
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription className="text-sm">
            API keys are stored in your browser's localStorage (not encrypted). This is suitable for testing only. 
            Browser extensions and XSS vulnerabilities could access your key. For production use, implement a backend proxy.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Key className="h-4 w-4 mr-2 text-slate-500" />
            <span className="text-sm font-medium">OpenAI API Key</span>
          </div>
          {isSaved && (
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <Check className="h-3 w-3 mr-1" />
              Saved
            </div>
          )}
        </div>

      {isVisible ? (
        <div className="space-y-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="text-sm"
          />
          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSaveKey}>Save Key</Button>
            <Button size="sm" variant="outline" onClick={() => setIsVisible(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex space-x-2">
          {isSaved ? (
            <>
              <Button size="sm" variant="outline" onClick={() => setIsVisible(true)}>
                Update Key
              </Button>
              <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={handleRemoveKey}>
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setIsVisible(true)}>
              Add API Key
            </Button>
          )}
        </div>
      )}
      </div>

      {/* Security Confirmation Dialog */}
      <AlertDialog open={showSecurityDialog} onOpenChange={setShowSecurityDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Security Warning: Client-Side Key Storage
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-sm">
              <p className="font-semibold">Your API key will be stored in browser localStorage where it can be accessed by:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Browser extensions you've installed</li>
                <li>Any JavaScript code on this page</li>
                <li>XSS vulnerabilities (if any exist)</li>
              </ul>
              <p className="font-semibold text-destructive">
                Your OpenAI API key is linked to billing. Only proceed if this is for testing or demo purposes.
              </p>
              <p className="text-xs text-muted-foreground">
                For production applications, implement a backend proxy to store API keys securely on the server.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSave}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmSave}
              className="bg-destructive hover:bg-destructive/90"
            >
              I Understand, Save Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ApiKeyInput;
