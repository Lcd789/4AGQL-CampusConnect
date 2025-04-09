// src/components/structure/Header.tsx
import {useState} from "react";
import {Link as RouterLink, useNavigate, useLocation} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
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
    ListItemButton, // Ajout du composant ListItemButton
    Divider,
    useMediaQuery,
    useTheme,
    Avatar
} from "@mui/material";
import {
    Menu as MenuIcon,
    Dashboard,
    Grade,
    Person,
    Logout,
    Login,
    PersonAdd,
    Class,
    CalendarMonth,
    Assignment
} from "@mui/icons-material";
import { getAvatarProps} from "../../utils/avatarUtils.ts";

const Header = () => {
    console.log(`AuthContext useAuth() dans le Header : ${useAuth()}`)
    const {isAuthenticated, user, logout} = useAuth();
    console.log(`User dans le Header : ${user}`)
    const navigate = useNavigate();
    const location = useLocation();
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
        <Box sx={{width: 250, bgcolor: 'background.paper'}} role="presentation">
            <List>
                <ListItem>
                    <Typography
                        variant="h6"
                        sx={
                            {fontWeight: 'bold', color: 'text.primary'}
                        }
                    >
                        CampusConnect
                    </Typography>
                </ListItem>
                <Divider/>

                {isAuthenticated && user ? (
                    <>
                        {/* Routes basées sur le rôle */}
                        {user.role === "student" ? (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => handleNavigate("/student-dashboard")}
                                        sx={{
                                            bgcolor: isActive("/student-dashboard")
                                                ? 'rgba(0, 0, 0, 0.08)'
                                                : 'transparent',
                                            color: 'text.primary'
                                        }}
                                    >
                                        <ListItemIcon sx={
                                                {color: 'inherit'}
                                            }
                                        >
                                            <Dashboard/>
                                        </ListItemIcon>
                                        <ListItemText primary="Tableau de bord"/>
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => handleNavigate("/grades")}
                                        sx={{
                                            bgcolor: isActive("/grades")
                                                ? 'rgba(0, 0, 0, 0.08)'
                                                : 'transparent',
                                            color: 'text.primary'
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={
                                                {color: 'inherit'}
                                            }
                                        >
                                            <Grade/>
                                        </ListItemIcon>
                                        <ListItemText primary="Mes notes"/>
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => handleNavigate("/classes")}
                                        sx={{
                                            bgcolor: isActive("/classes")
                                                ? 'rgba(0, 0, 0, 0.08)'
                                                : 'transparent',
                                            color: 'text.primary'
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={
                                                {color: 'inherit'}
                                            }
                                        >
                                            <Class/>
                                        </ListItemIcon>
                                        <ListItemText primary="Mes cours"/>
                                    </ListItemButton>
                                </ListItem>
                            </>
                        ) : user.role === "professor" ? (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => handleNavigate("/professor-dashboard")}
                                        sx={{
                                            bgcolor: isActive("/professor-dashboard")
                                                ? 'rgba(0, 0, 0, 0.08)'
                                                : 'transparent',
                                            color: 'text.primary'
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={
                                                {color: 'inherit'}
                                            }
                                        >
                                            <Dashboard/>
                                        </ListItemIcon>
                                        <ListItemText primary="Tableau de bord"/>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => handleNavigate("/grade-management")}
                                        sx={{
                                            bgcolor: isActive("/grade-management")
                                                ? 'rgba(0, 0, 0, 0.08)'
                                                : 'transparent',
                                            color: 'text.primary'
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={
                                                {color: 'inherit'}
                                            }
                                        >
                                            <Assignment/>
                                        </ListItemIcon>
                                        <ListItemText primary="Gestion des notes"/>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => handleNavigate("/class-management")}
                                        sx={{
                                            bgcolor: isActive("/class-management")
                                                ? 'rgba(0, 0, 0, 0.08)'
                                                : 'transparent',
                                            color: 'text.primary'
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={
                                                {color: 'inherit'}
                                            }
                                        >
                                            <CalendarMonth/>
                                        </ListItemIcon>
                                        <ListItemText primary="Gestion des cours"/>
                                    </ListItemButton>
                                </ListItem>
                            </>
                        ) : null}

                        <Divider/>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => handleNavigate("/profile")}
                                sx={{
                                    bgcolor: isActive("/profile")
                                        ? 'rgba(0, 0, 0, 0.08)'
                                        : 'transparent',
                                    color: 'text.primary'
                                }}
                            >
                                <ListItemIcon
                                    sx={
                                        {color: 'inherit'}
                                    }
                                >
                                    <Person/>
                                </ListItemIcon>
                                <ListItemText primary="Profil"/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{color: 'text.primary'}}
                            >
                                <ListItemIcon
                                    sx={
                                        {color: 'inherit'}
                                    }
                                >
                                    <Logout/>
                                </ListItemIcon>
                                <ListItemText primary="Déconnexion"/>
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => handleNavigate("/login")}
                                sx={{
                                    bgcolor: isActive("/login")
                                        ? 'rgba(0, 0, 0, 0.08)'
                                        : 'transparent',
                                    color: 'text.primary'
                                }}
                            >
                                <ListItemIcon sx={
                                        {color: 'inherit'}
                                    }
                                >
                                    <Login/>
                                </ListItemIcon>
                                <ListItemText primary="Connexion"/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => handleNavigate("/register")}
                                sx={{
                                    bgcolor: isActive("/register")
                                        ? 'rgba(0, 0, 0, 0.08)'
                                        : 'transparent',
                                    color: 'text.primary'
                                }}
                            >
                                <ListItemIcon
                                    sx={
                                        {color: 'inherit'}
                                    }
                                >
                                    <PersonAdd/>
                                </ListItemIcon>
                                <ListItemText primary="Inscription"/>
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>

                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 'bold'
                        }}
                    >
                        CampusConnect
                    </Typography>

                    {!isMobile && (
                        <Box sx={{display: 'flex'}}>
                            {isAuthenticated && user ? (
                                <>
                                    {/* Boutons de navigation basés sur le rôle */}
                                    {user.role === "student" ? (
                                        <>
                                            <Button
                                                color="inherit"
                                                component={RouterLink}
                                                to="/student-dashboard"
                                                sx={{
                                                    mx: 0.5,
                                                    backgroundColor: isActive("/student-dashboard") ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                                }}
                                                startIcon={<Dashboard/>}
                                            >
                                                Tableau de bord
                                            </Button>
                                            <Button
                                                color="inherit"
                                                component={RouterLink}
                                                to="/grades"
                                                sx={{
                                                    mx: 0.5,
                                                    backgroundColor: isActive("/grades") ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                                }}
                                                startIcon={<Grade/>}
                                            >
                                                Notes
                                            </Button>
                                            <Button
                                                color="inherit"
                                                component={RouterLink}
                                                to="/classes"
                                                sx={{
                                                    mx: 0.5,
                                                    backgroundColor: isActive("/classes") ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                                }}
                                                startIcon={<Class/>}
                                            >
                                                Cours
                                            </Button>
                                        </>
                                    ) : user.role === "professor" ? (
                                        <>
                                            <Button
                                                color="inherit"
                                                component={RouterLink}
                                                to="/professor-dashboard"
                                                sx={{
                                                    mx: 0.5,
                                                    backgroundColor: isActive("/professor-dashboard") ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                                }}
                                                startIcon={<Dashboard/>}
                                            >
                                                Tableau de bord
                                            </Button>
                                            <Button
                                                color="inherit"
                                                component={RouterLink}
                                                to="/grade-management"
                                                sx={{
                                                    mx: 0.5,
                                                    backgroundColor: isActive("/grade-management") ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                                }}
                                                startIcon={<Assignment/>}
                                            >
                                                Notes
                                            </Button>
                                            <Button
                                                color="inherit"
                                                component={RouterLink}
                                                to="/class-management"
                                                sx={{
                                                    mx: 0.5,
                                                    backgroundColor: isActive("/class-management") ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                                }}
                                                startIcon={<CalendarMonth/>}
                                            >
                                                Cours
                                            </Button>
                                        </>
                                    ) : null}

                                    <IconButton
                                        edge="end"
                                        aria-label="compte utilisateur"
                                        aria-controls={menuId}
                                        aria-haspopup="true"
                                        onClick={handleProfileMenuOpen}
                                        color="inherit"
                                        sx={{ml: 1}}
                                    >
                                        <Avatar
                                            {...getAvatarProps(user?.username || '')}
                                            sx={{width: 32, height: 32, ...getAvatarProps(user.username || '')
                                            }}
                                        />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <Button
                                        color="inherit"
                                        component={RouterLink}
                                        to="/login"
                                        sx={{
                                            mx: 0.5,
                                            backgroundColor: isActive("/login") ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                        }}
                                        startIcon={<Login/>}
                                    >
                                        Connexion
                                    </Button>
                                    <Button
                                        color="inherit"
                                        component={RouterLink}
                                        to="/register"
                                        sx={{
                                            mx: 0.5,
                                            backgroundColor: isActive("/register") ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
                                        }}
                                        startIcon={<PersonAdd/>}
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