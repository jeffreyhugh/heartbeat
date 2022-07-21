import Heartbeat from '~/svg/heartbeat.svg';

export default function Logo() {
  return (
    // <Image
    //   alt='Heartbeat Logo'
    //   src='/favicon/favicon-96x96.png'
    //   width={96}
    //   height={96}
    // />
    <span className='flex items-center'>
      <Heartbeat className='mr-1 text-2xl' />
      <span className='text-lg font-bold'>Heartbeat</span>
    </span>
  );
}
