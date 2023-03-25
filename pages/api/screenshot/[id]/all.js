import { ok, methodNotAllowed, unauthorized } from 'next-basics';
import { allowQuery } from 'lib/auth';
import { useAuth, useCors } from 'lib/middleware';
import { TYPE_WEBSITE } from 'lib/constants';
import { getScreenshot } from 'queries';


export default async (req, res) => {
  await useCors(req, res);
  await useAuth(req, res);

  if (req.method === 'GET') {
    if (!(await allowQuery(req, TYPE_WEBSITE))) {
      return unauthorized(res);
    }

    const { id: websiteId, url } = req.query;

    const data = await getScreenshot(websiteId, url)
    res.setHeader('content-type', 'image/png')
    res.send(data[0].screenshot);
    return;
  }

  return methodNotAllowed(res);
};
