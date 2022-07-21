import clsx from 'clsx';
import emojis from 'emojilib';
import React from 'react';

export type EmojiPickerProps = {
  label?: string;
  id?: string;
  defaultSelected?: string;
  helperText?: string;
  onEmojiSelect: (emoji: string) => void;
} & React.ComponentPropsWithoutRef<'input'>;

export default function EmojiPicker({
  label,
  id,
  defaultSelected = '',
  onEmojiSelect,
  className,
  ...rest
}: EmojiPickerProps) {
  const [text, setText] = React.useState('');
  const [selectedEmoji, setSelectedEmoji] = React.useState(defaultSelected);

  return (
    <div>
      <label htmlFor={id} className='block text-sm font-normal text-gray-700'>
        {label}
      </label>
      <div
        className={clsx(
          'relative mt-1',
          'block w-full rounded-md shadow-sm',
          'border border-gray-300 focus-within:border-primary-500 focus-within:ring-primary-500',
          className
        )}
      >
        <div className=''>
          <input
            {...rest}
            type='text'
            name={id}
            id={id}
            className={clsx(
              'block w-full rounded-md shadow-sm',
              'border-none ring-0 focus:ring-0'
            )}
            placeholder='Search for an emoji...'
            aria-describedby={id}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className='mt-1'>
          <EmojiMap
            selectedEmoji={selectedEmoji}
            setSelectedEmoji={setSelectedEmoji}
            onSelect={(emoji) => onEmojiSelect(emoji)}
            data={
              text === ''
                ? Object.keys(emojis)
                : Object.keys(emojis).filter((emoji) =>
                    emojis[emoji as keyof typeof emojis].some((tag) =>
                      tag.includes(text)
                    )
                  )
            }
          />
        </div>
      </div>
    </div>
  );
}

const EmojiMap = ({
  data,
  onSelect,
  selectedEmoji,
  setSelectedEmoji,
  className,
}: {
  data: string[];
  onSelect: (arg0: string) => void;
  selectedEmoji: string;
  setSelectedEmoji: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}) => (
  <div className='h-36'>
    <div
      className={clsx(
        className,
        'm-2 flex max-h-36 flex-wrap items-start justify-start gap-1 overflow-x-hidden overflow-y-scroll'
      )}
    >
      {data.map((emoji) => (
        <div
          key={emoji}
          className={clsx(
            selectedEmoji === emoji ? 'bg-primary-500' : '',
            'flex h-8 min-w-[2rem] select-none items-center justify-center text-xl',
            'rounded-md hover:bg-primary-500'
          )}
          onClick={() => {
            setSelectedEmoji(emoji);
            onSelect(emoji);
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  </div>
);
