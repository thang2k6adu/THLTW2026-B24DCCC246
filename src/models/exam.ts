import { useState, useCallback } from 'react';
import { 
  getKnowledgeBlocks, createKnowledgeBlock, deleteKnowledgeBlock,
  getSubjects, createSubject, deleteSubject,
  getQuestions, createQuestion, deleteQuestion
} from '@/services/exam';

export default () => {
  const [knowledgeBlocks, setKnowledgeBlocks] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [savedStructures, setSavedStructures] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // --- Knowledge Blocks ---
  const fetchKnowledgeBlocks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getKnowledgeBlocks();
      if (res?.data?.success) setKnowledgeBlocks(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const addKnowledgeBlock = async (name: string) => {
    const res = await createKnowledgeBlock({ name });
    if (res?.data?.success) await fetchKnowledgeBlocks();
    return res;
  };

  const editKnowledgeBlock = async (id: number, name: string) => {
    const { updateKnowledgeBlock } = await import('@/services/exam');
    const res = await updateKnowledgeBlock(id, { name });
    if (res?.data?.success) await fetchKnowledgeBlocks();
    return res;
  };

  const removeKnowledgeBlock = async (id: number) => {
    const res = await deleteKnowledgeBlock(id);
    if (res?.data?.success) await fetchKnowledgeBlocks();
    return res;
  };

  // --- Subjects ---
  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSubjects();
      if (res?.data?.success) setSubjects(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSubject = async (data: any) => {
    const res = await createSubject(data);
    if (res?.data?.success) await fetchSubjects();
    return res;
  };

  const editSubject = async (code: string, data: any) => {
    const { updateSubject } = await import('@/services/exam');
    const res = await updateSubject(code, data);
    if (res?.data?.success) await fetchSubjects();
    return res;
  };

  const removeSubject = async (code: string) => {
    const res = await deleteSubject(code);
    if (res?.data?.success) await fetchSubjects();
    return res;
  };

  // --- Questions ---
  const fetchQuestions = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const res = await getQuestions(params);
      if (res?.data?.success) setQuestions(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const addQuestion = async (data: any) => {
    const res = await createQuestion(data);
    if (res?.data?.success) await fetchQuestions();
    return res;
  };

  const removeQuestion = async (id: string) => {
    const res = await deleteQuestion(id);
    if (res?.data?.success) await fetchQuestions();
    return res;
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

    questions,
    fetchQuestions,
    addQuestion,
    removeQuestion,

    // Generated Exams History (Client-side only)
    exams,
    saveExam,
    removeExam,

    // Saved Structures History (Client-side only)
    savedStructures,
    saveStructure,
    removeStructure
  };
};
