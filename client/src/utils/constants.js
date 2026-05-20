export const INTERVIEW_TYPES = [
    { value: 'technical', label: 'Technical', icon: '💻', description: 'Data structures, algorithms, system design' },
    { value: 'hr', label: 'HR', icon: '🤝', description: 'Cultural fit, salary negotiation, career goals' },
    { value: 'behavioral', label: 'Behavioral', icon: '🧠', description: 'STAR method, leadership, teamwork' },
    { value: 'system_design', label: 'System Design', icon: '🏗️', description: 'Architecture, scalability, trade-offs' },
    { value: 'dsa', label: 'DSA', icon: '📊', description: 'Data structures & algorithms focused' },
    { value: 'mixed', label: 'Mixed', icon: '🎯', description: 'Combination of all types' }
];

export const DIFFICULTY_LEVELS = [
    { value: 'easy', label: 'Easy', color: 'text-success' },
    { value: 'medium', label: 'Medium', color: 'text-warning' },
    { value: 'hard', label: 'Hard', color: 'text-danger' }
];

export const DOMAINS = [
    'Frontend', 'Backend', 'Full Stack', 'Data Science', 'Machine Learning',
    'DevOps', 'Mobile Development', 'Cloud Computing', 'Cybersecurity', 'Database'
];

export const COMPANIES = [
    'Google', 'Amazon', 'Meta', 'Apple', 'Microsoft', 'Netflix', 'Uber',
    'Airbnb', 'Twitter', 'LinkedIn', 'Stripe', 'Salesforce', 'Adobe', 'Other'
];

export const GRADE_COLORS = {
    'A+': 'text-success',
    'A': 'text-success',
    'B+': 'text-brand-400',
    'B': 'text-brand-400',
    'C': 'text-warning',
    'D': 'text-warning',
    'F': 'text-danger'
};

export const READINESS_CONFIG = {
    not_ready: { label: 'Not Ready', color: 'text-danger', bg: 'bg-danger/10' },
    needs_work: { label: 'Needs Work', color: 'text-warning', bg: 'bg-warning/10' },
    almost_ready: { label: 'Almost Ready', color: 'text-brand-400', bg: 'bg-brand-400/10' },
    ready: { label: 'Ready!', color: 'text-success', bg: 'bg-success/10' }
};
