import moment from 'moment-timezone';
import { getConfigStats } from 'queries';
import { ok, badRequest, methodNotAllowed, unauthorized } from 'next-basics';
import { allowQuery } from 'lib/auth';
import { useAuth, useCors } from 'lib/middleware';
import { TYPE_WEBSITE } from 'lib/constants';

const unitTypes = ['year', 'month', 'hour', 'day'];

export default async (req, res) => {
  await useCors(req, res);
  await useAuth(req, res);

  if (req.method === 'GET') {
    if (!(await allowQuery(req, TYPE_WEBSITE))) {
      return unauthorized(res);
    }

    const {
      id: websiteId,
      start_at,
      end_at,
      unit,
      tz,
      step
    } = req.query;

    const startDate = new Date(+start_at);
    const endDate = new Date(+end_at);

    if (!moment.tz.zone(tz) || !unitTypes.includes(unit)) {
      return badRequest(res);
    }

    const [configurations, sessions] = await Promise.all([
      getConfigStats(websiteId, {
        start_at: startDate,
        end_at: endDate,
        timezone: tz,
        unit,
        count: '*',
        filters: {
          step
        },
      }),
      getConfigStats(websiteId, {
        start_at: startDate,
        end_at: endDate,
        timezone: tz,
        unit,
        count: 'distinct configuration.',
        filters: {
          step
        },
      }),
    ]);

    return ok(res, { configurations, sessions });
  }

  return methodNotAllowed(res);
};
