import request from '@/utils/axios';

// --- Knowledge Blocks ---
export async function getKnowledgeBlocks() {
  return request.get('/api/exam/knowledge-blocks');
}

export async function createKnowledgeBlock(data: { name: string }) {
  return request.post('/api/exam/knowledge-blocks', { data });
}

export async function deleteKnowledgeBlock(id: number) {
  return request.delete(`/api/exam/knowledge-blocks/${id}`);
}


// --- Subjects ---
export async function getSubjects() {
  return request.get('/api/exam/subjects');
}

export async function createSubject(data: { subject_code: string; subject_name: string; credits: number }) {
  return request.post('/api/exam/subjects', { data });
}

export async function deleteSubject(code: string) {
  return request.delete(`/api/exam/subjects/${code}`);
}


// --- Questions ---
export async function getQuestions(params?: { subject?: string; difficulty?: string; knowledge_block?: number }) {
  return request.get('/api/exam/questions', { params });
}

export async function createQuestion(data: { question_id: string; subject: string; content: string; difficulty: string; knowledge_block: number }) {
  return request.post('/api/exam/questions', { data });
}

export async function deleteQuestion(id: string) {
  return request.delete(`/api/exam/questions/${id}`);
}
