import  { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useUser } from 'reactfire';

// Opciones limitadas de cursos y carreras
const CURSOS_DISPONIBLES = [
    'Taller de Proyecto 1',
    'Taller de Desempeño Profesional'
];

const CARRERAS_DISPONIBLES = [
    'Ingeniería de Sistemas de Información',
    'Ingeniería de Software',
    'Ciencias de la Computación',
    'Ciberseguridad'
];

export const CompleteProfileModal = ({ open, onClose, userData, onUpdate }) => {
    const firestore = useFirestore();
    const { data: user } = useUser();

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        curso: '',
        carrera: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userData) {
            setFormData({
                nombre: userData.nombre || '',
                apellido: userData.apellido || '',
                curso: userData.curso || '',
                carrera: userData.carrera || ''
            });
        }
    }, [userData]);

    const handleChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.nombre.trim()) {
            setError('El nombre es requerido');
            return;
        }
        if (!formData.apellido.trim()) {
            setError('El apellido es requerido');
            return;
        }
        if (!formData.curso) {
            setError('Debes seleccionar un curso');
            return;
        }
        if (!formData.carrera) {
            setError('Debes seleccionar una carrera');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const userDocRef = doc(firestore, 'users', user.uid);

            await updateDoc(userDocRef, {
                nombre: formData.nombre.trim(),
                apellido: formData.apellido.trim(),
                nombreCompleto: `${formData.nombre.trim()} ${formData.apellido.trim()}`,
                curso: formData.curso,
                carrera: formData.carrera,
                needsAdditionalInfo: false,
                updatedAt: new Date().toISOString()
            });

            // Llamar al callback de actualización
            if (onUpdate) {
                await onUpdate();
            }

            onClose();
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            setError('Error al actualizar el perfil. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Typography variant="h6" component="div">
                    Completa tu Perfil
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ pt: 3 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Por favor completa tu información para personalizar tu experiencia.
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* Nombre */}
                        <TextField
                            label="Nombre"
                            value={formData.nombre}
                            onChange={handleChange('nombre')}
                            fullWidth
                            required
                            disabled={loading}
                            placeholder="Ej: Juan"
                        />

                        {/* Apellido */}
                        <TextField
                            label="Apellido"
                            value={formData.apellido}
                            onChange={handleChange('apellido')}
                            fullWidth
                            required
                            disabled={loading}
                            placeholder="Ej: Pérez"
                        />

                        {/* Curso */}
                        <FormControl fullWidth required disabled={loading}>
                            <InputLabel>Curso</InputLabel>
                            <Select
                                value={formData.curso}
                                label="Curso"
                                onChange={handleChange('curso')}
                            >
                                <MenuItem value="">
                                    <em>Selecciona tu curso</em>
                                </MenuItem>
                                {CURSOS_DISPONIBLES.map((curso) => (
                                    <MenuItem key={curso} value={curso}>
                                        {curso}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Carrera */}
                        <FormControl fullWidth required disabled={loading}>
                            <InputLabel>Carrera</InputLabel>
                            <Select
                                value={formData.carrera}
                                label="Carrera"
                                onChange={handleChange('carrera')}
                            >
                                <MenuItem value="">
                                    <em>Selecciona tu carrera</em>
                                </MenuItem>
                                {CARRERAS_DISPONIBLES.map((carrera) => (
                                    <MenuItem key={carrera} value={carrera}>
                                        {carrera}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>

                <DialogActions sx={{
                    px: 3,
                    py: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Button
                        onClick={onClose}
                        disabled={loading}
                        variant="outlined"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ minWidth: 120 }}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};