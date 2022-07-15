import { DateTime } from 'luxon';

import { Row_Application } from '@/lib/db';
import { health } from '@/lib/health';

export default function ApplicationCard({ item }: { item: Row_Application }) {
  //eslint-disable-next-line no-console
  const healthIndex = Math.abs(
    Math.ceil(
      DateTime.fromISO(item.last_heartbeat_at).diffNow().toMillis() /
        (1000 * 60)
    )
  );

  return (
    <div className='rounded-md border border-black p-4 hover:bg-gray-200'>
      <div className='flex w-72'>
        <div className='flex items-center pr-4 text-2xl'>
          {health[healthIndex > 5 ? 5 : healthIndex < 0 ? 0 : healthIndex]}
        </div>
        <div className='flex flex-grow flex-col'>
          <div className='text-xl font-bold'>{item.friendly_name}</div>
          <div className='text-sm'>
            Last heartbeat{' '}
            {
              [
                'just now',
                '1 minute ago',
                '2 minutes ago',
                '3 minutes ago',
                '4 minutes ago',
                '5+ minutes ago',
              ][healthIndex > 5 ? 5 : healthIndex < 0 ? 0 : healthIndex]
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlankCard() {
  return (
    <div className='h-0 border border-transparent px-4'>
      <div className='w-72' />
    </div>
  );
}
