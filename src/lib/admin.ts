import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function isAllowedAdminUser(user: User | null | undefined) {
  if (!user) {
    return false;
  }

  const tokenResult = await user.getIdTokenResult();

  if (tokenResult.claims.admin === true) {
    return true;
  }

  const adminDocRef = doc(db, 'admins', user.uid);
  const adminDoc = await getDoc(adminDocRef);

  return adminDoc.exists();
}
