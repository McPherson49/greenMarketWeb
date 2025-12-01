// EXTENDED TYPES FOR NESTED OBJECTS
export interface BusinessInfo {
  // Define business properties based on your API
  name?: string;
  address?: string;
  // Add other business fields as needed
}

export interface UserSettings {
  // Define settings properties
  notifications?: boolean;
  language?: string;
  // Add other settings fields as needed
}

export interface SocialAccounts {
  // Define social media properties
  facebook?: string;
  twitter?: string;
  instagram?: string;
  // Add other social fields as needed
}

// UPDATE THE MAIN INTERFACE WITH SPECIFIC TYPES
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  avatar: string;
  banner: string | null;
  business: BusinessInfo | null;
  settings: UserSettings | null;
  socials: SocialAccounts | null;
  tags: string[] | null;
  fcm_token: string | null;
  email_verified_at: string | null;
  provider_name: string | null;
  provider_id: string | null;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_admin: boolean;
  product_count: number;
}