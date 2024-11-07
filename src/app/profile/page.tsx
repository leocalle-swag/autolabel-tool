'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Save, AlertCircle } from 'lucide-react';
import { ApiError } from '@/types/api';
import { storage } from '@/lib/storage';
import Header from '@/components/Header';

const ProfilePage = () => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({text: '', type: ''});
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const savedKey = storage.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = async () => {
    setIsLoading(true);
    try {
      // Salva nel localStorage
      storage.saveApiKey(apiKey);
      
      setMessage({text: 'API Key salvata con successo!', type: 'ok'});
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Errore sconosciuto',
        code: 'API_KEY_ERROR'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Header></Header>
    <div className="container mx-auto p-4 max-w-2xl">
      
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Gestione API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">OpenAI API Key</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Inserisci la tua OpenAI API Key"
              className="font-mono"
            />
            <p className="text-sm text-gray-500">
              La tua API key è salvata nel browser in modo sicuro
            </p>
          </div>

          {message.text && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSaveApiKey}
            disabled={!apiKey || isLoading}
            className="w-full"
          >
            {isLoading ? (
              'Salvataggio...'
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salva API Key
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default ProfilePage;