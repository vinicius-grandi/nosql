var express = require('express');
var router = express.Router();
const authMiddleware = require('../app/controllers/projectController');
const Project = require('../app/models/Project');
const { flash } = require('express-flash-message');
const session = require('express-session')
const secret = require('../config/auth.json');
const Task = require('../app/models/Task');

router.use(authMiddleware);

router.use(
  session({
    secret: secret.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: process.env.NODE_ENV === 'development'
    },
  })
);

router.use(flash({ sessionKeyName: 'flashMessage', useCookieSession: true }));

router.get('/', async (req, res, next) => {  
  const { ObjectId } = require('mongodb');
  const id = ObjectId(JSON.parse(req.cookies.login).user._id);

  const messages = await req.consumeFlash('info');
  try {
    const projects = await Project.find({user: {
      _id: id
    }}).populate('user');
    

    res.render('projects',  {
      title: 'Projects', 
      user: JSON.parse(req.cookies.login).user,
      projects: (projects.length < 1)?false:projects,
      messages: (messages.length !== '[]')? messages: '',
    });
  } catch (err) {

  }
});

// Create Project
router.post('/', async (req, res) => {
  try {
    const taskTitles = req.body.taskTitles.split(',');
    const tasks = []

    taskTitles.map(title => {
      tasks.push({ 
        title: title, 
        assignedTo: JSON.parse(req.cookies.login).user._id
      });
    })

    const { title, description } = req.body;
    
    const project = await Project.create({ 
      title,
      description,
      user: JSON.parse(req.cookies.login).user._id,
    });

    await Promise.all(
      tasks.map(async task => {
      const projectTask = new Task({ ...task, project: project._id});

      await projectTask.save();

      project.tasks.push(projectTask);
    }));

    await project.save();

    await req.flash('info', 'Project Created!');
    res.redirect('../login');
  } catch (err) {
    return res.status(400).send('Error creating new project');
  }
})
// List Project
router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('tasks');

    console.log(project._id)
    return res.render('update', {title: 'Update', project: project, pid: req.params.projectId});
  } catch (err) {
    return res.status(400).send('Error loading project')
  }
})
// Update Project
router.put('/:projectId', async (req, res) => {
  try {
    const taskTitles = req.body.taskTitles.split(',');
    const tasks = [];

    taskTitles.map(title => {
      tasks.push({ 
        title: title, 
        assignedTo: JSON.parse(req.cookies.login).user._id
      });
    })

    const { title, description } = req.body;
    
    const project = await Project.findByIdAndUpdate(req.params.projectId, { 
      title,
      description,
    }, { new: true });

    project.tasks = [];

    await Task.remove({ project: project._id })
    await Promise.all(
      tasks.map(async task => {
      const projectTask = new Task({ ...task, project: project._id});

      await projectTask.save();

      project.tasks.push(projectTask);
    }));

    await project.save();

    await req.flash('info', 'Project Updated!');
    res.redirect('../login');
  } catch (err) {
    return res.status(400).send('Error updating new project');
  }
})
// Delete Project
router.delete('/', async (req, res) => {
  try {
    const project = Object.keys(req.body)

    project.map(async id =>await Project.findByIdAndRemove(id));

    await req.flash('info', 'Project Deleted!');
    res.redirect('../login')
  } catch (err) {
    return res.status(400).send('Error deleting project')
  }
})

module.exports = router;
