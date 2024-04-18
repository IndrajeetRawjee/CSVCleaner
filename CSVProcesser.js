import fs from 'fs';
import csv from 'csv-parser';
import _ from 'lodash';
import { createObjectCsvWriter } from 'csv-writer';

export class CSVProcesser {

    constructor(inputFile, outputFile,column="Name") {
        this.inputFile = inputFile;
        this.outPutFile = outputFile;
        this.data = [];
        this.column = column;
    }

    async readData() {
        const stream = fs.createReadStream(this.inputFile)
            .pipe(csv());

        for await (const row of stream) {
            console.log(row);
            this.data.push(row);
        }
        return this.data;
    }

    async filterData(data,column) {
        return _.uniqBy(data, column);
    }

    async writeData(data) {
        if (data.length === 0) {
            console.error('No data to write');
            return;
        }

        const csvWriter = createObjectCsvWriter({
            path: 'output.csv',
            header: Object.keys(data[0]).map(key => ({ id: key, title: key }))
        });

        await csvWriter.writeRecords(data);
    }

    async Process() {
        try {
            const data = await this.readData();
            const cleanData = await this.filterData(data);
            await this.writeData(cleanData);
            console.log('The CSV file was processed successfully');

        }
        catch (err) {
            console.error('Error processing CSV file:', err);
        }
    }
}
