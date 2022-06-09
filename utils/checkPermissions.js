import { UnauthenticatedError } from '../errors/index.js';

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return; //that means you are the person that created this Job. then allowed this
  throw new UnauthenticatedError('Not authorized to access this...');
};

export default checkPermissions;
