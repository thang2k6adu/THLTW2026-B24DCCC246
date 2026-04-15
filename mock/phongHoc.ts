import { Request, Response } from 'express';

// Dữ liệu giả lập (mock db)
let phongHocList = [
  { _id: '1', maPhong: 'P101', tenPhong: 'Phòng 101', soChoNgoi: 50, loaiPhong: 'Lý thuyết', nguoiPhuTrach: 'Nguyễn Văn A' },
  { _id: '2', maPhong: 'P102', tenPhong: 'Phòng 102', soChoNgoi: 100, loaiPhong: 'Hội trường', nguoiPhuTrach: 'Trần Thị B' },
  { _id: '3', maPhong: 'P103', tenPhong: 'Phòng 103', soChoNgoi: 20, loaiPhong: 'Thực hành', nguoiPhuTrach: 'Lê Văn C' },
];

export default {
  'GET /api/phong-hoc/list': (req: Request, res: Response) => {
    res.send({ 
      data: phongHocList, 
      total: phongHocList.length, 
      success: true 
    });
  },
  
  'POST /api/phong-hoc': (req: Request, res: Response) => {
    const { maPhong, tenPhong } = req.body;
    
    // Check validation (Mã phòng, Tên phòng không trùng)
    const exists = phongHocList.find(p => p.maPhong === maPhong || p.tenPhong === tenPhong);
    if (exists) {
      return res.status(400).send({ 
        success: false, 
        message: 'Mã phòng hoặc Tên phòng đã tồn tại!' 
      });
    }

    const newPhongHoc = { ...req.body, _id: Date.now().toString() };
    phongHocList.push(newPhongHoc);
    
    res.send({ 
       data: newPhongHoc, 
       success: true, 
       message: 'Thêm phòng thành công' 
    });
  },

  'PUT /api/phong-hoc': (req: Request, res: Response) => {
    const { _id, maPhong, tenPhong } = req.body;
    
    const index = phongHocList.findIndex(p => p._id === _id);
    if (index === -1) {
      return res.status(404).send({ success: false, message: 'Không tìm thấy phòng!' });
    }

    // Check trùng, loại trừ phòng hiện tại
    const isDuplicate = phongHocList.some(p => p._id !== _id && (p.maPhong === maPhong || p.tenPhong === tenPhong));
    if (isDuplicate) {
      return res.status(400).send({ 
         success: false, 
         message: 'Mã phòng hoặc Tên phòng đã bị trùng lặp!' 
      });
    }

    phongHocList[index] = { ...phongHocList[index], ...req.body };
    res.send({ data: phongHocList[index], success: true, message: 'Cập nhật thành công' });
  },

  'DELETE /api/phong-hoc/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    phongHocList = phongHocList.filter(p => p._id !== id);
    res.send({ success: true, message: 'Xóa phòng thành công' });
  },
};
