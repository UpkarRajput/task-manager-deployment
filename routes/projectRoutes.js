const express = require('express');
const db = require('../db');
const { verifyToken, verifyProjectAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes here require the user to be logged in
router.use(verifyToken);

// --- PROJECT MANAGEMENT ---

// Create a new project (The creator automatically becomes the Admin)
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id;

    try {
        // Start a transaction since we are inserting into two tables
        await db.query('START TRANSACTION');

        const [projectResult] = await db.query(
            'INSERT INTO Projects (name, description) VALUES (?, ?)',
            [name, description]
        );
        const projectId = projectResult.insertId;

        // Assign the creator as the Admin in the junction table
        await db.query(
            'INSERT INTO ProjectMembers (project_id, user_id, role) VALUES (?, ?, ?)',
            [projectId, userId, 'Admin']
        );

        await db.query('COMMIT');
        res.status(201).json({ message: 'Project created', projectId });
    } catch (error) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Get all projects for the logged-in user
router.get('/', async (req, res) => {
    const userId = req.user.id;
    try {
        const [projects] = await db.query(`
            SELECT p.*, pm.role 
            FROM Projects p
            JOIN ProjectMembers pm ON p.id = pm.project_id
            WHERE pm.user_id = ?
        `, [userId]);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Add a member to a project (Requires Admin privileges)
router.post('/:projectId/members', verifyProjectAdmin, async (req, res) => {
    const { email, role } = req.body; // role should be 'Admin' or 'Member'
    const projectId = req.params.projectId;

    try {
        // Find user by email
        const [users] = await db.query('SELECT id FROM Users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        
        await db.query(
            'INSERT INTO ProjectMembers (project_id, user_id, role) VALUES (?, ?, ?)',
            [projectId, users[0].id, role || 'Member']
        );
        res.status(201).json({ message: 'Member added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add member' });
    }
});

// --- TASK MANAGEMENT ---

// Create a task inside a project (Requires Admin privileges)
router.post('/:projectId/tasks', verifyProjectAdmin, async (req, res) => {
    const { title, due_date, assigned_to } = req.body;
    const projectId = req.params.projectId;

    try {
        await db.query(
            'INSERT INTO Tasks (project_id, title, due_date, assigned_to) VALUES (?, ?, ?, ?)',
            [projectId, title, due_date, assigned_to || null]
        );
        res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Get all tasks for a specific project
router.get('/:projectId/tasks', async (req, res) => {
    const projectId = req.params.projectId;
    try {
        const [tasks] = await db.query(`
            SELECT t.*, u.name as assigned_to_name 
            FROM Tasks t
            LEFT JOIN Users u ON t.assigned_to = u.id
            WHERE t.project_id = ?
        `, [projectId]);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Update a task's status (Any member of the project can do this)
router.put('/tasks/:taskId/status', async (req, res) => {
    const { status } = req.body; // 'To Do', 'In Progress', 'Done'
    const taskId = req.params.taskId;

    try {
        await db.query('UPDATE Tasks SET status = ? WHERE id = ?', [status, taskId]);
        res.json({ message: 'Task status updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

module.exports = router;