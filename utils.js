import User from './modelUser.js';

export default async function verifyFirmName(userFirmName) {
  try {
    const existingUser = await User.findOne({ where: { firm_name: userFirmName } });

    if (!existingUser) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification du firm_name :', error);
    throw new Error('Erreur lors de la vérification du firm_name');
  }
}

