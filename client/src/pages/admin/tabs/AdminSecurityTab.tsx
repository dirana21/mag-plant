import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  User,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Server,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { api } from '../../../services/api';
import { AuditLog } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

interface AdminSecurityTabProps {
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminSecurityTab: React.FC<AdminSecurityTabProps> = ({ onNotify }) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(user?.username || 'admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const logs = await api.getAuditLogs();
      setAuditLogs(logs);
    } catch {
      // ignore
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      onNotify('Введіть поточний пароль для підтвердження', 'error');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      onNotify('Нові паролі не співпадають', 'error');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      onNotify('Новий пароль повинен містити щонайменше 6 символів', 'error');
      return;
    }

    setUpdating(true);
    try {
      await api.updateCredentials({
        currentPassword,
        newUsername: newUsername.trim() !== user?.username ? newUsername.trim() : undefined,
        newPassword: newPassword || undefined
      });
      onNotify('Облікові дані адміністратора успішно оновлено!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      loadAuditLogs();
    } catch (err: any) {
      onNotify(err.message || 'Помилка оновлення даних', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="pb-6 border-b border-slate-800">
        <h2 className="text-xl font-bold font-heading text-white">
          Безпека та захист від хакерських атак
        </h2>
        <p className="text-xs text-slate-400">
          Керування доступом, статус захисних механізмів сайту та журнали аудиту дій.
        </p>
      </div>

      {/* 1. Active Security Status Overview */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-white">
              Активні рівні кіберзахисту MAG
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">
              ● Усі захисні модулі активовані та працюють в штатному режимі
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Helmet CSP & Headers</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Захист від XSS, Clickjacking, MIME-sniffing та заборона виконання неавторизованих скриптів.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Rate Limiting (Anti-DoS)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Блокування перебору паролів (max 5 спроб на 15 хв) та анти-флуд захист форми контактів.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Bcrypt & HttpOnly JWT</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Хешування з 12 раундами солі. Токени зберігаються в захищених cookie без доступу з JS.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SQL Injection Immunity</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Параметризовані SQLite запити з WAL режимом повністю виключають ін'єкції коду.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Change Admin Credentials Form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-white">
              Зміна логіна та пароля адміністратора
            </h3>
            <p className="text-xs text-slate-400">
              Рекомендуємо встановити надійний пароль із цифрами та літерами.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateCredentials} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Логін облікового запису
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Новий пароль (залиште порожнім, якщо не змінюєте)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="Новий пароль..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Повторіть новий пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="Підтвердження..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-amber-400 mb-1">
              Поточний пароль (для збереження змін) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="Введіть ваш поточний пароль..."
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              {updating ? 'Збереження...' : 'Оновити дані доступу'}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Security Audit Logs */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold font-heading text-white">
              Журнал аудиту безпеки (Останні події)
            </h3>
          </div>

          <button
            onClick={loadAuditLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-xs text-slate-300 rounded-lg border border-slate-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
            <span>Оновити</span>
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Подія</th>
                <th className="py-2.5 px-4">Деталі</th>
                <th className="py-2.5 px-4">IP-адреса</th>
                <th className="py-2.5 px-4">Час</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    Записів аудиту поки немає
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-mono font-bold text-emerald-400">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300 max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-400">
                      {log.ip_address}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">
                      {new Date(log.created_at).toLocaleString('uk-UA')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
