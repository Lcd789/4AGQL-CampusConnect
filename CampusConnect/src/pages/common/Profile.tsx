import {useState, useEffect} from "react";
import {
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    Grid,
    TextField,
    Typography,
    Paper,
    Alert,
    Snackbar,
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import {getAvatarProps, stringToColor} from "../../utils/avatarUtils.ts";
import {Delete} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {z} from "zod";
import {useAuth} from "../../context/AuthContext";
import {useMe} from "../../api/auth/authQueries.ts";
import {useDeleteUser, useUpdateUser} from "../../api/users/userMutations.ts";

// Schéma de validation pour la mise à jour du profil
const updateProfileSchema = z.object({
    username: z.string()
        .min(1, {message: "Le nom d'utilisateur est requis"})
        .max(24, {message: "Le nom d'utilisateur est trop long"}),
    password: z.string().optional(),
    confirmPassword: z.string().optional()
}).refine(data => !data.password || data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
});

const Profile = () => {
    const {user, isAuthenticated, logout} = useAuth();
    const navigate = useNavigate();
    const {data, loading, error, refetch} = useMe();
    const [updateUser, {loading: updating, error: updateError}] = useUpdateUser();
    const [deleteUser, {loading: deleting}] = useDeleteUser();

    // États du formulaire - conserve les noms d'origine
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    // États pour les notifications et erreurs
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    useEffect(() => {
        if (data?.me) {
            setUsername(data.me.username);
            setEmail(data.me.email);
        } else if (user) {
            setUsername(user.username || "");
            setEmail(user.email || "");
        }
    }, [data, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});

        try {
            // Valider les données du formulaire
            updateProfileSchema.parse({
                username,
                password,
                confirmPassword
            });

            if (!data?.me?.id) {
                setFormErrors({form: "Impossible de récupérer l'ID utilisateur"});
                return;
            }

            const variables: {
                username?: string;
                password?: string;
            } = {};

            // N'inclure que les champs qui ont été modifiés
            if (username !== data.me.username) variables.username = username;
            if (password) variables.password = password;

            // Ne rien envoyer si aucun changement
            if (Object.keys(variables).length === 0) {
                setSuccessMessage("Aucune modification à effectuer");
                setOpenSnackbar(true);
                return;
            }

            const result = await updateUser({
                variables: variables
            })
            
            if(result.data?.updateUser){
                setUsername(result.data.updateUser.username);
                
                const updatedFields = [];
                if (variables.username) updatedFields.push("nom d'utilisateur");
                if (variables.password) updatedFields.push("mot de passe");

                setSuccessMessage(
                    `Profil mis à jour avec succès (${updatedFields.join(", ")})`
                );

                setPassword("");
                setConfirmPassword("");
                
                await refetch();
            } else {
                setFormErrors({form: "Erreur lors de la mise à jour du profil"});
            }
            setOpenSnackbar(true);
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Formatage des erreurs de validation Zod
                const fieldErrors: { [key: string]: string } = {};
                error.errors.forEach(error => {
                    if(error.path){
                        fieldErrors[error.path[0]] = error.message;
                    }
                });
                setFormErrors(fieldErrors);
            } else {
                setFormErrors(
                    {
                        form:
                            "Erreur lors de la mise à jour du profil: "
                            + (error instanceof Error
                                    ? error.message
                                    : String(error)
                            )
                    }
                );
            }
        }
    };

    const getInitial = (): string => {
        return username ? username.charAt(0).toUpperCase() : "?";
    };

    const handleCloseDeleteDialog = (): void => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteAccount = async (): Promise<void> => {
        if (!data?.me?.id) {
            setFormErrors({form: "Impossible de récupérer l'ID utilisateur"});
            setOpenSnackbar(true);
            return;
        }

        try {
            await deleteUser({
                variables: {
                    userId: data.me.id
                }
            });

            // Déconnexion après suppression
            logout();
            navigate("/");
        } catch (error : unknown) {

            if( error instanceof Error) {
                setFormErrors({
                    delete: "Erreur lors de la suppression du compte : " + error.message
                });
            }else{
                setFormErrors({form: "Erreur lors de la suppression du compte : " + String(error)});
            }
            setOpenSnackbar(true);
        } finally {
            setOpenDeleteDialog(false);
        }
    };

    const handleCloseSnackbar = (): void => {
        setOpenSnackbar(false);
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{mt: 10, textAlign: "center"}}>
                <CircularProgress/>
                <Typography variant="h6" mt={2}>
                    Chargement du profil...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{mt: 10}}>
                <Alert severity="error">
                    Erreur lors du chargement du profil: {error.message}
                </Alert>
            </Container>
        );
    }

    if (!isAuthenticated) {
        return (
            <Container maxWidth="sm" sx={{mt: 10}}>
                <Alert severity="warning">
                    Vous devez être connecté pour accéder à cette page.
                </Alert>
            </Container>
        );
    }

    const userInfo = data?.me || user;

    return (
        <Container maxWidth="md" sx={{py: 4}}>
            <Paper elevation={3} sx={{p: 4, borderRadius: 2}}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Mon Profil
                </Typography>

                {/* En-tête du profil avec avatar */}
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", mb: 4}}>
                    <Avatar
                        {...getAvatarProps(username)}
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: username ? stringToColor(username) : '#888888',
                            fontSize: '2rem',
                            mr: 3
                        }}
                    >
                        {getInitial()}
                    </Avatar>
                    <Box>
                        <Typography variant="h5">{userInfo?.username}</Typography>
                        <Typography variant="body1" color="text.secondary">{userInfo?.email}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Rôle: {userInfo?.role === "professor" ? "Professeur" : "Étudiant"}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{mb: 4}}/>

                <Grid container spacing={3}>
                    {/* Formulaire de modification */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Modifier mes informations
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 2}}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="username"
                                        label="Nom d'utilisateur"
                                        name="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        error={!!formErrors.username}
                                        helperText={formErrors.username}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        error={!!formErrors.email}
                                        helperText={formErrors.email}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="password"
                                        label="Nouveau mot de passe"
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        error={!!formErrors.password}
                                        helperText={formErrors.password}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirmer le mot de passe"
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        error={!!formErrors.confirmPassword}
                                        helperText={formErrors.confirmPassword}
                                    />
                                </Grid>
                            </Grid>

                            {formErrors.form && (
                                <Alert severity="error" sx={{mt: 2}}>
                                    {formErrors.form}
                                </Alert>
                            )}

                            {updateError && (
                                <Alert severity="error" sx={{mt: 2}}>
                                    {updateError.message}
                                </Alert>
                            )}

                            <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 4}}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={updating}
                                    sx={{minWidth: 200}}
                                >
                                    {updating ? "Mise à jour..." : "Enregistrer"}
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Delete/>}
                                    onClick={() => setOpenDeleteDialog(true)}
                                    sx={{minWidth: 200}}
                                >
                                    Supprimer mon compte
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Dialog de confirmation pour la suppression */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Êtes-vous sûr de vouloir supprimer votre compte ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Cette action est irréversible. Toutes vos données personnelles et votre historique
                        seront définitivement supprimés de notre système. Vous ne pourrez plus accéder à
                        vos informations ni restaurer votre compte.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Annuler
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={20}/> : <Delete/>}
                    >
                        {deleting ? "Suppression..." : "Supprimer définitivement"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar pour les messages de succès */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={formErrors.form ? "error" : "success"}
                    sx={{width: "100%"}}
                >
                    {formErrors.form || successMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Profile;