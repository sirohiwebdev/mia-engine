import { differenceInSeconds } from 'date-fns';

class HashGenerator {
  public toBase64 = (data: string) => {
    const b64 = Buffer.from(data).toString('base64');
    return b64;
  };

  public toPlain = (base64: string) => {
    const plain = Buffer.from(base64, 'base64').toString('ascii');
    return plain;
  };
  generateForUser = (email: string, time = 1) => {
    const date = new Date(Date.now() + time * 3600000).getTime();
    const hash = this.toBase64(JSON.stringify({ email: email, timestamp: date }));
    return hash;
  };

  validateHashForUser = (hash: string): string | null => {
    console.log({ hash });
    try {
      const data = JSON.parse(this.toPlain(hash));
      const encodeTime = new Date(data.timestamp);
      const now = new Date();
      if (differenceInSeconds(now, encodeTime) > 2) {
        return null;
      } else {
        return data.email as string;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };
}

export default new HashGenerator();
