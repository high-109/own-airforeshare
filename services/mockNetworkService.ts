import { SharedItem, ItemType, NetworkStatus } from '../types';

const STORAGE_KEY = 'wifidrop_shared_items';
const NETWORK_ID_KEY = 'wifidrop_network_id';
const CLIENT_ID_KEY = 'wifidrop_client_id';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Simulate "Same Wi-Fi" by using a fixed ID if not present, or random based on logic
const getNetworkId = (): string => {
  let netId = localStorage.getItem(NETWORK_ID_KEY);
  if (!netId) {
    // In a real app, this would be the Public IP fetched from an API
    // For this demo, we use a fixed "Demo-Network" so user sees it work immediately
    netId = '192.168.1.x (Demo)';
    localStorage.setItem(NETWORK_ID_KEY, netId);
  }
  return netId;
};

const getClientId = (): string => {
  let clientId = sessionStorage.getItem(CLIENT_ID_KEY);
  if (!clientId) {
    clientId = generateId();
    sessionStorage.setItem(CLIENT_ID_KEY, clientId);
  }
  return clientId;
};

export const getNetworkStatus = (): NetworkStatus => {
  return {
    ip: getNetworkId(),
    networkId: getNetworkId(),
    deviceCount: Math.floor(Math.random() * 3) + 1, // Simulated count
  };
};

export const getItems = (): SharedItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const allItems: SharedItem[] = JSON.parse(raw);
    const now = Date.now();
    const networkId = getNetworkId();
    
    // Filter by network and expiration
    const validItems = allItems.filter(
      (item) => item.networkId === networkId && item.expiresAt > now
    );
    
    // Clean up storage if needed (remove old items)
    if (allItems.length !== validItems.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validItems));
    }
    
    return validItems.sort((a, b) => b.createdAt - a.createdAt);
  } catch (e) {
    console.error("Failed to load items", e);
    return [];
  }
};

export const uploadItem = (
  type: ItemType,
  content: string,
  meta: { fileName?: string; fileSize?: string; mimeType?: string; aiSummary?: string } = {},
  durationMinutes: number = 30
): SharedItem => {
  const items = getItems(); // Get current valid items (re-reads storage)
  
  const newItem: SharedItem = {
    id: generateId(),
    type,
    content,
    createdAt: Date.now(),
    expiresAt: Date.now() + durationMinutes * 60 * 1000,
    networkId: getNetworkId(),
    ...meta,
  };

  const updatedItems = [newItem, ...items];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  
  // Trigger a custom event for same-tab updates
  window.dispatchEvent(new Event('storage'));
  
  return newItem;
};

// Clear items for this network
export const clearAll = () => {
   const allItems = getItems();
   const networkId = getNetworkId();
   const otherNetworkItems = allItems.filter(i => i.networkId !== networkId);
   localStorage.setItem(STORAGE_KEY, JSON.stringify(otherNetworkItems));
   window.dispatchEvent(new Event('storage'));
}