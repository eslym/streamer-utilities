///<reference types="bun-types" />

const version = Bun.env.GIT_COMMIT
    ? `Revision ${Bun.env.GIT_COMMIT.substring(0, 7)}`
    : 'Unknown Version';

Bun.write('.env.local', `PUBLIC_VERSION=${JSON.stringify(version)}\n`);
