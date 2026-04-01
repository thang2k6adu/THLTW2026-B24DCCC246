import { getStorageData, setStorageData } from '@/utils/storage';

export interface IClub {
  id: string;
  avatar: string;
  name: string;
  establishedDate: string;
  description: string; // HTML string
  president: string;
  isActive: boolean;
}

const CLUB_STORAGE_KEY = 'CLUB_MANAGEMENT_CLUBS';

const defaultClubs: IClub[] = [
  {
    id: '1',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=IT',
    name: 'Câu lạc bộ IT',
    establishedDate: '2020-01-01',
    description: '<p>Câu lạc bộ dành cho người đam mê công nghệ</p>',
    president: 'Nguyễn Văn A',
    isActive: true,
  },
  {
    id: '2',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Music',
    name: 'Câu lạc bộ Âm nhạc',
    establishedDate: '2021-05-15',
    description: '<p>Nơi giao lưu âm nhạc và các bộ môn nghệ thuật</p>',
    president: 'Trần Thị B',
    isActive: true,
  }
];

export const getClubs = async (): Promise<IClub[]> => {
  return await getStorageData<IClub[]>(CLUB_STORAGE_KEY, defaultClubs);
};

export const saveClubs = async (clubs: IClub[]): Promise<void> => {
  return await setStorageData(CLUB_STORAGE_KEY, clubs);
};
