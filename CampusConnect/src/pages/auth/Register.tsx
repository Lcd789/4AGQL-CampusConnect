// src/pages/auth/Register.tsx
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useRegister} from "../../api/auth/authMutations.ts";
import { ApolloError } from "@apollo/client";
import {z} from "zod";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from "@mui/material";
import {useAuth} from "../../context/AuthContext.tsx";

// Définition du schéma Zod pour la validation
const registerSchema = z.object({
    email: z.string().email({message: "Email invalide"}),
    password: z.string().min(6, {message: "Le mot de passe doit contenir au moins 6 caractères"}),
    confirmPassword: z.string().min(1, {message: "Veuillez confirmer votre mot de passe"}),
    username: z.string().min(1, {message: "Le nom d'utilisateur est requis"}), // Renommé de "name" à "username"
    role: z.enum(["student", "professor"], {message: "Veuillez sélectionner un rôle valide"})
}).refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
        role: "student"
    });

    const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
    const [generalError, setGeneralError] = useState("");
    const [registerMutation, {loading}] = useRegister();
    const navigate = useNavigate();
    const {login: authLogin} = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));

        // Nettoyage de l'erreur lorsque l'utilisateur modifie le champ
        if (errors[name as keyof RegisterFormData]) {
            setErrors(prev => ({...prev, [name]: undefined}));
        }
    };

    const handleRoleChange = (e: SelectChangeEvent) => {
        setFormData(prev => ({...prev, role: e.target.value as "student" | "professor"}));

        // Nettoyage de l'erreur du champ role
        if (errors.role) {
            setErrors(prev => ({...prev, role: undefined}));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");

        try {
            // Validation avec Zod
            registerSchema.parse(formData);

            // Exécution de la mutation register avec les variables du formulaire
            const {data} = await registerMutation({
                variables: {
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    role: formData.role
                }
            });

            if (data?.register) {
                authLogin(data.register.token);

                const userRole = data.register.user.role;
                const redirectPath = userRole === "student"
                    ? "/student-dashboard"
                    : "/professor-dashboard";

                navigate(redirectPath);
            }


        } catch (err) {
            if (err instanceof z.ZodError) {
                // Formatage des erreurs de validation Zod
                const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
                err.errors.forEach(error => {
                    const field = error.path[0] as keyof RegisterFormData;
                    fieldErrors[field] = error.message;
                });
                setErrors(fieldErrors);
            } else if (
                err instanceof ApolloError
                && err.graphQLErrors
                && err.graphQLErrors.length > 0
            ) {

                // Extraction du message d'erreur GraphQL
                const graphQLErrorMessage = err.graphQLErrors[0].message;

                // Si l'erreur concerne l'email existant, on l'affiche spécifiquement dans le champ email
                if (graphQLErrorMessage.includes("User already exists with this email")) {
                    setErrors(prev => ({
                        ...prev,
                        email: "Cet email est déjà utilisé par un autre compte"
                    }));
                } else {
                    // Autres erreurs GraphQL
                    setGeneralError(graphQLErrorMessage);
                }
            } else {
                // Autre type d'erreur
                setGeneralError("Une erreur s'est produite lors de l'inscription");
                console.error(err);
            }
        }
    };


    return (
            <Container component="main" maxWidth="sm">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: 8
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 4,
                            width: '100%',
                            borderRadius: 2
                        }}
                    >
                        <Typography component="h1" variant="h5" align="center" gutterBottom>
                            Inscription
                        </Typography>

                        {generalError && (
                            <Alert severity="error" sx={{mb: 2}}>
                                {generalError}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Nom complet"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={formData.username}
                                onChange={handleChange}
                                error={!!errors.username}
                                helperText={errors.username}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                            <FormControl fullWidth margin="normal" error={!!errors.role}>
                                <InputLabel id="role-label">Rôle</InputLabel>
                                <Select
                                    labelId="role-label"
                                    id="role"
                                    value={formData.role}
                                    label="Rôle"
                                    onChange={handleRoleChange}
                                >
                                    <MenuItem value="student">Étudiant</MenuItem>
                                    <MenuItem value="professor">Professeur</MenuItem>
                                </Select>
                                {errors.role && (
                                    <Typography variant="caption" color="error">
                                        {errors.role}
                                    </Typography>
                                )}
                            </FormControl>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mot de passe"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirmer le mot de passe"
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24}/> : "S'inscrire"}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        );
    };

    export default Register;