// src/components/structure/Footer.tsx
import { Box, Container, Grid, Typography, Link, Divider, IconButton } from "@mui/material";
import { Facebook, Twitter, LinkedIn, Instagram, GitHub } from "@mui/icons-material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "primary.main", // Utilise la couleur primaire de votre thème
                color: "white",
                py: 6, // Padding vertical plus important
                mt: "auto", // Pousse le footer en bas si le contenu ne remplit pas la page
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">
                    {/* Colonne Logo et Description */}
                    <Grid item xs={12} sm={4} md={4}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            CampusConnect
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Votre plateforme éducative complète pour connecter étudiants et professeurs dans un environnement d'apprentissage moderne.
                        </Typography>
                    </Grid>

                    {/* Colonne Liens Utiles */}
                    <Grid item xs={12} sm={4} md={4}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Liens Utiles
                        </Typography>
                        <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                            <Box component="li" sx={{ mb: 1 }}>
                                <Link href="/" color="inherit" underline="hover">
                                    Accueil
                                </Link>
                            </Box>
                            <Box component="li" sx={{ mb: 1 }}>
                                <Link href="/about" color="inherit" underline="hover">
                                    À propos
                                </Link>
                            </Box>
                            <Box component="li" sx={{ mb: 1 }}>
                                <Link href="/faq" color="inherit" underline="hover">
                                    FAQ
                                </Link>
                            </Box>
                            <Box component="li" sx={{ mb: 1 }}>
                                <Link href="/contact" color="inherit" underline="hover">
                                    Contact
                                </Link>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Colonne Contact */}
                    <Grid item xs={12} sm={4} md={4}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Contact
                        </Typography>
                        <Typography variant="body2" paragraph>
                            support@campusconnect.fr
                        </Typography>
                        <Typography variant="body2" paragraph>
                            +33 (0)1 23 45 67 89
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <IconButton aria-label="facebook" sx={{ color: "white", mr: 1 }}>
                                <Facebook />
                            </IconButton>
                            <IconButton aria-label="twitter" sx={{ color: "white", mr: 1 }}>
                                <Twitter />
                            </IconButton>
                            <IconButton aria-label="linkedin" sx={{ color: "white", mr: 1 }}>
                                <LinkedIn />
                            </IconButton>
                            <IconButton aria-label="instagram" sx={{ color: "white" }}>
                                <Instagram />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)", my: 3 }} />

                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2">
                        &copy; {new Date().getFullYear()} CampusConnect - Tous droits réservés
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <Link href="/privacy" color="inherit" underline="hover" sx={{ mx: 1 }}>
                            Politique de confidentialité
                        </Link>
                        <Link href="/terms" color="inherit" underline="hover" sx={{ mx: 1 }}>
                            Conditions d'utilisation
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;