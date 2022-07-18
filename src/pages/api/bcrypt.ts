import bc from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function bcrypt(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    handlePOST(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;

  const hash = await bc.hash(body, 10);

  //eslint-disable-next-line no-console
  console.log(hash);
  res.status(200).json({ hash });
};
