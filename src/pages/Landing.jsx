import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Paper,
    Stack,
    IconButton,
    Link as MuiLink
} from '@mui/material';
import {
    ChatBubbleOutline as MessageCircleIcon,
    MenuBook as BookOpenIcon,
    AccessTime as ClockIcon,
    History as HistoryIcon,
    TrackChanges as TargetIcon,
    Security as ShieldIcon,
    AutoAwesome as SparklesIcon,
    School as GraduationCapIcon,
    ChevronRight as ChevronRightIcon,
    CheckCircle as CheckCircleIcon,
    FlashOn as ZapIcon,
    Psychology as BrainIcon,
    People as UsersIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero-chatbot.jpg'; // Ajusta la ruta según tu estructura

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: BookOpenIcon,
            title: "Asistencia Académica",
            description: "Respuestas sobre temas, materiales y exámenes de tus cursos"
        },
        {
            icon: TargetIcon,
            title: "Personalizado",
            description: "Adaptado a tu curso y carrera específica"
        },
        {
            icon: HistoryIcon,
            title: "Historial Completo",
            description: "Accede a todas tus conversaciones anteriores"
        },
        {
            icon: ZapIcon,
            title: "Respuestas Instantáneas",
            description: "Sin esperas, disponible 24/7"
        },
        {
            icon: ShieldIcon,
            title: "Seguro y Privado",
            description: "Tus datos protegidos con Firebase"
        },
        {
            icon: SparklesIcon,
            title: "Feedback Inteligente",
            description: "Sistema de mejora continua"
        }
    ];

    const steps = [
        {
            number: "1",
            title: "Regístrate",
            description: "Crea tu cuenta en segundos con Google o email"
        },
        {
            number: "2",
            title: "Configura tu perfil",
            description: "Añade tu curso y carrera"
        },
        {
            number: "3",
            title: "Pregunta lo que necesites",
            description: "El bot responde adaptado a ti"
        },
        {
            number: "4",
            title: "Revisa tu historial",
            description: "Accede a conversaciones pasadas cuando quieras"
        }
    ];

    const useCases = [
        "¿Cuáles son los temas principales del curso?",
        "Necesito ayuda con ejercicios de cálculo",
        "¿Qué material de estudio está disponible?",
        "Explícame los conceptos clave de programación"
    ];

    const stats = [
        { value: "24/7", label: "Disponibilidad" },
        { value: "100%", label: "Personalizado" },
        { value: "<1s", label: "Tiempo de respuesta" },
        { value: "Gratis", label: "Sin costos" }
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
            {/* Hero Section */}
            <Box sx={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                pt: { xs: 8, md: 12 },
                pb: { xs: 12, md: 20 }
            }}>
                {/* Pattern overlay */}
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    opacity: 0.3
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
                                {/* Badge */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 10,
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        mb: 3
                                    }}
                                >
                                    <SparklesIcon sx={{ fontSize: 18 }} />
                                    <Typography variant="body2" sx={{ color: 'white' }}>
                                        100% Gratis • Sin tarjeta de crédito
                                    </Typography>
                                </Paper>

                                {/* Main Title */}
                                <Typography
                                    variant="h2"
                                    sx={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        mb: 3,
                                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                                        lineHeight: 1.2,
                                        animation: 'fadeIn 0.8s ease-in'
                                    }}
                                >
                                    Tu Asistente Virtual Universitario Inteligente
                                </Typography>

                                {/* Subtitle */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'rgba(255,255,255,0.95)',
                                        mb: 4,
                                        fontSize: { xs: '1rem', md: '1.25rem' },
                                        lineHeight: 1.6
                                    }}
                                >
                                    Obtén ayuda instantánea con tus cursos, 24/7. Respuestas personalizadas adaptadas a tu carrera.
                                </Typography>

                                {/* CTA Buttons */}
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                    sx={{ mb: 4, justifyContent: { xs: 'center', lg: 'flex-start' } }}
                                >
                                    <Button
                                        variant="contained"
                                        size="large"
                                        endIcon={<ChevronRightIcon />}
                                        onClick={() => navigate('/register')}
                                        sx={{
                                            bgcolor: 'white',
                                            color: '#667eea',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.95)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Comenzar Gratis
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/login')}
                                        sx={{
                                            color: 'white',
                                            borderColor: 'rgba(255,255,255,0.4)',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(10px)',
                                            '&:hover': {
                                                borderColor: 'white',
                                                bgcolor: 'rgba(255,255,255,0.2)'
                                            }
                                        }}
                                    >
                                        Iniciar Sesión
                                    </Button>
                                </Stack>

                                {/* Features badges */}
                                <Stack
                                    direction="row"
                                    spacing={3}
                                    sx={{
                                        justifyContent: { xs: 'center', lg: 'flex-start' },
                                        color: 'rgba(255,255,255,0.9)',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircleIcon sx={{ fontSize: 20 }} />
                                        <Typography variant="body2">Sin instalación</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircleIcon sx={{ fontSize: 20 }} />
                                        <Typography variant="body2">Acceso inmediato</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Grid>

                        {/* Hero Image */}
                        <Grid item xs={12} lg={6} sx={{ display: { xs: 'none', lg: 'block' } }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    animation: 'float 6s ease-in-out infinite',
                                    '@keyframes float': {
                                        '0%, 100%': { transform: 'translateY(0px)' },
                                        '50%': { transform: 'translateY(-20px)' }
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                                        borderRadius: 6,
                                        filter: 'blur(40px)'
                                    }}
                                />
                                <Box
                                    component="img"
                                    src={heroImage}
                                    alt="ChatBot UNI Interface"
                                    sx={{
                                        position: 'relative',
                                        borderRadius: 6,
                                        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                                        width: '100%',
                                        height: 'auto'
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>

                <style>
                    {`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}
                </style>
            </Box>

            {/* Stats Section */}
            <Paper
                elevation={0}
                sx={{
                    py: 6,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Container maxWidth="md">
                    <Grid container spacing={4}>
                        {stats.map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        animation: 'slideUp 0.6s ease-out',
                                        animationDelay: `${index * 0.1}s`,
                                        animationFillMode: 'both',
                                        '@keyframes slideUp': {
                                            from: { opacity: 0, transform: 'translateY(30px)' },
                                            to: { opacity: 1, transform: 'translateY(0)' }
                                        }
                                    }}
                                >
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'primary.main',
                                            mb: 1,
                                            fontSize: { xs: '2rem', md: '2.5rem' }
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Paper>

            {/* Features Section */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(103, 126, 234, 0.05)' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 'bold',
                                mb: 2,
                                fontSize: { xs: '2rem', md: '2.5rem' }
                            }}
                        >
                            Características Principales
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ maxWidth: 700, mx: 'auto' }}
                        >
                            Todo lo que necesitas para mejorar tu experiencia académica
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} lg={4} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        border: 'none',
                                        borderRadius: 4,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                borderRadius: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 3
                                            }}
                                        >
                                            <feature.icon sx={{ fontSize: 28, color: 'white' }} />
                                        </Box>
                                        <Typography variant="h6" fontWeight="600" gutterBottom>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* How It Works Section */}
            <Box sx={{ py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 'bold',
                                mb: 2,
                                fontSize: { xs: '2rem', md: '2.5rem' }
                            }}
                        >
                            ¿Cómo Funciona?
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Comenzar es súper simple
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {steps.map((step, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                                    <Box
                                        sx={{
                                            width: 72,
                                            height: 72,
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                            mx: 'auto',
                                            mb: 3,
                                            boxShadow: '0 8px 16px rgba(103, 126, 234, 0.3)'
                                        }}
                                    >
                                        {step.number}
                                    </Box>
                                    <Typography variant="h6" fontWeight="600" gutterBottom>
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {step.description}
                                    </Typography>

                                    {index < steps.length - 1 && (
                                        <ChevronRightIcon
                                            sx={{
                                                display: { xs: 'none', md: 'block' },
                                                position: 'absolute',
                                                top: 36,
                                                right: -20,
                                                color: 'primary.main',
                                                fontSize: 32
                                            }}
                                        />
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Use Cases Section */}
            <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(103, 126, 234, 0.05)' }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: 'rgba(103, 126, 234, 0.1)',
                                px: 2,
                                py: 1,
                                borderRadius: 10,
                                color: 'primary.main',
                                mb: 3
                            }}
                        >
                            <MessageCircleIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" fontWeight="600">
                                Ejemplos reales
                            </Typography>
                        </Paper>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 'bold',
                                mb: 2,
                                fontSize: { xs: '2rem', md: '2.5rem' }
                            }}
                        >
                            Pregunta lo que necesites
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Algunos ejemplos de lo que puedes consultar
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        {useCases.map((useCase, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        border: '2px solid',
                                        borderColor: 'rgba(103, 126, 234, 0.2)',
                                        borderRadius: 3,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: 'rgba(103, 126, 234, 0.5)',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    bgcolor: 'rgba(103, 126, 234, 0.1)',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <BrainIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                                            </Box>
                                            <Typography variant="body1" fontWeight="500">
                                                {useCase}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: { xs: 8, md: 12 }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                        opacity: 0.3
                    }}
                />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <GraduationCapIcon sx={{ fontSize: 72, color: 'white', mb: 3 }} />
                        <Typography
                            variant="h3"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                mb: 3,
                                fontSize: { xs: '2rem', md: '2.5rem' }
                            }}
                        >
                            ¿Listo para mejorar tu experiencia universitaria?
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: 'rgba(255,255,255,0.95)', mb: 4 }}
                        >
                            Únete a miles de estudiantes que ya están usando ChatBot UNI
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ChevronRightIcon />}
                            onClick={() => navigate('/register')}
                            sx={{
                                bgcolor: 'white',
                                color: '#667eea',
                                px: 5,
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: 3,
                                textTransform: 'none',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.95)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Comenzar Ahora - Es Gratis
                        </Button>
                        <Typography
                            variant="body2"
                            sx={{ color: 'rgba(255,255,255,0.8)', mt: 2 }}
                        >
                            No se requiere tarjeta de crédito
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    bgcolor: '#1a1a1a',
                    color: 'white',
                    py: 6
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <MessageCircleIcon />
                                <Typography variant="h6" fontWeight="bold">
                                    ChatBot UNI
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Tu asistente virtual universitario inteligente, disponible 24/7
                            </Typography>
                        </Grid>

                        <Grid item xs={6} md={3}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                                Producto
                            </Typography>
                            <Stack spacing={1}>
                                <MuiLink href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                    Características
                                </MuiLink>
                                <MuiLink href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                    Precios
                                </MuiLink>
                                <MuiLink href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                    Seguridad
                                </MuiLink>
                            </Stack>
                        </Grid>

                        <Grid item xs={6} md={3}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                                Empresa
                            </Typography>
                            <Stack spacing={1}>
                                <MuiLink href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                    Acerca de
                                </MuiLink>
                                <MuiLink href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                    Blog
                                </MuiLink>
                                <MuiLink href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                    Contacto
                                </MuiLink>
                            </Stack>
                        </Grid>

                        <Grid item xs={6} md={3}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                                Legal
                            </Typography>
                            <Stack spacing={1}>
                                <MuiLink href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                    Términos
                                </MuiLink>
                                <MuiLink href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                    Privacidad
                                </MuiLink>
                                <MuiLink href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                                    Cookies
                                </MuiLink>
                            </Stack>
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            pt: 4,
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            © 2025 ChatBot UNI. Todos los derechos reservados.
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'rgba(255,255,255,0.7)',
                                    '&:hover': { color: 'white' }
                                }}
                            >
                                <UsersIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'rgba(255,255,255,0.7)',
                                    '&:hover': { color: 'white' }
                                }}
                            >
                                <MessageCircleIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'rgba(255,255,255,0.7)',
                                    '&:hover': { color: 'white' }
                                }}
                            >
                                <GraduationCapIcon />
                            </IconButton>
                        </Stack>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;