import {
  supabaseServerClient,
  withApiAuth,
} from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

import { Row_Application } from '@/lib/db';

export default withApiAuth(async function Route(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      handleGet(req, res);
      break;
    // case 'POST':
    //   handlePost(req, res);
    //   break;
    // case 'DELETE':
    //   handleDelete(req, res);
    //   break;
    default:
      res.status(405).json({
        message: `Method ${req.method} not allowed`,
      });
  }
});

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const query = await supabaseServerClient({ req, res })
    .from('applications')
    .select(
      `id, 
      created_at, 
      friendly_name, 
      last_heartbeat_at, 
      last_heartbeat_id, 
      user_id`
    )
    .limit(100);

  const data = query.data as Row_Application[];
  const error = query.error;

  if (error) {
    res.status(500).json({
      message: 'Error querying applications',
      error,
    });
  } else {
    res.status(200).json({
      data,
    });
  }
}
