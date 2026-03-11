import { Request, Response } from 'express';

// Define Mock Data
let kholKienThuc = [
  { id: 1, name: 'Tổng quan' },
  { id: 2, name: 'Cơ sở' },
  { id: 3, name: 'Chuyên sâu' },
  { id: 4, name: 'Nâng cao' }
];

let danhMucMonHoc = [
  { subject_code: 'INT3132', subject_name: 'THLTWeb', credits: 3 },
  { subject_code: 'INT3134', subject_name: 'Thiết kế UX/UI', credits: 2 }
];

let cauHoiList = [
  { question_id: 'Q01', subject: 'INT3132', content: 'Web là gì?', difficulty: 'Dễ', knowledge_block: 1 },
  { question_id: 'Q02', subject: 'INT3132', content: 'Thế nào là ReactJS?', difficulty: 'Trung bình', knowledge_block: 2 }
];

// Provide delay to simulate network
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export default {
  // Knowledge Blocks (Khối Kiến Thức)
  'GET /api/exam/knowledge-blocks': async (req: Request, res: Response) => {
    await delay(300);
    res.send({ success: true, data: kholKienThuc });
  },
  'POST /api/exam/knowledge-blocks': async (req: Request, res: Response) => {
    await delay(300);
    const { name } = req.body;
    const newBlock = { id: Date.now(), name };
    kholKienThuc.push(newBlock);
    res.send({ success: true, data: newBlock });
  },
  'PUT /api/exam/knowledge-blocks/:id': async (req: Request, res: Response) => {
    await delay(300);
    const { id } = req.params;
    const { name } = req.body;
    const index = kholKienThuc.findIndex(b => b.id === Number(id));
    if (index !== -1) {
      kholKienThuc[index].name = name;
      res.send({ success: true, data: kholKienThuc[index] });
    } else {
      res.status(404).send({ success: false, message: 'Not Found' });
    }
  },
  'DELETE /api/exam/knowledge-blocks/:id': async (req: Request, res: Response) => {
    await delay(300);
    const { id } = req.params;
    kholKienThuc = kholKienThuc.filter(b => b.id !== Number(id));
    res.send({ success: true });
  },

  // Subjects (Môn học)
  'GET /api/exam/subjects': async (req: Request, res: Response) => {
    await delay(300);
    res.send({ success: true, data: danhMucMonHoc });
  },
  'POST /api/exam/subjects': async (req: Request, res: Response) => {
    await delay(300);
    const { subject_code, subject_name, credits } = req.body;
    const newSub = { subject_code, subject_name, credits };
    danhMucMonHoc.push(newSub);
    res.send({ success: true, data: newSub });
  },
  'PUT /api/exam/subjects/:code': async (req: Request, res: Response) => {
    await delay(300);
    const { code } = req.params;
    const { subject_name, credits } = req.body;
    const index = danhMucMonHoc.findIndex(s => s.subject_code === code);
    if (index !== -1) {
      danhMucMonHoc[index].subject_name = subject_name;
      danhMucMonHoc[index].credits = credits;
      res.send({ success: true, data: danhMucMonHoc[index] });
    } else {
      res.status(404).send({ success: false, message: 'Not Found' });
    }
  },
  'DELETE /api/exam/subjects/:code': async (req: Request, res: Response) => {
    await delay(300);
    const { code } = req.params;
    danhMucMonHoc = danhMucMonHoc.filter(s => s.subject_code !== code);
    res.send({ success: true });
  },

  // Questions (Câu hỏi)
  'GET /api/exam/questions': async (req: Request, res: Response) => {
    await delay(300);
    const { subject, difficulty, knowledge_block } = req.query;
    let filtered = [...cauHoiList];
    
    if (subject) filtered = filtered.filter(q => q.subject === subject);
    if (difficulty) filtered = filtered.filter(q => q.difficulty === difficulty);
    if (knowledge_block) filtered = filtered.filter(q => q.knowledge_block === Number(knowledge_block));
    
    res.send({ success: true, data: filtered });
  },
  'POST /api/exam/questions': async (req: Request, res: Response) => {
    await delay(300);
    const { question_id, subject, content, difficulty, knowledge_block } = req.body;
    const newQuestion = { question_id, subject, content, difficulty, knowledge_block };
    cauHoiList.push(newQuestion);
    res.send({ success: true, data: newQuestion });
  },
  'DELETE /api/exam/questions/:id': async (req: Request, res: Response) => {
    await delay(300);
    const { id } = req.params;
    cauHoiList = cauHoiList.filter(q => q.question_id !== id);
    res.send({ success: true });
  }
};
