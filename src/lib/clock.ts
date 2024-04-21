import { readable, type Readable } from 'svelte/store';

type Clock = {
    h12: string;
    h24: string;
    min: string;
    sec: string;
    night: boolean;
};

let clock: Readable<Clock>;

if (import.meta.env.SSR) {
    clock = readable({
        h12: '12',
        h24: '00',
        min: '00',
        sec: '00',
        night: false
    });
} else {
    clock = readable<Clock>(
        {
            h12: '12',
            h24: '00',
            min: '00',
            sec: '00',
            night: false
        },
        (set) => {
            const interval = setInterval(() => {
                const now = new Date();
                const h12 = (now.getHours() % 12 || 12).toString().padStart(2, '0');
                const h24 = now.getHours().toString().padStart(2, '0');
                const min = now.getMinutes().toString().padStart(2, '0');
                const sec = now.getSeconds().toString().padStart(2, '0');
                const night = now.getHours() < 6 || now.getHours() >= 18;
                set({ h12, h24, min, sec, night });
            }, 200);
            return () => clearInterval(interval);
        }
    );
}

export { clock };
