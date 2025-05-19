const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Add JSON body parsing middleware
server.use(jsonServer.bodyParser);

// Create a temporary directory without spaces
const tempDir = path.join(os.tmpdir(), 'trippal_db');

// Ensure the directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Copy the db.json file to the temp directory
const sourceDbPath = path.join(__dirname, 'db.json');
const targetDbPath = path.join(tempDir, 'db.json');

try {
  // Read the original db.json
  const dbContent = fs.readFileSync(sourceDbPath, 'utf8');
  
  // Write to the temp location
  fs.writeFileSync(targetDbPath, dbContent);
  
  console.log(`Database copied to: ${targetDbPath}`);
  
  // Start the JSON server from the temp directory
  const serverProcess = exec(`npx json-server --watch ${targetDbPath} --port 3001`, 
    { cwd: tempDir },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting server: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Server stderr: ${stderr}`);
      }
    }
  );
  
  // Handle server output
  serverProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  // Handle server exit
  serverProcess.on('exit', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
  
  console.log('JSON Server started. Press Ctrl+C to stop.');
  
} catch (error) {
  console.error(`Error: ${error.message}`);
}

// Add logging middleware
server.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Add error handling middleware
server.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Use default middlewares
server.use(middlewares);

// Add custom routes with error handling
server.get('/trips/:id', (req, res, next) => {
  const tripId = req.params.id;
  console.log('Fetching trip:', tripId);
  try {
    const trip = router.db.get('trips').find({ id: tripId }).value();
    if (!trip) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Trip with ID ${tripId} not found`
      });
    }
    console.log('Found trip:', trip);
    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch trip data'
    });
  }
});

server.get('/days', (req, res, next) => {
  const tripId = req.query.tripId;
  console.log('Fetching days for trip:', tripId);
  try {
    if (!tripId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'tripId query parameter is required'
      });
    }

    const days = router.db.get('days')
      .filter(day => day.tripId === tripId)
      .value();
    
    console.log('Found days:', days);
    res.json(days);
  } catch (error) {
    console.error('Error fetching days:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch days data'
    });
  }
});

server.get('/activities', (req, res, next) => {
  const tripId = req.query.tripId;
  console.log('Fetching activities for trip:', tripId);
  try {
    if (!tripId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'tripId query parameter is required'
      });
    }

    const activities = router.db.get('activities')
      .filter(activity => activity.tripId === tripId)
      .value();
    
    console.log('Found activities:', activities);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch activities data'
    });
  }
});

// Add POST endpoint for creating new activities
server.post('/activities', (req, res, next) => {
  console.log('Creating new activity:', req.body);
  try {
    const newActivity = {
      ...req.body,
      id: req.body.id || `activity-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    // Add the new activity to the database
    const activities = router.db.get('activities');
    activities.push(newActivity).write();

    console.log('Created activity:', newActivity);
    res.status(201).json(newActivity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create activity'
    });
  }
});

// Add endpoint to update trip budget
server.patch('/trips/:id/budget', (req, res, next) => {
  const tripId = req.params.id;
  const budgetUpdate = req.body;
  console.log('Updating budget for trip:', tripId, budgetUpdate);
  
  try {
    const trip = router.db.get('trips').find({ id: tripId }).value();
    if (!trip) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Trip with ID ${tripId} not found`
      });
    }

    // Update budget information
    const updatedTrip = {
      ...trip,
      budget: {
        ...trip.budget,
        ...budgetUpdate,
        remaining: trip.budget.total - (budgetUpdate.spent || trip.budget.spent)
      }
    };

    router.db.get('trips')
      .find({ id: tripId })
      .assign(updatedTrip)
      .write();

    console.log('Updated trip budget:', updatedTrip);
    res.json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip budget:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update trip budget'
    });
  }
});

// Add endpoint to add expense
server.post('/expenses', (req, res, next) => {
  console.log('Creating new expense:', req.body);
  try {
    const newExpense = {
      ...req.body,
      id: `expense-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    // Add the new expense to the database
    const expenses = router.db.get('expenses');
    expenses.push(newExpense).write();

    // Update trip's spent amount
    const trip = router.db.get('trips').find({ id: newExpense.tripId }).value();
    if (trip) {
      const totalSpent = expenses
        .filter(e => e.tripId === newExpense.tripId)
        .reduce((sum, e) => sum + e.amount, 0);

      router.db.get('trips')
        .find({ id: newExpense.tripId })
        .assign({
          budget: {
            ...trip.budget,
            spent: totalSpent,
            remaining: trip.budget.total - totalSpent
          }
        })
        .write();
    }

    console.log('Created expense:', newExpense);
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create expense'
    });
  }
});

// Add endpoint to get expenses for a trip
server.get('/expenses', (req, res, next) => {
  const tripId = req.query.tripId;
  console.log('Fetching expenses for trip:', tripId);
  try {
    if (!tripId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'tripId query parameter is required'
      });
    }

    const expenses = router.db.get('expenses')
      .filter(expense => expense.tripId === tripId)
      .value();
    
    console.log('Found expenses:', expenses);
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch expenses data'
    });
  }
});

// Use router for other routes
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
}); 