import React, { useState, useRef, useEffect, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Avatar,
    Chip,
    Stack,
    List,
    ListItem,
    CircularProgress,
    Fade,
    Badge,
    Tooltip,
    useTheme,
    useMediaQuery,
    InputAdornment,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Send as SendIcon,
    AttachFile as AttachFileIcon,
    School as SchoolIcon,
    MoreVert as MoreVertIcon,
    EmojiEmotions as EmojiIcon,
    Refresh as RefreshIcon,
    SmartToy as BotIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
    arrayUnion
} from 'firebase/firestore';
import { CONFIG } from '../config';
import { AuthContext } from '../contexts/AuthContextApp';
import FeedbackInline from '../components/FeedbackInline';

const Chat = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userData } = useContext(AuthContext);
    const firestore = getFirestore();

    const [messages, setMessages] = useState([
        {
            id: 1,
            text: '¡Hola! 👋 Soy tu asistente virtual universitario. Puedo ayudarte con información sobre tus cursos y carrera.',
            sender: 'bot',
            timestamp: new Date(),
            type: 'welcome'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [error, setError] = useState(null);
    const [serverStatus, setServerStatus] = useState('checking');
    const [currentChatId, setCurrentChatId] = useState(null);
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const [currentThreadId, setCurrentThreadId] = useState(null);

    // Estados para feedback inline
    const [showFeedbackInline, setShowFeedbackInline] = useState(false);
    const [pendingFeedbackMessageId, setPendingFeedbackMessageId] = useState(null);
    const [feedbackGiven, setFeedbackGiven] = useState(new Set());

    const messagesEndRef = useRef(null);
    const loadedChatIdRef = useRef(null);
    const lastNewParamRef = useRef(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const API_BASE_URL = `${CONFIG.uri}/api/chat`;

    const suggestions = [
        { text: '📚 Temas del curso', query: '¿Cuáles son los temas principales del curso?', color: 'primary' },
        { text: '📖 Material de estudio', query: '¿Qué material de estudio está disponible?', color: 'secondary' },
        { text: '❓ Ayuda con ejercicios', query: 'Necesito ayuda con ejercicios', color: 'success' },
        { text: '📝 Información de exámenes', query: 'Información sobre exámenes', color: 'warning' },
        { text: '🎯 Objetivos del curso', query: '¿Cuáles son los objetivos del curso?', color: 'info' },
        { text: '💡 Conceptos clave', query: 'Explícame los conceptos clave', color: 'error' }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, showFeedbackInline]);

    useEffect(() => {
        checkServerHealth();
    }, []);

    // DETECTAR ?new= para resetear el chat
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const newParam = searchParams.get('new');

        if (newParam && newParam !== lastNewParamRef.current) {
            console.log('✅ RESETEAR CHAT - Param:', newParam);

            lastNewParamRef.current = newParam;
            loadedChatIdRef.current = null;
            setCurrentChatId(null);
            setCurrentThreadId(null);
            setShowSuggestions(true);
            setInputMessage('');
            setError(null);
            setIsTyping(false);
            setShowFeedbackInline(false);
            setPendingFeedbackMessageId(null);
            setFeedbackGiven(new Set());

            // FORZAR reseteo completo de mensajes
            const newMessages = [
                {
                    id: Date.now(),
                    text: '¡Hola! 👋 Soy tu asistente virtual universitario. Puedo ayudarte con información sobre tus cursos y carrera.',
                    sender: 'bot',
                    timestamp: new Date(),
                    type: 'welcome'
                }
            ];

            setMessages(newMessages);

            // Limpiar URL
            setTimeout(() => {
                navigate('/chat', { replace: true });
            }, 100);
        }
    }, [location.search, navigate]);

    // Cargar chat desde History
    useEffect(() => {
        if (!user || !chatId) return;

        if (location.state?.noReload) {
            window.history.replaceState({}, document.title);
            return;
        }

        if (loadedChatIdRef.current !== chatId) {
            loadedChatIdRef.current = chatId;
            loadChat(chatId);
        }
    }, [chatId, user, location.state]);

    const checkServerHealth = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            if (response.ok) {
                setServerStatus('online');
            } else {
                setServerStatus('offline');
            }
        } catch (error) {
            console.error('Error checking server health:', error);
            setServerStatus('offline');
        }
    };

    const convertTimestampToDate = (timestamp) => {
        if (!timestamp) return new Date();
        if (timestamp instanceof Date) return timestamp;
        if (timestamp.toDate && typeof timestamp.toDate === 'function') return timestamp.toDate();
        if (typeof timestamp === 'number') return new Date(timestamp);
        if (typeof timestamp === 'string') return new Date(timestamp);
        return new Date();
    };

    const loadChat = async (id) => {
        setIsLoadingChat(true);
        try {
            const chatDocRef = doc(firestore, 'chats', id);
            const chatDoc = await getDoc(chatDocRef);

            if (chatDoc.exists()) {
                const chatData = chatDoc.data();

                if (chatData.userId !== user.uid) {
                    setError('No tienes acceso a este chat');
                    navigate('/chat');
                    return;
                }

                const loadedMessages = (chatData.messages || []).map(msg => ({
                    ...msg,
                    timestamp: convertTimestampToDate(msg.timestamp)
                }));

                setMessages(loadedMessages);
                setCurrentChatId(id);
                setCurrentThreadId(chatData.threadId || null);
                setShowSuggestions(false);

                // Cargar feedbacks ya dados
                if (chatData.feedbacksGiven) {
                    setFeedbackGiven(new Set(chatData.feedbacksGiven));
                }
            } else {
                setError('Chat no encontrado');
                navigate('/chat');
            }
        } catch (error) {
            console.error('Error loading chat:', error);
            setError('Error al cargar el chat');
        } finally {
            setIsLoadingChat(false);
        }
    };

    const handleSendMessage = async (messageText = null) => {
        const mensaje = messageText || inputMessage.trim();
        if (!mensaje) return;

        if (!userData?.curso || !userData?.carrera) {
            setError('Por favor completa tu perfil con tu curso y carrera');
            return;
        }

        if (serverStatus !== 'online') {
            setError('El servidor no está disponible');
            return;
        }

        // Ocultar feedback inline si está visible
        setShowFeedbackInline(false);

        const userMessage = {
            id: Date.now(),
            text: mensaje,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);
        setShowSuggestions(false);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/preguntar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pregunta: mensaje,
                    curso: userData.curso,
                    carrera: userData.carrera,
                    threadId: currentThreadId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar la pregunta');
            }

            if (data.success) {
                const botMessage = {
                    id: Date.now() + 1,
                    text: data.respuesta,
                    sender: 'bot',
                    timestamp: new Date(),
                    assistantId: data.assistantId,
                    shouldAskFeedback: data.shouldAskFeedback // 🆕 Guardar si debe preguntar
                };

                setMessages(prev => [...prev, botMessage]);

                if (data.threadId && data.threadId !== currentThreadId) {
                    setCurrentThreadId(data.threadId);
                }

                await saveToFirebase([userMessage, botMessage], data.threadId);

                // 🆕 Mostrar feedback inline si el bot detectó que debe preguntar
                if (data.shouldAskFeedback && !feedbackGiven.has(botMessage.id)) {
                    setTimeout(() => {
                        setShowFeedbackInline(true);
                        setPendingFeedbackMessageId(botMessage.id);
                    }, 1500);
                }
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            setError(error.message || 'Error al comunicarse con el servidor');

            const errorMessage = {
                id: Date.now() + 1,
                text: 'Lo siento, ocurrió un error al procesar tu pregunta. Por favor intenta nuevamente.',
                sender: 'bot',
                timestamp: new Date(),
                isError: true
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const saveToFirebase = async (newMessages, threadId) => {
        if (!user) return;

        try {
            let chatDocId = currentChatId;

            if (!chatDocId) {
                chatDocId = `${user.uid}_${Date.now()}`;
                const chatDocRef = doc(firestore, 'chats', chatDocId);

                const firstUserMessage = messages.find(m => m.sender === 'user')?.text ||
                    newMessages.find(m => m.sender === 'user')?.text ||
                    'Nueva conversación';

                await setDoc(chatDocRef, {
                    userId: user.uid,
                    title: firstUserMessage.substring(0, 50) + (firstUserMessage.length > 50 ? '...' : ''),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    messages: [...messages, ...newMessages],
                    threadId: threadId || currentThreadId,
                    curso: userData?.curso || '',
                    carrera: userData?.carrera || '',
                    feedbacksGiven: Array.from(feedbackGiven)
                });

                setCurrentChatId(chatDocId);
                navigate(`/chat/${chatDocId}`, { replace: true, state: { noReload: true } });

            } else {
                const chatDocRef = doc(firestore, 'chats', chatDocId);
                await updateDoc(chatDocRef, {
                    messages: arrayUnion(...newMessages),
                    updatedAt: serverTimestamp(),
                    threadId: threadId || currentThreadId,
                    curso: userData?.curso || '',
                    carrera: userData?.carrera || ''
                });
            }
        } catch (error) {
            console.error('Error saving to Firebase:', error);
        }
    };

    const handleFeedbackSubmit = async ({ satisfecho, comentario }) => {
        try {
            const response = await fetch(`${CONFIG.uri}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatId: currentChatId || `temp_${Date.now()}`,
                    userId: user.uid,
                    curso: userData.curso,
                    carrera: userData.carrera,
                    satisfecho,
                    comentario,
                    assistantId: messages.find(m => m.assistantId)?.assistantId || '',
                    threadId: currentThreadId,
                    numeroMensajes: messages.length
                })
            });

            const data = await response.json();

            if (data.success) {
                // Marcar que ya se dio feedback para este mensaje
                const newFeedbackGiven = new Set(feedbackGiven);
                newFeedbackGiven.add(pendingFeedbackMessageId);
                setFeedbackGiven(newFeedbackGiven);

                // Guardar en Firebase
                if (currentChatId) {
                    const chatDocRef = doc(firestore, 'chats', currentChatId);
                    await updateDoc(chatDocRef, {
                        feedbacksGiven: Array.from(newFeedbackGiven)
                    });
                }

                // Mostrar mensaje de agradecimiento
                const thankYouMessage = {
                    id: Date.now(),
                    text: satisfecho
                        ? '¡Gracias por tu feedback positivo! 😊 Me alegra haber podido ayudarte.'
                        : 'Gracias por tu feedback. Tomaré en cuenta tus comentarios para mejorar. ¿Hay algo más específico en lo que pueda ayudarte?',
                    sender: 'bot',
                    timestamp: new Date(),
                    type: 'feedback_response'
                };

                setMessages(prev => [...prev, thankYouMessage]);

                if (currentChatId) {
                    const chatDocRef = doc(firestore, 'chats', currentChatId);
                    await updateDoc(chatDocRef, {
                        messages: arrayUnion(thankYouMessage),
                        updatedAt: serverTimestamp()
                    });
                }
            }

            setShowFeedbackInline(false);
            setPendingFeedbackMessageId(null);

        } catch (error) {
            console.error('Error enviando feedback:', error);
            setError('Error al enviar feedback. Por favor intenta nuevamente.');
        }
    };

    const handleFeedbackDismiss = () => {
        setShowFeedbackInline(false);
        setPendingFeedbackMessageId(null);
    };

    const handleSuggestionClick = (suggestion) => {
        handleSendMessage(suggestion.query);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleRetry = () => {
        if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
            handleSendMessage(messages[messages.length - 1].text);
        }
    };

    const getConnectionStatusColor = () => {
        switch (serverStatus) {
            case 'online': return 'success.main';
            case 'offline': return 'error.main';
            default: return 'warning.main';
        }
    };

    const formatTime = (date) => {
        if (!date) return '';
        const d = convertTimestampToDate(date);
        return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    if (isLoadingChat) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f8f9fa',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    borderRadius: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100
                }}
            >
                <Box sx={{
                    maxWidth: 900,
                    mx: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Badge
                            color={serverStatus === 'online' ? 'success' : 'error'}
                            variant="dot"
                            overlap="circular"
                        >
                            <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
                                <SchoolIcon />
                            </Avatar>
                        </Badge>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                Asistente Universitario
                            </Typography>
                            {userData?.curso && userData?.carrera && (
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    {userData.curso} - {userData.carrera}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <IconButton color="inherit">
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            </Paper>

            {/* Messages Area */}
            <Box sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ maxWidth: 900, width: '100%', mx: 'auto' }}>
                    <List sx={{ width: '100%' }}>
                        {messages.map((message) => (
                            <ListItem
                                key={message.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                    mb: 2,
                                    px: 0
                                }}
                            >
                                <Fade in timeout={300}>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 1,
                                        maxWidth: '75%',
                                        flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                                        alignItems: 'flex-start'
                                    }}>
                                        <Avatar sx={{
                                            width: 36,
                                            height: 36,
                                            bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                                            flexShrink: 0
                                        }}>
                                            {message.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                                        </Avatar>

                                        <Paper
                                            elevation={1}
                                            sx={{
                                                p: 2,
                                                bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                                                color: message.sender === 'user' ? 'white' : 'text.primary',
                                                borderRadius: 3,
                                                wordWrap: 'break-word',
                                                ...(message.isError && {
                                                    bgcolor: 'error.light',
                                                    color: 'error.contrastText'
                                                })
                                            }}
                                        >
                                            {message.sender === 'bot' ? (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeHighlight]}
                                                    components={{
                                                        p: ({ children }) => (
                                                            <Typography variant="body2" sx={{ mb: 1, '&:last-child': { mb: 0 } }}>
                                                                {children}
                                                            </Typography>
                                                        ),
                                                        h1: ({ children }) => (
                                                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1, mt: 1 }}>
                                                                {children}
                                                            </Typography>
                                                        ),
                                                        h2: ({ children }) => (
                                                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, mt: 1 }}>
                                                                {children}
                                                            </Typography>
                                                        ),
                                                        ul: ({ children }) => (
                                                            <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                                                                {children}
                                                            </Box>
                                                        ),
                                                        ol: ({ children }) => (
                                                            <Box component="ol" sx={{ pl: 3, mb: 1 }}>
                                                                {children}
                                                            </Box>
                                                        ),
                                                        code: ({ inline, children }) => (
                                                            inline ? (
                                                                <Box
                                                                    component="code"
                                                                    sx={{
                                                                        bgcolor: 'grey.200',
                                                                        px: 0.5,
                                                                        py: 0.2,
                                                                        borderRadius: 1,
                                                                        fontSize: '0.9em',
                                                                        fontFamily: 'monospace'
                                                                    }}
                                                                >
                                                                    {children}
                                                                </Box>
                                                            ) : (
                                                                <Box
                                                                    component="pre"
                                                                    sx={{
                                                                        bgcolor: 'grey.900',
                                                                        color: 'white',
                                                                        p: 2,
                                                                        borderRadius: 2,
                                                                        overflow: 'auto',
                                                                        mb: 1
                                                                    }}
                                                                >
                                                                    <code>{children}</code>
                                                                </Box>
                                                            )
                                                        )
                                                    }}
                                                >
                                                    {message.text}
                                                </ReactMarkdown>
                                            ) : (
                                                <Typography variant="body2">
                                                    {message.text}
                                                </Typography>
                                            )}

                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: 'block',
                                                    mt: 0.5,
                                                    opacity: 0.7,
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                {formatTime(message.timestamp)}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                </Fade>
                            </ListItem>
                        ))}

                        {isTyping && (
                            <ListItem sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main' }}>
                                        <BotIcon />
                                    </Avatar>
                                    <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
                                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                            <CircularProgress size={8} />
                                            <CircularProgress size={8} sx={{ animationDelay: '0.2s' }} />
                                            <CircularProgress size={8} sx={{ animationDelay: '0.4s' }} />
                                            <Typography variant="caption" sx={{ ml: 1 }}>
                                                Escribiendo...
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Box>
                            </ListItem>
                        )}

                        {/* 🆕 Feedback Inline */}
                        {showFeedbackInline && !isTyping && (
                            <ListItem sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, px: 0 }}>
                                <Fade in timeout={500}>
                                    <Box sx={{ maxWidth: '75%', width: '100%', ml: 5 }}>
                                        <FeedbackInline
                                            onSubmit={handleFeedbackSubmit}
                                            onDismiss={handleFeedbackDismiss}
                                        />
                                    </Box>
                                </Fade>
                            </ListItem>
                        )}

                        <div ref={messagesEndRef} />
                    </List>
                </Box>
            </Box>

            {/* Suggestions */}
            {showSuggestions && userData?.curso && userData?.carrera && messages.length <= 2 && (
                <Box sx={{
                    p: 2,
                    bgcolor: 'white',
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={600}>
                            Sugerencias rápidas:
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                            ...(isMobile && {
                                overflowX: 'auto',
                                flexWrap: 'nowrap',
                                pb: 1,
                                '&::-webkit-scrollbar': { height: 6 },
                                '&::-webkit-scrollbar-track': { bgcolor: 'grey.100' },
                                '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 2 }
                            })
                        }}>
                            {suggestions.map((suggestion, index) => (
                                <Chip
                                    key={index}
                                    label={suggestion.text}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    color={suggestion.color}
                                    variant="outlined"
                                    disabled={serverStatus === 'offline'}
                                    sx={{
                                        borderRadius: 5,
                                        height: 32,
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        minWidth: isMobile ? 'auto' : 'fit-content',
                                        whiteSpace: 'nowrap',
                                        bgcolor: 'white',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: 2
                                        },
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Input Area */}
            <Paper
                elevation={4}
                sx={{
                    position: 'sticky',
                    bottom: 0,
                    p: 2,
                    bgcolor: 'white',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 0,
                    zIndex: 100
                }}
            >
                <Box sx={{
                    maxWidth: 900,
                    mx: 'auto',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 1
                }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        placeholder={
                            !userData?.curso || !userData?.carrera
                                ? "Completa tu perfil para comenzar..."
                                : serverStatus === 'offline'
                                    ? "Servidor desconectado..."
                                    : "Escribe tu pregunta..."
                        }
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={!userData?.curso || !userData?.carrera || serverStatus === 'offline' || isTyping}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 6,
                                bgcolor: (!userData?.curso || !userData?.carrera || serverStatus === 'offline') ? 'grey.100' : '#f5f5f5',
                                border: 'none',
                                '&:hover': {
                                    bgcolor: (!userData?.curso || !userData?.carrera || serverStatus === 'offline') ? 'grey.100' : '#eeeeee'
                                },
                                '&.Mui-focused': {
                                    bgcolor: 'white',
                                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                                }
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none'
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Stack direction="row" spacing={0.5}>
                                        <Tooltip title="Adjuntar archivo">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    disabled={!userData?.curso || !userData?.carrera || serverStatus === 'offline'}
                                                >
                                                    <AttachFileIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Emoji">
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    disabled={!userData?.curso || !userData?.carrera || serverStatus === 'offline'}
                                                >
                                                    <EmojiIcon fontSize="small" />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </Stack>
                                </InputAdornment>
                            )
                        }}
                    />

                    <Tooltip title={
                        !userData?.curso || !userData?.carrera
                            ? "Completa tu perfil primero"
                            : serverStatus === 'offline'
                                ? "Servidor desconectado"
                                : "Enviar mensaje"
                    }>
                        <span>
                            <IconButton
                                onClick={() => handleSendMessage()}
                                disabled={!userData?.curso || !userData?.carrera || !inputMessage.trim() || serverStatus === 'offline' || isTyping}
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    width: 48,
                                    height: 48,
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                        transform: 'scale(1.05)'
                                    },
                                    '&:disabled': {
                                        bgcolor: 'grey.300',
                                        color: 'grey.500',
                                        transform: 'none'
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <SendIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>

                <Box sx={{
                    maxWidth: 900,
                    mx: 'auto',
                    mt: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="caption" color="text.secondary">
                        Presiona Enter para enviar, Shift+Enter para nueva línea
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: getConnectionStatusColor()
                        }} />
                        <Typography variant="caption" color="text.secondary">
                            {serverStatus === 'online' ? 'Conectado' :
                                serverStatus === 'offline' ? 'Desconectado' : 'Verificando...'}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Error Snackbar */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setError(null)}
                    severity="error"
                    sx={{ width: '100%' }}
                    action={
                        <IconButton
                            size="small"
                            onClick={handleRetry}
                            color="inherit"
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Chat;