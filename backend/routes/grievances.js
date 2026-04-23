const router = require('express').Router();
const Grievance = require('../models/Grievance');
const auth = require('../middleware/auth');

// Submit grievance
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const newGrievance = new Grievance({
      title,
      description,
      category,
      student: req.user,
    });

    const savedGrievance = await newGrievance.save();
    res.json(savedGrievance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View all grievances (for the logged in student)
router.get('/', auth, async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.user }).sort({ date: -1 });
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search grievance
router.get('/search', auth, async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Using regex for partial match as requested by "search?title=xyz"
    const grievances = await Grievance.find({
      student: req.user,
      title: { $regex: title, $options: 'i' }
    });
    
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View grievance by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const grievance = await Grievance.findOne({ _id: req.params.id, student: req.user });
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    res.json(grievance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update grievance
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, category, status } = req.body;
    
    const grievance = await Grievance.findOne({ _id: req.params.id, student: req.user });
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    if (title) grievance.title = title;
    if (description) grievance.description = description;
    if (category) grievance.category = category;
    if (status) grievance.status = status;

    const updatedGrievance = await grievance.save();
    res.json(updatedGrievance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete grievance
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedGrievance = await Grievance.findOneAndDelete({ _id: req.params.id, student: req.user });
    if (!deletedGrievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    res.json(deletedGrievance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
