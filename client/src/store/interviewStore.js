import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useInterviewStore = create(
    persist(
        (set, get) => ({
            interview: null,
            currentQuestionIndex: 0,
            sessionId: null,
            answers: {},

            setInterview: (interview) => set({ interview }),
            setSessionId: (id) => set({ sessionId: id }),
            setCurrentIndex: (index) => set({ currentQuestionIndex: index }),

            updateQuestionFeedback: (index, feedback) => set((state) => {
                if (!state.interview) return state;
                const updated = [...state.interview.questions];
                updated[index] = { ...updated[index], aiFeedback: feedback };
                return { interview: { ...state.interview, questions: updated } };
            }),

            saveAnswer: (index, answer) => set((state) => ({
                answers: { ...state.answers, [index]: answer }
            })),

            getAnswer: (index) => get().answers[index] || '',

            resetInterview: () => set({
                interview: null,
                currentQuestionIndex: 0,
                sessionId: null,
                answers: {}
            })
        }),
        {
            name: 'interview-storage',
            partialize: (state) => ({
                sessionId: state.sessionId,
                currentQuestionIndex: state.currentQuestionIndex,
                answers: state.answers
            })
        }
    )
);
