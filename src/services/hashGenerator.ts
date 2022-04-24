import { differenceInSeconds } from 'date-fns';

class HashGenerator {
  public toBase64 = (data: string) => {
    return Buffer.from(data).toString('base64');
  };

  public toPlain = (base64: string) => {
    return Buffer.from(base64, 'base64').toString('ascii');
  };
  generateForUser = (user: string, time = Number(process.env.HASH_TIME || 24)) => {
    const date = new Date(Date.now() + 172800000).getTime();
    return this.toBase64(JSON.stringify({ user, timestamp: date }));
  };

  validateHashForUser = (hash: string): string | null => {
    try {
      const data = JSON.parse(this.toPlain(hash));
      const encodeTime = new Date(data.timestamp);
      const now = new Date();
      if (differenceInSeconds(now, encodeTime) > 2) {
        return null;
      } else {
        return data.user as string;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };
}

export default new HashGenerator();
