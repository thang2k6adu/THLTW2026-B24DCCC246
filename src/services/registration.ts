import { getStorageData, setStorageData } from '@/utils/storage';

export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface IRegistrationHistory {
  action: string;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface IRegistration {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  address: string;
  strengths: string;
  clubId: string;
  reason: string;
  status: RegistrationStatus;
  notes?: string; 
  history: IRegistrationHistory[];
}

const REGISTRATION_STORAGE_KEY = 'CLUB_MANAGEMENT_REGISTRATIONS';

export const getRegistrations = async (): Promise<IRegistration[]> => {
  return await getStorageData<IRegistration[]>(REGISTRATION_STORAGE_KEY, []);
};

export const saveRegistrations = async (data: IRegistration[]): Promise<void> => {
  return await setStorageData(REGISTRATION_STORAGE_KEY, data);
};
