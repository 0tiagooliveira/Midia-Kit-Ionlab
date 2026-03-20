import { FormEvent, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../firebase';
import { ADMIN_EMAILS, isAllowedAdminEmail } from '../lib/admin';

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = useMemo(() => isAllowedAdminEmail(currentUser?.email), [currentUser?.email]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (!isAllowedAdminEmail(normalizedEmail)) {
        throw new Error('Este e-mail nao tem permissao de administrador.');
      }

      await signInWithEmailAndPassword(auth, normalizedEmail, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel fazer login.';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <section className="container py-24">
        <p className="text-sm uppercase tracking-[0.1em] text-slate-500">Carregando area administrativa...</p>
      </section>
    );
  }

  return (
    <section className="container py-12 md:py-20">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1767ae]">Painel administrativo</p>
        <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-slate-900 md:text-3xl">Login de administrador</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Entre com uma conta autorizada para administrar os conteudos do Midia Kit.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
          <p className="font-semibold uppercase tracking-[0.1em] text-slate-700">Contas permitidas</p>
          <ul className="mt-2 space-y-1">
            {ADMIN_EMAILS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {currentUser && isAdmin ? (
          <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">Voce entrou como administrador.</p>
            <p className="mt-1 break-all">{currentUser.email}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-slate-700"
            >
              Sair
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                E-mail
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-[#1767ae]"
                placeholder="seuemail@dominio.com"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                Senha
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-[#1767ae]"
                placeholder="Digite sua senha"
              />
            </div>

            {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-lg bg-[#1767ae] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#12558f] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {submitting ? 'Entrando...' : 'Entrar como admin'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
