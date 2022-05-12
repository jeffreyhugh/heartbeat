import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

import { MAX_BODY_SIZE } from '@/lib/const';
import { Row_Application, Row_Heartbeat } from '@/lib/db';

export default async function Route(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PRIVATE_SUPABASE_KEY || ''
  );

  const { id } = req.query;
  const appID = Array.isArray(id) ? id[0] : id;

  const validation = await isValidToken(appID, supabase, req);

  switch (validation.statusCode) {
    case 400:
      return res.status(validation.statusCode).json({
        error: 'not_authenticated',
        description: 'Invalid or missing `Authorization` header',
      });
    case 401:
      return res.status(validation.statusCode).json({
        error: 'not_authorized',
        description: 'Invalid or missing `Authorization` header',
      });
    case 500:
      return res.status(validation.statusCode).json({
        error: 'internal_error',
        description: 'Internal error authenticating the request',
      });
  }

  // strip body to 1kb
  const body =
    req.body.length > MAX_BODY_SIZE
      ? req.body.slice(0, MAX_BODY_SIZE) + '[...]'
      : req.body;

  const query = await supabase.from('heartbeats').insert({
    application_id: appID,
    created_at: new Date().toISOString(),
    body: body,
    user_id: validation.userID,
  } as Row_Heartbeat);
  const data = query.data as Row_Heartbeat[];

  if (query.error) {
    return res.status(500).json({
      error: 'internal_error',
      description: 'Internal error adding heartbeat to database',
    });
  }

  const query2 = await supabase
    .from('applications')
    .update({
      last_heartbeat_at: data[0].created_at,
      last_heartbeat_id: data[0].id,
    } as Row_Application)
    .eq('id', appID);

  if (query2.error) {
    return res.status(500).json({
      error: 'internal_error',
      description: 'Internal error updating application in database',
    });
  }

  return res.status(200).json({
    id: data[0].id,
  });
}

interface tokenValidation {
  statusCode: number;
  userID: string;
}

async function isValidToken(
  appID: string,
  supabase: SupabaseClient,
  req: NextApiRequest
): Promise<tokenValidation> {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return {
      statusCode: 400,
      userID: '',
    };
  }
  const bearerToken = authHeader.split(' ')[1];
  if (!bearerToken) {
    return {
      statusCode: 400,
      userID: '',
    };
  }

  const query = await supabase
    .from('applications')
    .select('*')
    .eq('id', appID)
    .eq('secret', bearerToken)
    .limit(1);
  const data = query.data as Row_Application[];
  const error = query.error;

  if (error) {
    return {
      statusCode: 500,
      userID: '',
    };
  }

  if (data.length === 0) {
    return {
      statusCode: 401,
      userID: '',
    };
  }

  return {
    statusCode: 200,
    userID: data[0].user_id,
  };
}
