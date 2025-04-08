// src/pages/professor/ClassManagement.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Container,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { z } from 'zod';
import { EventClickArg } from '@fullcalendar/core/index.js';

// Requêtes GraphQL
const GET_CLASSES = gql`
  query GetClasses {
    professorClasses {
      id
      title
      description
      start
      end
      room
      color
    }
  }
`;

const CREATE_CLASS = gql`
  mutation CreateClass($input: ClassInput!) {
    createClass(input: $input) {
      id
      title
      start
      end
    }
  }
`;

const UPDATE_CLASS = gql`
  mutation UpdateClass($id: ID!, $input: ClassInput!) {
    updateClass(id: $id, input: $input) {
      id
      title
      start
      end
    }
  }
`;

const DELETE_CLASS = gql`
  mutation DeleteClass($id: ID!) {
    deleteClass(id: $id)
  }
`;

// Schéma Zod pour la validation du formulaire de classe
const classSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères" }),
  description: z.string().optional(),
  start: z.string().min(1, { message: "La date de début est requise" }),
  end: z.string().min(1, { message: "La date de fin est requise" }),
  room: z.string().min(1, { message: "La salle est requise" }),
  color: z.string().optional()
});

type ClassFormData = z.infer<typeof classSchema>;

const ClassManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassFormData & { id?: string }>({
    title: '',
    description: '',
    start: '',
    end: '',
    room: '',
    color: '#3788d8' // Couleur par défaut
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ClassFormData, string>>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Requêtes GraphQL
  const { loading, error, data, refetch } = useQuery(GET_CLASSES);
  
  const [createClass, { loading: createLoading }] = useMutation(CREATE_CLASS, {
    onCompleted: () => {
      handleCloseDialog();
      refetch();
      showSnackbar("Cours créé avec succès", "success");
    },
    onError: (error) => {
      showSnackbar(`Erreur: ${error.message}`, "error");
    }
  });
  
  const [updateClass, { loading: updateLoading }] = useMutation(UPDATE_CLASS, {
    onCompleted: () => {
      handleCloseDialog();
      refetch();
      showSnackbar("Cours mis à jour avec succès", "success");
    },
    onError: (error) => {
      showSnackbar(`Erreur: ${error.message}`, "error");
    }
  });
  
  const [deleteClass, { loading: deleteLoading }] = useMutation(DELETE_CLASS, {
    onCompleted: () => {
      handleCloseDialog();
      refetch();
      showSnackbar("Cours supprimé avec succès", "success");
    },
    onError: (error) => {
      showSnackbar(`Erreur: ${error.message}`, "error");
    }
  });


  interface ProfessorClass {
    id: string;
    title: string;
    start: string;
    end: string;
    description: string;
    room: string;
    color: string;
  }

  interface DateClickInfo {
    dateStr: string;
  }

  // Formater les événements pour FullCalendar
  const events = data?.professorClasses.map((classItem: ProfessorClass) => ({
    id: classItem.id,
    title: classItem.title,
    start: classItem.start,
    end: classItem.end,
    extendedProps: {
      description: classItem.description,
      room: classItem.room
    },
    backgroundColor: classItem.color || '#3788d8',
    borderColor: classItem.color || '#3788d8'
  })) || [];

  const handleDateClick = (info: DateClickInfo) => {
    const start = new Date(info.dateStr);
    const end = new Date(start);
    end.setHours(start.getHours() + 1);
    
    setCurrentClass({
      title: '',
      description: '',
      start: info.dateStr,
      end: end.toISOString().slice(0, 16),
      room: '',
      color: '#3788d8'
    });
    
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEventClick = (info : EventClickArg) => {
    const event = info.event;
    setCurrentClass({
      id: event.id,
      title: event.title,
      description: event.extendedProps.description || '',
      start: event.start ? event.start.toISOString().slice(0, 16) :'',
      end: event.end ? event.end.toISOString().slice(0, 16) : '',
      room: event.extendedProps.room || '',
      color: event.backgroundColor
    });
    
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as { name: string; value: string };
    setCurrentClass(prev => ({ ...prev, [name]: value }));
    
    // Nettoyage de l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name as keyof ClassFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({});
  };

  const handleSubmit = () => {
    try {
      // Validation avec Zod
      classSchema.parse(currentClass);
      
      if (isEditing && currentClass.id) {
        // Mise à jour d'un cours existant
        updateClass({
          variables: {
            id: currentClass.id,
            input: {
              title: currentClass.title,
              description: currentClass.description,
              start: currentClass.start,
              end: currentClass.end,
              room: currentClass.room,
              color: currentClass.color
            }
          }
        });
      } else {
        // Création d'un nouveau cours
        createClass({
          variables: {
            input: {
              title: currentClass.title,
              description: currentClass.description,
              start: currentClass.start,
              end: currentClass.end,
              room: currentClass.room,
              color: currentClass.color
            }
          }
        });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Formatage des erreurs de validation Zod
        const fieldErrors: Partial<Record<keyof ClassFormData, string>> = {};
        err.errors.forEach(error => {
          const field = error.path[0] as keyof ClassFormData;
          fieldErrors[field] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        showSnackbar("Une erreur s'est produite", "error");
        console.error(err);
      }
    }
  };

  const handleDelete = () => {
    if (currentClass.id) {
      deleteClass({
        variables: {
          id: currentClass.id
        }
      });
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography color="error" variant="h6">
            Erreur de chargement des données: {error.message}
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => refetch()}
            sx={{ mt: 2 }}
          >
            Réessayer
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Gestion des cours
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            Utilisez ce calendrier pour gérer vos cours. Cliquez sur une date pour ajouter un nouveau cours, ou sur un cours existant pour le modifier.
          </Typography>
        </Box>
        
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          locale="fr"
          buttonText={{
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour'
          }}
        />
      </Paper>

      {/* Dialogue pour créer/modifier un cours */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Modifier le cours' : 'Créer un nouveau cours'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre du cours"
                name="title"
                value={currentClass.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={currentClass.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date et heure de début"
                name="start"
                type="datetime-local"
                value={currentClass.start}
                onChange={handleInputChange}
                error={!!errors.start}
                helperText={errors.start}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date et heure de fin"
                name="end"
                type="datetime-local"
                value={currentClass.end}
                onChange={handleInputChange}
                error={!!errors.end}
                helperText={errors.end}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salle"
                name="room"
                value={currentClass.room}
                onChange={handleInputChange}
                error={!!errors.room}
                helperText={errors.room}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Couleur"
                name="color"
                type="color"
                value={currentClass.color}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          {isEditing && (
            <Button 
              color="error" 
              onClick={handleDelete}
              disabled={createLoading || updateLoading || deleteLoading}
            >
              {deleteLoading ? <CircularProgress size={24} /> : 'Supprimer'}
            </Button>
          )}
          <Button 
            onClick={handleCloseDialog}
            disabled={createLoading || updateLoading || deleteLoading}
          >
            Annuler
          </Button>
          <Button 
            color="primary" 
            onClick={handleSubmit}
            disabled={createLoading || updateLoading || deleteLoading}
            variant="contained"
          >
            {(createLoading || updateLoading) ? 
              <CircularProgress size={24} /> : 
              isEditing ? 'Mettre à jour' : 'Créer'
            }
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClassManagement;