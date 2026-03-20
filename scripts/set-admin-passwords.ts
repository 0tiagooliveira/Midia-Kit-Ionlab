import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

const ADMIN_EMAILS = [
  'marketing.ionlab@gmail.com',
  'tiago336699@gmail.com'
];

const password = process.env.ADMIN_PASSWORD || 'Ionlab123.';
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  console.error('Defina GOOGLE_APPLICATION_CREDENTIALS com o caminho do JSON da service account.');
  process.exit(1);
}

if (password.length < 6) {
  console.error('ADMIN_PASSWORD precisa ter no minimo 6 caracteres.');
  process.exit(1);
}

const json = readFileSync(resolve(serviceAccountPath), 'utf8');
const serviceAccount = JSON.parse(json) as ServiceAccount;

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

async function run() {
  const auth = getAuth();
  const db = getFirestore();

  for (const email of ADMIN_EMAILS) {
    let uid = '';

    try {
      const user = await auth.getUserByEmail(email);
      uid = user.uid;
      await auth.updateUser(user.uid, { password, emailVerified: true });
      console.log(`Senha atualizada para ${email} (uid: ${user.uid})`);
    } catch (error: unknown) {
      const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: string }).code) : '';

      if (code === 'auth/user-not-found') {
        const created = await auth.createUser({
          email,
          password,
          emailVerified: true
        });
        uid = created.uid;

        console.log(`Usuario criado para ${email} (uid: ${created.uid})`);
      } else {
        throw error;
      }
    }

    if (!uid) {
      throw new Error(`UID nao encontrado para ${email}`);
    }

    await auth.setCustomUserClaims(uid, { admin: true });
    console.log(`Claim admin=true aplicado para ${email} (uid: ${uid})`);

    await db.collection('admins').doc(uid).set(
      {
        email,
        role: 'admin',
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
    console.log(`Documento admins/${uid} criado/atualizado`);
  }

  console.log('Concluido.');
}

run().catch((error) => {
  console.error('Falha ao configurar senhas de administrador:', error);
  process.exit(1);
});
