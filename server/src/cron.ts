import cron from "node-cron";
import fs from "fs";
import path from "path";

const MAX_IDLE_TIME = 120 * 1000;
const uploadsDir = path.join(process.cwd(), "uploads");

cron.schedule("*/30 * * * * *", () => {
    if (!fs.existsSync(uploadsDir)) return;

    const now = Date.now();
    const folders = fs.readdirSync(uploadsDir);

    for (const folder of folders) {
        const folderPath = path.join(uploadsDir, folder);

        try {
            const stat = fs.statSync(folderPath);

            if (!stat.isDirectory()) continue;

            const lastModified = stat.mtimeMs;
            const idleTime = now - lastModified;

            if (idleTime > MAX_IDLE_TIME) {
                fs.rmSync(folderPath, {
                    recursive: true,
                    force: true,
                });
            }
        } catch (err) {
            console.error("Failed: ", folderPath, err);
        }
    }
});