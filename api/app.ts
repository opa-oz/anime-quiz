import Fuse from 'fuse.js';
import { NowRequest, NowResponse } from '@vercel/node/dist';

import { Params, Request, Response, Session, Version } from '../src/types/request-params';
import { Questions } from '../src/types/configs';

import { getResource } from '../src/yaml-manager';
import shortDescription from '../src/utils/short-description';
import pickRandomPhrase from '../src/utils/pick-random-phrase';
import buildButtons from '../src/utils/build-buttons';

import { phrases, PING_COMMAND } from '../src/constants';

const EASY_QUESTIONS = getResource<Questions>('/questions/easy.yml');
const HARD_QUESTIONS = getResource<Questions>('/questions/hard.yml');

const responseToUser = ({ res, version, session }: Params, response: Response) => {
    res.end(JSON.stringify({
        version,
        session,
        response: {
            end_session: false,
            ...(response || {}),
            text: shortDescription(response.text, 1024),
            tts: response.tts ? shortDescription(response.tts, 1024) : undefined,
        },
    }));
};

const defaultAnswer = (params: Params) => {
    return responseToUser(params, {
        text: pickRandomPhrase(phrases.DEFAULT) as string,
        buttons: buildButtons([]),
    })
};

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { request, session, version }: { session: Session, version?: Version, request: Request } = req.body || {};

    const defaultRes = { res, version, session } as Params;

    const endWithError = () => {
        return responseToUser(defaultRes, {
            text: pickRandomPhrase(phrases.ERROR) as string,
            buttons: buildButtons([])
        });
    }

    if (request) {
        if (request.original_utterance) {
            const { original_utterance: orig, command } = request;

            if (command === PING_COMMAND) {
                return defaultAnswer(defaultRes);
            }

            console.log({ orig });
            endWithError();
        }
    }

    return defaultAnswer(defaultRes);
}
