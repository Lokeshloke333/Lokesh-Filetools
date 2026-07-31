import { mkdtemp, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

/**
 * Creates a unique temporary directory, executes the callback, and guarantees cleanup
 * of the directory and all its contents afterward, even if the callback throws an error.
 */
export async function withTempDir<T>(callback: (dirPath: string) => Promise<T>): Promise<T> {
  const dirPath = await mkdtemp(join(tmpdir(), "fileinator-"));
  try {
    return await callback(dirPath);
  } finally {
    try {
      await rm(dirPath, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error(`Failed to clean up temp directory at ${dirPath}:`, cleanupError);
    }
  }
}
