// src/pages/auth/Login.tsx
import {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useLogin} from "../../api/auth/authMutations.ts";
import {useAuth} from "../../context/AuthContext";
import {z} from "zod";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress
} from "@mui/material";

const loginSchema = z.object({
    email: z.string().email({message: "Email invalide"}),
    password: z.string().min(6, {message: "Le mot de passe doit contenir au moins 6 caractères"}),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
    const [formData, setFormData] = useState<LoginFormData>({email: "", password: ""});
    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
    const [generalError, setGeneralError] = useState("");

    // Utiliser le hook useLogin qui effectue la mutation Apollo
    const [loginMutation, {loading}] = useLogin();

    // Contexte d'authentification pour stocker l'utilisateur connecté
    const {login: authLogin} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message || "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));

        if (errors[name as keyof LoginFormData]) {
            setErrors((prev) => ({...prev, [name]: undefined}));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError("");

        try {
            // Validation des données du formulaire avec Zod
            loginSchema.parse(formData);

            // Exécution de la mutation login avec les variables du formulaire
            const {data} = await loginMutation({
                variables: {
                    email: formData.email,
                    password: formData.password
                }
            });

            // Si la connexion est réussie, on stocke les données d'authentification
            if (data?.login) {
                authLogin(data.login.token);

                // Redirection en fonction du rôle de l'utilisateur
                const userRole = data.login.user.role;
                const redirectPath = userRole === 'student'
                    ? '/student-dashboard'
                    : '/professor-dashboard';

                navigate(redirectPath);
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                // Gestion des erreurs de validation Zod
                const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
                err.errors.forEach((error) => {
                    const field = error.path[0] as keyof LoginFormData;
                    fieldErrors[field] = error.message;
                });
                setErrors(fieldErrors);
            } else {
                // Gestion des erreurs GraphQL ou autres
                setGeneralError("Échec de la connexion. Vérifiez vos identifiants.");
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
                    <Typography component="h1" variant="h5" align="center" sx={{mb: 3}}>
                        Connexion
                    </Typography>

                    {successMessage && (
                        <Alert severity="success" sx={{mb: 3}}>
                            {successMessage}
                        </Alert>
                    )}

                    {generalError && (
                        <Alert severity="error" sx={{mb: 3}}>
                            {generalError}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Adresse e-mail"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            sx={{mb: 2}}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            sx={{mb: 2}}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{mt: 3, mb: 2}}
                        >
                            {loading ? <CircularProgress size={24}/> : "Se connecter"}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;