export type SenseBody = {
  distance?: string;
  light?: string;
  is_available?: string;
  parking_slot?: string;
};

export type SenseData = {
  distance: number;
  light: number;
  is_available: boolean;
  parking_slot: string;
};

export type SenseRow = {
  id: number;
  distance: string;
  light: string;
  is_available: number;
  created_at: string;
};

export type SerializedSenseRow = {
  id: number;
  distance: number;
  light: number;
  is_available: boolean;
  created_at: string;
};

export type RecentSlot = {
  parking_slot?: string;
};

export type TimeSlot = {
  created_at?: string;
};