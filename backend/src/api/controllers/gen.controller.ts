import { NextFunction, Request, Response } from "express";
import materialModel from "../models/material.model";
import { ExpressError } from "@/lib/helpers/customError";
import * as fs1 from 'fs/promises'; // For reading file content
import { pdfToText } from 'pdf-ts'; // For parsing PDF
import * as mammoth from 'mammoth'; // For parsing DOCX
import * as fs from 'fs';
import { file } from "bun";

const fastAPIURL = "http://127.0.0.1:8000/api/generate";

class GenController {

    public async genQuiz(req: Request, res: Response, next: NextFunction) {


        function cleanExtractedText(rawText: string): string {
            return rawText
                .replace(/\r\n|\r|\n/g, ' ') // Replace all line breaks with a space
                .replace(/\s+/g, ' ')        // Replace multiple spaces with a single space
                .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
                .trim();                     // Remove leading and trailing whitespace
        }

        const TEXT = req.body.text;
        if (TEXT === false) {
            return next(new ExpressError("Material not found", 404));
        }

        //parse documents from FILEPATHS

        const filedata: Array<string> = [];

        for (const path of req.body.filepaths) {
            const fileExtension = path.split('.').pop()?.toLowerCase(); // Get file extension
            let content = '';

            try {
                const fileBuffer = await fs1.readFile(path); // Read file content

                switch (fileExtension) {
                    case 'pdf': {
                        // Parse PDF
                        const pdfBuffer = await fs.promises.readFile(path);
                        content = await pdfToText(pdfBuffer);
                        content = cleanExtractedText(content);
                        break;
                    }
                    case 'docx': {
                        // Parse DOCX
                        const result = await mammoth.extractRawText({ buffer: fileBuffer });
                        content = result.value;
                        break;
                    }
                    case 'txt': {
                        // Parse plain text
                        content = fileBuffer.toString('utf-8');
                        break;
                    }
                    default: {
                        console.warn(`Unsupported file format: ${fileExtension}`);
                        content = '';
                        break;
                    }
                }

                // Add parsed content to the results array
                filedata.push(content);

            } catch (error) {
                console.error(`Error parsing file ${path}:`, error);
                filedata.push(`Error parsing file: ${path}`);
            }
        }


        const queryParam = {
            FILEDATA: filedata[0],
            TEXT: TEXT as string,
            NUMBER: req.body.number,
            SUBJECT: req.body.subject,
            TONE: req.body.level,
        }

        const response = fetch(`${fastAPIURL}?${new URLSearchParams(queryParam)}`);
        response.then((response) => {
            response.json().then((data) => {
                res.status(200).json(data);
            }).catch((error) => {
                return next(error);
            });
        }).catch((error) => {
            return next(error);
        });
    }
}
export default new GenController();
