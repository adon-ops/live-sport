import { Stream, type StreamPlayerApi } from '@cloudflare/stream-react';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function useLocalStorageState<T>(key: string, defaultValue: T) {
    const valueFromLocalStorage = localStorage.getItem(key);

    const [value, setValue] = useState<T>(
        valueFromLocalStorage === null ? defaultValue : JSON.parse(valueFromLocalStorage)
    );

    return [
        value,
        (update: T) => {
            if (typeof update === 'function') {
                setValue((prev: T) => {
                    const newValue = update(prev);
                    localStorage.setItem(key, JSON.stringify(newValue));
                    return newValue;
                });
            } else {
                localStorage.setItem(key, JSON.stringify(update));
                setValue(update);
            }
        },
    ] as const;
}

type Primitive = string | number | boolean;

function useInput<T extends Primitive>(
    name: string,
    defaultValue: T,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    props: Omit<JSX.IntrinsicElements['input'], 'value' | 'checked' | 'onChange'>
) {
    const [value, setValue] = useLocalStorageState(name, defaultValue);
    return {
        value,
        input: (
            <label
                style={{
                    display: 'inline-block',
                    border: '1px solid',
                    padding: '4px 8px',
                }}
            >
                {name}{' '}
                <input
                    {...props}
                    checked={typeof value === 'boolean' ? value : undefined}
                    value={
                        typeof value === 'string' || typeof value === 'number' ? value : undefined
                    }
                    onChange={e =>
                        setValue(
                            defaultValue.constructor(
                                typeof defaultValue === 'boolean'
                                    ? e.target.checked
                                    : e.target.value
                            )
                        )
                    }
                />
            </label>
        ),
    };
}

const App = () => {
    const [searchParams] = useSearchParams();
    const ref = React.useRef<StreamPlayerApi>(null);

    const autoplay = useInput('autoplay', true, { type: 'checkbox' });
    const muted = useInput('muted', false, { type: 'checkbox' });
    const loop = useInput('loop', false, { type: 'checkbox' });
    const controls = useInput('controls', true, { type: 'checkbox' });
    const responsive = useInput('responsive', true, { type: 'checkbox' });
    const volume = useInput('volume', 1, {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.01,
    });
    const playbackRate = useInput('playbackRate', 1, {
        type: 'range',
        min: 0.25,
        max: 2,
        step: 0.25,
    });

    // src="4bcf13d23290043d9efb344b56200ebd"
    return (
        <div>
            <Stream
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                streamRef={ref}
                src={searchParams.get('liveInputUid') ?? ''}
                muted={muted.value}
                loop={loop.value}
                controls={controls.value}
                responsive={responsive.value}
                autoplay={autoplay.value}
                volume={volume.value}
                playbackRate={playbackRate.value}
                onAbort={() => console.log('aborted')}
                onCanPlay={() => console.log('onCanPlay')}
                onCanPlayThrough={() => console.log('onCanPlayThrough')}
                onDurationChange={() => console.log('onDurationChange')}
                onEnded={() => console.log('ended')}
                onError={e => console.log('error', e)}
                onLoadedData={() => console.log('onLoadedData')}
                onLoadStart={() => console.log('onLoadStart')}
                onPause={() => console.log('onPause')}
                onPlay={() => console.log('onPlay')}
                onPlaying={() => console.log('onPlaying')}
            />
            {/* <div>
				{volume.input}
				{playbackRate.input}
				{muted.input}
				{autoplay.input}
				{loop.input}
				{controls.input}
				{responsive.input}
			</div>
			<button
				onClick={() => {
					if (ref.current) {
						ref.current.currentTime = 30;
					}
				}}
			>
				seek to 30s
			</button>
			<button
				onClick={() => {
					if (ref.current) {
						ref.current.play();
					}
				}}
			>
				play
			</button> */}
        </div>
    );
};

export default App;
