import { create } from 'zustand';

type Concurso = {
  id: string;
  nome: string;
};

type TrilhaStore = {
  concursoSelecionado: Concurso | null;
  setConcurso: (concurso: Concurso) => void;
  clearConcurso: () => void;
};

export const useTrilhaStore = create<TrilhaStore>((set) => ({
  concursoSelecionado: null,
  setConcurso: (concurso) => set({ concursoSelecionado: concurso }),
  clearConcurso: () => set({ concursoSelecionado: null }),
}));
