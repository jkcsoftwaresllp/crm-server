import * as repo from '../repositories/approvalRepository.js';

export const listPendingOrgs = async () => {
  return await repo.getPendingOrgs();
};

export const approveOrganization = async (orgId) => {
  return await repo.approveOrg(orgId);
};