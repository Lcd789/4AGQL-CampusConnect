// src/pages/auth/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { z } from "zod";
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

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
    }
  }
`;

// Définition du schéma Zod pour la validation
const registerSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  confirmPassword: z.string().min(1, { message: "Veuillez confirmer votre mot de passe" }),
  name: z.string().min(1, { message: "Le nom est requis" }),
  role: z.enum(["student", "professor"], { message: "Veuillez sélectionner un rôle valide" })
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
    name: "",
    role: "student" // Valeur par défaut
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [generalError, setGeneralError] = useState("");
  
  const navigate = useNavigate();

  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: () => {
      // Rediriger vers la page de connexion avec un message de succès
      navigate("/login", { 
        state: { message: "Inscription réussie ! Vous pouvez maintenant vous connecter." }
      });
    },
    onError: (error) => {
      setGeneralError(error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Nettoyage de l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setFormData(prev => ({ ...prev, role: e.target.value as "student" | "professor" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    
    try {
      // Validation avec Zod
      registerSchema.parse(formData);
      
      // Si la validation réussit, on envoie la requête
      await registerMutation({
        variables: { 
          input: {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: formData.role
          }
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Formatage des erreurs de validation Zod
        const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
        err.errors.forEach(error => {
          const field = error.path[0] as keyof RegisterFormData;
          fieldErrors[field] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        // Autre type d'erreur
        setGeneralError("Une erreur s'est produite");
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
            <Alert severity="error" sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nom complet"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
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
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "S'inscrire"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;