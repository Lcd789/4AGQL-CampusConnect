import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfessorClasses, useClassEnrollments, GET_CLASS_ENROLLMENTS } from '../../api/classes/classQueries';
import { useCreateClass, useDeleteClass } from '../../api/classes/classMutations';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  TableSortLabel,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  CalendarMonth as CalendarIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import {Class} from "../../api/types.ts";

interface EnrollmentData {
  classId: string;
  count: number;
}

const ClassManagement: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Class>('title');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [enrollmentCounts, setEnrollmentCounts] = useState<EnrollmentData[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    room: '',
    color: '#4A90E2',
    courseId: ''
  });

  // Récupérer les classes du professeur
  const { loading, error, data, refetch } = useProfessorClasses();
  const [createClassMutation, { loading: createLoading }] = useCreateClass();
  const [deleteClassMutation, { loading: deleteLoading }] = useDeleteClass();


  // Calculer le nombre total d'étudiants inscrits
  useEffect(() => {
    if (data?.professorClasses) {
      const fetchEnrollmentCounts = async () => {
        const counts: EnrollmentData[] = [];

        for (const cls of data.professorClasses) {
          try {
            const result = await fetchEnrollmentsForClass(cls.id);
            counts.push({
              classId: cls.id,
              count: result?.classEnrollments?.length || 0
            });
          } catch (err) {
            console.error(`Failed to fetch enrollments for class ${cls.id}:`, err);
            counts.push({ classId: cls.id, count: 0 });
          }
        }

        setEnrollmentCounts(counts);
      };

      fetchEnrollmentCounts();
    }
  }, [data]);

  const fetchEnrollmentsForClass = async (classId: string) => {
    const { client } = useClassEnrollments('');
    const { data } = await client.query({
      query: GET_CLASS_ENROLLMENTS,
      variables: { classId }
    });

    return data;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start: '',
      end: '',
      room: '',
      color: '#4A90E2',
      courseId: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClassMutation({
      variables: { input: formData },
      onCompleted: () => {
        refetch();
        setOpen(false);
        resetForm();
        showAlertMessage('Class created successfully!', 'success');
      },
      onError: (error) => {
        showAlertMessage(`Error creating class: ${error.message}`, 'error');
      }
    });
  };


  const handleDeleteClass = (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      deleteClassMutation({
        variables: { id },
        onCompleted: () => {
          refetch();
          showAlertMessage('Class deleted successfully!', 'success');
        },
        onError: (error) => {
          showAlertMessage(`Error deleting class: ${error.message}`, 'error');
        }
      });
    }
  };


  const handleViewDetails = (id: string) => {
    navigate(`/professor/classes/${id}`);
  };

  const showAlertMessage = (message: string, severity: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleRequestSort = (property: keyof Class) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedClasses = React.useMemo(() => {
    if (!data?.professorClasses) return [];

    return [...data.professorClasses].sort((a, b) => {
      if (orderBy === 'title') {
        return order === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [data, order, orderBy]);

  const totalStudents = enrollmentCounts.reduce((sum, item) => sum + item.count, 0);
  const activeClasses = data?.professorClasses?.filter(c => new Date(c.end) > new Date()).length || 0;

  if (loading) return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
  );

  if (error) return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Error: {error.message}
        </Alert>
      </Container>
  );

  return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Class Management
          </Typography>
          <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
          >
            Create New Class
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Classes
                  </Typography>
                  <Typography variant="h5">
                    {data?.professorClasses?.length || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Classes
                  </Typography>
                  <Typography variant="h5">
                    {activeClasses}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon sx={{ fontSize: 40, mr: 2, color: 'info.main' }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Students Enrolled
                  </Typography>
                  <Typography variant="h5">
                    {totalStudents}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Classes Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                      active={orderBy === 'title'}
                      direction={orderBy === 'title' ? order : 'asc'}
                      onClick={() => handleRequestSort('title')}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Students</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedClasses.map((cls: Class) => {
                const studentCount = enrollmentCounts.find(e => e.classId === cls.id)?.count || 0;
                const isActive = new Date(cls.end) > new Date();

                return (
                    <TableRow key={cls.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: cls.color || '#4A90E2',
                                mr: 1
                              }}
                          />
                          {cls.title}
                        </Box>
                      </TableCell>
                      <TableCell>{cls.room}</TableCell>
                      <TableCell>{new Date(cls.start).toLocaleString()}</TableCell>
                      <TableCell>{new Date(cls.end).toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                            label={studentCount}
                            color={studentCount > 0 ? "primary" : "default"}
                            size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton
                              color="primary"
                              onClick={() => handleViewDetails(cls.id)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={studentCount > 0 ? "Cannot delete class with students" : "Delete class"}>
                      <span>
                        <IconButton
                            color="error"
                            onClick={() => handleDeleteClass(cls.id)}
                            disabled={studentCount > 0}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                );
              })}
              {sortedClasses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography sx={{ py: 2 }}>
                        No classes found. Create your first class!
                      </Typography>
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create Class Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Class</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                      name="title"
                      label="Class Title"
                      value={formData.title}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      name="description"
                      label="Description"
                      value={formData.description}
                      onChange={handleInputChange}
                      fullWidth
                      multiline
                      rows={3}
                      margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                      name="start"
                      label="Start Date & Time"
                      type="datetime-local"
                      value={formData.start}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                      name="end"
                      label="End Date & Time"
                      type="datetime-local"
                      value={formData.end}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                      name="room"
                      label="Room"
                      value={formData.room}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                      name="color"
                      label="Color"
                      type="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      name="courseId"
                      label="Course ID (optional)"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">Create</Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Alert/Notification */}
        <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Container>
  );
};

export default ClassManagement;