import { readable, type Readable } from 'svelte/store';

type Clock = {
    h12: string;
    h24: string;
    min: string;
    sec: string;
    pm: boolean;
    blink: boolean;
};

let clock: Readable<Clock>;

if (import.meta.env.SSR) {
    clock = readable({
        h12: '12',
        h24: '00',
        min: '00',
        sec: '00',
        pm: false,
        blink: false
    });
} else {
    clock = readable<Clock>(
        {
            h12: '12',
            h24: '00',
            min: '00',
            sec: '00',
            pm: false,
            blink: false
        },
        (set) => {
            const interval = setInterval(() => {
                const now = new Date();
                const h12 = (now.getHours() % 12 || 12).toString().padStart(2, '0');
                const h24 = now.getHours().toString().padStart(2, '0');
                const min = now.getMinutes().toString().padStart(2, '0');
                const sec = now.getSeconds().toString().padStart(2, '0');
                const pm = now.getHours() >= 12;
                const blink = now.valueOf() % 1000 < 500;
                set({ h12, h24, min, sec, pm, blink });
            }, 200);
            return () => clearInterval(interval);
        }
    );
}

export { clock };
