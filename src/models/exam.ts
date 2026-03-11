import { useState, useEffect, useCallback } from 'react';

// Initial Mock Data Fallback
const INITIAL_KNOWLEDGE_BLOCKS = [
  { id: 1, name: 'Tổng quan' },
  { id: 2, name: 'Cơ sở' },
  { id: 3, name: 'Chuyên sâu' },
  { id: 4, name: 'Nâng cao' }
];

const INITIAL_SUBJECTS = [
  { subject_code: 'INT3132', subject_name: 'THLTWeb', credits: 3 },
  { subject_code: 'INT3134', subject_name: 'Thiết kế UX/UI', credits: 2 }
];

const INITIAL_QUESTIONS = [
  { question_id: 'Q01', subject: 'INT3132', content: 'Web là gì?', difficulty: 'Dễ', knowledge_block: 1 },
  { question_id: 'Q02', subject: 'INT3132', content: 'Thế nào là ReactJS?', difficulty: 'Trung bình', knowledge_block: 2 }
];

const loadFromLocal = (key: string, initialData: any) => {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
};

export default () => {
  const [knowledgeBlocks, setKnowledgeBlocks] = useState<any[]>(() => loadFromLocal('exam_knowledge_blocks', INITIAL_KNOWLEDGE_BLOCKS));
  const [subjects, setSubjects] = useState<any[]>(() => loadFromLocal('exam_subjects', INITIAL_SUBJECTS));
  const [questions, setQuestions] = useState<any[]>(() => loadFromLocal('exam_questions', INITIAL_QUESTIONS));
  const [exams, setExams] = useState<any[]>(() => loadFromLocal('exam_exams', []));
  const [savedStructures, setSavedStructures] = useState<any[]>(() => loadFromLocal('exam_saved_structures', []));
  const [loading] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('exam_knowledge_blocks', JSON.stringify(knowledgeBlocks)); }, [knowledgeBlocks]);
  useEffect(() => { localStorage.setItem('exam_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('exam_questions', JSON.stringify(questions)); }, [questions]);
  useEffect(() => { localStorage.setItem('exam_exams', JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem('exam_saved_structures', JSON.stringify(savedStructures)); }, [savedStructures]);

  // --- Knowledge Blocks ---
  const fetchKnowledgeBlocks = useCallback(async () => {}, []);

  const addKnowledgeBlock = async (name: string) => {
    const newBlock = { id: Date.now(), name };
    setKnowledgeBlocks(prev => [...prev, newBlock]);
    return { data: { success: true } };
  };

  const editKnowledgeBlock = async (id: number, name: string) => {
    setKnowledgeBlocks(prev => prev.map(b => b.id === id ? { ...b, name } : b));
    return { data: { success: true } };
  };

  const removeKnowledgeBlock = async (id: number) => {
    setKnowledgeBlocks(prev => prev.filter(b => b.id !== id));
    return { data: { success: true } };
  };

  // --- Subjects ---
  const fetchSubjects = useCallback(async () => {}, []);

  const addSubject = async (data: any) => {
    setSubjects(prev => [...prev, data]);
    return { data: { success: true } };
  };

  const editSubject = async (code: string, data: any) => {
    setSubjects(prev => prev.map(s => s.subject_code === code ? { ...s, ...data } : s));
    return { data: { success: true } };
  };

  const removeSubject = async (code: string) => {
    setSubjects(prev => prev.filter(s => s.subject_code !== code));
    return { data: { success: true } };
  };

  // --- Questions ---

  // To support filtering, let's keep a master list and a filtered list
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>(questions);
  
  // Sync full questions to filtered when it changes (if no filters are active)
  useEffect(() => {
    setFilteredQuestions(questions);
  }, [questions]);

  const fetchQuestionsFiltered = useCallback(async (params?: any) => {
    let filtered = [...questions];
    if (params) {
        if (params.subject) filtered = filtered.filter(q => q.subject === params.subject);
        if (params.difficulty) filtered = filtered.filter(q => q.difficulty === params.difficulty);
        if (params.knowledge_block) filtered = filtered.filter(q => q.knowledge_block === Number(params.knowledge_block));
    }
    setFilteredQuestions(filtered);
  }, [questions]);

  const addQuestion = async (data: any) => {
    setQuestions(prev => [...prev, data]);
    return { data: { success: true } };
  };

  const removeQuestion = async (id: string) => {
    setQuestions(prev => prev.filter(q => q.question_id !== id));
    return { data: { success: true } };
  };

  // --- Exams (Client-side) ---
  const saveExam = (exam: any) => {
    setExams(prev => [exam, ...prev]);
  };

  const removeExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  // --- Exam Structures (Client-side) ---
  const saveStructure = (struct: any) => {
    setSavedStructures(prev => [struct, ...prev]);
  };

  const removeStructure = (id: string) => {
    setSavedStructures(prev => prev.filter(e => e.id !== id));
  };

  return {
    loading,
    
    knowledgeBlocks,
    fetchKnowledgeBlocks,
    addKnowledgeBlock,
    editKnowledgeBlock,
    removeKnowledgeBlock,

    subjects,
    fetchSubjects,
    addSubject,
    editSubject,
    removeSubject,

    questions: filteredQuestions, // Expose filtered list to components
    fetchQuestions: fetchQuestionsFiltered, // Use the new filtering function
    addQuestion,
    removeQuestion,

    exams,
    saveExam,
    removeExam,

    savedStructures,
    saveStructure,
    removeStructure
  };
};
