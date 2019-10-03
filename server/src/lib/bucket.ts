import { S3 } from 'aws-sdk';
import { getConfig } from '../config-helper';
import Model from './model';
import { ImportedSentence } from './model/db';
import { ServerError } from './utility';

/**
 * Bucket
 *   The bucket class is responsible for loading clip
 *   metadata into the Model from s3.
 */

export default class Bucket {
  private model: Model;
  private s3: S3;

  constructor(model: Model, s3: S3) {
    this.model = model;
    this.s3 = s3;
  }

  /**
   * Fetch a public url for the resource.
   */
  private getPublicUrl(key: string) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: getConfig().BUCKET_NAME,
      Key: key,
      Expires: 24 * 60 * 30,
    });
  }

  /**
   * Grab metadata to play clip on the front end.
   */
  async getRandomClips(
    client_id: string,
    locale: string,
    count: number,
    contractor: string,
    assignmentId: string
  ): Promise<{ id: number; glob: string; text: string; sound: string }[]> {
    const clips = await this.model.findEligibleClips(
      client_id,
      locale,
      count,
      contractor,
      assignmentId
    );
    try {
      return await Promise.all(
        clips.map(async ({ id, path, sentence }) => {
          // We get a 400 from the signed URL without this request
          await this.s3
            .headObject({
              Bucket: getConfig().BUCKET_NAME,
              Key: path,
            })
            .promise();

          return {
            id,
            glob: path.replace('.mp3', ''),
            text: sentence,
            sound: this.getPublicUrl(path),
          };
        })
      );
    } catch (e) {
      console.log('aws error', e, e.stack);
      return [];
    }
  }

  getAvatarClipsUrl(path: string) {
    return this.getPublicUrl(path);
  }

  async sentencesFileToJSON(sentencesFile: Buffer[], source: string) {
    const sentences: ImportedSentence[] = [];
    const streamFile = require('streamifier').createReadStream(sentencesFile);

    const lineReader = require('readline').createInterface({
      input: streamFile,
      crlfDelay: Infinity,
    });

    // https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
    for await (const line of lineReader) {
      sentences.push({ sentence: line, source });
    }

    return sentences;
  }

  async getContractorSentencesByLocale(
    contractor: string,
    locale: string
  ): Promise<ImportedSentence[]> {
    try {
      const source = 'utterances';
      const sentencesFilePath = `${contractor}/${locale}/${source}.txt`;
      const sentenceFile = await this.s3
        .getObject({
          Bucket: getConfig().BUCKET_SENTENCES_NAME,
          Key: sentencesFilePath,
        })
        .promise();

      const sentences = await this.sentencesFileToJSON(
        sentenceFile.Body as Buffer[],
        source
      );
      return sentences;
    } catch (e) {
      console.log('aws error', e, e.stack);
      throw e;
    }
  }
}
