import { Navigate } from 'react-router-dom';
import { useIsAuthorizedTrainer } from '../hooks/Useisauthorizedtrainer';

const ProtectedAdminRoute = ({ children }) => {
    const isAuthorizedTrainer = useIsAuthorizedTrainer();

    if (!isAuthorizedTrainer) {
        return <Navigate to="/admin/chat" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
