import { getStorageData, setStorageData } from '@/utils/storage';
import moment from 'moment';

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

const REGISTRATION_STORAGE_KEY = 'CLUB_MANAGEMENT_REGISTRATIONS_V2';

const defaultRegistrations: IRegistration[] = [
  {
    id: 'reg1',
    candidateName: 'Đặng Tuấn E',
    email: 'tuane@ptit.edu.vn',
    phone: '0987654321',
    gender: 'Nam',
    address: 'Hà Nội',
    strengths: 'Lập trình Web, React',
    clubId: '1',
    reason: 'Muốn học hỏi công nghệ',
    status: 'Approved',
    notes: 'Duyệt vì chuyên môn rất tốt',
    history: [
      { action: 'Tạo đơn', actor: 'Đặng Tuấn E', timestamp: moment().subtract(5, 'days').toISOString() },
      { action: 'Duyệt đơn', actor: 'Admin', timestamp: moment().subtract(1, 'days').toISOString(), note: 'Tuyệt vời' }
    ]
  },
  {
    id: 'reg2',
    candidateName: 'Ngô Thu F',
    email: 'thuf@ptit.edu.vn',
    phone: '0912345678',
    gender: 'Nữ',
    address: 'Hải Phòng',
    strengths: 'Hát, Nhảy',
    clubId: '2',
    reason: 'Muốn được đứng trên sân khấu lớn',
    status: 'Pending',
    history: [
      { action: 'Tạo đơn', actor: 'Ngô Thu F', timestamp: moment().subtract(2, 'hours').toISOString() }
    ]
  },
  {
    id: 'reg3',
    candidateName: 'Trần Văn G',
    email: 'vang@ptit.edu.vn',
    phone: '0922334455',
    gender: 'Nam',
    address: 'Nam Định',
    strengths: 'Không có sở trường nổi bật',
    clubId: '1',
    reason: 'Đăng ký cho vui vì bạn rủ',
    status: 'Rejected',
    notes: 'Không có định hướng rõ ràng và ít nghiêm túc',
    history: [
      { action: 'Tạo đơn', actor: 'Trần Văn G', timestamp: moment().subtract(10, 'days').toISOString() },
      { action: 'Từ chối đơn', actor: 'Admin', timestamp: moment().subtract(8, 'days').toISOString(), note: 'Không phù hợp tiêu chí câu lạc bộ năm nay' }
    ]
  },
  {
    id: 'reg4',
    candidateName: 'Phạm Hương H',
    email: 'huongh@ptit.edu.vn',
    phone: '0977665544',
    gender: 'Nữ',
    address: 'Hà Nội',
    strengths: 'Giao tiếp Tiếng Anh rất tốt',
    clubId: '3',
    reason: 'Trau dồi và giao lưu ngoại ngữ. Muốn đi du học',
    status: 'Approved',
    history: [
      { action: 'Tạo đơn', actor: 'Phạm Hương H', timestamp: moment().subtract(20, 'days').toISOString() }
    ]
  },
  {
    id: 'reg5',
    candidateName: 'Hoàng Minh K',
    email: 'minhk@ptit.edu.vn',
    phone: '0955112233',
    gender: 'Nam',
    address: 'Bắc Ninh',
    strengths: 'Chơi bóng chuyền ấn tượng',
    clubId: '4',
    reason: 'Tham gia giải đấu thể thao trường chuyên',
    status: 'Pending',
    history: [
      { action: 'Tạo đơn', actor: 'Hoàng Minh K', timestamp: moment().subtract(1, 'days').toISOString() }
    ]
  }
];

export const getRegistrations = async (): Promise<IRegistration[]> => {
  return await getStorageData<IRegistration[]>(REGISTRATION_STORAGE_KEY, defaultRegistrations);
};

export const saveRegistrations = async (data: IRegistration[]): Promise<void> => {
  return await setStorageData(REGISTRATION_STORAGE_KEY, data);
};
