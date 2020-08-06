import { Button } from '../types/request-params';

export default function buildButtons(rawButtons: Array<string | { title: string, url: string, hide?: boolean; }>): Array<Button> {
    const preparedButtons: Array<{ title: string, url?: string, hide?: boolean, }> = rawButtons.map((raw) => {
        if (typeof raw === 'string') {
            return { title: raw };
        }

        return raw;
    });

    return preparedButtons.map((button) => ({
        title: button.title,
        url: button.url,
        hide: typeof button.hide === 'boolean' ? button.hide : true,
    }));
}
