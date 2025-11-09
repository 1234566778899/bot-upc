// components/FeedbackInline.jsx
import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Collapse,
    IconButton,
    Stack,
    Chip
} from '@mui/material';
import {
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    Close as CloseIcon,
    Send as SendIcon
} from '@mui/icons-material';

const FeedbackInline = ({ onSubmit, onDismiss }) => {
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comentario, setComentario] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleFeedbackClick = (satisfecho) => {
        setSelectedFeedback(satisfecho);
        setShowCommentBox(true);
    };

    const handleSubmit = async () => {
        if (selectedFeedback === null) return;

        setEnviando(true);
        await onSubmit({
            satisfecho: selectedFeedback,
            comentario: comentario.trim()
        });
        setEnviando(false);
    };

    const handleSkip = () => {
        if (selectedFeedback !== null) {
            handleSubmit();
        } else {
            onDismiss();
        }
    };

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                bgcolor: '#f8f9fa',
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'primary.light',
                position: 'relative'
            }}
        >
            <IconButton
                size="small"
                onClick={onDismiss}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>

            <Box sx={{ pr: 4 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="primary" gutterBottom>
                    ¿Te he podido ayudar con tu pregunta? 🤔
                </Typography>

                {!showCommentBox ? (
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button
                            variant={selectedFeedback === true ? "contained" : "outlined"}
                            color="success"
                            startIcon={<ThumbUpIcon />}
                            onClick={() => handleFeedbackClick(true)}
                            size="small"
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                flex: 1
                            }}
                        >
                            Sí, me ayudó
                        </Button>
                        <Button
                            variant={selectedFeedback === false ? "contained" : "outlined"}
                            color="error"
                            startIcon={<ThumbDownIcon />}
                            onClick={() => handleFeedbackClick(false)}
                            size="small"
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                flex: 1
                            }}
                        >
                            No mucho
                        </Button>
                    </Stack>
                ) : (
                    <Collapse in={showCommentBox}>
                        <Box sx={{ mt: 2 }}>
                            <Chip
                                icon={selectedFeedback ? <ThumbUpIcon /> : <ThumbDownIcon />}
                                label={selectedFeedback ? 'Satisfecho' : 'No satisfecho'}
                                color={selectedFeedback ? 'success' : 'error'}
                                size="small"
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                placeholder={
                                    selectedFeedback
                                        ? "¿Qué fue lo que más te ayudó? (opcional)"
                                        : "¿Cómo podría mejorar mi asistencia? (opcional)"
                                }
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    bgcolor: 'white',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />

                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleSubmit}
                                    disabled={enviando}
                                    endIcon={<SendIcon />}
                                    sx={{ textTransform: 'none', flex: 1 }}
                                >
                                    {enviando ? 'Enviando...' : 'Enviar feedback'}
                                </Button>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={handleSkip}
                                    disabled={enviando}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Omitir
                                </Button>
                            </Stack>
                        </Box>
                    </Collapse>
                )}
            </Box>
        </Paper>
    );
};

export default FeedbackInline;