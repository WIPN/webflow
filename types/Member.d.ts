export interface CustomFields {
  'first-name': string;
  'last-name': string;
  chapter?: string; // Optional if not all members have a chapter
  company?: string; // Optional if not all members have a company
  location?: string; // Optional if not all members have a location
  phone?: string; // Optional if not all members have a phone number
}

export interface Auth {
  email: string;
}

export interface Member {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  chapter?: string;
  company?: string;
  location?: string;
  phone?: string;
}
