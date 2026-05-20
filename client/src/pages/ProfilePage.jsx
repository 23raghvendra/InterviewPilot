import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { updateProfile, changePassword } from '../api/auth.api';
import { Mail, Save, Lock, Plus, X, Award, ShieldCheck, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, updateUser } = useAuthStore();
    const [saving, setSaving] = useState(false);
    const [changingPw, setChangingPw] = useState(false);
    const [showPwForm, setShowPwForm] = useState(false);

    const [form, setForm] = useState({
        name: user?.name || '',
        targetRole: user?.targetRole || '',
        skills: user?.skills || [],
        targetCompanies: user?.targetCompanies || []
    });

    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
    const [newSkill, setNewSkill] = useState('');
    const [newCompany, setNewCompany] = useState('');

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data } = await updateProfile(form);
            updateUser(data.data.user);
            toast.success('Security profile synced successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Sync failed');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePw = async (e) => {
        e.preventDefault();
        setChangingPw(true);
        try {
            await changePassword(pwForm);
            toast.success('Security key phrase updated');
            setPwForm({ currentPassword: '', newPassword: '' });
            setShowPwForm(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update credentials');
        } finally {
            setChangingPw(false);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
            setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
            setNewSkill('');
        }
    };

    const removeSkill = (skill) => {
        setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
    };

    const addCompany = () => {
        if (newCompany.trim() && !form.targetCompanies.includes(newCompany.trim())) {
            setForm({ ...form, targetCompanies: [...form.targetCompanies, newCompany.trim()] });
            setNewCompany('');
        }
    };

    const removeCompany = (company) => {
        setForm({ ...form, targetCompanies: form.targetCompanies.filter(c => c !== company) });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-6 mb-8">
                <div className="w-12 h-12 rounded-xl border border-brand-500/20 bg-brand-500/5 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                    <ShieldCheck size={22} className="text-brand-400" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Security & Credentials</h1>
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-widest">Manage your cognitive metrics and parameters</p>
                </div>
            </div>

            {/* Profile Summary Header */}
            <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl border border-white/10 bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl">
                        {user?.name?.charAt(0)?.toUpperCase() || 'P'}
                    </div>
                    <div className="space-y-1.5 text-center sm:text-left flex-1">
                        <h2 className="text-xl font-bold text-white tracking-tight">{user?.name}</h2>
                        <p className="text-text-secondary text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                            <Mail size={12} className="text-brand-400" /> {user?.email}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                            <span className="px-3 py-1 rounded-xl text-[10px] font-bold border border-white/5 bg-white/3 text-brand-400">Average Rating: {user?.averageScore || 0}%</span>
                            <span className="px-3 py-1 rounded-xl text-[10px] font-bold border border-white/5 bg-white/3 text-text-secondary">{user?.totalInterviews || 0} evaluations</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuration Panel */}
            <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md space-y-6">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider text-brand-300">Edit Profile Matrix</h3>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-widest block">Candidate Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 bg-surface border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-widest block">Objective Role</label>
                        <input
                            type="text"
                            value={form.targetRole}
                            onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                            placeholder="e.g., Senior Systems Designer"
                            className="w-full px-4 py-3 bg-surface border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-text-muted transition-colors"
                        />
                    </div>
                </div>

                {/* Skills Block */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest block">Acquired Skill Set</label>
                    <div className="flex flex-wrap gap-2 py-2">
                        {form.skills.map(skill => (
                            <span key={skill} className="px-3 py-1.5 rounded-xl text-xs font-bold border border-brand-500/15 bg-brand-500/5 text-brand-400 flex items-center gap-1.5">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-rose-400 transition-colors cursor-pointer"><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            placeholder="Add skill node (e.g., Docker, Distributed Systems)..."
                            className="flex-1 px-4 py-3 bg-surface border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-text-muted transition-colors"
                        />
                        <button onClick={addSkill} className="px-4 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:from-brand-500 hover:to-indigo-500 transition-colors flex items-center justify-center cursor-pointer">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                {/* Target Companies */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest block">Objective Enterprise Targets</label>
                    <div className="flex flex-wrap gap-2 py-2">
                        {form.targetCompanies.map(company => (
                            <span key={company} className="px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10 bg-white/2 text-white flex items-center gap-1.5">
                                {company}
                                <button onClick={() => removeCompany(company)} className="hover:text-rose-400 transition-colors cursor-pointer"><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCompany}
                            onChange={(e) => setNewCompany(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
                            placeholder="Add target enterprise (e.g., Stripe, Netflix)..."
                            className="flex-1 px-4 py-3 bg-surface border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-text-muted transition-colors"
                        />
                        <button onClick={addCompany} className="px-4 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:from-brand-500 hover:to-indigo-500 transition-colors flex items-center justify-center cursor-pointer">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:from-brand-500 hover:to-indigo-500 transition-all flex items-center gap-2 disabled:opacity-70 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                        {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Save size={14} />}
                        Sync Security Matrix
                    </button>
                </div>
            </div>

            {/* Password Credentials updates */}
            <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider text-brand-300">Security Credentials</h3>
                    <button
                        onClick={() => setShowPwForm(!showPwForm)}
                        className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-xs font-bold uppercase tracking-wider hover:bg-white/4 transition-colors flex items-center gap-2 text-white cursor-pointer"
                    >
                        <Lock size={14} /> Update Keyphrase
                    </button>
                </div>
                {showPwForm && (
                    <form onSubmit={handleChangePw} className="space-y-4 mt-6 pt-6 border-t border-white/5 animate-in slide-in-from-top duration-300">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input
                                type="password"
                                placeholder="Current security password"
                                value={pwForm.currentPassword}
                                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-surface border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-text-muted transition-colors"
                                required
                            />
                            <input
                                type="password"
                                placeholder="New password (min 6 characters)"
                                value={pwForm.newPassword}
                                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-surface border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-text-muted transition-colors"
                                required
                                minLength={6}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={changingPw}
                            className="px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:from-brand-500 hover:to-indigo-500 transition-colors disabled:opacity-75 flex w-full sm:w-auto justify-center cursor-pointer"
                        >
                            {changingPw ? 'Committing...' : 'Commit New Keyphrase'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
