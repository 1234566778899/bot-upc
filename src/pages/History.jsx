import React, { useState, useContext, useMemo, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    ListItemButton,
    IconButton,
    Avatar,
    Chip,
    CircularProgress,
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Divider,
    Stack,
    Alert,
    Fade,
    Pagination
} from '@mui/material';
import {
    Search as SearchIcon,
    Chat as ChatIcon,
    MoreVert as MoreVertIcon,
    Delete as DeleteIcon,
    Sort as SortIcon,
    Forum as ForumIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
    getFirestore,
    collection,
    query,
    where,
    orderBy,
    deleteDoc,
    doc,
    onSnapshot
} from 'firebase/firestore';
import { AuthContext } from '../contexts/AuthContextApp';

const ITEMS_PER_PAGE = 8;

const AVATAR_COLORS = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#0288d1', '#c62828'];

const getAvatarColor = (id) => {
    const sum = (id || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

const getPreviewText = (chat) => {
    const firstUserMsg = chat.messages?.find(m => m.sender === 'user');
    return firstUserMsg?.text || '—';
};

const getDateGroup = (timestamp) => {
    if (!timestamp) return 'Sin fecha';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return 'Esta semana';
    if (diffDays < 30) return 'Este mes';
    return 'Antes';
};

const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);
    const diffDays = diffHours / 24;
    if (diffHours < 1) return 'Ahora';
    if (diffHours < 24) return `${Math.floor(diffHours)}h`;
    if (diffDays < 7) return `${Math.floor(diffDays)}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

export const History = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);
    const [sortBy, setSortBy] = useState('recent');
    const [error, setError] = useState(null);
    const [chats, setChats] = useState([]);
    const [status, setStatus] = useState('loading');
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!user) { setStatus('idle'); setChats([]); return; }
        setStatus('loading');
        try {
            const firestore = getFirestore();
            const chatsQuery = query(
                collection(firestore, 'chats'),
                where('userId', '==', user.uid),
                orderBy('updatedAt', 'desc')
            );
            const unsubscribe = onSnapshot(
                chatsQuery,
                (snapshot) => {
                    const loaded = [];
                    snapshot.forEach(d => loaded.push({ id: d.id, ...d.data() }));
                    setChats(loaded);
                    setStatus('success');
                },
                (err) => {
                    console.error('Error loading chats:', err);
                    setError('Error al cargar el historial');
                    setStatus('error');
                }
            );
            return () => unsubscribe();
        } catch {
            setStatus('error');
            setError('Error al configurar el historial');
        }
    }, [user]);

    useEffect(() => { setPage(1); }, [searchTerm, sortBy]);

    const filteredChats = useMemo(() => {
        let filtered = [...chats];
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        switch (sortBy) {
            case 'recent':
                filtered.sort((a, b) =>
                    (b.updatedAt?.toDate?.() || new Date(0)) - (a.updatedAt?.toDate?.() || new Date(0))
                );
                break;
            case 'oldest':
                filtered.sort((a, b) =>
                    (a.createdAt?.toDate?.() || new Date(0)) - (b.createdAt?.toDate?.() || new Date(0))
                );
                break;
            case 'alphabetical':
                filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;
            default:
                break;
        }
        return filtered;
    }, [chats, searchTerm, sortBy]);

    const totalPages = Math.ceil(filteredChats.length / ITEMS_PER_PAGE);

    const paginatedChats = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredChats.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredChats, page]);

    // Build list items with date section headers (only when sorted by date)
    const listItems = useMemo(() => {
        const useGroups = sortBy !== 'alphabetical';
        const items = [];
        let lastGroup = null;
        paginatedChats.forEach(chat => {
            if (useGroups) {
                const group = getDateGroup(chat.updatedAt);
                if (group !== lastGroup) {
                    items.push({ type: 'header', label: group, key: `h-${group}` });
                    lastGroup = group;
                }
            }
            items.push({ type: 'chat', chat, key: chat.id });
        });
        return items;
    }, [paginatedChats, sortBy]);

    const handleChatClick = (chatId) => navigate(`/admin/chat/${chatId}`);

    const handleMenuOpen = (e, chat) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
        setSelectedChat(chat);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedChat(null);
    };

    const handleDeleteClick = (chat) => {
        setChatToDelete(chat);
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = async () => {
        if (!chatToDelete) return;
        try {
            await deleteDoc(doc(getFirestore(), 'chats', chatToDelete.id));
            setDeleteDialogOpen(false);
            setChatToDelete(null);
        } catch {
            setError('Error al eliminar el chat');
        }
    };

    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f5f7fa' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ height: { xs: 'calc(100vh - 64px)', md: '100vh' }, display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa' }}>

            {/* Header */}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', px: { xs: 2, md: 4 }, pt: 3, pb: 2 }}>
                <Box sx={{ maxWidth: 860, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
                        <Box>
                            <Typography variant="h5" fontWeight={700} color="text.primary" lineHeight={1.2}>
                                Historial
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {chats.length} conversación{chats.length !== 1 ? 'es' : ''}
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/admin/chat')}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2 }}
                        >
                            Nuevo chat
                        </Button>
                    </Box>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <TextField
                            fullWidth
                            placeholder="Buscar conversación..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 2, bgcolor: '#f5f5f5', '& fieldset': { border: 'none' } }
                            }}
                        />
                        <TextField
                            select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            size="small"
                            sx={{
                                minWidth: { xs: '100%', sm: 170 },
                                '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f5f5f5' },
                                '& fieldset': { border: 'none' }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SortIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                                    </InputAdornment>
                                )
                            }}
                        >
                            <MenuItem value="recent">Más recientes</MenuItem>
                            <MenuItem value="oldest">Más antiguos</MenuItem>
                            <MenuItem value="alphabetical">Alfabético</MenuItem>
                        </TextField>
                    </Stack>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" onClose={() => setError(null)} sx={{ mx: 'auto', mt: 2, maxWidth: 860, width: 'calc(100% - 32px)' }}>
                    {error}
                </Alert>
            )}

            {/* List */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 4 }, py: 2.5 }}>
                <Box sx={{ maxWidth: 860, mx: 'auto' }}>
                    {filteredChats.length === 0 ? (
                        <Paper
                            elevation={0}
                            sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: '1.5px dashed', borderColor: 'divider', bgcolor: 'white' }}
                        >
                            <ForumIcon sx={{ fontSize: 52, color: 'grey.300', mb: 2 }} />
                            <Typography variant="h6" fontWeight={600} color="text.secondary" gutterBottom>
                                {searchTerm ? 'Sin resultados' : 'Sin conversaciones aún'}
                            </Typography>
                            <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                                {searchTerm
                                    ? `No se encontró "${searchTerm}"`
                                    : 'Inicia tu primera conversación con el asistente'}
                            </Typography>
                            {!searchTerm && (
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/admin/chat')}
                                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                >
                                    Comenzar ahora
                                </Button>
                            )}
                        </Paper>
                    ) : (
                        <>
                            {listItems.map((item) =>
                                item.type === 'header' ? (
                                    <Typography
                                        key={item.key}
                                        variant="caption"
                                        fontWeight={700}
                                        color="text.disabled"
                                        sx={{
                                            display: 'block',
                                            mt: 2,
                                            mb: 0.75,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            '&:first-of-type': { mt: 0 }
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                ) : (
                                    <Fade in key={item.key} timeout={200}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                mb: 1,
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                bgcolor: 'white',
                                                overflow: 'hidden',
                                                transition: 'border-color 0.15s, box-shadow 0.15s',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    boxShadow: '0 2px 10px rgba(25,118,210,0.1)'
                                                }
                                            }}
                                        >
                                            <ListItemButton
                                                onClick={() => handleChatClick(item.chat.id)}
                                                sx={{ p: 1.75, gap: 1.5, alignItems: 'flex-start' }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        bgcolor: getAvatarColor(item.chat.id),
                                                        width: 42,
                                                        height: 42,
                                                        flexShrink: 0,
                                                        fontSize: '1rem',
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    {(item.chat.title || 'C')[0].toUpperCase()}
                                                </Avatar>

                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight={600}
                                                            noWrap
                                                            sx={{ flex: 1, pr: 1, fontSize: '0.9rem' }}
                                                        >
                                                            {item.chat.title || 'Sin título'}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0, fontSize: '0.72rem' }}>
                                                            {formatDate(item.chat.updatedAt)}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => handleMenuOpen(e, item.chat)}
                                                            sx={{ ml: 0.5, color: 'text.disabled', p: 0.5 }}
                                                        >
                                                            <MoreVertIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        noWrap
                                                        sx={{ mb: 1, fontSize: '0.82rem' }}
                                                    >
                                                        {getPreviewText(item.chat)}
                                                    </Typography>

                                                    <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                                                        {item.chat.curso && (
                                                            <Chip
                                                                label={item.chat.curso}
                                                                size="small"
                                                                sx={{ height: 20, fontSize: '0.68rem', bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600, border: 'none' }}
                                                            />
                                                        )}
                                                        {item.chat.carrera && (
                                                            <Chip
                                                                label={item.chat.carrera}
                                                                size="small"
                                                                sx={{ height: 20, fontSize: '0.68rem', bgcolor: '#f3e5f5', color: '#6a1b9a', fontWeight: 600, border: 'none' }}
                                                            />
                                                        )}
                                                        <Chip
                                                            label={`${item.chat.messages?.length || 0} mensajes`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ height: 20, fontSize: '0.68rem', color: 'text.disabled' }}
                                                        />
                                                    </Stack>
                                                </Box>
                                            </ListItemButton>
                                        </Paper>
                                    </Fade>
                                )
                            )}

                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3, pb: 1 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={(_, v) => { setPage(v); window.scrollTo(0, 0); }}
                                        color="primary"
                                        shape="rounded"
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ sx: { borderRadius: 2, minWidth: 160, boxShadow: 3 } }}
            >
                <MenuItem onClick={() => { if (selectedChat) handleChatClick(selectedChat.id); handleMenuClose(); }}>
                    <ChatIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                    Abrir chat
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleDeleteClick(selectedChat)} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
                    Eliminar
                </MenuItem>
            </Menu>

            {/* Delete Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle fontWeight={700}>¿Eliminar conversación?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Esta acción no se puede deshacer. Se eliminará permanentemente "{chatToDelete?.title}".
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
