const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Home / Login Selection Page
app.get('/', (req, res) => {
  res.render('index');
});

// Doctor Login
app.get('/doctor-login', (req, res) => {
  res.render('login', { role: 'doctor', title: 'Doctor Login' });
});

// Patient Login
app.get('/patient-login', (req, res) => {
  res.render('login', { role: 'patient', title: 'Patient Login' });
});

// Doctor Dashboard
app.get('/doctor', (req, res) => {
  const appointments = [
    { time: '09:00 AM', patient: 'Alice Morgan', type: 'Cardiology', status: 'Confirmed', priority: 'high' },
    { time: '10:30 AM', patient: 'James Liu', type: 'General', status: 'Pending', priority: 'medium' },
    { time: '12:00 PM', patient: 'Sara Kim', type: 'Neurology', status: 'Confirmed', priority: 'low' },
    { time: '02:00 PM', patient: 'Tom Brown', type: 'Cardiology', status: 'Confirmed', priority: 'high' },
    { time: '03:30 PM', patient: 'Nina Patel', type: 'Orthopedics', status: 'Pending', priority: 'medium' },
  ];
  const notifications = [
    { type: 'urgent', msg: 'URGENT: Lab Results for Patient B-345', time: '2m ago' },
    { type: 'alert', msg: 'Patient Alice Morgan BP spike detected', time: '15m ago' },
    { type: 'info', msg: 'New collaboration request from Dr. Smith', time: '1h ago' },
    { type: 'info', msg: 'Surgery schedule updated for tomorrow', time: '2h ago' },
  ];
  const colleagues = [
    { name: 'Dr. Sarah Smith', specialty: 'Neurologist', status: 'online' },
    { name: 'Dr. Mike Johnson', specialty: 'Cardiologist', status: 'busy' },
    { name: 'Dr. Priya Nair', specialty: 'Radiologist', status: 'online' },
    { name: 'Dr. Leo Wang', specialty: 'Surgeon', status: 'offline' },
  ];
  res.render('doctor', { appointments, notifications, colleagues });
});

// Patient Dashboard
app.get('/patient', (req, res) => {
  const medicines = [
    { name: 'Metformin 500mg', time: 'Morning & Evening', food: 'After meal', refill: '12 days left' },
    { name: 'Amlodipine 5mg', time: 'Morning', food: 'Before meal', refill: '5 days left' },
    { name: 'Atorvastatin 10mg', time: 'Night', food: 'After meal', refill: '20 days left' },
  ];
  const diagnoses = [
    { condition: 'Type 2 Diabetes', severity: 'Moderate', desc: 'Your blood sugar levels are higher than normal. This is being managed with medication and diet.' },
    { condition: 'Hypertension', severity: 'Mild', desc: 'Your blood pressure is slightly elevated. Exercise and reducing salt intake will help.' },
  ];
  res.render('patient', { medicines, diagnoses });
});

// Handle login form
app.post('/login', (req, res) => {
  const { role } = req.body;
  if (role === 'doctor') res.redirect('/doctor');
  else res.redirect('/patient');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CareConnect running at http://localhost:${PORT}`);
});
