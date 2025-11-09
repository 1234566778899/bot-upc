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
    Divider
} from '@mui/material';
import {
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    TrendingUp as TrendingUpIcon,
    Message as MessageIcon
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
    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            const response = await fetch(`${CONFIG.uri}/api/feedback/estadisticas`);
            const data = await response.json();

            if (data.success) {
                setEstadisticas(data.estadisticas);
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!estadisticas) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>No hay datos disponibles</Typography>
            </Box>
        );
    }

    const { resumen, porCursoCarrera, comentariosRecientes, tendenciaDiaria } = estadisticas;

    const COLORS = ['#4caf50', '#f44336'];

    const pieData = [
        { name: 'Satisfechos', value: resumen.satisfechos },
        { name: 'No Satisfechos', value: resumen.noSatisfechos }
    ];

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Dashboard de Feedback
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                Análisis de satisfacción del servicio de asistencia
            </Typography>

            {/* Cards de resumen */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Total Feedbacks
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        {resumen.total}
                                    </Typography>
                                </Box>
                                <MessageIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Satisfechos
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="success.main">
                                        {resumen.satisfechos}
                                    </Typography>
                                </Box>
                                <ThumbUpIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        No Satisfechos
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="error.main">
                                        {resumen.noSatisfechos}
                                    </Typography>
                                </Box>
                                <ThumbDownIcon sx={{ fontSize: 40, color: 'error.main', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        % Satisfacción
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                                        {resumen.porcentajeSatisfaccion}%
                                    </Typography>
                                </Box>
                                <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Gráfico de tendencia */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Tendencia Diaria (Últimos 30 días)
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={tendenciaDiaria}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total" />
                                <Line type="monotone" dataKey="satisfechos" stroke="#4caf50" name="Satisfechos" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Gráfico circular */}
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Distribución
                        </Typography>
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
                    </Paper>
                </Grid>

                {/* Por curso/carrera */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Por Curso y Carrera
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={porCursoCarrera}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id.curso" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="satisfechos" fill="#4caf50" name="Satisfechos" />
                                <Bar dataKey="noSatisfechos" fill="#f44336" name="No Satisfechos" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Comentarios recientes */}
                <Grid item xs={12} lg={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Comentarios Recientes
                        </Typography>
                        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                            {comentariosRecientes.map((feedback, index) => (
                                <React.Fragment key={index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                    <Chip
                                                        icon={feedback.satisfecho ? <ThumbUpIcon /> : <ThumbDownIcon />}
                                                        label={feedback.satisfecho ? 'Satisfecho' : 'No Satisfecho'}
                                                        color={feedback.satisfecho ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {feedback.curso} - {feedback.carrera}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="text.primary">
                                                        {feedback.comentario}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(feedback.timestamp).toLocaleDateString()} - {feedback.numeroMensajes} mensajes
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < comentariosRecientes.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;