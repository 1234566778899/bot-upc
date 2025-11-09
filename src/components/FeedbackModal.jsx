// components/FeedbackModal.jsx
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    TextField,
    Rating,
    Stack,
    IconButton
} from '@mui/material';
import {
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const FeedbackModal = ({ open, onClose, onSubmit, curso, carrera }) => {
    const [satisfecho, setSatisfecho] = useState(null);
    const [comentario, setComentario] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async () => {
        if (satisfecho === null) return;

        setEnviando(true);
        await onSubmit({ satisfecho, comentario });
        setEnviando(false);

        // Reset
        setSatisfecho(null);
        setComentario('');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 1
                }
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">
                        ¿Cómo fue tu experiencia? 💭
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {curso} - {carrera}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                            ¿Estás satisfecho con la asistencia?
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button
                                variant={satisfecho === true ? "contained" : "outlined"}
                                color="success"
                                startIcon={<ThumbUpIcon />}
                                onClick={() => setSatisfecho(true)}
                                sx={{
                                    flex: 1,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                Sí, me ayudó
                            </Button>
                            <Button
                                variant={satisfecho === false ? "contained" : "outlined"}
                                color="error"
                                startIcon={<ThumbDownIcon />}
                                onClick={() => setSatisfecho(false)}
                                sx={{
                                    flex: 1,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                No, necesito más ayuda
                            </Button>
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                            ¿Quieres agregar algún comentario? (opcional)
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Cuéntanos más sobre tu experiencia..."
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            variant="outlined"
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{ textTransform: 'none' }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={satisfecho === null || enviando}
                    sx={{
                        textTransform: 'none',
                        minWidth: 120
                    }}
                >
                    {enviando ? 'Enviando...' : 'Enviar Feedback'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FeedbackModal;   