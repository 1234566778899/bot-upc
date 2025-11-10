// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider,
    TextField,
    MenuItem,
    Stack,
    Button,
    Alert
} from '@mui/material';
import {
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    TrendingUp as TrendingUpIcon,
    Message as MessageIcon,
    FilterList as FilterListIcon,
    Refresh as RefreshIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import { CONFIG } from '../config';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts';

const Dashboard = () => {
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filtros
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [carreraSeleccionada, setCarreraSeleccionada] = useState('');
    const [cursosDisponibles, setCursosDisponibles] = useState([]);
    const [carrerasDisponibles, setCarrerasDisponibles] = useState([]);

    useEffect(() => {
        cargarEstadisticas();
    }, [cursoSeleccionado, carreraSeleccionada]);

    const cargarEstadisticas = async () => {
        setLoading(true);
        setError(null);
        try {
            // Construir query params
            const params = new URLSearchParams();
            if (cursoSeleccionado) params.append('curso', cursoSeleccionado);
            if (carreraSeleccionada) params.append('carrera', carreraSeleccionada);

            const response = await fetch(`${CONFIG.uri}/api/feedback/estadisticas?${params}`);
            const data = await response.json();

            if (data.success) {
                setEstadisticas(data.estadisticas);

                // Extraer cursos y carreras únicas de los datos
                if (data.estadisticas.porCursoCarrera) {
                    const cursosUnicos = [...new Set(
                        data.estadisticas.porCursoCarrera.map(item => item._id.curso)
                    )].filter(Boolean).sort();

                    const carrerasUnicas = [...new Set(
                        data.estadisticas.porCursoCarrera.map(item => item._id.carrera)
                    )].filter(Boolean).sort();

                    setCursosDisponibles(cursosUnicos);
                    setCarrerasDisponibles(carrerasUnicas);
                }
            } else {
                setError('Error al cargar estadísticas');
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleLimpiarFiltros = () => {
        setCursoSeleccionado('');
        setCarreraSeleccionada('');
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <CircularProgress size={60} />
                <Typography variant="body1" color="text.secondary">
                    Cargando estadísticas...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={cargarEstadisticas}
                >
                    Reintentar
                </Button>
            </Box>
        );
    }

    if (!estadisticas) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">
                    No hay datos disponibles
                </Alert>
            </Box>
        );
    }

    const { resumen, porCursoCarrera, comentariosRecientes, tendenciaDiaria } = estadisticas;

    const COLORS = ['#4caf50', '#f44336'];

    const pieData = [
        { name: 'Satisfechos', value: resumen.satisfechos },
        { name: 'No Satisfechos', value: resumen.noSatisfechos }
    ];

    // Preparar datos para el gráfico de barras con etiquetas más cortas
    const datosBarras = porCursoCarrera.map(item => ({
        nombre: `${item._id.curso || 'Sin curso'}`,
        carrera: item._id.carrera || 'Sin carrera',
        satisfechos: item.satisfechos,
        noSatisfechos: item.noSatisfechos,
        total: item.total
    }));

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    📊 Dashboard de Feedback
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Análisis de satisfacción del servicio de asistencia
                </Typography>
            </Box>

            {/* Filtros */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FilterListIcon color="primary" />
                    <Typography variant="h6" fontWeight="600">
                        Filtros
                    </Typography>
                </Box>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            select
                            fullWidth
                            label="Curso"
                            value={cursoSeleccionado}
                            onChange={(e) => setCursoSeleccionado(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        >
                            <MenuItem value="">
                                <em>Todos los cursos</em>
                            </MenuItem>
                            {cursosDisponibles.map((curso) => (
                                <MenuItem key={curso} value={curso}>
                                    {curso}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            select
                            fullWidth
                            label="Carrera"
                            value={carreraSeleccionada}
                            onChange={(e) => setCarreraSeleccionada(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        >
                            <MenuItem value="">
                                <em>Todas las carreras</em>
                            </MenuItem>
                            {carrerasDisponibles.map((carrera) => (
                                <MenuItem key={carrera} value={carrera}>
                                    {carrera}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={12} md={4}>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={cargarEstadisticas}
                                fullWidth
                                sx={{ borderRadius: 2 }}
                            >
                                Actualizar
                            </Button>
                            {(cursoSeleccionado || carreraSeleccionada) && (
                                <Button
                                    variant="text"
                                    onClick={handleLimpiarFiltros}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Limpiar
                                </Button>
                            )}
                        </Stack>
                    </Grid>
                </Grid>

                {/* Mostrar filtros activos */}
                {(cursoSeleccionado || carreraSeleccionada) && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                            Filtros activos:
                        </Typography>
                        {cursoSeleccionado && (
                            <Chip
                                label={`Curso: ${cursoSeleccionado}`}
                                onDelete={() => setCursoSeleccionado('')}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {carreraSeleccionada && (
                            <Chip
                                label={`Carrera: ${carreraSeleccionada}`}
                                onDelete={() => setCarreraSeleccionada('')}
                                size="small"
                                color="secondary"
                                variant="outlined"
                            />
                        )}
                    </Box>
                )}
            </Paper>

            {/* Cards de resumen */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.3s',
                            '&:hover': {
                                boxShadow: 3,
                                transform: 'translateY(-4px)'
                            }
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2" gutterBottom>
                                        Total Feedbacks
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold">
                                        {resumen.total}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 3,
                                        bgcolor: 'primary.lighter',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <MessageIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'success.light',
                            bgcolor: 'success.lighter',
                            transition: 'all 0.3s',
                            '&:hover': {
                                boxShadow: 3,
                                transform: 'translateY(-4px)'
                            }
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2" gutterBottom>
                                        Satisfechos
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color="success.main">
                                        {resumen.satisfechos}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 3,
                                        bgcolor: 'success.light',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <ThumbUpIcon sx={{ fontSize: 32, color: 'white' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'error.light',
                            bgcolor: 'error.lighter',
                            transition: 'all 0.3s',
                            '&:hover': {
                                boxShadow: 3,
                                transform: 'translateY(-4px)'
                            }
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2" gutterBottom>
                                        No Satisfechos
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color="error.main">
                                        {resumen.noSatisfechos}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 3,
                                        bgcolor: 'error.light',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <ThumbDownIcon sx={{ fontSize: 32, color: 'white' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'primary.light',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            transition: 'all 0.3s',
                            '&:hover': {
                                boxShadow: 6,
                                transform: 'translateY(-4px)'
                            }
                        }}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography sx={{ color: 'rgba(255,255,255,0.9)' }} variant="body2" gutterBottom>
                                        % Satisfacción
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                                        {resumen.porcentajeSatisfaccion}%
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <TrendingUpIcon sx={{ fontSize: 32, color: 'white' }} />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Gráfico de tendencia */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <TrendingUpIcon color="primary" />
                            <Typography variant="h6" fontWeight="bold">
                                Tendencia Diaria (Últimos 30 días)
                            </Typography>
                        </Box>
                        {tendenciaDiaria && tendenciaDiaria.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={tendenciaDiaria}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="_id"
                                        tick={{ fontSize: 12 }}
                                        stroke="#666"
                                    />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 8,
                                            border: '1px solid #e0e0e0',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#667eea"
                                        strokeWidth={3}
                                        name="Total"
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="satisfechos"
                                        stroke="#4caf50"
                                        strokeWidth={3}
                                        name="Satisfechos"
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography color="text.secondary">
                                    No hay datos de tendencia disponibles
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Gráfico circular */}
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Distribución
                        </Typography>
                        {resumen.total > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography color="text.secondary">
                                    No hay datos para mostrar
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Por curso/carrera */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <SchoolIcon color="primary" />
                            <Typography variant="h6" fontWeight="bold">
                                Por Curso y Carrera
                            </Typography>
                        </Box>
                        {datosBarras && datosBarras.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={datosBarras}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="nombre"
                                        tick={{ fontSize: 11 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        stroke="#666"
                                    />
                                    <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 8,
                                            border: '1px solid #e0e0e0',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <Paper sx={{ p: 1.5 }}>
                                                        <Typography variant="body2" fontWeight="600">
                                                            {data.nombre}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {data.carrera}
                                                        </Typography>
                                                        <Divider sx={{ my: 0.5 }} />
                                                        <Typography variant="body2" color="success.main">
                                                            Satisfechos: {data.satisfechos}
                                                        </Typography>
                                                        <Typography variant="body2" color="error.main">
                                                            No Satisfechos: {data.noSatisfechos}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="600">
                                                            Total: {data.total}
                                                        </Typography>
                                                    </Paper>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="satisfechos"
                                        fill="#4caf50"
                                        name="Satisfechos"
                                        radius={[8, 8, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="noSatisfechos"
                                        fill="#f44336"
                                        name="No Satisfechos"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography color="text.secondary">
                                    No hay datos por curso/carrera
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Comentarios recientes */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            💬 Comentarios Recientes
                        </Typography>
                        {comentariosRecientes && comentariosRecientes.length > 0 ? (
                            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                                {comentariosRecientes.map((feedback, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem
                                            alignItems="flex-start"
                                            sx={{
                                                borderRadius: 2,
                                                '&:hover': {
                                                    bgcolor: 'action.hover'
                                                }
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                                                        <Chip
                                                            icon={feedback.satisfecho ? <ThumbUpIcon /> : <ThumbDownIcon />}
                                                            label={feedback.satisfecho ? 'Satisfecho' : 'No Satisfecho'}
                                                            color={feedback.satisfecho ? 'success' : 'error'}
                                                            size="small"
                                                        />
                                                        <Chip
                                                            label={feedback.curso}
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                        />
                                                        <Chip
                                                            label={feedback.carrera}
                                                            size="small"
                                                            variant="outlined"
                                                            color="secondary"
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.primary"
                                                            sx={{
                                                                mt: 1,
                                                                fontStyle: feedback.comentario ? 'normal' : 'italic'
                                                            }}
                                                        >
                                                            {feedback.comentario || 'Sin comentario adicional'}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                            {new Date(feedback.timestamp).toLocaleDateString('es-ES', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })} • {feedback.numeroMensajes} mensajes
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {index < comentariosRecientes.length - 1 && <Divider sx={{ my: 1 }} />}
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <MessageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                                <Typography color="text.secondary">
                                    No hay comentarios recientes
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;