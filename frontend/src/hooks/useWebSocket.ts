'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { WebSocketService, ResearchMessage, ResearchStep } from '@/services/websocket';

interface ResearchStatus {
  step: ResearchStep;
  progress: number;
  details: string;
  timestamp: string;
}

export function useWebSocket(url: string) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string[]>([]);
  const [researchStatuses, setResearchStatuses] = useState<ResearchStatus[]>([]);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocketService(url);
    
    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, [url]);

  const handleMessage = useCallback((data: ResearchMessage) => {
    console.log('Received message:', data);
    
    // Add to status list
    if (data.details) {
      const details = data.details;
      setProcessingStatus(prev => [...prev, details]);
    }

    // Add to research statuses
    setResearchStatuses(prev => [
      ...prev, 
      {
        step: data.step,
        progress: data.progress,
        details: data.details || '',
        timestamp: data.timestamp
      }
    ]);

    // Update progress
    setCurrentProgress(data.progress);

    // Handle completion or error
    if (data.step === 'complete' && data.completion) {
      setFinalResult(data.completion);
      setIsProcessing(false);
    } else if (data.step === 'error') {
      const errorMessage = data.details || 'Unknown error';
      setProcessingStatus(prev => [...prev, `Error: ${errorMessage}`]);
      setConnectionError(errorMessage);
      setIsProcessing(false);
    }
  }, []);

  const handleError = useCallback((error: Event) => {
    console.error('WebSocket error:', error);
    setProcessingStatus(prev => [...prev, 'Connection error occurred']);
    setConnectionError('Failed to connect to research service');
    setIsProcessing(false);
  }, []);

  const startResearch = useCallback((query: string) => {
    if (!wsRef.current) {
      setConnectionError('WebSocket service not initialized');
      return;
    }
    
    setIsProcessing(true);
    setProcessingStatus([`Starting research for: "${query}"`]);
    setResearchStatuses([]);
    setFinalResult(null);
    setCurrentProgress(0);
    setConnectionError(null);
    
    // Connect to WebSocket and send the query
    wsRef.current.connect(handleMessage, handleError);
    
    // Small delay to ensure connection is established
    setTimeout(() => {
      if (wsRef.current) {
        wsRef.current.startResearch(query);
      }
    }, 500);
    
  }, [handleMessage, handleError]);

  return {
    isProcessing,
    processingStatus,
    researchStatuses,
    finalResult,
    currentProgress,
    connectionError,
    startResearch
  };
} 