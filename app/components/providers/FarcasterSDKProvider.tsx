'use client';

import sdk, {
  AddMiniApp,
} from '@farcaster/miniapp-sdk';
import { useCallback, useEffect, useState, createContext, useContext, ReactNode } from 'react';

interface FarcasterSDKContextType {
  isSDKLoaded: boolean;
  context: any;
  openUrl: (url: string) => Promise<void>;
  close: () => Promise<void>;
  added: boolean;
  notificationDetails: any | null;
  lastEvent: string;
  addFrame: () => Promise<void>;
  addFrameResult: string;
  sdk: typeof sdk;
}

const FarcasterSDKContext = createContext<FarcasterSDKContextType | undefined>(undefined);

export function useFarcasterSDK() {
  const context = useContext(FarcasterSDKContext);
  if (context === undefined) {
    throw new Error('useFarcasterSDK must be used within a FarcasterSDKProvider');
  }
  return context;
}

// For backward compatibility with existing useSDK hooks
export function useSDK() {
  const context = useFarcasterSDK();
  return {
    isSDKReady: context.isSDKLoaded,
    sdkError: null,
    sdk: context.sdk,
  };
}

function useFrame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<any>();
  const [added, setAdded] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState<any | null>(null);
  const [lastEvent, setLastEvent] = useState('');
  const [addFrameResult, setAddFrameResult] = useState('');

  // SDK actions only work in mini app clients, so this pattern supports browser actions as well
  const openUrl = useCallback(
    async (url: string) => {
      if (context) {
        await sdk.actions.openUrl(url);
      } else {
        window.open(url, '_blank');
      }
    },
    [context]
  );

  const close = useCallback(async () => {
    if (context) {
      await sdk.actions.close();
    } else {
      window.close();
    }
  }, [context]);

  const addFrame = useCallback(async () => {
    try {
      setNotificationDetails(null);
      const result = await sdk.actions.addFrame();

      if (result.notificationDetails) {
        setNotificationDetails(result.notificationDetails);
      }
      setAddFrameResult(
        result.notificationDetails
          ? `Added, got notification token ${result.notificationDetails.token} and url ${result.notificationDetails.url}`
          : 'Added, got no notification details'
      );
    } catch (error) {
      if (
        error instanceof AddMiniApp.RejectedByUser ||
        error instanceof AddMiniApp.InvalidDomainManifest
      ) {
        setAddFrameResult(`Not added: ${error.message}`);
      } else {
        setAddFrameResult(`Error: ${error}`);
      }
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        console.log('🔄 FarcasterSDK: Loading SDK context...');
        
        const context = await sdk.context;
        console.log('✅ FarcasterSDK: Context loaded:', !!context);
        console.log('🔧 Context details:', {
          user: context.user ? { fid: context.user.fid, username: context.user.username } : null,
          location: context.location,
        });
        
        setContext(context);
        setIsSDKLoaded(true);

        // Set up event listeners with type assertions to bypass strict typing
        (sdk as any).on('frameAdded', ({ notificationDetails }: any) => {
          console.log('📱 FarcasterSDK: Frame added event');
          setAdded(true);
          setNotificationDetails(notificationDetails ?? null);
          setLastEvent('Frame added');
        });

        (sdk as any).on('frameAddRejected', ({ reason }: any) => {
          console.log('❌ FarcasterSDK: Frame add rejected:', reason);
          setAdded(false);
          setLastEvent(`Frame add rejected: ${reason}`);
        });

        (sdk as any).on('frameRemoved', () => {
          console.log('🗑️ FarcasterSDK: Frame removed event');
          setAdded(false);
          setLastEvent('Frame removed');
        });

        (sdk as any).on('notificationsEnabled', ({ notificationDetails }: any) => {
          console.log('🔔 FarcasterSDK: Notifications enabled');
          setNotificationDetails(notificationDetails ?? null);
          setLastEvent('Notifications enabled');
        });

        (sdk as any).on('notificationsDisabled', () => {
          console.log('🔕 FarcasterSDK: Notifications disabled');
          setNotificationDetails(null);
          setLastEvent('Notifications disabled');
        });

        (sdk as any).on('primaryButtonClicked', () => {
          console.log('🖱️ FarcasterSDK: Primary button clicked');
          setLastEvent('Primary button clicked');
        });

        // Call ready action - this is the critical part!
        console.log('📞 FarcasterSDK: Calling sdk.actions.ready()...');
        await sdk.actions.ready({});
        console.log('✅ FarcasterSDK: sdk.actions.ready() completed successfully!');
        
      } catch (error) {
        console.error('❌ FarcasterSDK: Failed to load SDK:', error);
        // Still mark as loaded to prevent infinite retry
        setIsSDKLoaded(true);
      }
    };

    if (sdk && !isSDKLoaded) {
      console.log('🔄 FarcasterSDK: Starting SDK initialization...');
      load();
      
      return () => {
        console.log('🧹 FarcasterSDK: Cleaning up event listeners...');
        (sdk as any).removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  return {
    isSDKLoaded,
    context,
    added,
    notificationDetails,
    lastEvent,
    addFrame,
    addFrameResult,
    openUrl,
    close,
  };
}

interface FarcasterSDKProviderProps {
  children: ReactNode;
}

export function FarcasterSDKProvider({ children }: FarcasterSDKProviderProps) {
  const frameContext = useFrame();

  const value: FarcasterSDKContextType = {
    ...frameContext,
    sdk,
  };

  return (
    <FarcasterSDKContext.Provider value={value}>
      {children}
    </FarcasterSDKContext.Provider>
  );
}