import React, { useState } from 'react';
import { useUser } from 'reactfire';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Alert,
    LinearProgress,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Card,
    CardContent,
    Divider,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon,
    School as SchoolIcon,
    Lock as LockIcon,
    RocketLaunch as RocketLaunchIcon,
    Description as DescriptionIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { CONFIG } from '../config';

const AUTHORIZED_EMAILS = [
    'gabitotaipe01@gmail.com',
    'ordazhoyos2001@gmail.com'
];

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

export const Training = () => {
    const { data: user } = useUser();
    const [curso, setCurso] = useState('');
    const [carrera, setCarrera] = useState('');
    const [archivos, setArchivos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [progreso, setProgreso] = useState(0);
    const [progresoTexto, setProgresoTexto] = useState('');

    // Verificar si el usuario tiene permisos
    const isAuthorized = user && AUTHORIZED_EMAILS.includes(user.email);

    if (!isAuthorized) {
        return (
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
                    <LockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                    <Typography variant="h4" gutterBottom color="error">
                        Acceso Restringido
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        No tienes permisos para acceder a esta sección.
                    </Typography>
                </Paper>
            </Container>
        );
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const pdfFiles = files.filter(file => file.type === 'application/pdf');

        if (pdfFiles.length !== files.length) {
            setMensaje({
                tipo: 'warning',
                texto: 'Solo se permiten archivos PDF. Algunos archivos fueron ignorados.'
            });
        }

        setArchivos(pdfFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!curso || !carrera) {
            setMensaje({
                tipo: 'error',
                texto: 'Por favor completa todos los campos.'
            });
            return;
        }

        if (archivos.length === 0) {
            setMensaje({
                tipo: 'error',
                texto: 'Debes subir al menos un archivo PDF.'
            });
            return;
        }

        setLoading(true);
        setMensaje({ tipo: '', texto: '' });
        setProgreso(0);

        try {
            const formData = new FormData();
            formData.append('curso', curso);
            formData.append('carrera', carrera);
            formData.append('userEmail', user.email);

            archivos.forEach(archivo => {
                formData.append('archivos', archivo);
            });

            // Simular progreso
            const progressInterval = setInterval(() => {
                setProgreso(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        setProgresoTexto('Finalizando...');
                        return 90;
                    }
                    if (prev < 30) {
                        setProgresoTexto('Subiendo archivos...');
                    } else if (prev < 60) {
                        setProgresoTexto('Creando vector store...');
                    } else {
                        setProgresoTexto('Entrenando asistente...');
                    }
                    return prev + 10;
                });
            }, 1000);

            const response = await axios.post(
                `${CONFIG.uri}/api/entrenar`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            clearInterval(progressInterval);
            setProgreso(100);
            setProgresoTexto('¡Completado!');

            if (response.data.success) {
                setMensaje({
                    tipo: 'success',
                    texto: `¡Asistente entrenado exitosamente para ${curso} - ${carrera}!`
                });

                // Limpiar formulario
                setCurso('');
                setCarrera('');
                setArchivos([]);
            }
        } catch (error) {
            console.error('Error al entrenar asistente:', error);
            setMensaje({
                tipo: 'error',
                texto: error.response?.data?.error || 'Error al entrenar el asistente. Intenta nuevamente.'
            });
        } finally {
            setLoading(false);
            setTimeout(() => {
                setProgreso(0);
                setProgresoTexto('');
            }, 2000);
        }
    };

    const handleRemoveFile = (index) => {
        const newArchivos = archivos.filter((_, i) => i !== index);
        setArchivos(newArchivos);
    };

    const formatFileSize = (bytes) => {
        return (bytes / 1024 / 1024).toFixed(2);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h3" gutterBottom>
                        Entrenamiento de Asistentes
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Sube archivos PDF para entrenar asistentes específicos por curso y carrera
                    </Typography>
                </Box>

                {/* Mensaje de alerta */}
                {mensaje.texto && (
                    <Alert
                        severity={mensaje.tipo}
                        sx={{ mb: 3 }}
                        onClose={() => setMensaje({ tipo: '', texto: '' })}
                    >
                        {mensaje.texto}
                    </Alert>
                )}

                {/* Formulario */}
                <Box component="form" onSubmit={handleSubmit}>
                    {/* Select de Curso */}
                    <FormControl fullWidth sx={{ mb: 3 }} required disabled={loading}>
                        <InputLabel>Curso</InputLabel>
                        <Select
                            value={curso}
                            label="Curso"
                            onChange={(e) => setCurso(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Selecciona un curso</em>
                            </MenuItem>
                            {CURSOS_DISPONIBLES.map((cursoOption) => (
                                <MenuItem key={cursoOption} value={cursoOption}>
                                    {cursoOption}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Select de Carrera */}
                    <FormControl fullWidth sx={{ mb: 3 }} required disabled={loading}>
                        <InputLabel>Carrera</InputLabel>
                        <Select
                            value={carrera}
                            label="Carrera"
                            onChange={(e) => setCarrera(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Selecciona una carrera</em>
                            </MenuItem>
                            {CARRERAS_DISPONIBLES.map((carreraOption) => (
                                <MenuItem key={carreraOption} value={carreraOption}>
                                    {carreraOption}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Input de archivos */}
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        fullWidth
                        disabled={loading}
                        sx={{ mb: 1 }}
                    >
                        Seleccionar Archivos PDF
                        <input
                            type="file"
                            accept=".pdf"
                            multiple
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>


                    {/* Lista de archivos */}
                    {archivos.length > 0 && (
                        <Card variant="outlined" sx={{ mb: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">
                                        Archivos seleccionados
                                    </Typography>
                                    <Chip
                                        label={archivos.length}
                                        color="primary"
                                        size="small"
                                        sx={{ ml: 2 }}
                                    />
                                </Box>
                                <List>
                                    {archivos.map((archivo, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <DescriptionIcon sx={{ mr: 2, color: 'error.main' }} />
                                                <ListItemText
                                                    primary={archivo.name}
                                                    secondary={`${formatFileSize(archivo.size)} MB`}
                                                />
                                                {!loading && (
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() => handleRemoveFile(index)}
                                                            color="error"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                )}
                                            </ListItem>
                                            {index < archivos.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    )}

                    {/* Barra de progreso */}
                    {loading && (
                        <Box sx={{ mb: 3 }}>
                            <LinearProgress
                                variant="determinate"
                                value={progreso}
                                sx={{ height: 10, borderRadius: 5 }}
                            />
                            <Typography
                                variant="body2"
                                color="primary"
                                sx={{ mt: 1, textAlign: 'center', fontWeight: 'bold' }}
                            >
                                {progresoTexto}
                            </Typography>
                        </Box>
                    )}

                    {/* Botón de envío */}
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading || archivos.length === 0 || !curso || !carrera}
                        startIcon={loading ? null : <RocketLaunchIcon />}
                        sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            background: loading ? undefined : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        }}
                    >
                        {loading ? '⏳ Entrenando...' : '🚀 Entrenar Asistente'}
                    </Button>
                </Box>

                {/* Información adicional */}
                <Card sx={{ mt: 4, bgcolor: 'info.lighter', borderLeft: 4, borderColor: 'info.main' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <InfoIcon sx={{ mr: 1, color: 'info.main' }} />
                            <Typography variant="h6" color="info.main">
                                Información Importante
                            </Typography>
                        </Box>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="• El entrenamiento puede tomar varios minutos dependiendo de la cantidad y tamaño de archivos."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="• Si ya existe un asistente para el mismo curso y carrera, será reemplazado automáticamente."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="• Los archivos PDF deben contener texto legible (no imágenes escaneadas)."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="• Una vez entrenado, el asistente estará disponible inmediatamente para todos los usuarios."
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>

                {/* Información de cursos y carreras disponibles */}
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Card sx={{ flex: 1 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary">
                                📚 Cursos Disponibles
                            </Typography>
                            <List dense>
                                {CURSOS_DISPONIBLES.map((curso) => (
                                    <ListItem key={curso}>
                                        <ListItemText primary={`• ${curso}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    <Card sx={{ flex: 1 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="secondary">
                                🎓 Carreras Disponibles
                            </Typography>
                            <List dense>
                                {CARRERAS_DISPONIBLES.map((carrera) => (
                                    <ListItem key={carrera}>
                                        <ListItemText primary={`• ${carrera}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Box>
            </Paper>
        </Container>
    );
};