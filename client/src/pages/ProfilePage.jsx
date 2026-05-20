import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { updateProfile, changePassword } from '../api/auth.api';
import { User, Mail, Target, Briefcase, Save, Lock, Plus, X } from 'lucide-react';
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
            toast.success('Profile updated');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePw = async (e) => {
        e.preventDefault();
        setChangingPw(true);
        try {
            await changePassword(pwForm);
            toast.success('Password changed');
            setPwForm({ currentPassword: '', newPassword: '' });
            setShowPwForm(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
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
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Profile Settings</h1>

            {/* Avatar & Info */}
            <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl border border-gray-400 bg-gray-900/10 flex items-center justify-center text-2xl font-bold text-gray-900 shadow-xl">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                        <p className="text-text-secondary text-sm flex items-center gap-1.5 mt-1">
                            <Mail size={14} /> {user?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-300 text-gray-900 truncate">Avg Score: {user?.averageScore || 0}%</span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-300 text-gray-900 truncate">{user?.totalInterviews || 0} sessions</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile */}
            <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm space-y-6">
                <h3 className="font-semibold text-gray-900">Edit Profile</h3>

                <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">Full Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-surface border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">Target Role</label>
                    <input
                        type="text"
                        value={form.targetRole}
                        onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                        placeholder="e.g., Senior Software Engineer"
                        className="w-full px-4 py-2.5 bg-surface border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder:text-text-muted transition-colors"
                    />
                </div>

                {/* Skills */}
                <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">Skills</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {form.skills.map(skill => (
                            <span key={skill} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-gray-900/5 text-gray-900 flex items-center gap-1.5">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors"><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            placeholder="Add a skill..."
                            className="flex-1 px-4 py-2.5 bg-surface border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder:text-text-muted transition-colors"
                        />
                        <button onClick={addSkill} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                {/* Target Companies */}
                <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">Target Companies</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {form.targetCompanies.map(company => (
                            <span key={company} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 bg-gray-900/5 text-gray-900 flex items-center gap-1.5">
                                {company}
                                <button onClick={() => removeCompany(company)} className="hover:text-red-400 transition-colors"><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCompany}
                            onChange={(e) => setNewCompany(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
                            placeholder="Add a company..."
                            className="flex-1 px-4 py-2.5 bg-surface border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder:text-text-muted transition-colors"
                        />
                        <button onClick={addCompany} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {saving ? <span className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin"></span> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Password */}
            <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Security</h3>
                    <button
                        onClick={() => setShowPwForm(!showPwForm)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-900/5 transition-colors flex items-center gap-2 text-gray-900"
                    >
                        <Lock size={16} /> Change Password
                    </button>
                </div>
                {showPwForm && (
                    <form onSubmit={handleChangePw} className="space-y-4 mt-6 pt-6 border-t border-gray-200">
                        <input
                            type="password"
                            placeholder="Current password"
                            value={pwForm.currentPassword}
                            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                            className="w-full px-4 py-2.5 bg-surface border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder:text-text-muted transition-colors"
                            required
                        />
                        <input
                            type="password"
                            placeholder="New password (min 6 characters)"
                            value={pwForm.newPassword}
                            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                            className="w-full px-4 py-2.5 bg-surface border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder:text-text-muted transition-colors"
                            required
                            minLength={6}
                        />
                        <button
                            type="submit"
                            disabled={changingPw}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70 flex w-full sm:w-auto justify-center"
                        >
                            {changingPw ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
