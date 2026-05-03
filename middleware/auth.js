const jwt = require('jsonwebtoken');
const db = require('../db');

// Check if the user has a valid JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized: Invalid Token' });
        req.user = decoded; // Contains { id: user_id }
        next();
    });
};

// Check if the logged-in user is an Admin for the specific project
const verifyProjectAdmin = async (req, res, next) => {
    const userId = req.user.id;
    // Project ID can come from URL params depending on the route (/api/projects/:projectId)
    const projectId = req.params.projectId || req.body.project_id; 

    if (!projectId) return res.status(400).json({ error: 'Project ID required for admin check' });

    try {
        const [rows] = await db.query(
            'SELECT role FROM ProjectMembers WHERE user_id = ? AND project_id = ?',
            [userId, projectId]
        );

        if (rows.length === 0) {
            return res.status(403).json({ error: 'Forbidden: You are not a member of this project.' });
        }

        if (rows[0].role !== 'Admin') {
            return res.status(403).json({ error: 'Forbidden: Admin access required to perform this action.' });
        }
        
        next(); // User is verified as an Admin, proceed to the route logic
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error verifying role' });
    }
};

module.exports = { verifyToken, verifyProjectAdmin };