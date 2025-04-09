// src/pages/professor/ClassManagementDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    Divider,
    useTheme,
    useMediaQuery,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Delete as DeleteIcon,
    PersonRemove as PersonRemoveIcon,
    PersonAdd as PersonAddIcon,
    Edit as EditIcon,
    ArrowBack as ArrowBackIcon,
    School as SchoolIcon
} from '@mui/icons-material';

// Définition des requêtes GraphQL
const GET_CLASS_DETAILS = gql`
    query GetClassDetails($id: ID!) {
        class(id: $id) {
            id
            name
            description
            professorId
        }
        classEnrollments(classId: $id) {
            id
            classId
            studentId
            student {
                id
                username
                email
            }
        }
    }
`;

const GET_AVAILABLE_STUDENTS = gql`
    query GetAvailableStudents {
        students {
            id
            username
            email
        }
    }
`;

const DELETE_CLASS = gql`
    mutation DeleteClass($id: ID!) {
        deleteClass(id: $id)
    }
`;

const ENROLL_STUDENT = gql`
    mutation EnrollStudent($classId: ID!, $studentId: ID!) {
        enrollStudent(classId: $classId, studentId: $studentId) {
            id
            classId
            studentId
        }
    }
`;

const REMOVE_ENROLLMENT = gql`
    mutation RemoveEnrollment($id: ID!) {
        removeEnrollment(id: $id)
    }
`;

const UPDATE_CLASS = gql`
    mutation UpdateClass($id: ID!, $name: String, $description: String) {
        updateClass(id: $id, name: $name, description: $description) {
            id
            name
            description
        }
    }
`;

const ClassManagementDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // States
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [classData, setClassData] = useState({ name: '', description: '' });
    const [selectedStudent, setSelectedStudent] = useState('');
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // GraphQL Queries & Mutations
    const { loading, error, data, refetch } = useQuery(GET_CLASS_DETAILS, {
        variables: { id },
        onCompleted: (data) => {
            setClassData({
                name: data.class.name,
                description: data.class.description || ''
            });
        }
    });

    const { data: studentsData } = useQuery(GET_AVAILABLE_STUDENTS);

    const [deleteClass, { loading: deleteLoading }] = useMutation(DELETE_CLASS, {
        onCompleted: () => {
            showSnackbar("Classe supprimée avec succès", "success");
            navigate('/professor/classes');
        },
        onError: (error) => {
            showSnackbar(`Erreur: ${error.message}`, "error");
        }
    });

    const [enrollStudent, { loading: enrollLoading }] = useMutation(ENROLL_STUDENT, {
        onCompleted: () => {
            setOpenAddStudentDialog(false);
            refetch();
            showSnackbar("Étudiant ajouté avec succès", "success");
        },
        onError: (error) => {
            showSnackbar(`Erreur: ${error.message}`, "error");
        }
    });

    const [removeEnrollment, { loading: removeLoading }] = useMutation(REMOVE_ENROLLMENT, {
        onCompleted: () => {
            refetch();
            showSnackbar("Étudiant retiré avec succès", "success");
        },
        onError: (error) => {
            showSnackbar(`Erreur: ${error.message}`, "error");
        }
    });

    const [updateClass, { loading: updateLoading }] = useMutation(UPDATE_CLASS, {
        onCompleted: () => {
            setOpenEditDialog(false);
            refetch();
            showSnackbar("Classe mise à jour avec succès", "success");
        },
        onError: (error) => {
            showSnackbar(`Erreur: ${error.message}`, "error");
        }
    });

    // Helpers
    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClassData({ ...classData, [name]: value });
    };

    const handleUpdateClass = () => {
        updateClass({
            variables: {
                id,
                name: classData.name,
                description: classData.description
            }
        });
    };

    const handleDeleteClass = () => {
        deleteClass({ variables: { id } });
    };

    const handleAddStudent = () => {
        if (selectedStudent) {
            enrollStudent({
                variables: {
                    classId: id,
                    studentId: selectedStudent
                }
            });
        }
    };

    const handleRemoveStudent = (enrollmentId: string) => {
        removeEnrollment({ variables: { id: enrollmentId } });
    };

    // Filtrer les étudiants qui ne sont pas déjà dans la classe
    const getAvailableStudents = () => {
        if (!studentsData || !data) return [];

        const enrolledStudentIds = data.classEnrollments.map(
            (enrollment: any) => enrollment.studentId
        );

        return studentsData.students.filter(
            (student: any) => !enrolledStudentIds.includes(student.id)
        );
    };

    if (loading) return <Box display="flex" justifyContent="center" m={4}><CircularProgress /></Box>;
    if (error) return <Typography color="error">Erreur: {error.message}</Typography>;

    const students = data.classEnrollments || [];
    const studentCount = students.length;
    const canDelete = studentCount === 0;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={4} display="flex" alignItems="center">
                <IconButton
                    onClick={() => navigate('/professor/classes')}
                    sx={{ mr: 2 }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1">Gestion de Classe</Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Informations de la classe */}
                <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                {data.class.name}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1" color="text.secondary" paragraph>
                                {data.class.description || "Aucune description"}
                            </Typography>
                            <Chip
                                icon={<SchoolIcon />}
                                label={`${studentCount} étudiant${studentCount !== 1 ? 's' : ''}`}
                                color="primary"
                                variant="outlined"
                            />
                        </CardContent>
                        <CardActions>
                            <Button
                                startIcon={<EditIcon />}
                                onClick={() => setOpenEditDialog(true)}
                            >
                                Modifier
                            </Button>
                            <Button
                                startIcon={<DeleteIcon />}
                                color="error"
                                onClick={() => setOpenDeleteDialog(true)}
                                disabled={!canDelete}
                            >
                                Supprimer
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                {/* Liste des étudiants */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Liste des étudiants</Typography>
                            <Button
                                startIcon={<PersonAddIcon />}
                                variant="contained"
                                color="primary"
                                onClick={() => setOpenAddStudentDialog(true)}
                            >
                                Ajouter un étudiant
                            </Button>
                        </Box>

                        {studentCount === 0 ? (
                            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                Aucun étudiant inscrit dans cette classe
                            </Typography>
                        ) : (
                            <List>
                                {students.map((enrollment: any) => (
                                    <ListItem
                                        key={enrollment.id}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="remove"
                                                color="error"
                                                onClick={() => handleRemoveStudent(enrollment.id)}
                                                disabled={removeLoading}
                                            >
                                                <PersonRemoveIcon />
                                            </IconButton>
                                        }
                                        divider
                                    >
                                        <ListItemAvatar>
                                            <Avatar>{enrollment.student.username.charAt(0).toUpperCase()}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={enrollment.student.username}
                                            secondary={enrollment.student.email}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Dialogue de modification de classe */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth>
                <DialogTitle>Modifier la classe</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nom de la classe"
                        name="name"
                        value={classData.name}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={classData.description}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Annuler</Button>
                    <Button
                        onClick={handleUpdateClass}
                        variant="contained"
                        color="primary"
                        disabled={updateLoading || !classData.name}
                    >
                        {updateLoading ? <CircularProgress size={24} /> : "Enregistrer"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialogue d'ajout d'étudiant */}
            <Dialog open={openAddStudentDialog} onClose={() => setOpenAddStudentDialog(false)} fullWidth>
                <DialogTitle>Ajouter un étudiant</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Sélectionner un étudiant"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        fullWidth
                        variant="outlined"
                        margin="dense"
                    >
                        {getAvailableStudents().map((student: any) => (
                            <MenuItem key={student.id} value={student.id}>
                                {student.username} ({student.email})
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddStudentDialog(false)}>Annuler</Button>
                    <Button
                        onClick={handleAddStudent}
                        variant="contained"
                        color="primary"
                        disabled={enrollLoading || !selectedStudent}
                    >
                        {enrollLoading ? <CircularProgress size={24} /> : "Ajouter"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialogue de confirmation de suppression */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Supprimer la classe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {canDelete
                            ? "Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible."
                            : "Impossible de supprimer cette classe car des étudiants y sont encore inscrits. Veuillez d'abord retirer tous les étudiants."}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Annuler</Button>
                    <Button
                        onClick={handleDeleteClass}
                        color="error"
                        variant="contained"
                        disabled={!canDelete || deleteLoading}
                    >
                        {deleteLoading ? <CircularProgress size={24} /> : "Supprimer"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar pour les notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ClassManagementDetail;