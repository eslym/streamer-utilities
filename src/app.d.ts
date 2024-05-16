// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        interface PageData {
            group?: string;
        }
        // interface PageState {}
        // interface Platform {}
    }

    interface URL {
        to(url: string, query?: Record<string, string | null | undefined>): string;
        to(query: Record<string, string | null | undefined>): string;
        ext(url: string, query?: Record<string, string | null | undefined>): URL;
        ext(query: Record<string, string | null | undefined>): URL;
    }

    interface URLSearchParams {
        getNumber(name: string): number | null;
    }
}

export {};
