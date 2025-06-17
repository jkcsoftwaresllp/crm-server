import express from 'express';
import {
  getPendingOrganizations,
  approveOrganizationById,
} from '../controllers/approvalController.js';

const router = express.Router();

router.get('/orgs/pending', getPendingOrganizations);
router.post('/orgs/approve/:orgId', approveOrganizationById);

export default router;