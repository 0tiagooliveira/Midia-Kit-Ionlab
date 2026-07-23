import { FormEvent, useEffect, useState } from 'react';
import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User
} from 'firebase/auth';
import { auth } from '../firebase';
import { isAllowedAdminUser } from '../lib/admin';
import { Download } from 'lucide-react';
import { exportMediaKitSpreadsheet } from '../lib/catalogExport';

function getAuthErrorMessage(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';

  if (code === 'auth/invalid-credential') {
    return 'Credenciais invalidas. Verifique se Email/Senha esta habilitado no Firebase Auth ou entre com Google.';
  }

  if (code === 'auth/popup-closed-by-user') {
    return 'Login com Google cancelado.';
  }

  if (code === 'auth/account-exists-with-different-credential') {
    return 'Esta conta ja existe com outro metodo de login.';
  }

  if (code === 'auth/unauthorized-domain') {
    return 'Dominio nao autorizado no Firebase Auth. Adicione localhost em Authorized domains.';
  }

  if (code === 'auth/popup-blocked') {
    return 'Popup bloqueado. Tentando login por redirecionamento...';
  }

  if (code === 'auth/internal-error') {
    return 'Falha interna no popup do Google. Tentando login por redirecionamento...';
  }

  return error instanceof Error ? error.message : 'Nao foi possivel fazer login.';
}

function shouldFallbackToRedirect(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';
  const message = error instanceof Error ? error.message : '';

  return (
    code === 'auth/popup-blocked' ||
    code === 'auth/popup-closed-by-user' ||
    code === 'auth/cancelled-popup-request' ||
    code === 'auth/internal-error' ||
    message.includes('Pending promise was never set')
  );
}

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    getRedirectResult(auth).catch(() => {
      // Redirect result may be empty when user did not come from redirect flow.
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const allowed = await isAllowedAdminUser(user);
        setIsAdmin(allowed);

        if (!allowed) {
          setErrorMessage('Conta sem permissao de administrador. Libere este usuario criando admins/{uid} no Firestore ou adicionando claim admin=true.');
        }
      } catch {
        setIsAdmin(false);
        setErrorMessage('Nao foi possivel validar as permissoes de administrador.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setInfoMessage('');
    setSubmitting(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (shouldFallbackToRedirect(error)) {
        setInfoMessage('Abrindo login do Google por redirecionamento...');
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
        return;
      }

      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePassword = async () => {
    setErrorMessage('');
    setInfoMessage('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage('Digite seu e-mail para receber o link de criacao/redefinicao de senha.');
      return;
    }

    setSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      setInfoMessage('Se a conta existir e o provedor Email/Senha estiver habilitado no Firebase Auth, o link sera enviado para este e-mail.');
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleExportSpreadsheet = async () => {
    setErrorMessage('');
    setInfoMessage('');
    setExporting(true);

    try {
      await exportMediaKitSpreadsheet();
      setInfoMessage('Planilha exportada com sucesso.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel exportar a planilha.');
    } finally {
      setExporting(false);
    }
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

        {currentUser && isAdmin ? (
          <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">Voce entrou como administrador.</p>
            <p className="mt-1 break-all">{currentUser.email}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExportSpreadsheet}
                disabled={exporting}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1767ae] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#12558f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={14} />
                {exporting ? 'Exportando...' : 'Exportar planilha'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-slate-700"
              >
                Sair
              </button>
            </div>
          </div>
        ) : currentUser && !isAdmin ? (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Conta autenticada sem permissao de administrador.</p>
            <p className="mt-1 break-all">E-mail: {currentUser.email || 'nao informado'}</p>
            <p className="mt-1 break-all">UID: {currentUser.uid}</p>
            <p className="mt-3 text-xs leading-relaxed">
              Para liberar acesso: crie no Firestore o documento admins/{currentUser.uid} ou adicione claim admin=true para este usuario.
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-slate-700"
            >
              Trocar conta
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
            {infoMessage ? <p className="text-sm text-emerald-700">{infoMessage}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-lg bg-[#1767ae] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#12558f] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {submitting ? 'Entrando...' : 'Entrar como admin'}
            </button>

            <div className="relative py-1">
              <div className="h-px w-full bg-slate-200" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                ou
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Aguarde...' : 'Entrar com Google'}
            </button>

            <button
              type="button"
              onClick={handleCreatePassword}
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Aguarde...' : 'Criar/Redefinir senha'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
