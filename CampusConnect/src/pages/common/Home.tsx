// src/pages/common/Home.tsx
import { Link } from "react-router-dom";
import { Container, Card, CardContent, Typography, Button, Box, Paper, Stack } from "@mui/material";
import {
    PersonAdd,
    School,
    Grade,
    Class as ClassIcon,
    SupervisorAccount,
    Dashboard
} from "@mui/icons-material";

const Home = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            {/* Hero Section */}
            <Paper
                sx={{
                    position: 'relative',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    mb: 6,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 2,
                    p: 6,
                    boxShadow: 3,
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                        CampusConnect
                    </Typography>
                    <Typography variant="h5" paragraph>
                        La plateforme complète de gestion académique pour étudiants et professeurs
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                        <Button
                            component={Link}
                            to="/register"
                            variant="contained"
                            color="secondary"
                            size="large"
                            startIcon={<PersonAdd />}
                        >
                            S'inscrire
                        </Button>
                        <Button
                            component={Link}
                            to="/login"
                            variant="outlined"
                            sx={{ color: 'white', borderColor: 'white' }}
                            size="large"
                        >
                            Se connecter
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            {/* Features Section */}
            <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mb: 4 }}>
                Fonctionnalités principales
            </Typography>

            {/* Remplacer Grid par une approche plus flexible avec Box */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4
                }}
            >
                {/* User Management */}
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 16px)', lg: 'calc(33.33% - 16px)' } }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PersonAdd color="primary" sx={{ fontSize: 40, mr: 2 }} />
                                <Typography variant="h5" component="h3">
                                    Gestion des utilisateurs
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary">
                                Créez facilement votre compte et gérez votre profil. Mettez à jour vos informations
                                personnelles et paramètres en toute sécurité.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Authentication */}
                <Box sx={{ width: { xs: '100%', md: 'calc(50% - 16px)', lg: 'calc(33.33% - 16px)' } }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SupervisorAccount color="primary" sx={{ fontSize: 40, mr: 2 }} />
                                <Typography variant="h5" component="h3">
                                    Authentification sécurisée
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary">
                                Accédez à vos données avec une authentification sécurisée par JWT. Protection complète
                                de votre vie privée et de vos informations académiques.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Ajoutez ici les autres cartes de fonctionnalités de la même manière */}
                {/* ... */}
            </Box>
        </Container>
    );
};

export default Home;