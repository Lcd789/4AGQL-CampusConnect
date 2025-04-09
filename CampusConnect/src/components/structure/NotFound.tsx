// src/pages/common/NotFound.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
    CircularProgress,
    useTheme,
    useMediaQuery
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";

function NotFound() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        // Gestion du compte à rebours
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            navigate("/");
        }
    }, [countdown, navigate]);

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 3, sm: 5 },
                    textAlign: "center",
                    borderRadius: 2,
                    backgroundColor: "background.paper"
                }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                >
                    <ErrorOutlineIcon
                        color="error"
                        sx={{
                            fontSize: isMobile ? 80 : 120,
                            mb: 1
                        }}
                    />

                    <Typography
                        variant={isMobile ? "h4" : "h3"}
                        component="h1"
                        fontWeight="bold"
                        color="error"
                    >
                        404
                    </Typography>

                    <Typography
                        variant={isMobile ? "h5" : "h4"}
                        component="h2"
                        fontWeight="medium"
                        gutterBottom
                    >
                        Page introuvable
                    </Typography>

                    <Typography variant="body1" paragraph>
                        La page que vous recherchez n'existe pas ou a été déplacée.
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress
                            variant="determinate"
                            value={(countdown/5)*100}
                            size={24}
                            thickness={4}
                            color="primary"
                        />
                        <Typography variant="body2" color="text.secondary">
                            Redirection dans {countdown} seconde{countdown !== 1 ? "s" : ""}...
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<HomeIcon />}
                        onClick={() => navigate("/")}
                        sx={{
                            mt: 2,
                            px: 3,
                            py: 1,
                            borderRadius: 1.5
                        }}
                    >
                        Retourner à l'accueil
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default NotFound;