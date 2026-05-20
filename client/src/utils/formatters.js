export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });
}

export function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(date);
}

export function getScoreColor(score) {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-brand-400';
    if (score >= 40) return 'text-warning';
    return 'text-danger';
}

export function getScoreBg(score) {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-brand-400/10';
    if (score >= 40) return 'bg-warning/10';
    return 'bg-danger/10';
}

export function getGradeFromScore(score) {
    if (score >= 93) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 78) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 55) return 'C';
    if (score >= 40) return 'D';
    return 'F';
}

export function truncate(str, len = 100) {
    if (!str || str.length <= len) return str;
    return str.substring(0, len) + '...';
}
