// src/components/structure/Footer.tsx
import { Box, Container, Typography, Link, IconButton, Stack } from "@mui/material";
import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "primary.main",
                color: "white",
                py: 4,
                mt: "auto",
            }}
        >
            <Container maxWidth="lg">
                {/* Logo et description */}
                <Box sx={{ mb: 3, textAlign: "center" }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        CampusConnect
                    </Typography>
                    <Typography variant="body2" sx={{ maxWidth: "600px", mx: "auto" }}>
                        Votre plateforme éducative complète pour connecter étudiants et professeurs
                        dans un environnement d'apprentissage moderne.
                    </Typography>
                </Box>

                {/* Liens et contact en flexbox */}
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, mb: 3 }}>
                    {/* Liens Utiles */}
                    <Box sx={{ minWidth: "200px" }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Liens Utiles
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="/" color="inherit" underline="hover">Accueil</Link>
                            <Link href="/about" color="inherit" underline="hover">À propos</Link>
                            <Link href="/faq" color="inherit" underline="hover">FAQ</Link>
                            <Link href="/contact" color="inherit" underline="hover">Contact</Link>
                        </Stack>
                    </Box>

                    {/* Contact */}
                    <Box sx={{ minWidth: "200px" }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Contact
                        </Typography>
                        <Typography variant="body2">support@campusconnect.fr</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>+33 (0)1 23 45 67 89</Typography>

                        {/* Icônes sociales */}
                        <Box>
                            <IconButton aria-label="facebook" size="small" sx={{ color: "white", mr: 1 }}>
                                <Facebook />
                            </IconButton>
                            <IconButton aria-label="twitter" size="small" sx={{ color: "white", mr: 1 }}>
                                <Twitter />
                            </IconButton>
                            <IconButton aria-label="linkedin" size="small" sx={{ color: "white", mr: 1 }}>
                                <LinkedIn />
                            </IconButton>
                            <IconButton aria-label="instagram" size="small" sx={{ color: "white" }}>
                                <Instagram />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>

                {/* Copyright */}
                <Typography variant="body2" sx={{ textAlign: "center", pt: 2 }}>
                    © {new Date().getFullYear()} CampusConnect. Tous droits réservés.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;