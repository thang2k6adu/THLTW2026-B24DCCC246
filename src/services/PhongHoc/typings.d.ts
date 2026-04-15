declare namespace PhongHoc {
  type LoaiPhong = 'Lý thuyết' | 'Thực hành' | 'Hội trường';

  interface IRecord {
    _id?: string;
    maPhong: string;
    tenPhong: string;
    soChoNgoi: number;
    loaiPhong: LoaiPhong | string;
    nguoiPhuTrach: string;
  }
}
