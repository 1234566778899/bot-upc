import { useUser } from 'reactfire';

const AUTHORIZED_EMAILS = [
    'gabitotaipe01@gmail.com',
    'ordazhoyos2001@gmail.com',
    'lilstoukz8@gmail.com'
];

/**
 * Hook personalizado para verificar si el usuario está autorizado para entrenar asistentes
 * @returns {boolean} true si el usuario está autorizado, false en caso contrario
 */
export const useIsAuthorizedTrainer = () => {
    const { data: user } = useUser();
    return user && AUTHORIZED_EMAILS.includes(user.email);
};

export { AUTHORIZED_EMAILS };