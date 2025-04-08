// src/components/structure/Header.tsx
import { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom"; // Ajout de useLocation
import { useAuth } from "../../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Avatar
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  Grade,
  Person,
  Logout,
  Login,
  PersonAdd,
  Class
} from "@mui/icons-material";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Récupère l'URL actuelle
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fonction pour vérifier si un lien est actif
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    setDrawerOpen(false);
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
    setDrawerOpen(false);
  };

  const menuId = 'primary-account-menu';
  const renderMenu = (
      <Menu
          anchorEl={anchorEl}
          id={menuId}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleNavigate("/profile")}>Profil</MenuItem>
        <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
      </Menu>
  );

  const drawerContent = (
      <Box sx={{ width: 250, bgcolor: 'background.paper' }} role="presentation">
        <List>
          <ListItem>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              CampusConnect
            </Typography>
          </ListItem>
          <Divider />

          <ListItem
              component="button"
              onClick={() => handleNavigate("/")}
              sx={{
                bgcolor: isActive("/") ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                color: 'text.primary'
              }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}><Dashboard /></ListItemIcon>
            <ListItemText primary="Accueil" />
          </ListItem>

          {isAuthenticated ? (
              <>
                <ListItem
                    component="button"
                    onClick={() => handleNavigate("/dashboard")}
                    sx={{
                      bgcolor: isActive("/dashboard") ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                      color: 'text.primary'
                    }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}><Dashboard /></ListItemIcon>
                  <ListItemText primary="Tableau de bord" />
                </ListItem>

                {/* Continuer pour les autres éléments... */}
              </>
          ) : (
              <>
                <ListItem
                    component="button"
                    onClick={() => handleNavigate("/login")}
                    sx={{
                      bgcolor: isActive("/login") ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                      color: 'text.primary'
                    }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}><Login /></ListItemIcon>
                  <ListItemText primary="Connexion" />
                </ListItem>

                <ListItem
                    component="button"
                    onClick={() => handleNavigate("/register")}
                    sx={{
                      bgcolor: isActive("/register") ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                      color: 'text.primary'
                    }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}><PersonAdd /></ListItemIcon>
                  <ListItemText primary="Inscription" />
                </ListItem>
              </>
          )}
        </List>
      </Box>
  );

  return (
      <>
        <AppBar
            position="static"
            color="primary"
            elevation={0}
            sx={{ width: '100%' }}
        >
          <Toolbar>
            {isMobile ? (
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
            ) : null}

            <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{
                  flexGrow: 1,
                  textDecoration: 'none',
                  '&:hover' : {
                    color: 'white',
                  },
                  color: 'inherit',
                  fontWeight: 'bold'

                }}
            >
              CampusConnect
            </Typography>

            {!isMobile && (
                <Box sx={{ display: 'flex' }}>
                  <Button
                      color="inherit"
                      component={RouterLink}
                      to="/"
                      sx={{
                        mx: 1,
                        border: isActive("/") ? '1px solid white' : 'none',
                        "&:hover": {
                          backgroundColor: 'rgba(255, 255, 255, 0.4)',
                          borderColor: 'white',
                          color: 'blue',
                          transition: 'background-color 0.3s'
                        }
                      }}
                  >
                    Accueil
                  </Button>

                  {isAuthenticated ? (
                      <>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/dashboard"
                            sx={{
                              mx: 1,
                              border: isActive("/dashboard") ? '1px solid white' : 'none',
                              "&:hover": {
                                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                borderColor: 'white',
                                color: 'blue',
                                transition: 'background-color 0.3s'
                              }
                            }}
                        >
                          Tableau de bord
                        </Button>

                        {user?.role === "student" && (
                            <>
                              <Button
                                  color="inherit"
                                  component={RouterLink}
                                  to="/grades"
                                  sx={{
                                    mx: 1,
                                    border: isActive("/grades") ? '1px solid white' : 'none',
                                    "&:hover": {
                                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                      borderColor: 'white',
                                      color: 'blue',
                                      transition: 'background-color 0.3s'
                                    }
                                  }}
                              >
                                Mes notes
                              </Button>
                              <Button
                                  color="inherit"
                                  component={RouterLink}
                                  to="/classes"
                                  sx={{
                                    mx: 1,
                                    border: isActive("/classes") ? '1px solid white' : 'none',
                                    "&:hover": {
                                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                      borderColor: 'white',
                                      color: 'blue',
                                      transition: 'background-color 0.3s'
                                    }
                                  }}
                              >
                                Mes cours
                              </Button>
                            </>
                        )}

                        {user?.role === "professor" && (
                            <>
                              <Button
                                  color="inherit"
                                  component={RouterLink}
                                  to="/grade-management"
                                  sx={{
                                    mx: 1,
                                    border: isActive("/grade-management") ? '1px solid white' : 'none',
                                    "&:hover": {
                                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                      color: 'blue',
                                      transition: 'background-color 0.3s'
                                    }
                                  }}
                              >
                                Gestion des notes
                              </Button>
                              <Button
                                  color="inherit"
                                  component={RouterLink}
                                  to="/class-management"
                                  sx={{
                                    mx: 1,
                                    border: isActive("/class-management") ? '1px solid white' : 'none',
                                    "&:hover": {
                                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                      color: 'blue',
                                      transition: 'background-color 0.3s'
                                    }
                                  }}
                              >
                                Gestion des cours
                              </Button>
                            </>
                        )}

                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                          <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'secondary.main',
                                fontSize: '0.875rem'
                              }}
                          >
                            {user?.name?.charAt(0) || "U"}
                          </Avatar>
                        </IconButton>
                      </>
                  ) : (
                      <>
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/login"
                            sx={{
                              mx: 1,
                              border: isActive("/login") ? '1px solid white' : 'none',
                              "&:hover": {
                                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                color: 'blue',
                                transition: 'background-color 0.3s'
                              }
                            }}
                        >
                          Connexion
                        </Button>
                        <Button
                            variant="outlined"
                            color="inherit"
                            component={RouterLink}
                            to="/register"
                            sx={{
                              ml: 1,
                              border: isActive("/register") ? '1px solid white' : 'none',
                              "&:hover": {
                                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                color: 'blue',
                                transition: 'background-color 0.3s'
                              }
                            }}
                        >
                          Inscription
                        </Button>
                      </>
                  )}
                </Box>
            )}
          </Toolbar>
        </AppBar>

        <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerToggle}
        >
          {drawerContent}
        </Drawer>

        {renderMenu}
      </>
  );
};

export default Header;