import { allowQuery } from 'lib/auth';
import { TYPE_WEBSITE } from 'lib/constants';
import { useAuth, useCors } from 'lib/middleware';
import { methodNotAllowed, ok, unauthorized } from 'next-basics';
import { getEventsType } from 'queries';

export default async (req, res) => {
  await useCors(req, res);
  await useAuth(req, res);

  if (req.method === 'GET') {
    if (!(await allowQuery(req, TYPE_WEBSITE))) {
      return unauthorized(res);
    }

    const { id: websiteUuid, url } = req.query;

    let data = await getEventsType(websiteUuid, url);

    return ok(res, data);
  }

  return methodNotAllowed(res);
};
