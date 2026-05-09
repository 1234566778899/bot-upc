import React, { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Link,
    Container,
    Stack,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CONFIG } from '../../config';

const STEPS = ['Correo', 'Código', 'Nueva contraseña'];

export const ForgotPassword = () => {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.toLowerCase().endsWith('@gmail.com')) {
            setError('Solo se permiten correos de Gmail (@gmail.com)');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${CONFIG.uri}/api/auth/forgot-password`, { email });
            setStep(1);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al enviar el código. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');

        if (code.length !== 6) {
            setError('El código debe tener 6 dígitos');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post(`${CONFIG.uri}/api/auth/verify-code`, { email, code });
            setResetToken(data.resetToken);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Código inválido o expirado');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${CONFIG.uri}/api/auth/reset-password`, { resetToken, newPassword });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setError('');
        setCode('');
        setLoading(true);
        try {
            await axios.post(`${CONFIG.uri}/api/auth/forgot-password`, { email });
        } catch (err) {
            setError('Error al reenviar el código');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4
        }}>
            <Container maxWidth="sm">
                <Paper elevation={24} sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.95)'
                }}>
                    {/* Indicador de pasos */}
                    {step < 3 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
                            {STEPS.map((label, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        bgcolor: i <= step ? 'primary.main' : 'grey.200',
                                        color: i <= step ? 'white' : 'text.secondary',
                                        transition: 'all 0.3s'
                                    }}>
                                        {i + 1}
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: i <= step ? 'primary.main' : 'text.disabled',
                                            fontWeight: i === step ? 700 : 400,
                                            display: { xs: 'none', sm: 'block' }
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                    {i < STEPS.length - 1 && (
                                        <Box sx={{
                                            width: 32,
                                            height: 2,
                                            bgcolor: i < step ? 'primary.main' : 'grey.200',
                                            transition: 'all 0.3s'
                                        }} />
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Paso 0: Ingresar correo */}
                    {step === 0 && (
                        <>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                                    ¿Olvidaste tu contraseña?
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Ingresa tu correo y te enviaremos un código de verificación
                                </Typography>
                            </Box>
                            <form onSubmit={handleSendCode}>
                                <Stack spacing={2.5}>
                                    <TextField
                                        fullWidth
                                        label="Correo electrónico"
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                        required
                                        disabled={loading}
                                        placeholder="tucorreo@gmail.com"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon color="primary" />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar código'}
                                    </Button>
                                </Stack>
                            </form>
                        </>
                    )}

                    {/* Paso 1: Ingresar código */}
                    {step === 1 && (
                        <>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                                    Ingresa el código
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Enviamos un código de 6 dígitos a{' '}
                                    <strong>{email}</strong>
                                </Typography>
                            </Box>
                            <form onSubmit={handleVerifyCode}>
                                <Stack spacing={2.5}>
                                    <TextField
                                        fullWidth
                                        label="Código de verificación"
                                        value={code}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setCode(val);
                                            setError('');
                                        }}
                                        required
                                        disabled={loading}
                                        placeholder="000000"
                                        inputProps={{
                                            maxLength: 6,
                                            style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.5rem', fontWeight: 700 }
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={loading || code.length !== 6}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Verificar código'}
                                    </Button>
                                </Stack>
                            </form>
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    ¿No recibiste el código?{' '}
                                    <Link
                                        component="button"
                                        variant="body2"
                                        onClick={handleResendCode}
                                        disabled={loading}
                                        sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                    >
                                        Reenviar
                                    </Link>
                                </Typography>
                            </Box>
                        </>
                    )}

                    {/* Paso 2: Nueva contraseña */}
                    {step === 2 && (
                        <>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                                    Nueva contraseña
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Elige una contraseña segura para tu cuenta
                                </Typography>
                            </Box>
                            <form onSubmit={handleResetPassword}>
                                <Stack spacing={2.5}>
                                    <TextField
                                        fullWidth
                                        label="Nueva contraseña"
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                                        required
                                        disabled={loading}
                                        helperText="Mínimo 6 caracteres"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Confirmar contraseña"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                        required
                                        disabled={loading}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                    />
                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar contraseña'}
                                    </Button>
                                </Stack>
                            </form>
                        </>
                    )}

                    {/* Paso 3: Éxito */}
                    {step === 3 && (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <CheckCircleIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
                            <Typography variant="h5" fontWeight="bold" color="success.main" gutterBottom>
                                ¡Contraseña actualizada!
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                Tu contraseña fue cambiada correctamente. Ya puedes iniciar sesión.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/login')}
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}
                            >
                                Ir al inicio de sesión
                            </Button>
                        </Box>
                    )}

                    {/* Link de regreso */}
                    {step < 3 && (
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => navigate('/login')}
                                sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                                ← Volver al inicio de sesión
                            </Link>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};
