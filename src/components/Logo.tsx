import feather from 'feather-icons';

export default function Logo() {
  return (
    // <Image
    //   alt='Heartbeat Logo'
    //   src='/favicon/favicon-96x96.png'
    //   width={96}
    //   height={96}
    // />
    <span className='flex'>
      <span
        dangerouslySetInnerHTML={{
          __html: feather.icons.heart.toSvg({ class: 'fill-primary-500 mr-2' }),
        }}
      />
      <span className='text-lg font-bold'>Heartbeat</span>
    </span>
  );
}
